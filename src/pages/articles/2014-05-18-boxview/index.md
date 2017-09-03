---
layout: post
title: "BoxView"
date: "2014-05-18T21:51:11.000Z"
comments: true
sharing: true
draft: false
path: "/posts/boxview/"
category: Ruby
tags:
  - "Box"
  - "Ruby"
  - "Rails"
---

### onStart
The [BoxViewAPI](https://developers.box.com/view/) is useful for displaying documents in the browser without needing to do any heavy lifting. You can quickly turn any PDF, MS Document, or MS PowerPoint into HTML and display it inline on your website. The HTML is hosted by Box, and you can easily display this on your site by using an iFrame. Alternatively you could download the HTML and display it with viewer.js. Make sure you [signup](https://app.box.com/) and [create a BoxView app](https://app.box.com/developers/services) before you start. The app will have an API key that you will need in all requests you make with Box. I am implementing it in Rails, but you could do this on any backend in exactly the same fashion.

### Upload a Document
The first step to making a viewable document is uploading the file to box. I decided to use the net::http library when communicating with the BoxViewAPI. However, you can use any RESTful lib. RestClient is another popular one. Then make a post with the necessary headers. The response if successful will contain a document id.

```ruby
  # Headers used throughout these examples
  # Get YOUR_API_KEY from the box view application page
  BOX_HEADERS = {
    'Authorization' => "Token #{YOUR_API_KEY}",
    'Content-type' => 'application/json'
  }

  def upload_document
    document_uri = URI.parse("https://view-api.box.com/1/documents")
    data = {
      'url' => original_url
      # If thumbnails are desired:
      #, 'thumbnails' => '100x100'
    }
    http = Net::HTTP.new(document_uri.host, document_uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(document_uri.path, BOX_HEADERS)
    request.body = data.to_json
    response = http.request(request)
    parsed = JSON.parse response.body
    document_id = parsed["id"]
    return document_id
    # or self.update_attribute :document_id, document_id
  end
```

### Create a Session
Now that you have a document id, you can make upload_document return the id or just save it to a model (This is useful if you're interested in implementing WebHooks). Next you can use that document id to create a session which will begin the conversion of the document, and let you know when it is ready. If you are using this in your web app frequently, I recommend using [Sidekiq](http://sidekiq.org/) to offload all these network calls and possible database saves to an asynchronous process. When successful, box will return a 201, which means the document is ready for viewing. If you don't get a 201 you will get a 202 or 400 response code. A 202 means the document is not yet ready for viewing. A 400 means the conversion has failed. If you'd like to view your file at this point, just head over to [https://view-api.box.com/1/sessions/{session id}/view?theme=light](https://view-api.box.com/1/sessions/{session id}/view?theme=light), where session id is the id you get from the 201 response.

```ruby
  def create_session(document_id)
    session_uri = URI.parse("https://view-api.box.com/1/sessions")
    data = {
      "document_id" => document_id
      #, "expires_at" => Time.now + 1.hour
      # You could specify an expiration date.
    }
    http = Net::HTTP.new(session_uri.host, session_uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(session_uri.path, BOX_HEADERS)
    request.body = data.to_json
    response = http.request(request)
    case response.code
    when "201" # Done converting
      parsed = JSON.parse response.body
      session_id = parsed["id"]
      return session_id
      # or self.update_attribute :session_id, session_id
    when "202" # Session not ready yet
      time = response['Retry-After'].to_i
      # here you would retry based on the time variable
      # You could use sidekiqs perform_in method, or just sleep
    when "400" # An error occurred while converting the document or the document does not exist
      Rails.logger.debug "Document failed to convert - #{response.body}"
    else
      raise "BoxSessionError #{response.inspect}"
    end
  end
```

### Generate a Thumbnail
A cool feature BoxView has is thumbnail generation. It can return a thumbnail of any size 16-1024 wide by 16-768 high. This way you can see a preview of the document before displaying it to a user. The BoxView API only requires a height and width, and the document that you want the thumbnail generated from.

```ruby
  def generate_thumbnail(document_id)
    query_params = "?width=100&height=100"
    thumbnail_uri = URI.parse("https://view-api.box.com/1/documents/#{document_id}/thumbnail")
    http = Net::HTTP.new(thumbnail_uri.host, thumbnail_uri.port)
    http.use_ssl = true
    thumbnail_path = thumbnail_uri.path + params
    request = Net::HTTP::Get.new(thumbnail_path, BOX_HEADERS)
    response = http.request(request)
    case response.code
    when "200" # Valid thumbnail
      thumbnail = response.body
      # Now upload the thumbnail to another server
      # or use it however you would like
    when "202" # Thumbnail isn't ready yet
      time = response['Retry-After'].to_i
      # Same as a session 202, sleep or worker
    when "400" # Width/Height are invalid
      Rails.logger.debug "400 Box Thumbnail Width x Height Invalid - #{response.body}"
    else
      raise "BoxThumbnailError #{response.inspect}"
    end
  end
```

Box offers a chance of producing the thumbnail earlier in the process. If you state the width and height earlier when uploading the document, box will have the thumbnail ready by the time you call generate_thumbnail. After getting the thumbnail from the response you could upload it to your own server.

### onFinish
My examples above are all in ruby, but their also exists a [great python project on GitHub](https://view-upload.herokuapp.com/) that shows how to do the same. If you needed help getting started with BoxView I hope you no longer do. If you require WebHooks with BoxView, they aren't very difficult. Just email api@box.com with your API key and domain to send the responses to a controller. If you want to test that WebHooks work in your testing environment, I recommend using [ngrok](https://ngrok.com). It helped me confirm everything was in a good working condition before using it in other environments. As always, if you need help let me know.

---
template: post
title: "Sinatra Assets"
date: "2014-05-26T15:32:56.000Z"
comments: true
sharing: true
draft: false
slug: "sinatra-assets/"
category: Ruby
tags:
  - "Sinatra"
  - "Ruby"
---

### onStart
Rails is one of the most popular frameworks right now. It contains a lot of magic, and that can often be credited to its asset pipeline. Frequently when I think of Sinatra I think of it as a slim downed version of Rails. It has its uses, and so does Rails, but what if we wanted to combine Sinatra with an asset pipeline. I decided to do a little digging, and after doing a little research, I discovered that their is only one good solution that exists right now. It is called the [Sinatra AssetPack](https://github.com/rstacruz/sinatra-assetpack).

### Sinatra AssetPack
In order to get started using the Sinatra AssetPack you will need to add it to your Gemfile.

```ruby Gemfile
gem 'sinatra-assetpack', :require => 'sinatra/assetpack'
```

Then run bundle (or bundle install), and let it install. Once installed you can start taking advantage of the Sinatra AssetPack. I added it to the base of my Sinatra app, I would recommend you do the same.

```ruby Base
require 'sinatra/base'
require 'sinatra/assetpack'

class MyApp < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :views, settings.root + '/views'
  set :public_folder, settings.root + '/public'

  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'app/js'
    serve '/css',    from: 'app/css'
    serve '/images', from: 'app/images'

    # Serve up JS per request
    js :app, '/js/app.js', [
      '/js/vendor/**/*.js',
      '/js/lib/**/*.js'
    ]

    # Serve up CSS per request
    css :application, '/css/application.css', [
      '/css/screen.css'
    ]

    # jsmin, yui, closure or uglify for js compression
    js_compression  :uglify
    # simple, sass, yui, or sqwish for css compression
    css_compression :sass
  }

  get '/' do
    haml :index
  end
end
```

With the Sinatra AssetPack you can minify/obfuscate your js and css files. It will help you clean up your routes as well. By serving up only the files you need, you can specify exactly what js and css files for your Sinatra app when hitting a particular route. I found out of all the available options, this was the simplest


### The Pipeline
After configuring your app like I did above, you will be able to use the pipeline in your static files. In this example I am using haml. It is very simple to include your js/css/haml files using this type of pipeline.

```haml Index
= haml :browser_compat
%html
  %header
    = haml :header # header contains != css :application
  %body
    .container
      .navigation
        = haml :navigation
      .stage
        = haml :stage
      .footer
        = haml :footer
    #js_footer
      != js :app
```

This results in very clean and readable haml. The pieces here are reusable, and by following this pipeline you start to modularize your Sinatra application. I hope more apps use this, as it brings the magic of Rails to Sinatra apps, which tend to be more simplistic.

### onFinish
Not everyone will need an asset pipeline in their web app. This is for those that require a clean and reusable code base for an app that is based on Sinatra. I find that modularizing your js and css will help a lot. Especially when you get obfuscation for free with it. Sinatra can be a powerful web application framework, and tools like this can make it even better. If you require any assistance setting up Sinatra AssetPack let me know.

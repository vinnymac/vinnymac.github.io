---
layout: post
title: "Aviary's FeatherJS in Backbone.Marionette"
date: "2014-04-07T01:01:35.000Z"
comments: true
draft: false
path: "/posts/aviarys-featherjs-in-backbone-marionette/"
category: JavaScript
tags:
  - "JavaScript"
  - "Backbone"
  - "Marionette"
  - "Aviary"
---

To get started head over to the [Developer Page](http://developers.aviary.com/ "Dev Page") and sign up. Select the HTML 5 app and generate an api key. Place featherjs in a [script tag or download it](http://feather.aviary.com/js/feather.js "FeatherJS").

Now in your Backbone.Marionette app you are going to either create a new ItemView or navigate to an existing one you want aviary to be launched from.

```coffeescript
class App.AvatarView extends Backbone.Marionette.ItemView
  template: 'avatar'
  className: 'avatar_view'
```

Initialize Aviary by creating an instance of Feather JS. Do this in the initialize method of the ItemView. Here we construct what Aviary's Editor will do throughout its use. When the user finishes saving the photo, a url is returned. You are left with several options. Insert the url into the DOM using the image id, save the new url to an attribute on your Backbone model, or directly post the url to your server. Make sure you store your api_key somewhere so you can access it from anywhere you might need to launch aviary. For this example I'll store it in window.aviary_api_key.

```coffeescript
initialize: ->
  @featherEditor = new Aviary.Feather
    apiKey: aviary_api_key
    apiVersion: 3 # The latest api version
    tools: ['stickers', 'crop']
    onSave: (id, url) ->
      @model.save
        avatar_url: url
      return false # ignores the save/confirm dialog
    theme: 'light' # dark by default
    noCloseButton: true # You can force the user to continue using aviary this way.
```

Aviary also provides callback methods like onClose and onReady for additional control during various points of user interaction. Another useful param is postUrl. This allows you to post the newly edited photo to a route on your server or wherever you would like.

You're going to need a method that can start aviary from an event or some other place in your view. Let's call this method launchEditor.

```coffeescript
launchEditor: (id, src) ->
  # load a url now or pass it into this function
  @featherEditor.launch
    image: id
    url: src
  return false
```

If you would like to add a default cropping ratio you can do so by adding a 'forceCropPreset' to the params on launch like so.

```coffeescript
@featherEditor.launch
  image: id
  url: src
  forceCropPreset: ['My Default', '1:1']
  forceCropMessage: 'Please Crop your Avatar'
```

At this point you can test that aviary is properly launching after calling the 'launchEditor' method. You may want to add a click listener to launch it. If you have a class named avatar, you could add an event to launch it.

```coffeescript
events:
  'click .avatar' : 'launchEditor'
```

Aviary has [documentation](http://developers.aviary.com/docs/web/setup-guide "Aviary's Feather Documentation") on implementing feather. I don't recommend reading the entire thing. Only pieces of it are useful for specific instances of aviary. I went over some of the more useful features you may want when using it with Avatars. But you can mix and match Aviary's editor to fit your needs. Take a look at the various tools the editor offers to see what I mean.

Remember, every external library comes with its hardships. Although it seems very simple to implement, Aviary only allows external resources to be used as (a publicly available file that they process) the url source. The url they return to you is always one from there servers. So if you don't feel comfortable with aviary touching your users data remotely, I would look for other options. Such as manually cropping photos using the HTML 5 Canvas.

Note: I had trouble with IE9, they claim to support it but I received 'Not Enough Storage' errors when launching Feather in IE. It appeared to be an issue with cascading style sheets, let me know if you have a similar result.

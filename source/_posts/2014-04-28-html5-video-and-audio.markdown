---
layout: post
title: "HTML5 Video and Audio"
date: 2014-04-28 16:27:05 -0400
comments: true
sharing: true
categories: HTML5, Coffeescript
---

### onStart
HTML5 makes placing an audio or video stream into your web app simple. However, not all browsers can use HTML5 (IE > 8, Chrome > 3, FF > 3). Many great solutions such as [VideoJS](https://github.com/videojs/video.js) and [AudioJS](http://kolber.github.io/audiojs/) try to alleviate that issue. In this article I will be going over how one might implement HTML5 video and audio in a dynamic and reusable fashion. The various features available when templating, and the tribulations when working with video and audio in javascript.

### Video and Audio Templates
To begin let's see what HTML5 video and audio tags might look like in a template.

```haml HTML5 Video and Audio Tagging
# (poster, height, and width are video only features)
%video#movie{height: 640, width: 480, poster: "some.png",
              controls: true, autoplay: true, loop: true}
  %source#mp4{src: 'rickroll.mp4', type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'}
  %source#ogg - # you can specify as many of these as you like, or just one.
  Your browser does not support the video type or codec.

%audio#speakers{preload: auto, controls: true, autoplay: true, loop: true}
  %source#mp3{src: 'getlucky.mp3'}
  Something terrible has occurred, run for your lives!
```
Above a HAML file contains an HTML5 video and audio tag. Let's go over some of their attributes. Looking at the video tag we can see I specified a height and width just like a div (video only). The controls attribute tells the browser to show the built in controls, it takes a boolean value. Autoplay makes the browser play the media automatically, and it takes a boolean value. Loop causes the media to play indefinitely, and it takes a boolean value. The poster attribute displays an image until the first frame of the video has loaded. An external or local image can be specified (video only). The preload attribute, which can be one of three things, none | metadata | auto. The media can also take a src attribute, but when dynamically controlling html5 video/audio it is easier to place a source tag underneath and specify the source manually or from JS. The source tag also allows for specifying the content type and codec of the video that will be playing. Lastly you can specify in plain text an error message, if the media you are trying to play is not supported. A list of all the [video attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) and [audio attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) can be found on MDN.

### Dynamic Video and Audio
Having control over the video and audio that may be playing is a desirable feature. Unfortunately you may want to use something jQuery to help you do this. Currently jQuery does not support HTML5 video and audio. You are going to have to use straight javascript (in my case coffeescript).

```coffeescript
# You cannot use jQuery to do this:
# @$('#movie').load()
# However you can get the first DOM element.
movie = @$('#movie').get(0) # If you want to retain jQuery, use eq(0) instead.

# Optionally set the source in JS.
@$('#mp4').get(0).src = '/rickroll.mp4'

# First you will need to load the video.
movie.load()

# Check if the video can be played, before playing it.
movie.canPlayType('video/mp4') # returns 'maybe', 'probably' or ''

# Then you can play it.
movie.play()

# To pause you can call pause or trigger the event
movie.pause() # or @$('#movie').trigger 'pause'

# For stopping playback all together, their are a few solutions.
movie.pause()
movie.currentTime = 0
# or
movie.src = ''
# or
@$('#movie').remove()

# Several events exist that you can listen in on.
# How do I know when the first frame has loaded?
movie.addEventListener 'loadeddata', -> console.log 'Done loading!'
# How can I calculate the progress of a video?
movie.addEventListener 'progress', -> console.log @buffered.end(0) / @duration
# How do I know how far along the video is?
movie.addEventListener 'timeupdate', -> console.log @currentTime / @duration
```
All of the examples above would also work for audio, just replace the #movie id with the #speakers id. HTML5 is very feature rich. You can get just about any of the information that you could want when using these APIs. I only went over a few of the [events that HTML5 offers](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events). I recommend reading over the rest to get a better grasp of the available tools.

```coffeescript
# For audio you can use the built in Audio Constructor as well.
sound = new Audio ['http://musicdomain.com/getlucky.mp3']
# Preload gets set to auto by default.
# Sources aren't available as a fallback, so manually detect compatibility.
unless sound.canPlayType? 'audio/mpeg'
  # An alternative like flash/silverlight goes here.
```

### Backbone Example
Before wrapping up let's take a look at a real life example. This would be in the case that you were using Backbone, but any structural web application would work similarly. Below I have built a tiny MP3 player that is being controlled and styled through a backbone view, with custom play and pause button ids.
```coffeescript
class MP3Player extends Backbone.View
  template: 'mp3_player'
  events:
    'click #play'  : 'play'
    'click #pause' : 'pause'
  initialize: -> @loadAudio()
  loadAudio: ->
    @$speakers = @$('#speakers').get(0)
    @$('#mp3').get(0).src = 'http://musicdomain.com/getlucky.mp3'
    @load()
  load: -> @$speakers.load()
  play: -> @$speakers.play()
  pause: -> @$speakers.pause()
```
I found that when using HTML5 video and audio in a structural app, the code is more readable. Through a combination of backbone and coffeescript you can create a clean and concise video or audio player. Wrapping the video or audio tags in a container allows you to customize many aspects. Which allows for things like custom control interfaces. Using the timeupdate event you could display a message to the user as they progress or finish streaming. Things can get tricky at times because of the lack of jQuery support. But keep in mind that if you fall back to basic javascript things will work out just fine.

### onFinish
Some may argue that the HTML5 Video and Audio APIs aren't worth introducing yet. Many implementations always have to offer a fallback option using Flash or an alternative like Silverlight. If you take a look at Soundcloud or Youtube, to this day you have to go into some experimental mode just to turn on HTML5 media playback. On top of that browsers differ in their implementation of the HTML5 API and so you have to tiptoe around when using it. This has been the case for most internet related things since the beginning of time, so I doubt this will deter anyone from using it. If you find yourself struggling feel free to contact me. Also the VideoJS and AudioJS libs take care of the majority of failure cases and allow for easy styling out of the box.
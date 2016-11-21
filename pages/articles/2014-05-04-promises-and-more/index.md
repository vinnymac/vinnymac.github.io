---
layout: post
title: "Promises and More"
date: 2014-05-05 12:30:53 -0400
comments: true
sharing: true
category: JavaScript
categories: JavaScript, Promises
---

### onStart
I've recently begun using promises in my javascript and even now I understand how useful they can be. I have come across many tools in the last year that I have found to be helpful. Certain situations have just appeared very hard, and then suddenly the perfect tool would allow me to continue on and overcome a hurdle. Promises are a tool such as that.

### jQuery Deferreds
Although jQuery Deferred promises aren't A+ Compliant, I still find them to be very useful. Often when writing Backbone.Marionette apps I have needed to make a major change to a view and immediately after do some work. This happens in almost ever view in every app I have worked on. Say you need to navigate to another part of the app but first require closing the view the user is looking at. Calling the close or remove method on your view will often do the trick, but when you have extra work, timing becomes important. In many examples, I see people calling the event, and then executing the close. This does work, but is only working because of timing. If you use a jquery deferred you can execute the event after the closing of the view.

```coffeescript
$deferred = $.Deferred()
$deferred.resolve @close()
$deferred.done -> App.vent.trigger 'show:dialog'
```

### Image Loading with jQuery Promises
Many libraries exist to load images, but I like to rock my own. Using jQuery Deferred promises you can go a step further with image loading. Javascript offers an image object which has a few callbacks on it. onLoad, onError, and onAbort can be used with jQuery promises so that you can be sure that the image has succeeded or failed at loading properly.

```coffeescript
imageLoader = (url) ->
  loadImage = (deferred) ->

    loaded = ->
      unbindEvents()
      deferred.resolve image

    errored = ->
      unbindEvents()
      deferred.reject image

    unbindEvents = ->
      image.onload = null
      image.onerror = null
      image.onabort = null

    image = new Image()
    image.onload = loaded
    image.onerror = errored
    image.onabort = errored

    image.src = url

  # promise causes the resolve/reject methods to not be accessible.
  $.Deferred(loadImage).promise()
```

With the above imageLoader you could do something like the example below.

```coffeescript
$promise = imageLoader 'http://catgif.com/cat.gif'
$promise.done (image) -> $('.loading').replaceWith image
$promise.fail -> $('.loading').replaceWith '<img src="sadface.png"></img>'
```

### A+ Promises
A promise is an eventual result of an asynchronous operation. Many people have argued over exactly what the terminology should be and how the inner workings should work. If you aren't looking to argue about this, and just want to take advantage of promises. I recommend starting with q. [Q is an A+ compliant library](http://documentup.com/kriskowal/q/), and it works using the expected when then format.

```coffeescript
# Normal Q Promise structure
Q.fcall step1
.then step2
.then step3
.then (value) -> console.log value
.catch (error) -> console.log error
.done()

# Any function that returns a promise
promise = @climber()
promise.when @climbAMountain() # A when is a static then
promise.then @fallDown()
.catch (error) ->
  # A note on Q promises:
  # It will catch any errors while you are climbing or falling
.done()

# Q also offers a try catch finally block
promise = @anotherPromise()
promise.then # try some work
promise.catch # catch some error
promise.fin # finally do thing
```

Q is a very flexible promise library. It allows you to chain promises and execute arrays of promises. It is easy to use, and combined with coffeescript becomes one of the most readable solutions.

### Tools
Promises are great and have helped dig me out of a lot of holes. Having helpers to assist you along the way when building a web app makes development more enjoyable and relaxing. I'll share some of the other tools that I use to help me along the way. Many people might be thinking why build my own when I can just download something like UnderscoreJS. Libraries are great, but occassionally you come up with a great piece that you just carry with you. I recommend building your own set and improving upon them. Share them with the developers you work with and just spread the word.

```coffeescript
# Cleanup video and audio elements when you are done with them.
cleanupMedia: ($media) ->
  return unless $media.length
  $media[0].pause()
  $media[0].src = ''
  $media.children('source').prop 'src', ''
  $media.remove().length = 0

# Methods to check for HTML5 Video and Audio Support
supports_video: -> !!document.createElement('video').canPlayType
supports_audio: -> !!document.createElement('audio').canPlayType

# Move the cursor to the end of an input
$.fn.focusToEnd = -> @each ->
  v = $(this).val()
  $(this).focus().val("").val v
# Then do this:
$('.input').focusToEnd()

# A contains method for the String class
if not String::contains then String::contains = -> String::indexOf.apply( this, arguments ) isnt -1
# Use it like so:
"apple".contains 'app' # returns true
```

### onFinish
A promise is not the swiss army knife of javascript tools. However it will get you out of hard and ugly situations with asynchronous code. $.ajax, $.post, and $.get all return deferreds that you can then listen in on. That is where the .done, .fail, .always methods come from in asnychronous jquery. Promises are a great way to finish the job, and at any time. Promise libraries exist other than Q, and I would recommend reading about the various other ones before deciding on Q. May promises help you in your developments. If you have any questions feel free to ask, I will respond, I promise.

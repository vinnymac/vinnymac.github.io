---
layout: post
title: "Client-Side EXIF"
date: 2014-04-14 09:59:53 -0400
comments: true
categories: EXIF, Web Worker, Javascript
---

```coffeescript
  1        2       3      4         5            6           7          8

######  ######      ##  ##      ##########  ##                  ##  ##########
##          ##      ##  ##      ##  ##      ##  ##          ##  ##      ##  ##
####      ####    ####  ####    ##          ##########  ##########          ##
##          ##      ##  ##
##          ##  ######  ######
```

### Overview
Images with exif data are often not that easy to handle. I have used many of the options available to one when trying to get Exif in JavaScript. This is a review of several of the options I see as viable, as well as what to do with the exif data once you've retrieved it.

For testing purposes throughout this review, in case you don't have an image with exif intact, download this one for testing.

### Image Orientation in Firefox
http://sethfowler.org/blog/2013/09/13/new-in-firefox-26-css-image-orientation

http://dev.w3.org/csswg/css3-images/#image-orientation

The only browser which actually allows for orientation of images to be corrected right now is [Firefox 26 beta](https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation#Browser_compatibility).

[Unfortunately chrome has yet to implement this feature](https://code.google.com/p/chromium/issues/detail?id=158753) and the only way to see correctly oriented images is by having an image at the [top level of the DOM](https://code.google.com/p/chromium/issues/detail?id=56845#c66). As time passes this feature will become more adopted, and possibly images will be rotated automatically. Firefox will return the best results, but you should be able to try it in any browser you have installed. Just give this [example](http://jsfiddle.net/7tNT4/1/) a try.

```javascript
<img style="image-orientation: from-image" src="image.jpg">
```

### Load-Image Library
https://github.com/blueimp/JavaScript-Load-Image
This library can do a lot of wonderful work loading your images. It has the idea of mix and matching behind its implementation. You can grab the exif and the main library and start parsing data with very few lines of code. After parsing the exif data out, you have to load the image again.

```coffeescript
# Parsing the Metadata
loadImage.parseMetaData file, (data) ->
  if data.exif
    options.orientation = data.exif.get('Orientation')

# Scaling an image
canvas = loadImage.scale image,
  left: 0
  top: 0
  sourceWidth: image.width
  sourceHeight: image.height
  maxWidth: target_width
  maxHeight: target_height
```

As you can see the Load-Image lib allows for a lot more than just exif extraction. You can manipulate images in many ways using this tool. The downsides are that this doesn't use a web worker, so you cannot count on this when doing other performance heavy operations. If you would like to test this out for yourself, they have [a great demo](http://blueimp.github.io/JavaScript-Load-Image/).

### EXIF and BinaryAJAX
Although old, these two files will allow you to extract EXIF meta data from JPEG images. This is best used with the FileReader API available on most modern browsers.
[EXIF](http://www.nihilogic.dk/labs/exif/exif.js) and [BinaryAJAX](http://www.nihilogic.dk/labs/binaryajax/binaryajax.js) are available at http://nihilogic.dk . Below is an example of using the FileReader to load the image, and then extract the exif with EXIF and BinaryAJAX.

```coffeescript
image = @files[0] # Get the first file from the user
reader = new FileReader
reader.onloadend = ->
  exif = EXIF.readFromBinaryFile new BinaryFile @result
reader.readAsBinaryString image
```

The advantage of this library is that it doesn't require much, and you do not have to load the image many times. All it really requires is the use of the File API. The downside is you don't get the advantages of manipulating the images, or resizing properly. All you get is the EXIF data. Seeing as this one is outdated, I would just [give it a try](http://sandbox.juurlink.org/html5imageuploader/) or try the more [code friendly example](http://jsfiddle.net/interstateone/gtLWG/). If you would like to fork the git, you can find it [here](https://github.com/jseidelin/exif-js).

### Flickr's Image Manipulation

http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/

Flickr has a great write up in regards to manipulating image data using web workers. Web workers appear to be a very performant option when getting the exif data. Unfortunately Flickr doesn't go into too much detail, so I do not have a great example to show you. However, the idea is sound. For more information about retreiving exif data on the client, read this.

Consistent exif orientation handling is wack on the web, [a great article on this topic](http://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/), goes into detail about the current state of orientation handling. If you would like a pack of images to test your own implementation of gathering exif data, Dave Perret has a pack of them [over on github](https://github.com/recurser/exif-orientation-examples).
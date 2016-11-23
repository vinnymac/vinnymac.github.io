---
layout: post
title: "Client-Side EXIF"
date: 2014-04-14T09:59:53.000Z
comments: true
sharing: true
category: JavaScript
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

### onStart
Images with exif data are often not that easy to handle. Manipulating images on the client and passing around metadata can be a slow and painful process. I have used many of the options available to one when trying to get exif in JavaScript. This is a review of several viable options for getting exif from an image.

For testing purposes throughout this review I recommend using images with exif data intact. Dave Perret has a pack of them [over on github](https://github.com/recurser/exif-orientation-examples) that you can download.

### Image Orientation in Firefox

Althought this doesn't deal with extracting EXIF, it is worth mentioning for those looking for a solution to orientation problems. The only browser which actually allows for image orientation correction right now is [Firefox 26 beta or above](https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation#Browser_compatibility). Adding this feature is very simple. Just apply the image-orientation style using css to any image tag. [Unfortunately chrome has yet to implement this feature](https://code.google.com/p/chromium/issues/detail?id=158753) and the only way to see correctly oriented images is by having an image at the [top level of the DOM](https://code.google.com/p/chromium/issues/detail?id=56845#c66). As time passes this feature will become adopted, and possibly images will be rotated automatically.

```html
<img style="image-orientation: from-image" src="image.jpg">
```

See for yourself how this works in [my example](http://jsfiddle.net/L3S7R/). Firefox will return the best results, but you should be able to try it in any browser you have installed. Documentation for the image-orientation style can be [found on w3](http://dev.w3.org/csswg/css3-images/#image-orientation).

### Load-Image Library
This library is great at, you guessed it, loading images! It has the idea of mix and matching behind its implementation. You can grab the exif and the main library and start parsing data with very few lines of code. After parsing the exif data out, you have to load the image again. This isn't great for performance but it does work very well. Try it out for yourself [here](https://github.com/blueimp/JavaScript-Load-Image).

```coffeescript
# Parsing the Metadata
loadImage.parseMetaData file, (data) ->
  options = {}
  if data.exif
    options.orientation = data.exif.get('Orientation')
    options.canvas = true # tells loadImage we want a canvas returned
  # Load the Image with new options
  loadImage file, (image) ->
    $('some_div').append(image)
  , options

# You could also scale an image
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

The advantage of this library is that it doesn't require much, and you do not have to load the image many times. All it really requires is the use of the File API. The downside is you don't get the advantages of manipulating the images, or resizing properly. All you get is the EXIF data. Seeing as this one is outdated, I would just [give it a try](http://sandbox.juurlink.org/html5imageuploader/) or try the more [code friendly example](http://jsfiddle.net/interstateone/gtLWG/). Visit the github page [here](https://github.com/jseidelin/exif-js) for more information.

### Flickr's EXIF Extraction
[Flickr has a great write up](http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/) in regards to extracting the metadata using web workers. Web workers appear to be a very performant option. Similarly to the example above, you need to use the FileReader API, but more efficiently slice off only the part of the image that contains the exif data. When working with the exif data in a web worker, the EXIF tag for orientation will be at offset 0x112.

```coffeescript
# Slice up the section of the file that contains the exif (128 KiloBytes = 131072 Bytes)
if file.slice
  filePart = file.slice 0, 131072
else if file.webkitSlice
  filePart = file.webkitSlice 0, 131072
else if file.mozSlice
  filePart = file.mozSlice 0, 131072
else
  filePart = file

# Read part of the file, then send it to our worker for processing
reader = new FileReader
reader.onload = ->
  # Refers to a worker you must define
  jobBlob = new Blob [workers.exif_processor], {type: "text/javascript"}
  worker = new Worker URL.createObjectURL jobBlob
  worker.addEventListener 'message', (e) ->
    console.log "Exif Orientation Data:", e.data
  worker.postMessage
    binary: @result
reader.readAsBinaryString filePart
```
Using Web Workers to process the exif data is the fastest way to correcting your images. You may even be able to get web workers working with one of the examples above. Flickr used to acquire most of the metadata server side, but now they moved over to doing it on the client. Hopefully this will convince others to do the same, and we can get the webs images looking better than they have in the past.

### onFinish
Consistent exif orientation handling is wack on the web, [a great article on this topic](http://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/), goes into detail about the current state of orientation handling. If you think you know a better way, or an alternative to the methods I went over here, please let me know. Extracting EXIF is hard enough, having to manipulate images after is overkill.

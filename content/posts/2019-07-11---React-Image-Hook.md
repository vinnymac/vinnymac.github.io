---
title: "React Image Hook"
date: "2019-07-11T05:57:00.000Z"
template: post
comments: true
sharing: true
draft: false
slug: "react-image-hook"
category: Javascript
tags:
  - "Javascript"
  - "React"
description: "Writing an effective image loader using react hooks"
---

A frequent problem I run into in web development is image loading. The web has built-ins for this, such as `<img />` and `<picture />`. They are not that powerful or flexible however. What if you need fallbacks, or want to do something fancy with low quality image placeholders then you may need something better. Image loading in JS also needs to have a flexible API that happens to work across any browser, lets say IE10 and up, as well as the last 2 versions of Firefox, Chrome, Edge, et cetera. This comes with a lot of trade offs, and you can feel like you are walking on egg shells at times. It would be nice if we could use the modern `Promise` API instead of the old `onload` and `onerror` callbacks we are used to. By the end of this short read, you should feel like you can load images for any use case, and even better with React Hooks!

So lets start by creating a module `loadImage.js`.

```js
export default (url) => new Promise()
```

Next we are going to want to create an image that can tell the browser we want to download an image. This is done by setting the `src` property of the image to a particular url. In some cases this might be across origins, so lets add an option for that as well.

```js
export default (url, crossOrigin) => {
  const image = new Image()

  if (crossOrigin) image.crossOrigin = crossOrigin

  return new Promise(() => {
    image.src = url
  })
}
```

We haven't implemented our promise API properly yet however. We need to fulfill our promise when the image loads, and handle it failing as well. This can be done with `addEventListener` or the older `on` event callbacks, such as `onload`, `onerror`, or `onabort`. Let's try using them below.

```js
export default (url, crossOrigin) => {
  const image = new Image()

  if (crossOrigin) image.crossOrigin = crossOrigin

  return new Promise((resolve, reject) => {
    const loaded = (event) => {
      resolve(event.target)
    }

    const errored = (error) => {
      reject(error)
    }

    image.onload = loaded
    image.onerror = errored
    image.onabort = errored

    image.src = url
  })
}
```

Nice now we can finally give it a try and see if that worked.

```js
import loadImage from './loadImage.js'

async function getImage(url) {
    try {
      const img = await loadImage(url, false)
      // Use `img` however we want, cache it or measure it
      console.log(img.src, img.height, img.width)
    } catch (err) {
      // report error, load fallback, retry, et cetera
      console.error(err)
    }
}

getImage('https://vincenttaverna.com/media/image-1.jpg')
```

Great it works, but with one caveat. Our callbacks are never being cleaned up. We never called `removeEventListener` or more specifically in this case we forgot to unbind our events. Nothing to fret over, we can easily do so by adding an `unbindEvents` method.


```js
export default (url, crossOrigin) => {
  const image = new Image()

  if (crossOrigin) image.crossOrigin = crossOrigin

  return new Promise((resolve, reject) => {
    const loaded = (event) => {
      unbindEvents(image)
      resolve(event.target)
    }

    const errored = (error) => {
      unbindEvents(image)
      reject(error)
    }

    image.onload = loaded
    image.onerror = errored
    image.onabort = errored

    image.src = url
  })
}

function unbindEvents(image) {
  image.onload = null
  image.onerror = null
  image.onabort = null
}
```

To get older browser support you will need to polyfill the `Promise` API. You may also need to use `e.target || e.srcElement` instead to get older IE to cooperate, but otherwise this should work across many different browsers and OS'. Below you can find the complete example with these macro modifications.

```js
export default (url, crossOrigin) => {
  const image = new Image()

  // Support cross origin requests
  if (crossOrigin) image.crossOrigin = crossOrigin

  return new Promise((resolve, reject) => {
    // Load Handler
    const loaded = (event) => {
      // Cleanup our image element, we no longer need it
      unbindEvents(image)
      // Fulfill our promise with the event image element, even in older browsers
      resolve(event.target || event.srcElement)
    }

    // Error Handler
    const errored = (error) => {
      // Cleanup our image element, we no longer need it
      unbindEvents(image)
      // Forward our error to the user
      reject(error)
    }

    // Set our handlers
    image.onload = loaded
    image.onerror = errored
    image.onabort = errored

    // Tell the browser we are ready to begin downloading
    image.src = url
  })
}

function unbindEvents(image) {
  // Reset callbacks
  image.onload = null
  image.onerror = null
  image.onabort = null

  try {
    // Some browsers need you to remove the src
    // in order to garbage collect the image object
    delete image.src
  } catch (e) {
    // Safari's strict mode throws, ignore
  }
}
```

Okay, well now we have a useful helper for loading images, but what else can we do with this? I mean I don't even know how to use this with my cool new React SPA 😡. What if we were to instead wrap this in a React Hook so we could use it across an existing application 😁? Let's create a hook called `useImage` and see if we can use this new helper effectively.

```js
import loadImage from './loadImage.js'

export default function useImage(src) {}
```

We are going to need to keep track of the state (`useState`) of the image as it is loading. This will allow users of our `useImage` hook to know whether or not the image has loaded. We will add states for loading, loaded, and failed. Additionally we are going to need to know when the component is updated, so we will need to `useEffect`.

```js
import { useState, useEffect } from 'react'
import loadImage from './loadImage.js'

const Status = {
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
}

export default function useImage(src) {
  const [status, setStatus] = useState(initialState)

  useEffect(() => {
    if (!src || status === Status.LOADED) return

    try {
      const image = await loadImage(src)
      setStatus(Status.LOADED)
    } catch (error) {
      setStatus(Status.FAILED)
    }
  }, [src])

  return [status]
}
```

This is starting to look like an actual hook. We could do better though. Let's add a cache to reuse image objects. This will make future attempts to load a particular cached `src` avoid loading entirely. 

Additionally we should make sure we call `useRef` to keep track of whether or not we are mounted. This is necessary so we do not try to load images when the component is no longer mounted.

```js
import { useState, useEffect, useRef } from 'react'

import loadImage from './loadImage.js'

const cache = new Map()

export const Status = {
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
}

export default function useImage(src) {
  const cachedImg = cache.get(src)
  const initialState = cachedImg ? Status.LOADED : Status.LOADING
  const [status, setStatus] = useState(initialState)
  const mounted = useRef(false)

  useEffect(
    () => {
      if (!src || status === Status.LOADED) return
      mounted.current = true

      try {
        const image = await loadImage(src)
        if (!mounted.current) return

        cache.set(src, image)
        setStatus(Status.LOADED)
      } catch (error) {
        if (!mounted.current) return

        cache.delete(src)
        setStatus(Status.FAILED)
      }
      return () => {
        mounted.current = false
      }
    },
    [src, status]
  )

  return [status, cachedImg]
}
```

Notice I used a `Map` here for the cache. If you are using older browsers and are not transpiling your code using something like `babel` I recommend using a simple object instead.

Let's see how we might use `useImage` in the wild.

```js
import React from 'react'
import useImage, { Status } from './useImage.js'

import fallback from './fallback.png'

export default function Image({ src }) {
  const [status, image] = useImage(src)

  if (status === Status.LOADING) {
    return <div className="spinner" />
  }
  
  let source
  if (status === Status.FAILED) {
    source = fallback
  } else {
    source = src
  }

  return <img src={source} />
}
```

Great! This is a super flexible API to work with, and can easily be extended to do numerous things. Such as LQIP, lazy loading, or anything we may need. If you wanted you could add `onLoad` and `onError` callbacks to this hook, but ideally you can do everything you want in render now that you have the `status`.

As an exercise try adding `IntersectionObserver` to this hook. Make it only download a given image until the image is actually on screen. Go a step further and display a placeholder until the image is on screen. You will end up with a really convenient way to handle lazy loading, and prevent your browser from downloading images unnecessarily. This can save a lot of bandwidth for your users, as well as make your page load much faster!

If you made a powerful image loader, found this instructional interesting, or just want to ask me something, feel free to bring it up in the comments below.

Thanks for reading


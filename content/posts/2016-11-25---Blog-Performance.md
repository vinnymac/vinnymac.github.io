---
title: "Blog Performance"
date: "2016-11-25T02:06:00.000Z"
template: post
comments: true
sharing: true
draft: false
slug: "blog-performance/"
category: JavaScript
tags:
  - "JavaScript"
  - "Gatsby"
  - "Performance"
description: "Gatsby and Metrics for the new blog."
---

Recently I revamped this blog site using the amazing [GatsbyJS](https://github.com/gatsbyjs). I noticed immediately how much faster it was, and that was in part due to how much work has gone into making gatsby produce an optimized site. I recently watched a [video](https://www.youtube.com/watch?list=PLNYkxOF6rcICc687SxHQRuo9TVNOJelSZ&v=6m_E-mC0y3Y) by Sam Saccone and Paul Irish about performance and metrics. They spoke about two tools [Lighthouse](https://github.com/GoogleChrome/lighthouse) and [PWMetrics](https://github.com/paulirish/pwmetrics) which you can use today to measure your site performance in a useful way. I was able to quickly grasp what bottlenecks were having an adverse affect on the blogs load times.

Through diagnosis I was able to drastically improve the score. Here is what I get from pwmetrics today.

[![PWMetrics](/media/pwmetrics.png)](/media/pwmetrics.png)

You can even generate it yourself. Just try out the commands below.

```bash
yarn global add pwmetrics
pwmetrics https://vincenttaverna.com
```

```bash
yarn global add lighthouse
lighthouse https://vincenttaverna.com
```

The next version of GatsbyJS, v1, is being developed right now. It will improve performance even more so, and I am really looking forward to it. Between inline CSS, offline support via service workers, and more, it will be the best release yet. If I find spare time I will definitely be contributing to it and I think you should to!

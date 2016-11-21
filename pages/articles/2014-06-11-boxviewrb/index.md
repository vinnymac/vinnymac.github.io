---
title: "boxviewrb"
date: 2014-06-11 20:06:09 -0400
layout: post
path: "/boxviewrb/"
comments: true
sharing: true
category: Ruby
categories: Box, Ruby
description: "A look at integrating BoxView with an existing rails app, and the library that came out of this work."
---

### onStart

I took a bit of a blogging hiatus during my vacation recently. I used this time to start working on an open source project called [boxviewrb](https://github.com/getlua/boxviewrb). [Boxviewrb](https://github.com/getlua/boxviewrb) is a Box View API Wrapper written in ruby. It uses the [HTTParty](http://johnnunemaker.com/httparty/) gem for network calls, and also supports multipart uploading. Alternative gems for Box View do exist. However, they are incomplete implementations, some old that have not been updated (crocodoc), and others that just did not offer a complete feature set. [Boxviewrb](https://github.com/getlua/boxviewrb) works with every request and feature that the Box View API has documented. Test coverage is minimal, only some of the requests have tests, but I am meaning to add more coverage in the future. I attempted to make the documentation as readable and self explanatory as I possibly could. This is my first time ever releasing a piece of open source software, and it certainly will not be my last. Instructions on how to contribute can be found at the bottom of the readme.

### onFinish

In previous articles I wrote about communicating with the Box View API using Net::HTTP. Based on this primitive example I was able to make an open source gem. If you read over my documentation, you will notice the convenience methods. They came in handy when placing Box View in a production application. At [Lua](http://getlua.com) we now have document viewing right in the browser! If you would like this feature in a site you're running, give my gem a try. As always if you have any concerns or questions drop a comment below.

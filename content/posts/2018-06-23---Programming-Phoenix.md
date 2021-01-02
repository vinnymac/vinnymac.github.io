---
title: "Programming Phoenix"
date: "2018-06-23T08:38:00.000Z"
template: post
comments: true
sharing: true
draft: false
slug: "programming-phoenix"
category: Elixir
tags:
  - "Elixir"
  - "Erlang"
  - "Phoenix"
description: "Quotes from Programming Phoenix that inspire"
---

Some quotes from Programming Phoenix that inspire

> In July 2015, we (Chris McCord) compared
> Phoenix with Ruby on Rails. The firebird was nearly an order of magnitude
> faster than the locomotive, and it used just over one fourth of the processing
> power and just under one sixth of the total memory. Those numbers are
> staggering, but not many Rails users are after naked power.

> In Phoenix, you won’t have to read through dozens of
> skip_before_filter commands to know how your code works. You’ll just build a
> pipeline for each group of routes that work the same way.

> One continuous problem with web frameworks is that they tend to bloat over
> time, sometimes fatally. If the underlying abstractions for extending the
> framework are wrong, each new feature will increase complexity until the
> framework collapses under its own weight. Sometimes, the problem is that
> the web framework doesn’t include enough, and the abstractions for extending
> the framework aren’t right.
> This problem is particularly acute with object-oriented languages. Inheritance
> is simply not a rich enough abstraction to represent the entire ecosystem of
> a web platform. Inheritance works best when a single feature extends a
> framework across a single dimension. Unfortunately, many ambitious features
> span several different dimensions.

> As a developer,
> until now, you’ve been forced to make a choice between applications that
> intentionally forget important details to scale and applications that try to
> remember too much and break under load.

> Phoenix has:
> isolation and concurrency. Isolation guarantees that if a bug affects one
> channel, all other channels continue running. Breaking one feature won’t
> bleed into other site functionality. Concurrency means one channel can never
> block another one, whether code is waiting on the database or crunching
> data. This key advantage means that the UI never becomes unresponsive
> because the user started a heavy action.

> The problem for Rails developers is
> that the scope of problems it’s best able to solve is rapidly narrowing.

> If you’re a Java developer looking for where to go next, or a JVM-language
> developer looking for a better concurrency story, Phoenix would mean leaving
> the JVM behind. Maybe that’s a good thing. You’ll find a unified, integrated
> story in Phoenix with sound abstractions on top. You’ll see a syntax that
> provides Clojure-style metaprogramming on syntax that we think is richer
> and cleaner than Scala’s.

> A web server is a natural problem for
> a functional language to solve.

> In Phoenix, that connection is the whole universe of things we need to know
> about a user’s request.

> We process data in the model; we read or write that data through
> the controller. Ecto allows us to organize our code in this way. It separates
> the code with side effects, which changes the world around us, from the code
> that’s only transforming data.

> the atom table isn’t garbage-collected.

> Your application is a series of plugs, beginning with an endpoint
> and ending with a controller

> mix ecto.gen.migration create_user

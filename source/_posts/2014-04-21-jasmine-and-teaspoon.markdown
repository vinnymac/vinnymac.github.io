---
layout: post
title: "Jasmine and Teaspoon"
date: 2014-04-21 23:59:13 -0400
comments: true
sharing: true
categories: Jasmine, Teaspoon
---

### onStart
In the case of writing tests for your javascript/coffeescript apps you will find that jasmine is one of the best options. It is easy to add to by improving its matchers, and it is flexible enough to test more difficult subjects like asynchronous calls or mock/stub events and data. If you are currently looking for a way to test the front end of your website or javascript app you will not regret using jasmine to do so.

### Getting Started with Teaspoon
When testing with Jasmine I found it easiest to use Teaspoon alongside to easily setup a testing environment.

```ruby
# Add these lines to your Gemfile
group :development, :test do
  gem "teaspoon"
  # if you are using phantomjs
  # gem "phantomjs", ">= 1.8.1.1"
end
```

After setting up your gemfile, you can run bundler. Then execute the following line in your terminal.

```
rails generate teaspoon:install --framework=mocha --coffee
```
You can run your tests by visiting http://localhost:3000/teaspoon or whatever port you run your server on.
Alternatively you can run the teaspoon test suites by typing rake teaspoon in the command line.


### Writing Jasmine Tests
Now that you have setup Teaspoon you can get to the fun. I recommend reading the jasmines documentation, they have a lot of great examples on the various types of tests you may come across when testing a front end.
```coffeescript

```

### Creating Matchers
So now that you have written a test, maybe you want to expand the tools you have at your disposal when testing in Jasmine. Matchers are the key to this. If you have the UnderscoreJS Lib, you have a lot of easy matchers you can add to Jasmine that will make testing very simple.

### onFinish
Hopefully this brief overview of Teaspoon with Jasmine will give you the jump start you need to get into front end testing. Testing is invaluable, and I recommend doing it for more than just your front end if you can. If you have any problems while testing with Jasmine or just want some help, leave a comment below.
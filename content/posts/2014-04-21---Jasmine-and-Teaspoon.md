---
template: post
title: "Jasmine and Teaspoon"
date: "2014-04-21T23:59:13.000Z"
sharing: true
comments: true
draft: false
slug: "jasmine-and-teaspoon"
category: JavaScript
tags:
  - "Jasmine"
  - "Teaspoon"
  - "JavaScript"
---

### onStart
In the case of writing tests for your javascript/coffeescript apps you will find that Jasmine is one of the best options. It is easy to add to by improving its matchers, and it is flexible enough to test more difficult subjects like asynchronous calls or mock/stub events and data. If you are currently looking for a way to test the front end of your website or javascript app you will not regret using jasmine to do so.

### Getting Started with Teaspoon
When testing with Jasmine I found it easiest to use [Teaspoon](https://github.com/modeset/teaspoon) alongside to easily setup a testing environment. Teaspoon has many benefits. They offer support for command line testing as well as testing in the browser. Teaspoon automatically generates a spec helper so that you can easily require your front end app. Combine this with Stub/Mocking with [jasmine-sinon](https://github.com/froots/jasmine-sinon) and [jasmine-jquery](https://github.com/velesin/jasmine-jquery) and you will have all the testing tools you could want on the front end.

```ruby
# Add these lines to your Gemfile
group :development, :test do
  gem "teaspoon"
  # Teaspoon can use selenium or phantomjs
  # gem "phantomjs", ">= 1.8.1.1"
end
```
After setting up your gemfile, you can run bundler. Then execute the following line in your terminal. You can specify a framework, in my case I am using Jasmine, but Teaspoon supports other as well, such as Mocha. I also love to use coffeescript when testing, so I append --coffee to the end of the command to tell Teaspoon I will be writing coffee files.
```
rails generate teaspoon:install --framework=jasmine --coffee
```
You can run your tests by visiting http://localhost:3000/teaspoon. Where 3000 is the port you run your server on.
Alternatively you can run the Teaspoon test suites by typing rake teaspoon in the command line. They both have benefits, but ultimately you may find yourself wanting to run your tests using Guard. That way you can run your tests while you develop. If you are interested in using Guard with Teaspoon, I recommend reading about [guard-teaspoon](https://github.com/modeset/guard-teaspoon).

### Writing Jasmine Tests
Now that you have setup Teaspoon you can get to the fun part. I recommend reading Jasmines documentation, they have a lot of great examples on the various types of tests you may come across when testing a front end. In my case below, I am testing my backbone model Person, and the attributes that exist on it by default. If you want open a new file in the jasmine folder that Teaspoon generated. In my case it would be person_spec.coffee.
```coffeescript
describe "Person", ->

  # If you want to do something before each test
  beforeEach ->
    person = new People.Person()

  it 'should be alive', ->
    expect(person).toBeDefined()

  it 'should have a name', ->
    expect(person.get('name')).toBeString() # underscore method

  it 'should have a favorite food', ->
    expect(person.get('food')).toBe("Pizza")

  it 'should have an identification', ->
    expect(person.get('id')).toBeNumber()

  # If you want to write the boilerplate
  # for a test you haven't finished yet
  xit 'can die', ->

  # Testing a method on a model
  it 'should have a creator', ->
    expect(person.creator()).toBe("Vinny")
```

### Creating Matchers
So now that you have written a test, maybe you want to expand the tools you have at your disposal when testing in Jasmine. Matchers make it easy to create new tools you can use for testing. If you have the [UnderscoreJS](http://underscorejs.org/) library, you can easily add some matchers to Jasmine that will make testing better. In order to start adding matchers, open up your spec_helper file that Teaspoon generated. At the end of this file you can add any matchers you might want when writing your tests.

```coffeescript
beforeEach -> # Executes this code before each test.
  @addMatchers # Tells Jasmine to add these matchers
    toBeOfType: (type) ->
      return typeof @actual is type # @actual points to the expected value
    toBeNaN: ->
      return _.isNaN @actual
    toBeDate: ->
      return _.isDate @actual
    toBeEmpty: ->
      return _.isEmpty @actual
    toBeArray: ->
      return _.isArray @actual
    toBeObject: ->
      return _.isObject @actual
    toBeRegExp: ->
      return _.isRegExp @actual
    toBeFinite: ->
      return _.isFinite @actual
    toBeString: ->
      return _.isString @actual
    toBeNumber: ->
      return _.isNumber @actual
    toBeElement: ->
      return _.isElement @actual
    toBeBoolean: ->
      return _.isBoolean @actual
    toBeFunction: ->
      return _.isFunction @actual
    toHaveArguments: ->
      return _.isArguments @actual
```
By using a library like underscore you retain the testing environment that Jasmine creates, even when doing comparisons like expecting a handful of arguments. By adding matchers your tests become more clear and concise. Being able to write thin self explanatory tests is priceless. Especially when the magic is coming from a spec helper that you yourself have written.

### onFinish
Hopefully this brief overview of Teaspoon will give you the jump start you need to get into front end testing. Testing is invaluable, and I recommend doing it for more than just your front end if you can. If you have any problems while testing with Jasmine or just want some help, leave a comment below.

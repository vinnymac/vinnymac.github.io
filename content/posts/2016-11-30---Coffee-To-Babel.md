---
title: "Coffee to Babel in 24 hours"
date: "2016-11-30T09:17:00.000Z"
template: post
comments: true
sharing: true
draft: false
slug: "coffee-to-babel/"
category: JavaScript
tags:
  - "JavaScript"
  - "CoffeeScript"
description: "How I quickly translated an entire frontend codebase from coffee to babel."
---

Recently I was tasked with modernizing a CoffeeScript codebase to use Babel. I've used babel (and 6to5) across various projects for almost two years, not to mention I have been writing CoffeeScript since it has been in the hands of the public. I was told to convert the code to coffee to babel as quickly as I could. Fortunately the project I was working with was already setup with webpack which made using the `babel-loader` alongside the `coffee-loader` a possibility if I failed to convert everything on time. With that in mind I configured a basic `.eslintrc` and `.babelrc` and started the process of translation.

Surprisingly the process didn't start with actual translations. Manual translation would not be quick enough. Dredging through hundreds of coffee files was going to take me way more time than I had. So I started searching around for tools that could convert CoffeeScript to Babel. Tons of tools exist, but nothing to do this exact conversion. Luckily you can get something working pretty well if you use the right combination of tools. You will come across some files that don't fully convert, and you may even need to tweak the conversion tool to get it working to your liking. Given a time crunch like I had, you would be glad to have this as an option.

### [CJSX-Codemod](https://github.com/jsdf/cjsx-codemod)

If you aren't using JSX, or you don't know what JSX is, you can ignore this tool. It is only required if you were previously using JSX, and you can move on to the next tool I used in this process. For everyone else, this tool lets us convert JSX to coffee. So lines like `<div />` will translate to `React.createElement('div', null)`. You can globally install this package and then run it over a directory of scripts of your choosing. It will fire off some workers and tell you if it had any trouble along the way. If you are lucky everything will go smoothly. I recommend sanity checking throughout each step, and committing the changes that you are making so you don't end up wasting any time.

```bash
yarn global add cjsx-codemod
cjsx-codemod ./scripts
```

### [Decaffeinate](https://github.com/decaffeinate/decaffeinate)

This next tool will convert a coffee file to a babel compatible file. I couldn't find a great way to run the tool over a directory of scripts. Fortunately you can just run the command on a list of coffee files by piping it through xargs. If you don't know what the command below does let me explain. I search for files in a folder of my choice and then filter by coffee files. Next I run the decaffeinate command on each file that has been found. You should end up with a bunch of new javascript files, and your existing coffee files should remain untouched. Feel free to delete the coffee files now that they are unnecessary.

```bash
yarn global add decaffeinate
find ./scripts | grep .coffee | xargs -n 1 -P 5 decaffeinate
```

### [React-Codemod](https://github.com/reactjs/react-codemod)

Again, you should be able to ignore this if you aren't using JSX. This tool lets us turn those `React.createElement` calls back into JSX. You will need to add jscodeshift first, as this is just a script we tell it to use on a directory of javascript files. Make sure everything looks good, and move on to the final step.

```bash
yarn global add jscodeshift
git clone https://github.com/reactjs/react-codemod.git
cd ./react-codemod
yarn --no-lockfile
jscodeshift -t ./react-codemod/transforms/create-element-to-jsx.js ./scripts --no-explicit-require
```

### [ESLint](https://github.com/eslint/eslint)

I recommend configuring a `.eslintrc`. You can install ESLint and have it automatically fix up the transpiled code. This final step will give you a much more readable and clean result.

```bash
yarn add eslint --dev
./node_modules/eslint/bin/eslint.js --fix ./scripts
```

### Others

Below are some other tools that I found useful. You may find they give you false positives, so make sure to review all your changes carefully before committing. I hope these tools will help you out of a tight situation like the one I was in.

* [Lebab](https://github.com/lebab/lebab)
* [CoffeeScript](http://coffeescript.org/#usage)
* [CoffeeToES6](https://github.com/kriszyp/coffeetoes6)

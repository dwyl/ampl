# ampl

Ampl transforms your Markdown into ***AMP-compliant html*** so it loads super-fast!

[![Build Status](https://travis-ci.org/dwyl/ampl.svg?branch=master)](https://travis-ci.org/dwyl/ampl)
[![codecov.io](https://codecov.io/github/dwyl/ampl/coverage.svg?branch=master)](https://codecov.io/github/dwyl/ampl?branch=master)
[![Code Climate](https://codeclimate.com/github/dwyl/ampl/badges/gpa.svg)](https://codeclimate.com/github/dwyl/ampl)
[![Dependency Status](https://david-dm.org/dwyl/ampl.svg)](https://david-dm.org/dwyl/ampl)
[![devDependency Status](https://david-dm.org/dwyl/ampl/dev-status.svg)](https://david-dm.org/dwyl/ampl#info=devDependencies)
[![HitCount](https://hitt.herokuapp.com/dwyl/ampl.svg)](https://github.com/dwyl/ampl)

## Why?

Google is putting their clout behind the AMP
(_**A**ccelerated **M**obile **P**ages_) Project
to help speed up page load times on the Mobile Web:
https://googleblog.blogspot.co.uk/2015/10/introducing-accelerated-mobile-pages.html

This module lets you convert Markdown (`.md`) files to AMP-compliant `.html`
so that you can serve them up to mobile clients *much* faster.

## What?

For many, reading on the mobile web is a slow, clunky and frustrating experience - but it doesn’t have to be that way.
The Accelerated Mobile Pages (AMP) Project is an open source initiative that embodies the vision that publishers
can create mobile optimized content once and have it load instantly everywhere.

> Read: https://www.ampproject.org/

## How?

The best place to understand how AMP works is on
the official "*How it Works*" page:
https://www.ampproject.org/how-it-works/

### Usage Example

#### install `ampl` from NPM

First install the module from npm:

```sh
npm install ampl --save
```

#### use `ampl.parse` in your code

Then in your **ES5** code:

```js
var ampl = require('ampl');
var markdownString = '# Hello World!'; // or read from a .md file
var cssStyle = 'h1 { color: green; }'; // or load your style.css file
ampl.parse(markdownString, cssStyle, function(ampHtml) {
  console.log(ampHtml);
});
```

*Alternatively*, if you are already using ***ES6*** in your project, write:
```js
import { parse } from 'ampl';
const markdownString = '# Hello World!'; // or read from a .md file
const cssStyle = 'h1 { color: green; }'; // or load your style.css file
parse(markdownString, cssStyle, function(ampHtml) {
  console.log(ampHtml);
});
```

This simple example is in `example/simple.js`
To *run* this example, execute the following command in your terminal:

```js
./node_modules/babel-cli/bin/babel-node.js example/simple.js
```

This will output the following AMP-Compliant `html`:
```js
<html amp>
  <head >
    <meta charset='utf-8'></meta>
    <link rel='canonical' href='default.html'></link>
    <meta name='viewport' content='width=device-width,minimum-scale=1,initial-scale=1'></meta>
    <style amp-custom>
      h1 { color: green; }
    </style>
    <style >body {opacity: 0}</style><noscript ><style >body {opacity: 1}</style></noscript>
    <script async src='https://cdn.ampproject.org/v0.js'></script>
    <title >Index</title>
  </head>

    <div class="wrapper-main">
      <body >
    <h1 >Hello World!</h1>

  </body>
    </div>
</html>
```
When viewed in a *Browser*:
![dwyl-ampl-simple-example-hello-world-screenshot](https://cloud.githubusercontent.com/assets/194400/12456755/1ff076fc-bf99-11e5-869a-339d134cb50f.png)

> More elaborate example to follow...

## Background Reading

+ The AMP Spec: https://github.com/ampproject/amphtml

## Questions?

> If you have any questions please ask: https://github.com/dwyl/ampl/issues

**DEPRECATED AND NO LONGER MAINTAINED**
> We (I) had fun and learned a lot, but the time has come to say cheerio!

Web Caddy [![NPM version](http://img.shields.io/npm/v/web-caddy.svg)](https://www.npmjs.org/package/web-caddy) [![Circle CI](https://circleci.com/gh/peter-mouland/web-caddy/tree/master.svg?style=svg)](https://circleci.com/gh/peter-mouland/web-caddy/tree/master)
========================
> Create, Build, Test, Serve and Release. Quickly

 * Build and serve static or [NodeJS](http://en.wikipedia.org/wiki/Node.js) sites
 * Automatic browser refresh when source code is changed
 * Use [Jade](http://jade-lang.com) or [Mustache](https://mustache.github.io) HTML templating
 * Compile [Sass](http://en.wikipedia.org/wiki/Sass_(stylesheet_language)) and [CommonJS](http://en.wikipedia.org/wiki/CommonJS) or [AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) to CSS/JS and `.min` minified equivalents 
 * Test your code and automatically retest on the fly with each code change. True TDD!
 * Code coverage reporting by default with adjustable thresholds
 * [Continuous (or manual) Deployment](docs/RELEASE.md) to [github.io](https://pages.github.com), [Bower](http://bower.io) and/or [Amazon S3](http://en.wikipedia.org/wiki/Amazon_S3)
 * Customise the build process using [caddy.config.js](boilerplate/caddy.config.js) or using [gulp](examples/gulpfile.js)

## Installation

`npm install web-caddy --save-dev`

## Quick Start

#### Creating A New Project

> To create a new project with a build process, tdd and continuous deployment already set-up

1. Run `caddy new *project-name*` (which will create a directory)
2. *follow on-screen instructions.*
3. Run `npm start` within your new directory

[More Info >](docs/INITIALISING.md)

#### Enhancing An Existing Project

> Get the CLI (build, test, release etc) working within an existing project

1. Copy the [caddy.config.js](boilerplate/caddy.config.js) into your project root
2. Update the `tasks` object to match the jobs you need doing
3. Update the `buildPaths` object to match your directory structure

## Commands

> CLI and NodeJS commands

The web-caddy can be run from the command line or directly from within js files (i.e. a NodeJS script or a gulpfile). 
Once required (`var caddy = require('web-caddy');`), you can call the following:

CLI | Node | Sub-tasks
--- | ---- | ---------
[caddy new *project-name*](docs/NEW.md) | *unavailable* | *none*
[caddy build](docs/BUILD.md) | `caddy.build.all()` | styles, scripts, html
[caddy clean](docs/CLEAN.md) | `caddy.clean.all()` | styles, scripts, html, build, copy
[caddy copy](docs/COPY.md) | `caddy.copy()` | *none*
[caddy serve](docs/SERVE.md) | `caddy.serve()`  | *none*
karma start xxx.js | *unavailable* (see [karma](https://karma-runner.github.io/0.13/dev/public-api.html)) | *none*
[caddy init](docs/INIT.md) | `caddy.init.all()` | bower, gh-pages, git
[caddy bump](docs/BUMP.md) | `caddy.bump()` | *none*
[caddy release](docs/RELEASE.md#manual-deployment) | `caddy.release.all()` | bower, gh-pages, s3

**hint: add `-verbose` to the cli to see more logging**
**hint: add `-dev` to the cli to prevent js/css minification**

The CLI and Node will use the config set within [caddy.config.js](boilerplate/caddy.config.js) in your project root.

## Use Cases

> Setup your project to get the most out of `caddy`
 * [Example config file](examples/caddy.config.js)
 * [Continuous Deployment](docs/CONTINUOUS-DEPLOYMENT.md) 
 * [Using NodeJS](docs/NODE-EXAMPLE.md) 
 * [Using Gulp](docs/GULP-EXAMPLE.md) 

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

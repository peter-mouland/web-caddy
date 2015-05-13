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

`npm install -g web-caddy`

## Quick Start

#### Creating A New Project

> To create a new project with a build process, tdd and continuous deployment already set-up

1. Run `caddy new *project-name*` (which will create a directory)
2. *follow on-screen instructions.*
3. Run `npm start` within your new directory

[More Info >](INITIALISING.md)

#### Enhancing An Existing Project

> Get the CLI (build, test, release etc) working within an existing project

1. Copy the [caddy.config.js](boilerplate/caddy.config.js) into your project root
2. Remove and Update the the config for your needs
3. Update the `paths` object to match your directory structure

## Use Cases

> Setup your project to get the most out of `caddy`
 * [Example config file](examples/caddy.config.js)
 * [Initialising](docs/INITIALISING.md) remote services (Bower, Git + github.io)
 * [Building](docs/BUILD.md) code and automatically recreate the directory structure a set `target`
 * [Serving](docs/SERVE.md) static or NodeJS sites
 * [Testing](docs/TEST.md) while developing (TDD) or a single run before you release
 * [Releasing](docs/RELEASE.md) to Amazon S3, Bower, GitHub.io and Git using continuous or manual deployments 

## API

The web-caddy can be run from the command line or directly from within NodeJS files (i.e. a gulpfile).  The tasks are almost exactly the same.

Once required (`var caddy = require('web-caddy');`), you can call the following:

CLI | Node
--- | ----
caddy new *project-name* | *unavailable*
[caddy build](docs/BUILD.md) | `caddy.build.all(replacements)`<br> (optional: replacements object)
[caddy build scripts](docs/BUILD.md#scripts) | `caddy.build.scripts()`
[caddy build styles](docs/BUILD.md#styles) | `caddy.build.styles()`
[caddy build html](docs/BUILD.md#html) | `caddy.build.html(replacements)` <br>(optional: replacements object)
[caddy build server-config-files](docs/BUILD.md#server-config-files) | `caddy.build.serverConfigFiles()`
[caddy serve](docs/SERVE.md) | `caddy.serve.all(config)` <br>(optional: [server *config*](API.md#serve))
[caddy serve path/to/serve](docs/SERVE.md#adhoc-pages) | `caddy.serve.adhoc(path)` <br>(mandatory: path/to/serve)
[caddy test](docs/TEST.md#testing) | `caddy.test.all()`
[caddy test tdd](docs/TEST.md#tdd) | `caddy.test.tdd()`
[caddy init bower](docs/INITIALISING.md#bower) | `caddy.init.bower()`
[caddy init git](docs/INITIALISING.md#remote-git-repository) | `caddy.init.git(repository)` <br>(mandatory: Git URL)
[caddy bump *Semantic Version*](docs/RELEASE.md#bump-the-version) | `caddy.bump.all(versionType)` <br>(optional: *major*, *minor*, *patch*, *prerelease* or semantic *version*)
[caddy release](docs/RELEASE.md#manual-deployment) | `caddy.release.all()`
[caddy release gh-pages](docs/RELEASE.md#deploying-to-github.io) | `caddy.release.ghPages(message)` <br>(optional: commit *message*)
[caddy release s3](docs/RELEASE.md#deploying-to-amazon-s3) | `caddy.release.s3(version)` <br>(optional: semantic *version*)

The CLI and Node will use the config set within [caddy.config.js](boilerplate/caddy.config.js) in your project root.

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

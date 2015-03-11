Component Helper [![NPM version](http://img.shields.io/npm/v/component-helper.svg)](https://www.npmjs.org/package/component-helper) [![Circle CI](https://circleci.com/gh/skyglobal/component-helper/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/component-helper/tree/master)
========================
> Quickly create new components or Improve your existing build process

 * Build and serve (static or NodeJS) sites
 * Automatic browser refresh when source code is changed
 * Use Jade or Mustache HTML templating
 * Compile Sass and CommonJS or AMD to CSS/JS and `.min` equivalents 
 * Test your code and automatically retest on the fly with each code change. True TDD!
 * Code coverage reporting by default with adjustable thresholds
 * [Continuous (or manual) Deployment](RELEASING.md) to github.io, Bower and/or Amazon S3
 * Customise the build process using [component.config.js](component-structure/component.config.js) or using [gulp](examples/gulpfile.js).

## Installation

`npm install -g component-helper`

## Creating a New Component

1. Create a repository on github (optional)
2. Run `component new *component-name*` (which will create your component directory)
3. *follow on-screen instructions.*
4. in your component's directory, Run `npm start` .
5. Run `npm run tdd` : test your code even while making code changes.

### Generated Directory Structure

    $ component
    ├── test            => Home of your test config plus test specs
    ├── demo            => source code used soley for demoing the functionality
    │   ├- _includes    => Contains any html files to be concatinated to index.html
    │   ├- scripts      => any javascript needed to get the demo working
    │   ├- styles       => any Sass needed to get the demo working
    │   ├- images       => demo images directories
    │   └- index.html
    ├── src             => source code for the component.
    │   ├- scripts      => component javascript
    │   ├- styles       => component Sass
    ├── circle.yml      => Configuration to enable automatic build using circleci.com
    ├── gulpfile.js     => Default gulp setup to enable build, serve, test and release
    └── component.config.js       => Store the build config including the AWS variables
     
## API

The component helper can be run from the command line or directly from within NodeJS files (i.e. a gulpfile).  The tasks a almost exactly the same.

Once required (`var component = require('component-helper');`), you can call the following:

CLI | Node
--- | ----
[component new *component-name*](API.md/#new) | *unavailable*
[component build](API.md/#build) | `component.build.run(replacements)`<br> (optional: replacements object)
[component build scripts](API.md/#scripts) | `component.build.scripts()`
[component build styles](API.md/#styles) | `component.build.styles()`
[component build html](API.md/#html) | `component.build.html(replacements)` <br>(optional: replacements object)
[component serve](API.md/#serve) | `component.serve.run(config)` <br>(optional: [server *config*](API.md#serve))
[component serve path/to/serve](API.md/#adhoc) | `component.serve.adhoc(path)` <br>(mandatory: path/to/serve)
[component test](API.md/#testing) | `component.test.run()`
[component test tdd](API.md/#tdd) | `component.test.tdd()`
[component init bower](API.md/#bower) | `component.init.bower()`
[component init git](API.md/#git) | `component.init.git(repository)` <br>(mandatory: Git URL)
[component release](API.md/#releasing) | `component.release.run(versionType)` <br>(optional: *major*, *minor*, *patch*, *prerelease* or semantic *version*)
[component release gh-pages](API.md/#gh-pages) | `component.release.ghPages(message)` <br>(optional: commit *message*)
[component release s3](API.md/#s3) | `component.release.s3(version)` <br>(optional: semantic *version*)

The CLI and Node will use the config set within [component.config.js](component-structure/component.config.js) in your project root.

[API in Detail >](API.md)

### Advanced Customisation + Gulp

Using Node (or Gulp) you can customise the build process even more.

[Customisation Examples >](Customisation-Examples.md)

### Regression/Screen-shot tests

To add regression testing, please see [Sheut](https://github.com/skyglobal/Sheut)

## Releasing

 * [Continuous Deployment](RELEASING.md#continuous-deployment)
 * [Manual Deployment](RELEASING.md#manual-deployment)
 * [Amazon S3](API.md#s3)

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

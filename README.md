Component Helper [![NPM version](http://img.shields.io/npm/v/component-helper.svg)](https://www.npmjs.org/package/component-helper) [![Circle CI](https://circleci.com/gh/skyglobal/component-helper/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/component-helper/tree/master)
========================
> Quickly create new components or improve your existing build process

Out of the box you can:
 * Build and serve (static or NodeJS) sites
 * Automatic browser refresh when source code is changed
 * Compile Sass and CommonJS to CSS/JS and `.min` equivalents 
 * Test your code and keep an eye on code coverage.
 * Deploy to github.io, Bower or the cloud (currently Amazon S3)
 * Customise the build process using [component.config.js](component-structure/component.config.js) or using [gulp](component-structure/gulpfile.js).

## Installation

`npm install -g component-helper`

## Creating a New Component

1. Create a repository on github (optional)
2. Run `component new *component-name*` (which will create your component directory)
3. *follow on-screen instructions.*
4. Run `component serve` in your component's directory.
5. Run `component test` to test your code.
6. Run `component release` to release your code.

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
[component build](API.md/#build) | `component.build.all(replacements)`<br> (optional: replacements object)
[component build scripts](API.md/#scripts) | `component.build.scripts()`
[component build styles](API.md/#styles) | `component.build.styles()`
[component build html](API.md/#html) | `component.build.html(replacements)` <br>(optional: replacements object)
[component serve](API.md/#serve) | `component.serve.all(config)` <br>(optional: [server *config*](API.md#serve))
[component serve quick](API.md/#quick) | `component.serve.quick(config)` <br>(optional: [server *config*](API.md#serve))
[component test](API.md/#testing) | `component.test.all()`
[component test quick](API.md/#quick-1) | `component.test.quick()`
[component test tdd](API.md/#tdd) | `component.test.tdd()`
[component init bower](API.md/#bower) | `component.init.bower()`
[component init remoteGit](API.md/#bower) | `component.init.remoteGit(repository)` <br>(mandatory: Git SSH URL)
[component release](API.md/#releasing) | `component.release.all(versionType)` <br>(optional: *major*, *minor*, *patch*, *prerelease* or semantic *version*)
[component release gh-pages](API.md/#gh-pages) | `component.release.ghPages(message)` <br>(optional: commit *message*)
[component release s3](API.md/#s3) | `component.release.s3(version)` <br>(optional: semantic *version*)

The CLI and Node will use the config set within [component.config.js](component-structure/component.config.js) in your project root.

[API in Detail >](API.md)

### Advanced Customisation

Using Node (or Gulp) you can customise the build process even more.

[Customisation Examples >](Customisation-Examples.md)

### Regression/Screen-shot tests

To add regression testing, please see [Sheut](https://github.com/skyglobal/Sheut)

## Releasing your Component

If you are ready for your component to go public, you can release the code to Bower, github.io (gh-pages branch) and to the cloud (AWS).

[Read More >](RELEASING.md)

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

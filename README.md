Component Helper [![NPM version](http://img.shields.io/npm/v/component-helper.svg)](https://www.npmjs.org/package/component-helper) [![Circle CI](https://circleci.com/gh/skyglobal/component-helper/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/component-helper/tree/master)
========================
> Create, Build, Test, Serve and Release. Quickly

 * Build and serve static or [NodeJS](http://en.wikipedia.org/wiki/Node.js) sites
 * Automatic browser refresh when source code is changed
 * Use [Jade](http://jade-lang.com) or [Mustache](https://mustache.github.io) HTML templating
 * Compile [Sass](http://en.wikipedia.org/wiki/Sass_(stylesheet_language)) and [CommonJS](http://en.wikipedia.org/wiki/CommonJS) or [AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) to CSS/JS and `.min` minified equivalents 
 * Test your code and automatically retest on the fly with each code change. True TDD!
 * Code coverage reporting by default with adjustable thresholds
 * [Continuous (or manual) Deployment](docs/RELEASING.md) to [github.io](https://pages.github.com), [Bower](http://bower.io) and/or [Amazon S3](http://en.wikipedia.org/wiki/Amazon_S3)
 * Customise the build process using [component.config.js](boilerplate/component.config.js) or using [gulp](examples/gulpfile.js).

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
    │   ├- _includes    => Contains any html files to be concatenated to index.html
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

The component helper can be run from the command line or directly from within NodeJS files (i.e. a gulpfile).  The tasks are almost exactly the same.

Once required (`var component = require('component-helper');`), you can call the following:

CLI | Node
--- | ----
component new *component-name* | *unavailable*
[component build](docs/BUILD.md) | `component.build.run(replacements)`<br> (optional: replacements object)
[component build scripts](docs/BUILD.md#scripts) | `component.build.scripts()`
[component build styles](docs/BUILD.md#styles) | `component.build.styles()`
[component build html](docs/BUILD.md#html) | `component.build.html(replacements)` <br>(optional: replacements object)
[component serve](docs/SERVE.md) | `component.serve.run(config)` <br>(optional: [server *config*](API.md#serve))
[component serve path/to/serve](docs/SERVE.md#adhoc-pages) | `component.serve.adhoc(path)` <br>(mandatory: path/to/serve)
[component test](docs/TEST.md#testing) | `component.test.run()`
[component test tdd](docs/TEST.md#tdd) | `component.test.tdd()`
[component init bower](docs/INITIALISING.md#bower) | `component.init.bower()`
[component init git](docs/INITIALISING.md#remote-git-repository) | `component.init.git(repository)` <br>(mandatory: Git URL)
[component bump *Semantic Version*](docs/RELEASE.md#bump-the-version) | `component.bump.run(versionType)` <br>(optional: *major*, *minor*, *patch*, *prerelease* or semantic *version*)
[component release *Semantic Version*](docs/RELEASE.md#manual-deployment) | `component.release.run(versionType)` <br>(optional: *major*, *minor*, *patch*, *prerelease* or semantic *version*)
[component release gh-pages](docs/RELEASE.md#deploying-to-github.io) | `component.release.ghPages(message)` <br>(optional: commit *message*)
[component release s3](docs/RELEASE.md#deploying-to-amazon-s3) | `component.release.s3(version)` <br>(optional: semantic *version*)

The CLI and Node will use the config set within [component.config.js](boilerplate/component.config.js) in your project root.

### Use Cases

 * [Initialise](docs/INITIALISING.md)
 * [Build](docs/BUILD.md)
 * [Serve](docs/SERVE.md)
 * [Test](docs/TEST.md)
 * [Release](docs/RELEASE.md)

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

Component Helper [![NPM version](http://img.shields.io/npm/v/component-helper.svg)](https://www.npmjs.org/package/component-helper) [![Circle CI](https://circleci.com/gh/skyglobal/component-helper/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/component-helper/tree/master)
========================
> Quickly create new components or improve your existing build process

Out of the box you can:
 * Build and serve (static or NodeJS) sites
 * Automatic browser refresh when source code is changed
 * Compile Sass and CommonJS to CSS/JS and `.min` equivalents 
 * Test your code and keep an eye on code coverage.
 * Deploy to github.io, Bower or the cloud (currently Amazon S3)
 * Customise the build process using [component.config.js](component-structure/component.config.js) or using gulp.

## Installation

`npm install -g component-helper`

## Creating a New Component

1. Create a repository on github
2. Run `component new` and follow on-screen instructions
3. Run `component serve` in your component's directory.
4. Run `component test` to test your code!

### Generated Directory Structure

    $ component
    ├── _site           => Generated / Compiled demo site
    ├── config          => Store the build config including the AWS variables
    ├── dist            => Compiled code to be distrubtuted via bower
    ├── test            => Home of your test config plus test specs
    ├── demo            => source code used soley for demoing the functionality
    │   ├- _includes    => Contains any html files to be concatinated to index.html
    │   ├- js           => any javascript needed to get the demo working
    │   ├- scss         => any Sass needed to get the demo working
    │   ├- images etc.  => demo assets directories
    │   └- index.html
    └── src             => source code for the component.
        ├- js           => component javascript
        ├- scss         => component Sass
        └- images etc.  => component assets directories
     
## API

The component helper can be run from the command line or directly from within NodeJS files (i.e. a gulpfile).  The tasks a almost exactly the same.

Once required (`var component = require('component-helper');`), you can call the following:

CLI | Node
--- | ----
`component build` | `component.build.all()`
`component build scripts` | `component.build.scripts()`
`component build styles` | `component.build.styles()`
`component build html` | `component.build.html()`
`component serve` | `component.serve.all()`
`component test` | `component.test.all()`

The CLI will use the config set within root/[component.config.js](component-structure/component.config.js).
Node will also use this file, but can be overridden by passing in the config object to the function.

#### component.config.js
```javascript
module.exports = {
    ...
    serve: {
        script : 'src/app/server.js',
        host: 'http://localhost:3000',
        port: 8080,
        env: { NODE_ENV: 'development'}
    },
    ...
}
```

#### Node
```javascript
component.serve({
    script : 'src/test/testserver.js',
    host: 'http://localhost:3001',
    port: 8080,
    env: { NODE_ENV: 'test', PORT: 3001}
})
```
[More Tasks >](TASKS.md)

### Regression/Screen-shot tests

To add regression testing, please see [Sheut](https://github.com/skyglobal/Sheut)

## Releasing your Component

If you are ready for your component to go public, you can release the code to Bower, github.io (gh-pages branch) and to the cloud (AWS).

[Read More >](RELEASING.md)

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

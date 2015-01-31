Component Helper [![NPM version](http://img.shields.io/npm/v/component-helper.svg)](https://www.npmjs.org/package/component-helper) [![Circle CI](https://circleci.com/gh/skyglobal/component-helper/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/component-helper/tree/master)
========================

> A Component is self-contained web functionality, that can be easily re-used i.e. a Carousel.

This helper is used to create and deploy Components via Gulp or CLI tasks. You can :
 * Build and serve a demo page
 * Compile Sass to CSS
 * Compile JS to 'browserify' / 'requireJS' files (plus .min.js files)
 * Deploy to github.io / Bower / Amazon S3
 * Customise your build process as you need simply 'require' the replacement task

## Installation

`npm install -g component-helper`

## Creating a New Component

1. Create a repository on github
2. `component new`
3. Run `component serve` in your component's directory, stick a fork in it - you're done.

Once the above is complete should have the conventional directory structure as well as the useful gulp tasks.

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


## Running Locally

`component serve`

This will compile your assets (JS, Sass) and serve your demo page to [http://localhost:3456](http://localhost:3456)

`component test`

Please add Jasmine Tests to unit and functionally test your component.

[More Tasks >](TASKS.md)

### Regression/Screen-shot tests

To add regression testing, please see [Sheut](https://github.com/skyglobal/Sheut)

## Customise your Build

To enable you to build a custom step into the build process, you can use the `pre-build` within your gulp file:

```
gulp.task('pre-build', function(cb){
    ...
});

```


## Releasing your Component

If you are ready for your component to go public, you can release the code to Bower, github.io (gh-pages branch) and to the cloud (AWS).

[Read More >](RELEASING.md)

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

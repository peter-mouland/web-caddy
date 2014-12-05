Gulp Sky Component Helper 
========================

> A `Sky Component` is self-contained functionality, that can be re-used in many web projects i.e. a Carousel.

> This helper used to create and deploy Sky Components via Gulp tasks.

## Creating a Component
 
1. Intialise github repo and clone locally
2. Create a `package.json` (for [node](https://www.npmjs.org/doc/files/package.json.html)) updating `name` to your component name (lower case).
2. Install the helper using `npm install --save-dev gulp-sky-component-helper`
3. Create a `gulpfile.js` containing the following:
```
var gulp = require('gulp');
var pkg = require('./package.json');
// run 'gulp help' for available helper commands
var skyComponentHelper = require('./gulp-sky-component-helper')(gulp, pkg);
var paths = skyComponentHelper.paths;
```
4. intialise your component `gulp init`

Once the above is complete should have the conventional directory structure as well as the useful gulp tasks.

### Generated Directory Structure

    $ component
    ├── _site           => Generated / Compiled demo site
    ├── dist            => Compiled code and source code to be distrubtuted via bower
    ├── demo            => source code used soley for demoing the functionality
    │   ├- _includes    => Contains any html files to be concatinated to index.html
    │   ├- js           => any javascript needed to get the demo working
    │   ├- scss         => any Sass needed to get the demo working
    │   ├- images etc.  => demo assets directories
    │   └- index.html
    ├── src             => source code for the component.
    │   ├- js           => component javascript
    │   ├- scss         => component Sass
    │   ├- images etc.  => component assets directories
    │   └- index.html


## Gulp Tasks

### Common Tasks

The gulp tasks provided (and available on the command line) are:

 * `gulp serve`.  Serves your demo page locally with compiled assets
 * `gulp release:gh-pages`.  Pushes compiled assets to gh-pages branch
 * `gulp release:bower`.  Tags github release to make assets  (compiled and source) available to bower 
 * `gulp release:cdn`.  Pushes assets to AWS S3 and available via akamai

### Pre-build Hook

To enable you to build a custom step into the build process, you can use the `pre-build` within your gulp file:

```
gulp.task('pre-build', function(cb){
    ...
});

```

## Contribution

BSkyB components depends on collaboration between developers across Sky. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

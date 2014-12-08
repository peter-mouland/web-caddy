Gulp Sky Component Helper 
========================

> A `Sky Component` is self-contained functionality, that can be re-used in many web projects i.e. a Carousel.

> This helper used to create and deploy Sky Components via Gulp tasks.

`npm install --save-dev gulp-sky-component-helper`

## Creating a Component
 
1. Intialise github repo and clone locally
2. Create a `package.json` using [examples/package.json](test/package.json) (updating `name` to your component name  in lower case).
2. Install the helper and requireed node modules using `npm install`
3. Create a `gulpfile.js` using [examples/gulpfile.js](test/gulpfile.js) 
4. intialise your component `gulp init`
5. initalise gh-pages using the commands from the console output

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
    └── src             => source code for the component.
        ├- js           => component javascript
        ├- scss         => component Sass
        ├- images etc.  => component assets directories
        └- index.html


## Gulp Tasks

### Common Tasks

The gulp tasks provided (and available on the command line) are:

 * `gulp serve`.  Serves your demo page locally with compiled assets
 * `gulp release`. Automatically bump ('patch') the version number, you can also use `major|minor|patch|prerelease` e.g. :
 * `gulp release --version prerelease`

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

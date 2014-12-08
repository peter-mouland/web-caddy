Gulp Sky Component Helper 
========================

> A `Sky Component` is self-contained functionality, that can be re-used in many web projects i.e. a Carousel.

> This helper used to create and deploy Sky Components via Gulp tasks.

`npm install --save-dev gulp-sky-component-helper`

Using the steps for [Creating a Component](#creating-a-component) you can then automatically and quickly complete common tasks e.g.
 * Build and serve demo page
 * compile Sass / JS to a single file (and .min.js)
 * deploy to github.io / Bower / Amazon S3
 
## Creating a Component
 
1. Intialise github repo and clone locally
2. Create a `package.json` using [examples/package.json](test/package.json) 
    * Update `name` to your component name in lower case.
    * Ensure the `repository.url` is the correct github address.
2. Install the helper and requireed node modules using `npm install`
3. Create a `gulpfile.js` using [examples/gulpfile.js](test/gulpfile.js) 
4. intialise your component using `gulp init`
5. Register your bower component using the commands from the console output

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
        └- images etc.  => component assets directories


## Gulp Tasks

### Common Tasks

The gulp tasks provided (and available on the command line) are:

 * `gulp serve`
   * Compiles your assets (JS, Sass)
   * Serves your demo page to [http://localhost:3456](http://localhost:3456) 
 * `gulp release`
   * This will push the demo site to github.io 
   * It will push the compiled asstes as well as the source files to Bower
   * It will also push the compiled assets to the S3
   * The version number is bumped ('patch' incremented). 
   * you can also use `gulp release --version ` along with `major`, `minor`, `patch` or `prerelease`

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


## Releasing

To release, you must have the AWS environment variables set up. These are:
  * AWS_ACCESS_KEY_ID
  * AWS_SECRET_ACCESS_KEY
  * AWS_SKYGLOBAL_BUCKET
  * AWS_REGION
  
The component will only be registered with Bower if the component is in a `skyglobal` repo.
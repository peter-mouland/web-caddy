Gulp Sky Component Helper 
========================

> A Sky Component is self-contained web functionality, that can be easily re-used i.e. a Carousel.

This helper is used to create and deploy Sky Components via Gulp tasks. You can :
 * Build and serve a demo page
 * Compile Sass / JS to a single file (and `.min.js`)
 * Deploy to github.io / Bower / Amazon S3

## Creating a New Component
 
1. Intialise a repo within github and clone it locally
2. Create a `gulpfile.js` using [examples/gulpfile.js](examples/gulpfile.js) 
3. Create a `package.json` using [examples/package.json](examples/package.json) 
    * Update `name` to your component name in lower case.
    * Ensure the `repository.url` is the correct github address.
4. Run `npm install` to install the required node modules. 
5. Run `gulp init` to intialise your component. 

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


## Serving your Component locally

`gulp serve`

This will compile your assets (JS, Sass) and serves your demo page to [http://localhost:3456](http://localhost:3456) 

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


## Releasing your Component

`gulp release`

   * This will push the demo site to github.io 
   * Tag the version number in Git (Bower will use this if within a `skyglobal` repo)
   * It will also push the compiled assets to the S3
   * The version number is bumped ('patch' incremented). 
   * you can also use `gulp release --version ` along with `major`, `minor`, `patch` or `prerelease`

To release, you must have the AWS environment variables set up. These are:
  * AWS_ACCESS_KEY_ID
  * AWS_SECRET_ACCESS_KEY
  * AWS_SKYGLOBAL_BUCKET
  * AWS_REGION
  

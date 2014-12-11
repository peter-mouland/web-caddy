Gulp Component Helper 
========================

> A Component is self-contained web functionality, that can be easily re-used i.e. a Carousel.

This helper is used to create and deploy Components via Gulp tasks. You can :
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
5. Run `gulp init:component` to intialise your component. 
6. Run `gulp serve`, stick a fork in yourself - you're done.

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


## `gulp serve`

This will compile your assets (JS, Sass) and serve your demo page to [http://localhost:3456](http://localhost:3456) 

To enable you to build a custom step into the build process, you can use the `pre-build` within your gulp file:

```
gulp.task('pre-build', function(cb){
    ...
});

```

## Gulp Tasks in Detail

You can also hook into any predefined helper gulp task and over-write it with your own.  i.e. if you want to use requireJS rather than browserify you can change the 'js' task.

[Read More >](GULP-TASKS.md)

## Releasing your Component

If you are ready for your component to go public, you can release the code to Bower, github.io (gh-pages branch) and to the cloud (AWS).

[Read More >](RELEASING.md)

## Contribution

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

  

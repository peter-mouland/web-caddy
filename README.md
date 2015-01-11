Gulp Component Helper
========================

> A Component is self-contained web functionality, that can be easily re-used i.e. a Carousel.

This helper is used to create and deploy Components via Gulp tasks. You can :
 * Build and serve a demo page
 * Compile Sass to CSS
 * Compile JS to 'browserify' / 'requireJS' files (plus .min.js files)
 * Deploy to github.io / Bower / Amazon S3

## Creating a New Component

1. `component new name-of-component`
2. Update `package.json`
    * Update `name` to your component name in lower case.
    * Ensure the `repository.url` is the correct github address.
3. Run `npm install` to install the required node modules.
4. Run `gulp init:component` to intialise your component.
5. Run `gulp serve`, stick a fork in it - you're done.

Once the above is complete should have the conventional directory structure as well as the useful gulp tasks.

To push, create a repository on github and follow the instructions given to add an existing project.

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
        ├- js           => component javascript [more info](GULP-TASKS.md#js)
        ├- scss         => component Sass
        └- images etc.  => component assets directories


## Running Locally

`gulp serve`

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

## Contributing to the Helper

This project depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)



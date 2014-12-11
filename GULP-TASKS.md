# Gulp Tasks

These tasks are documented for those who want to know what is going on under the hood.  If you need to change the way your component works, you may also want to override these tasks within your own `gulpfile.js`. i.e. use requirejs instead of browserify within the `js` task.

### Sass

`gulp sass`

Using [gulp-sass](https://github.com/dlmanning/gulp-sass), this task create a `.css` for each `.scss` file (without an underscore `_` prefix) it finds. 

### JS

`gulp js`

This task can handle plain JS as well as files written using CommonJS. For each .js file in `/src/js` this will provide a `.min.js` version using [gulp-uglify](https://www.npmjs.com/package/gulp-uglify). 

To handle dependency management, we use [browserify](https://www.npmjs.com/package/browserify) which creates a single javascript file found in the `src/js` root.

You can use plain JS but do not forget to set your globals on `window`.

If you wish to use any other tool (i.e. requirejs) feel free to do this and recreate `gulp.tasks('js',function(){ ... })` in your own gulp file.

### Clean

`gulp clean`

Using Gulp to remove all directories created when compiling your assets.

### Create Site

`gulp create-site`

Using Gulp to simply concatinate all html files found in `demo/_includes` onto `demo/index.html`. Also copies none-js/css assets across to the demo site. Nothing fancy, yet.


### Create Distributable

`gulp create-dist`

Using Gulp to simply copy generated files created from [create-site](#create-site) and source files from `src` to a `dist` directory.  

This directory is used for when making the component available to [Bower](http://bower.io/) and pushing the files to the cloud (current [AWS](http://aws.amazon.com/s3/)).

### Build

`gulp build`

Using Gulp to get everything ready needed to get a demo site up and running.  As well as installing bower-dependencies, this will also run:

  * clean
  * js
  * sass
  * create-site
  * create-dist

### Serve

`gulp serve`

This will [build](#build) your site then using [browserSync](https://www.npmjs.com/package/browser-sync) start a server on localhost:3456.


### Release

`gulp release`

This will [build](#build) your site, then using [gulp-bump](https://www.npmjs.com/package/gulp-bump) with [gulp-replace](https://www.npmjs.com/package/gulp-replace) patch the version number in all the docs (package.json, bower.js, *.md and *.html).

This will then push the committed code to github and tag github with the new version. If configured (within config/index.js) it will also push to the AWS using [gulp-aws](https://www.npmjs.com/package/gulp-aws) and push to the gh-pages branch for github.io using [gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages).

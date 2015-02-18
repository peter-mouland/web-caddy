# Tasks

 * [New](#new) - Creating a new component
 * [Build](#build) - Building the assets needed for your component
 * [Serve](#serve) - Serving your site
 * [Test](#test) - Testing and code-coverage
 * [Init](#init) - Initialising Bower
 * [Release](#release) - Release to git, gh-pages, aws

## New

`component new *component-name*`

This will create a new component with a standard fie structure. From the component directory you can then build, test, serve and release out of the box.

## Build

`component build`

Executes all the Build tasks below.

#### Styles

`component build styles`

By default we assume the styles are written using [Sass](http://sass-lang.com/). *If you would like Less, please submit a pull request.*

This will create a compiled file for each `.scss` file (without an underscore `_` prefix) it finds in the `src/styles` **root**.
A `.min.css` will also be created for each compiled file.

These will be saved within the `dist` and `site` roots set within `component.config.js`

#### Scripts

`component build scripts`

By default we assume the javascript is written in CommonJS, so we [browserify](https://www.npmjs.com/package/browserify), you could however choose to use [requirejs](http://requirejs.org/) if you wish.
Just update `build.scripts` within [component.config.js](../component-structure/component.config.js)

This will create a compiled file for each `.js` file found in the `src/scripts` **root**.
Using [uglify-js](https://www.npmjs.com/package/uglify-js), this will also create `.min.js` files.

These will be saved within the `dist` and `site` roots set within `component.config.js`

#### HTML

`component build html`

By default we assume the html has been written using [mustache](https://github.com/janl/mustache.js). *If you would like Handlebars, please submit a pull request.*

This will create a compiled file for each `.html` file found in the `demo` **root**.

These will be saved within the `site` roots set within `component.config.js`


## Serve

`component serve`

This will [build](#build) your site then using [browserSync](https://www.npmjs.com/package/browser-sync) will open your browser and automatically apply any html, css and js source changes that are then made.

You can configure this to either serve a static site or node app within the component.config.js.

Static Example :
```javascript
    ...
    serve: {
        type:'static',
        directories : ['_site', 'other-directory'],
        port: 3456
    },
    ...
```

Node Server example : 
```javascript
    ...
    serve: {
        type: 'node'
        port: 3456
        script : 'app/server.js',
        host: 'http://localhost:3000',
        env: { NODE_ENV: 'local'}
    },
    ...
```

#### Quick

`component serve quick`

This will do the above `serve`, but without the build step.

## Testing

`component test`

This will [build](#build) your site then run then using [Karma](http://karma-runner.github.io/0.12/index.html) and [Jasmine](http://jasmine.github.io/2.2/introduction.html), it will run through the `.spec.js` files found in `/test/` directory.
A code-coverage report will also be produced.

Code-coverage is uses the `watermarks` option within [test/karma.conf.js](component-structure/test/karma.conf.js), and ensures the code coverage is above the thresholds given.

### Quick

`component test quick`

This will run your tests as mentioned above, but without the build step.

#### TDD

`component test tdd`

This will run through test and then stay open watching for code changes in your spec files.

## Init

#### Bower

`component init bower`

This will register your component with bower, using the name from your bower.json and the repository url from package.json.

## Releasing

`component release`

This will [build](#build) and [test](#test) your site and `patch` the version number in all the docs (package.json, bower.js, version.js, *.md and *.html).
Once this has complete, it will do all the steps below.

To force a version or release type use the `--version=` option followed by either `patch`, `minor`, `major`, `prerelease` or even `v3.2.1`

*note: Version numbers in your code enclosed in `"` or `/` will be updated*

#### Tag Git

`component release git`

This will add, commit and push any remaining files to `origin master`. Using the version within `package.json` and tag your code and push this to git.

#### GH-Pages

`component release gh-pages`

This will push the current files within `_site` to gh-pages branch (making your demo available on github.io).

#### Cloud

`component release cloud`

This will push the current files from within `_site` to AWS using the options within `component.config.js`.  Setting this option to false will prevent a release.

**example release config***
```javascript
    ...
    release: {
        type: 'aws',
        bucket: process.env.YOUR_AWS_BUCKET,
        accessKey: process.env.YOUR_AWS_ACCESS_KEY_ID,
        secret: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        region: process.env.YOUR_AWS_REGION,
        directoryPrefix: 'components/' //prefix your target release destination
    },
```

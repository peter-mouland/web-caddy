# Tasks
> Building the assets needed for your project

 * [Build](#build)
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [HTML](#html)
 * [Options Parameter](#options-parameter)
 * [As a build step](as-a-build-step)

*All* tasks create compiled files for each file found in the `buildPaths source` root directories and save them into the corresponding `targets` directories. Adding `minify: true` will also creare `.min` equivilents.

**Example from caddy.config.js**
```javascript
...
   tasks : {
        build: ['sass', 'mustache', 'browserify'],
    },
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist'], minify: true},
        {source: "./examples", targets: ['./_site']}
    ],
...
```

## Build

 * CLI: `caddy build`
 * NodeJS: `caddy.build.all(source-glob, target-directory, options)`

This will execute all the Build tasks within the `build` array in `caddy.config.js`.

#### Styles

 * CLI: `caddy build styles`
 * NodeJS: `caddy.build.styles(source-glob, target-directory, options)`

By default we use [Sass](http://sass-lang.com/) to compile styles, along with [AutoPrefixer](https://www.npmjs.com/package/autoprefixer).

This will create a compiled file for each `.scss` file (without an underscore `_` prefix) it finds in the `buildPaths source` root directories and save them into the corresponding `targets` directories. A `.min.css` will also be created for each compiled file.

As with all build tasks, add a config object to customise the build with [Sass options](https://github.com/sass/node-sass#options)

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['sass']
    },
    sass: {
        includePaths: 'bower_components',
    },
...
```

*NodeJS*

 `caddy.build.styles('/{.,*}/!(_)*.{css,scss,sass}', '_site', { includePaths: 'bower_components' })`

#### Scripts

 * CLI: `caddy build scripts`
 * NodeJS: `caddy.build.scripts(source-glob, target-directory, options)`

By default javascript is compiled using [browserify](https://www.npmjs.com/package/browserify), you could however choose to use [requirejs](http://requirejs.org/).

This will create a compiled file for each `.js` file found in the `buildPaths source` root directories and save them into the corresponding `targets` directories. Adding `minify:true` will use [uglify-js](https://www.npmjs.com/package/uglify-js) to create `.min.js` files.  To prevent minification use :

`caddy build scripts -dev`

**Example 1 : browserify** 

*caddy.config.js*

```javascript
...
    tasks: {
        build: ['browserify']
    },
    browserify: {
        insertGlobals : true,
        detectGlobals : false,
        vendorBundle: [
            { file: './bower_components/d3/d3.js', expose: 'd3'}
        ],
        vendorTarget: 'scripts/vendor.js'
    },
...
```

*NodeJS*

 `caddy.build.scripts('/{.,*}/!(_)*.js', '_site', { insertGlobals: 'true' })`
 
For `browserify` the `vendorBundle` and `vendorTarget` option will create an external file. Ensure you have the corresponding `browser` object in your `package.json`. *(do not use `debowerify`)* 

*package.json*
```javascript
...
  "browser": {
    "d3": "./bower_components/d3/d3.js"
  },
...
```

**Example 2 : requirejs**

*caddy.config.js*
```javascript
    tasks: {
        build: ['requirejs']
    },
    requirejs: {
        mainConfigFile: 'src/scripts/require.config.js'
    }
```

#### HTML

`caddy build html`

This will create a compiled .html file for each `.html`, `.mustache`, `.ms` or `.jade` file found in the `buildPaths source` root directories using either [mustache](https://github.com/janl/mustache.js) or [jade](http://jade-lang.com/) and save them into the corresponding `targets` directories.

By default, during the build it will also replace variables `{{ varName }}` that are matched within package.json.

**Example 1 : Mustache** 

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['mustache']
    }
...
```
*NodeJS*

 `caddy.build.html('/{.,*}/!(_)*.{html,ms,mustache}', '_site', { varsToReplace: 'with text' })`

**Example 2 : Jade** 

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['jade']
    }
...
```

## Options Parameter
> options that can be passed to all NodeJS calls above

    * minify: [true|false] Will minify JS and CSS
    * verbose: [true|false] Will display more details about what files are being removed
    * anything: 'string' Add any other String/Value pair. This can then be referenced within your Jade/Mustache template

## As a build step

 * `npm run build`
 * or `npm run build -- styles -dev`

It is recommended you update your package.json `scripts` object:

*package.json*
```javascript
    "scripts":{ 
        "build": "caddy build"
    }
```

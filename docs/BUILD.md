# Tasks
> Building the assets needed for your project

 * [Build](#build)
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [HTML](#html)

*All* tasks create compiled files for each file found in the `buildPaths source` root directories and save them into the corresponding `targets` directories. Adding `minify: true` will also creare `.min` equivilents.

**BuildPaths example from caddy.config.js**
```javascript
    tasks : {
        build: ['sass', 'mustache', 'browserify'],
    },
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist'], minify: true},
        {source: "./examples", targets: ['./_site']}
    ],
```

## Build

`caddy build`

This will clean target directories and execute all the Build tasks below.

#### Styles

`caddy build styles`

By default we use [Sass](http://sass-lang.com/) to compile styles, along with [AutoPrefixer](https://www.npmjs.com/package/autoprefixer).

This will create a compiled file for each `.scss` file (without an underscore `_` prefix) it finds in the `buildPaths source` root directories and save them into the corresponding `targets` directories. A `.min.css` will also be created for each compiled file.

As with all build tasks, add an config object to customise the build with [Sass options](https://github.com/sass/node-sass#options)

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

#### Scripts

`caddy build scripts`

By default javascript is compiled using [browserify](https://www.npmjs.com/package/browserify), you could however choose to use [requirejs](http://requirejs.org/).
Just update `build.scripts` within [caddy.config.js](boilerplate/caddy.config.js)

This will create a compiled file for each `.js` file found in the `buildPaths source` root directories and save them into the corresponding `targets` directories.

Adding `minify:true` will use [uglify-js](https://www.npmjs.com/package/uglify-js) to create `.min.js` files.  To prevent minification use :

`caddy build scripts -dev`

**Example 1 : browserify** 

*caddy.config.js*

```javascript
...
    buildPaths: [ 
        {source:'src', targets: ['_site','dist'], minify: true }
    ],
    tasks: {
        build: ['browserify']
    },
    browserify: {
        insertGloabals : false,
        detectGlobals : false,
        vendorBundle: [
            { file: './bower_components/d3/d3.js', expose: 'd3'}
        ],
        vendorTarget: 'scripts/vendor.js'
    },
...
```

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

**Example 1 : mMstache** 

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['mustache']
    }
...
```

**Example 2 : Jade** 

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['jade']
    }
...
```

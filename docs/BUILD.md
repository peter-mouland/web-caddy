# Caddy Build
> Building the assets needed for your project

The build will compile files and save them into the corresponding `target` directory.

 * [Config](#config)
 * [Build](#build)
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [HTML](#html)
 * [Options Parameter](#options-parameter)
 * [As a build step](as-a-build-step)

## Config

For any build to occur, you must add:
 * A `tasks` object containing `build` array with the appropriate sub-tasks.  
 * A `buildPaths` array is also required to tell caddy where to search for your files.
    
You may choose to also add:
 * `verbose: true` onto the buildPath object (or `-verbose` on the CLI)
 * `minify: true` onto the buildPath object (add `-dev` on the CLI to then prevent minification)
 * `buildGlobs` object which describes how to search for 'main' files to compile and recreate in the `target` directory.
    * The default is shown below, will match files in the `source` root and a single directory deep. 

**Example from caddy.config.js**
```javascript
...
   tasks : {
        build: ['sass', 'mustache', 'browserify'],
    },
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist'], minify: true, verbose: true},
        {source: "./examples", targets: ['./_site']}
    ],
    buildGlobs : {
        'html':    '/{.,*}/!(_)*.{html,jade,ms,mustache}',
        'styles':  '/{.,*}/!(_)*.{css,scss,sass}',
        'scripts': '/{.,*}/!(_)*.js'
    };
...
```

## Build
> execute all Build tasks within the `build` array in `caddy.config.js`.

 * CLI: `caddy build`
 * NodeJS: `caddy.build.all(source-glob, target-directory, options)`

#### Styles
> Use [Sass](http://sass-lang.com/) and [AutoPrefixer](https://www.npmjs.com/package/autoprefixer) to compile CSS

 * CLI: `caddy build styles`
 * NodeJS: `caddy.build.styles(source-glob, target-directory, options)`

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
> Compile CommonJS or AMD

 * CLI: `caddy build scripts`
 * NodeJS: `caddy.build.scripts(source-glob, target-directory, options)`

Compile javascript using [browserify](https://www.npmjs.com/package/browserify) or [requirejs](http://requirejs.org/) and use the minify option for [uglify-js](https://www.npmjs.com/package/uglify-js) to create `.min.js` files.

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
> Compile Mustache or Jade templates into HTML

 * CLI: `caddy build html`
 * NodeJS: `caddy.build.html(source-glob, target-directory, options)`

Use either [mustache](https://github.com/janl/mustache.js) or [jade](http://jade-lang.com/) and add variables to be replaced within your templates.

By default, during the build it will also replace variables `{{ pkg.varName }}` that are matched within package.json.

**Example 1 : Mustache** 

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['mustache']
    },
    buildPaths: [
        { source: "./src",  "target": './_site' , varsToReplace: 'with text'}
    ],
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

*NodeJS*

 `caddy.build.html('/{.,*}/!(_)*.{html,ms,mustache}', '_site', { varsToReplace: 'with text' })`

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

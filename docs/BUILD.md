# Tasks

 * [Build](#build) - Building the assets needed for your project
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [HTML](#html)

## Build

`caddy build`

This will clean target directories and execute all the Build tasks below.

#### Styles

`caddy build styles`

By default we assume the styles are written using [Sass](http://sass-lang.com/).

This will create a compiled file for each `.scss` file (without an underscore `_` prefix) it finds in the `paths.source` (or `paths.source/*`). A `.min.css` will also be created for each compiled file.

These will be saved within the `paths.target` set within [caddy.config.js](boilerplate/caddy.config.js)

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['sass']
    }
...
```

#### Scripts

`caddy build scripts`

By default we assume the javascript is written in CommonJS, so we [browserify](https://www.npmjs.com/package/browserify), you could however choose to use [requirejs](http://requirejs.org/) if you wish.
Just update `build.scripts` within [caddy.config.js](boilerplate/caddy.config.js)

This will create a compiled file for each `.js` file found in the `paths.source` (or `paths.source/*`).
Using [uglify-js](https://www.npmjs.com/package/uglify-js), this will also create `.min.js` files.

These will be saved within the `paths.target` set within [caddy.config.js](boilerplate/caddy.config.js)

The build can be configured more by adding a `browserify` or `requirejs` object to the [caddy.config.js](boilerplate/caddy.config.js).

**Example 1 : browserify** 

*caddy.config.js*

```javascript
...
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

The `vendorBundle` option will create `vendorTarget` file from external files. Ensure you have the corresponding `browser` object in your `package.json`. *(`debowerify` will sometime cause problems).* 

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

This will create a compiled .html file for each `.html`, `.mustache`, `.ms` or `.jade` file found in the `demo` **root** using either [mustache](https://github.com/janl/mustache.js) or [jade](http://jade-lang.com/).

These will be saved within `paths.target` set within [caddy.config.js](boilerplate/caddy.config.js)

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

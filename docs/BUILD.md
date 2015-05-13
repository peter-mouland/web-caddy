# Tasks

 * [Clean](#clean) - clean (remove) the contents of your set asset directories
 * [Build](#build) - Building the assets needed for your project
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [HTML](#html)
    * [Server Config Files](#server-config-files)

## Clean

`caddy clean`

This will remove any files from within the `target` directory.  

You can also `caddy clean (scripts|styles|html|images|fonts)` etc. to specifiy exact directories to clean.

## Build

`caddy build`

This will clean target directories and execute all the Build tasks below.

#### Styles

`caddy build styles`

*caddy.config.js*
```javascript
    tasks: {
        build: ['sass']
    }
```

By default we assume the styles are written using [Sass](http://sass-lang.com/). *If you would like Less, please submit a pull request.*

This will create a compiled file for each `.scss` file (without an underscore `_` prefix) it finds in the `paths.source` (or `paths.source/*`).
A `.min.css` will also be created for each compiled file.

These will be saved within the `paths.target` set within [caddy.config.js](boilerplate/caddy.config.js)

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

*caddy.config.js*
```javascript
    tasks: {
        build: ['moustache']
    }
```

This will create a compiled .html file for each `.html`, `.mustache`, `.ms` or `.jade` file found in the `demo` **root** using either [mustache](https://github.com/janl/mustache.js) or [jade](http://jade-lang.com/) (as set in the [caddy.config.js](boilerplate/caddy.config.js)).

These will be saved within `paths.target` set within [caddy.config.js](boilerplate/caddy.config.js)

By default, during the build it will also replace variables `{{ varName }}` that are matched within package.json.

#### Server Config Files

`caddy build server-config-files`

This will copy any server config files (currently `CNAME`, `.htaccess` and `robots.txt`) found in `paths.source` to your `paths.target`.


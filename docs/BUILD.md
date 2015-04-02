# Tasks

 * [Clean](#clean) - clean (remove) the contents of your set asset directories
 * [Build](#build) - Building the assets needed for your project

## Clean

`caddy clean`

This will remove any files from within all target directories (site & dist).  

You can also `caddy clean (scripts|styles|html|images|fonts)` etc. to specifiy exect directories to clean.

## Build

`caddy build`

This will clean all target directories (site & dist) and execute all the Build tasks below.

#### Styles

`caddy build styles`

By default we assume the styles are written using [Sass](http://sass-lang.com/). *If you would like Less, please submit a pull request.*

This will create a compiled file for each `.scss` file (without an underscore `_` prefix) it finds in the `src/styles` **root**.
A `.min.css` will also be created for each compiled file.

These will be saved within the `dist` and `site` roots set within [caddy.config.js](boilerplate/caddy.config.js)

#### Scripts

`caddy build scripts`

By default we assume the javascript is written in CommonJS, so we [browserify](https://www.npmjs.com/package/browserify), you could however choose to use [requirejs](http://requirejs.org/) if you wish.
Just update `build.scripts` within [caddy.config.js](boilerplate/caddy.config.js)

This will create a compiled file for each `.js` file found in the `src/scripts` **root**.
Using [uglify-js](https://www.npmjs.com/package/uglify-js), this will also create `.min.js` files.

These will be saved within the `dist` and `site` roots set within [caddy.config.js](boilerplate/caddy.config.js)

The build can be configured more by adding a `browserify` or `requirejs` object to the [caddy.config.js](boilerplate/caddy.config.js).

**Example 1 : browserify**

```javascript
    browserify: {
        insertGloabals : false,
        detectGlobals : false,
        vendorBundle: [
            { file: './bower_components/d3/d3.js', expose: 'd3'}
        ]
    },
```

The `vendorBundle` option will create `vendor.js` from external files. *(`debowerify` will sometime cause problems).*
Ensure you have the corresponding `browser` object in your `package.json`. i.e.

```javascript
...
  "browser": {
    "d3": "./bower_components/d3/d3.js"
  },
...
```

**Example 2 : requirejs**

```javascript
    requirejs: {
        mainConfigFile: 'src/scripts/require.config.js'
    }
```

#### HTML

`caddy build html`

This will create a compiled .html file for each `.html`, `.mustache`, `.ms` or `.jade` file found in the `demo` **root** using either [mustache](https://github.com/janl/mustache.js) or [jade](http://jade-lang.com/) (as set in the [caddy.config.js](boilerplate/caddy.config.js)).

These will be saved within the `site` roots set within [caddy.config.js](boilerplate/caddy.config.js)

By default, during the build it will also replace *site.now*, *site.name* and *site.version* variables.

#### Server Config Files

`caddy build server-config-files`

This will copy any server config files (currently `CNAME`, `.htaccess` and `robots.txt`) found in `paths.source.root` to your `paths.site.root`.


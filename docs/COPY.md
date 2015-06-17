# Tasks
> Copy static assets

 * [Copy](#copy)
    * [Images](#images)
    * [Fonts](#fonts)
    * [Server Config Files](#server-config-files)
    * [Other](#other)

*All* tasks will copy files found in `basePaths source` to the associated `targets` directories

**Example from caddy.config.js**
```javascript
...
   tasks : {
        copy: ['images', 'fonts', 'server-config'],
    },
...
```

## Copy

`caddy copy`

This will clean target directories and execute all the Copy tasks with the `copy` array within caddy.config.js.

Whenever files are copied, the same top-level directory structure is maintained within the target.

#### Images

`caddy copy images`

This will copy files matching `*.{ico,png,jpg,jpeg,gif,svg}`.

*caddy.config.js*
```javascript
...
    tasks: {
        copy: ['images']
    }
...
```

#### Fonts

`caddy copy fonts`

This will copy files matching `*.{svg,ttf,woff,eot}`.

*caddy.config.js*
```javascript
...
    tasks: {
        copy: ['fonts']
    }
...
```

#### Server Config Files

`caddy copy server-config-files`

This will copy any server config files (currently `CNAME`, `.htaccess`, `robots.txt` and `manifest.json`) .

*caddy.config.js*
```javascript
...
    tasks: {
        copy: ['server-config']
    }
...
```

#### Other

`caddy copy other`

This will copy any file that matches the glob within the `copy` array.

I.e. the following will copy all `.json` files from within `./src` to `./_site`

*caddy.config.js*
```javascript
...
    tasks: {
        copy: ['**/*.json']
    },
    buildPaths: [
        {source: "./src", targets: ['./_site']}
    ]
...
```

# Tasks

 * [Copy](#copy) - Copying static assets
    * [Images](#images)
    * [Fonts](#fonts)
    * [Server Config Files](#server-config-files)

## Copy

`caddy copy`

This will copy directories from your `paths.source` into your `paths.target`.

Whenever files are copied, the same top-level directory structure is maintained within the target.

#### Images

`caddy copy images`

This will files matching `*.{ico,png,jpg,jpeg,gif,svg}` into your `paths.target` directory.

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

This will files matching `*.{svg,ttf,woff,eot}` into your `paths.target` directory.

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['fonts']
    }
...
```

#### Server Config Files

`caddy copy server-config-files`

This will copy any server config files (currently `CNAME`, `.htaccess` and `robots.txt`) found in `paths.source` to your `paths.target`.

*caddy.config.js*
```javascript
...
    tasks: {
        build: ['server-config']
    }
...
```

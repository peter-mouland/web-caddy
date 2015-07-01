# Serve

You can serve static sites and node apps.  Using [browserSync](https://www.npmjs.com/package/browser-sync) your browser will open and automatically apply any html, css and js source changes.

 * [Static Sites](#static-sites)
 * [NodeJS Apps](#nodejs-apps)
 * [AdHoc Pages](#adhoc-pages)

## Static Sites

 * CLI: `caddy serve`
 * NodeJS: `caddy.serve(dir)`

Within the *caddy.config.js*:

```javascript
    ...
    serve: 'staticApp',
    staticApp:{
        server: { baseDir : '_site' },
        port: 3000
    },
    ...
```
 * The `staticApp` config object is optional.
 * *baseDir* (default: `paths.target`) A directory string, or an array of directory strings.
 * *port* (default: any free port starting at 3000) will where your browserSync instance is available with live reloading

We recommend that the package.json `scripts` object is updated to build your site first:

```
  "start": "caddy build && caddy serve",
```

You can then use: `npm start`

## NodeJS Apps

 * CLI: `caddy serve`
 * NodeJS: `caddy.serve(nodeAppObject)`

Within the *caddy.config.js*:

```javascript
    ...
    serve: 'nodeApp',
    nodeApp:{
      script : 'src/app/server.js',
      proxy: 'http://localhost:3000',
      port: 3456,
      env: { NODE_ENV: 'local'}
    },
    ...
```

 * *env* is an object of environment variables
 * *proxy* will load up your node instance
 * *port* will where your browserSync instance is available with live reloading

We recommend that the package.json `scripts` object is updated to build your site first:

```
  "start": "caddy build && caddy serve",
```

You can then use: `npm start`

## AdHoc Pages

> Serve any file quickly

 * CLI: `caddy serve path/to/serve`
 * NodeJS: `caddy.serve(dir)`

This serve the path given as a static site, ie. your code coverage report
# Serve

You can serve static sites and node apps.  Using [browserSync](https://www.npmjs.com/package/browser-sync) your browser will open and automatically apply any html, css and js source changes.

 * [Static Sites](#static-sites)
 * [NodeJS Apps](#nodejs-apps)
 * [AdHoc Pages](#adhoc-pages)

## Static Sites

`component serve`

Within the [caddy.config.js](boilerplate/caddy.config.js):

```javascript
    ...
    serve: 'staticApp',
    staticApp:{
        server: { baseDir : '_site' },
        port: 3456
    },
    ...
```

 * *baseDir* can be a single directory string, or an array of directory strings.
 * *port* will where your browserSync instance is available with live reloading

We recommend that the package.json `scripts` object is updated to build your site first:

```
  "start": "component build && component serve",
```

You can then use: `npm start`

## NodeJS Apps

`component serve`

Within the [caddy.config.js](boilerplate/caddy.config.js):

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
  "start": "component build && component serve",
```

You can then use: `npm start`

## AdHoc Pages

> Serve any file quickly

`component serve path/to/serve`

This serve the path given as a static site, ie. your code coverage report
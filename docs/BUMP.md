# Bump

> Bump the version within your app

 * CLI: `caddy bump`
 * NodeJS: `caddy.bump.all(source-glob, options)`

The files `package.json`, `app.json` and `README.md` are 'patched' by default. This is set in the `caddy.config.js`.

*caddy.config.js*
```javascript
...
    tasks: {
        bump: ['package.json','README.md', '*/app.json']
    }
...
```

You can specify which, and how, a file is bumped by adding the file name and `-patch`, `-minor`, -`major`, `-prerelease` or even `-v3.2.1`.

 * CLI: `caddy bump package.json -major`
 * NodeJS: `caddy.bump.all(['package.json'], {type: 'major'})`

## As a build step

 * 'npm run bump'
 * or 'npm run bump -- -major'

It is recommended you update your package.json `scripts` object:

*package.json*
```javascript
    "scripts":{ 
        "bump": "caddy bump"
    }
```
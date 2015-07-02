# Caddy Bump

> Find and bump version numbers within your app files.  

 * [Config](#config)
 * [Bump](#bump)
 * [As a build step](as-a-build-step)

## Config

To bump a file(s), you must add:
 * A `tasks` object containing `bump` array containing globs or files to copy.  

**Example from caddy.config.js**
```javascript
...
   tasks : {
        bump: ['package.json','README.md', '*/app.json'],
    }
...
```

## Bump
By default files are bumped with a 'patch'

 * CLI: `caddy bump`
 * NodeJS: `caddy.bump(source-glob, options)`

You can specify which, and how, a file is bumped by adding the file name and `-patch`, `-minor`, -`major`, `-prerelease` or even `-v3.2.1`.

 * CLI: `caddy bump package.json -major`
 * NodeJS: `caddy.bump(['package.json'], {type: 'major'})`

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
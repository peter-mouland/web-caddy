# Caddy Copy
> Copy static assets

 * [Config](#config)
 * [Copy](#copy)
 * [As a build step](as-a-build-step)

## Config

For any copy to occur, you must add:
 * A `tasks` object containing `copy` array with the appropriate sub-tasks.  
 * A `buildPaths` array is also required to tell caddy where to search for your files.

**Example from caddy.config.js**
```javascript
...
   buildPaths: [
       {source: "./src", targets: ['./_site']}
   ],
   tasks : {
        copy: ['images', '/*{CNAME,robots.txt}'],
    },
...
```

## Copy
> copy all matching files from each source to the corresponding target directory

 * CLI: `caddy copy`
 * NodeJS: `caddy.copy()`

You can also optionally add a `glob` to specify the files to remove, as well a `verbose` option. i.e.

 * CLI: `caddy copy package.json -verbose`
 * NodeJS: `caddy.copy('/{.,*}/!(_)*.{png,jpg,svg}', './_site', { verbose: true });`


## As a build step

 * 'npm run copy'

It is recommended you update your package.json `scripts` object:

*package.json*
```javascript
    "scripts":{ 
        "copy": "caddy copy"
    }
```
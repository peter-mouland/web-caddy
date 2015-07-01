# Tasks
> Copy static assets

 * CLI: `caddy copy`
 * NodeJS: `caddy.copy()`

*All* tasks will copy files found in `basePaths source` to the associated `targets` directories that match the given GLOB.

I.e. the following will copy an `images` and `fonts` directories with `CNAME` and `robots.txt` files from `./src` to `./_site`.

**Example from caddy.config.js**
```javascript
...
   buildPaths: [
       {source: "./src", targets: ['./_site']}
   ],
   tasks : {
        copy: ['images', 'fonts', '/*{CNAME,robots.txt}'],
    },
...
```

You can also optionally add a `glob` to specify the files to remove, as well as options. i.e.

 * CLI: `caddy copy package.json -verbose`
 * NodeJS: `caddy.copy('/{.,*}/!(_)*.{png,jpg,svg}', './_site', { verbose: true });`

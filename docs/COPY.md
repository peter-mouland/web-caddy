# Tasks
> Copy static assets

`caddy copy`

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

# Tasks
> Clean up files and directories

 * [Clean](#Clean)
    * [Build](#build)
    * [Copy](#copy)
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [HTML](#html)
 * `options` Parameter
 * [As a build step](as-a-build-step)

## Clean
> Remove all files from all `basePaths targets` directories.

 * CLI: `caddy clean`
 * NodeJS: `caddy.clean.all()`

You can also optionally add a `glob` to specify the files to remove, as well as options. i.e.

`caddy.clean.all('/{.,*}/!(_)*.{html,ms,mustache}', { verbose: true });`

#### Build
> Remove all files from all `basePaths targets` directories.
 
 * CLI: `caddy clean build`
 * NodeJS: `caddy.clean.build(options)`
 
The files being removed are all those from the  Styles, Scripts and HTML tasks below.

#### Copy
> Remove all files from all `tasks.copy` globs.
 
 * CLI: `caddy clean copy`
 * NodeJS: `caddy.clean.copy(options)`

#### Scripts
> Remove all files from all `basePaths targets` directories.
 
 * CLI: `caddy clean scripts`
 * NodeJS: `caddy.clean.scripts(options)`
 
The files removed match `'/{.,*}/!(_)*.js'`.

#### Styles
> Remove all files from all `basePaths targets` directories.
 
 * CLI: `caddy clean styles`
 * NodeJS: `caddy.clean.styles(options)`
 
The files removed match `/{.,*}/!(_)*.{css,scss,sass}`.

#### HTML
> Remove all files from all `basePaths targets` directories.
 
 * CLI: `caddy clean html`
 * NodeJS: `caddy.clean.html(options)`
 
The files removed match `/{.,*}/!(_)*.{html,jade,ms,mustache}`.

## Options Parameter
> options that can be passed to all NodeJS calls above

    * verbose: [true|false] Will display more details about what files are being removed


## As a build step

 * 'npm run clean'
 * or 'npm run clean -- build'

It is recommended you update your package.json `scripts` object:

*package.json*
```javascript
    "scripts":{ 
        "clean": "caddy clean"
    }
```
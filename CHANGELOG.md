# Change Log

## 2.0.x  Breaking change
  * Renamed to `web-caddy`
  * Speed improvements
  * Log output improvements (easier to know what is going on!)
  * Added `html-min` as a separate `build` task
  * Added `bower` as a separate `release` task
  * Added `-dev` CLI option to prevent file minification and speed up build time
  * Added `copy` task to separate the task of copying files from compiling code
  * Updated `build` to detect HTML/CSS/JS root locations and recreate within `target` with compiled code
  * Updated `paths.site` config option to `paths.target`
  * Updated `serve` task to be able to serve ad-hoc nodeApps or static files
  * Updated `serve` task to serve `paths.target` directory by default + to a free port if omitted
  * Updated `release` will not bump by default. Explicitly bump first using `caddy bump`
  * Updated new projects to display the name using `camelCase` or as words (with spaces) throughout docs
  * Updated `release` config option. this must be an array
  * Updated `build.scripts` to only minify source code (not demo code)
  * Updated `copy`, `build`, `serve`, `test` and `release` to be withina `tasks` object within the config
  * Updated Mustache/Jade to use variables from `package.json` by default
  * Removed automatic installation of npm modules wtih `caddy new xxx`
  * Removed `dist` path config option
  * Removed `site.xxx` from Mustache/Jade variables i.e. `site.version` becomes `version`
  
todo:
  * hook into git isues/labels to do automatic version bump!
  * add watchify config to poll for osX problems
  * update browserSync syntax as http://www.browsersync.io/docs/api/
  * verbose mode
  * move boilerplate to separate repo
  * update `caddy new` to clone web-caddy-boilerplate repo
  * caddy config -> to change which repo is cloned by default
  * test node api (all using options?)
  * allow node api to overwrite path.src and paths.target within options obj
  * caddy init if caddy config doesn't exist
  * document config file properly
  * speed, speed, speed
  * kill `test tdd` process properly
 
## 1.3.x
 * **1.3.0**
    * Updated Documents to explain more use-cases
    * Updated dependencies to be on fixed versions
    * Updated serve to watch and rebuild scripts faster
    * Updated `release` and `build` config
    * Added ability to push server config files to the 'site' root (e.g. .htaccess)
    * Added windows support

## 1.2.x

 * **1.2.0**
    * Speed improvements
    * Updated `Release` task is more flexible. Use `target` within `component.config.js`
    * Updated `init gitRemote` step to be `init git` config.
    * Updated All steps are implicit. ie. `component test` now only runs tests, not the build too.
    * if implicit tasks are wanted, please customise this in `npm scripts` object.
    * Updated `circle.yml` to allow for continuous deployment by default
    * Updated `build html` step to produce minified html
    * Updated `init git` to accept SSH or HTTP URLS
    * Updated testing into `unit` and `functional` with examples.
    * Added JSHint to `npm test` task by default.
    * Added global Alias for browserified JS files.
    * i.e. You can now call `require('component-name');` within your html.
    * Added `vendorBundle` option to browseify config.
    * This allows you to specifiy which external files should be built separately from your main js files.

## 1.1.x Breaking change

 * **1.1.2**
    * Update default `browserify` options
 * **1.1.0**
    * Updated **breaking change** `component.config.js` to expect explicit config objects
      * `requirejs`, `browserify`, `staticApp`, `nodeApp`, `s3` or `karma` objects
    * Updated **breaking change** `component release cloud` changed to `component release s3`.
    * Updated `build`/`serve` to only warn of compilation problems rather than quiting.
    * Updated cleaning to be less aggressive. This allows overlapping paths within `component.config.js`
    * Updated `karma.conf.js` to use browserify by default and to automatically apply shims
    * Removed dependency on Gulp for new components. Now recommended to use `npm` or `component` commands.
    * Added `component serve path/to/serve` option to allow a static path to be served instantly.
    * Added `jade` templating (for build.html config)
    * Added support for `~/.aws/credentials` for S3 releases
    * Added `clean` task in API/CLI.

## 1.0.0

 * Added Mustache templating (for build.html config)
 * Removed `html-concat` option
 * Removed the need to supply a git repo when running `component new`
 * Updated `component new` to `component new <<component-name>>`

## 0.9.x

 * Added CSS to specs by default
 * **0.9.1**
    * re-release for npm. grr. https://github.com/npm/npm/issues/5082#issuecomment-72300195
 * **0.9.0**
    * Updated `component.config.js` objects **breaking change**.
    * Added `requirejs` build.scripts type

## 0.8.x

 * Added `component new bower` task
 * Fixed dynamic server config
 * Updated to use latest `core` component
 * **0.8.8**
    * Fixed aws release paths
    * Fixed file object base path
    * Updated html-concat to work with subdirs
    * Added many more tests
 * **0.8.5**
    * Added `test quick` command
 * **0.8.4**
    * Added buildFonts config option, so this can now be skipped
 * **0.8.3**
    * Added .min for CSS
    * Added serving of NodeJS (express) apps
 * **0.8.2**
    * fixed cloud release bug
 * **0.8.1**
    * fixed releasing when specifying `--version=`
 * **0.8.0**
    * Added config file to make the helper insanely useful in many projects

## 0.7.x

 * fixed bug with rename
 * **0.7.0**
    * Renamed to `component-helper`
    * Added many more CLI commands - can now do everything without gulp (apart from `watch`).
    * build, serve, test, release now available i.e. `component build`

## 0.6.x

 * Fixed a few bugs
 * **0.6.0**
    * Major Refactor - is now much faster

## 0.5.x

 * Fixed CLI
 * **0.5.0**
    * Added versioned demo pages to build CDN
    * Added CLI for creating a component
    * Added link to screen-shotting to test suite

## 0.4.x

 * Updated tests to include bower dependencies if required
 * **0.4.1**
    * Updated test task to fail if coverage is too low
 * **0.4.0**
    * Added Jasmine test framework with coverage

## 0.3.x

 * Fixed 'version update' to only update placeholders within html files i.e. not versioned dependencies
 * **0.3.3**
    * Fixed how config files were found
 * **0.3.2**
    * Fixed aws-s3 plugin name
 * **0.3.1**
    * Updated test area. Can test all gulp tasks (Dangerous tasks are mocked).
    * Fixed gulp watch
 * **0.3.0**
    * Updated default bower directories to include `src`

## 0.2.x

 * Fixed some bugs in the examples code
 * **0.2.1
    * Components have to explicitly import sass dependencies from bower_components
 * **0.2.0
    * Added browserify into js task to handle dependency management

## 0.1.0

 * Updated to be more configurable and independent of sky 'defaults'

## 0.0.1

 * created

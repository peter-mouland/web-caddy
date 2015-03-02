# Change Log

## 1.1.0 (not yet released)
 
 * Removed dependency on Gulp for new components. Now recommended to use `component` commands.
 * Updated `build`/`serve` to only warn of compilation problems rather than quiting.
 * Added `jade` templating (for build.html config)
 * Added support for `~/.aws/credentials` for S3 releases. 
 * Updated cleaning to be less aggressive to allow overlapping paths in config
 * Added separate `clean` task in API/CLI

## 1.0.0

 * Added Mustache templating (for build.html config)
 * Removed `html-concat` option
 * Removed the need to supply a git repo when running `component new`
 * Updated `component new` to `component new <<component-name>>`

## 0.9.2

 * Added CSS to specs by default

## 0.9.1

 * re-release for npm. grr. https://github.com/npm/npm/issues/5082#issuecomment-72300195

## 0.9.0

 * Updated `component.config.js` objects : Breaking change.
 * Added `requirejs` build.scripts type

## 0.8.10

 * Added `component new bower` task
 * Fixed dynamic server config
 * Updated to use latest `core` component

## 0.8.8

 * Fixed aws release paths
 * Fixed file object base path
 * Updated html-concat to work with subdirs
 * Added many more tests

## 0.8.5

 * Added `test quick` command

## 0.8.4

 * Added buildFonts config option, so this can now be skipped

## 0.8.3

 * Added .min for CSS
 * Added serving of NodeJS (express) apps

## 0.8.2

 * fixed cloud release bug

## 0.8.1

 * fixed releasing when specifying `--version=`

## 0.8.0

 * Added config file to make the helper insanely useful in many projects

## 0.7.2

 * fixed bug with rename

## 0.7.0

 * Renamed to `component-helper`
 * Added many more CLI commands - can now do everything without gulp (apart from `watch`).
 * build, serve, test, release now available i.e. `component build`

## 0.6.3

 * Fixed a few bugs

## 0.6.0

 * Major Refactor - is now much faster

## 0.5.1

 * Fixed CLI

## 0.5.0

 * Added versioned demo pages to build CDN
 * Added CLI for creating a component
 * Added link to screen-shotting to test suite

## 0.4.2

 * Updated tests to include bower dependencies if required

## 0.4.1

 * Updated test task to fail if coverage is too low

## 0.4.0

 * Added Jasmine test framework with coverage

## 0.3.5

 * Fixed 'version update' to only update placeholders within html files i.e. not versioned dependencies

## 0.3.3

 * Fixed how config files were found

## 0.3.2

 * Fixed aws-s3 plugin name

## 0.3.1

 * Updated test area. Can test all gulp tasks (Dangerous tasks are mocked).
 * Fixed gulp watch

## 0.3.0

 * Updated default bower directories to include `src`

## 0.2.2

 * Fixed some bugs in the examples code

## 0.2.1

 * Components have to explicitly import sass dependencies from bower_components

## 0.2.0

 * Added browserify into js task to handle dependency management

## 0.1.0

 * Updated to be more configurable and independent of sky 'defaults'

## 0.0.1

 * created

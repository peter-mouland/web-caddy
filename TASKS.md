# Tasks

These tasks are documented for those who want to know what is going on under the hood.  If you need to change the way your component works, you may also want to override these tasks within your own `gulpfile.js`. i.e. using `requirejs` instead of `browserify` for your own component.

## Build

`component build`

Executes all the Build tasks below

#### CSS

`component build css`

Create a `.css` for each `.scss` file (without an underscore `_` prefix) it finds.

#### JS

`component build js`

This task can handle CommonJS and plain JS.  To handle dependency management, we use [browserify](https://www.npmjs.com/package/browserify) which creates a single javascript file found in the `src/js` root.

For each .js file in the `/src/js` root, a `.min.js` version is created using [uglify-js](https://www.npmjs.com/package/uglify-js).

#### HTML

`component build html`

Concatinate all html files found in `demo/_includes` into `demo/index.html`.  Nothing fancy, yet.


## Serve

`component serve`

This will [build](#build) your site then using [browserSync](https://www.npmjs.com/package/browser-sync) start a server on localhost:3456.
To prevent the build from kicking off, there is also `gulp server:quick` command available.

## Testing

`component test`

This will [build](#build) your site then run the Test tasks below.
To prevent the build from kicking off, there is also `gulp test:quick` command available.


#### Once

`component test once`

Using Karma and Jasmine, it will run through the `.spec.js` files found in `/test/` directory

#### TDD

`component test tdd`

Using the `watermarks` option within karma.conf.js, it ensures the code coverage is above the thresholds given.

#### Coverage

`component test coverage`

Using Karma and Jasmine, it will run through the `.spec.js` files found in `/test/` directory and watch for code changes in your spec files.


## Releasing

`component release`

This will [build](#build) and [test](#test) your site, patch the version number in all the docs (package.json, bower.js, version.js, *.md and *.html) then run the above release commands.

To force a version or release type use the `--version=` option followed by either `patch`, `minor`, `major` or even `v3.2.1`

note: if you have mentioned a version number that you do not want updating (i.e. to a third-party, do not enclose it in `"` or `/`

#### Amazon Web Services

`component release aws`

This will push the current files within `_site` to AWS if `aws:release` is set to true within `config/index.js`

#### GH-Pages

`component release gh-pages`

This will push the current files within `_site` to gh-pages branch.

#### Tagging Git

`component release git`

This will use the version within `package.json`, tag your code and push the tag to git.

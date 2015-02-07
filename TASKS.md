# Tasks

## New

`component new`

This will create a new component with a standard fie structure and giving you the ability to build, test, serve and release it out of the box.

#### Bower

`component new bower`

This will register you component with bower using the name from your bower.json and the repository url from package.json.

## Build

`component build`

Executes all the Build tasks below

#### Styles (default Sass)

`component build styles`

Create a `.css` for each `.scss` file (without an underscore `_` prefix) it finds.

These will be saved within the `dist` and `site` roots set within `component.config.js`

#### Scripts (default commonJS)

`component build scripts`

Using CommonJS to handle dependency management, we [browserify](https://www.npmjs.com/package/browserify) to create a compiled file for each javascript file found in the `src/js` root.
Using [uglify-js](https://www.npmjs.com/package/uglify-js), this will also create `.min.js` files.

These will be saved within the `dist` and `site` roots set within `component.config.js`

#### HTML

`component build html`

Concatinate all html files found in `demo/_includes` into `demo/index.html`.  Nothing fancy, yet.


## Serve

`component serve`

This will [build](#build) your site then using [browserSync](https://www.npmjs.com/package/browser-sync) will automatically apply any html, css and js source changes.

You can configure this to either serve a static site or node app.  Within the component.config.js this is the `serve` object.  Within node, just pass the relevant Object, String or Array.

Static Example : ```'_site'``` or ```['_site', 'public']```
Node Server example : 
```
{  script : 'src/app/server.js',
          host: 'http://localhost:3000',
          port: 3001,
          env: { NODE_ENV: 'development'}
}
```

#### Quick

`component serve quick`

This will do the above `serve`, but without the build step.

## Testing (default Karma)

`component test`

This will [build](#build) your site then run the Test tasks below.

### Quick

`component test quick`

This will run all your tests below as mentioned above, but without the build step.


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

#### cloud : (Default Amazon Web Services)

`component release cloud`

This will push the current files within `_site` to AWS if `aws:release` is set to true within `config/index.js`

#### GH-Pages

`component release gh-pages`

This will push the current files within `_site` to gh-pages branch.

#### Tagging Git

`component release git`

This will use the version within `package.json`, tag your code and push the tag to git.

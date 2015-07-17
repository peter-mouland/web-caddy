# Testing Your App

Using [Karma](http://karma-runner.github.io/0.12/index.html) and [Jasmine](http://jasmine.github.io/2.2/introduction.html).

 * [TDD](#tdd)
 * [Single Test Run](#single-test-run)
 * [Run a Specific Test](#run-a-specific-test)
 * [Functional Testing](#functional-testing)
 * [Unit Tests](#unit-tests)
 * [Code Coverage](#code-coverage)

## Single test run

> Run the complete test suite before pushing any changes to git

`karma start test/karma.unit.js --single-run` 
`karma start test/karma.functional.js --single-run`

This will run through the `.spec.js` files found in `/test/` directory (unit and functional).
A [code-coverage](#code-coverage) report will also be produced.

We recommend that your package.json `scripts` object is updated so you do not rely on a global install and to check your JS for errors, run the build, then run tests.

```javascript
    "test": "jshint src && caddy build && karma start test/karma.unit.js --single-run && karma start test/karma.functional.js --single-run",
```

You can then use `npm test`.

## TDD

> Automatically rerun tests while making code changes.

`karma start test/karma.unit.js`

This will run functional and unit tests (without code-coverage) which can be viewed in the browser by going to the site specified by the Karma console output (by default: http://localhost:9876/).

Making changes to your tests, or your code, will cause the suite to re-run.  To see code changes within `debug` page you should manually refresh the browser.

We recommend that your package.json `scripts` object is updated so you do not rely on a global install:

```javascript
    "tdd": "karma start test/karma.unit.js",
    "functional": "karma start test/karma.functional.js",
```

You can then use `npm run tdd` and  `npm run functional`.

## Run a Specific Test

> `focus` on a single test or group of tests

By using the `fdescribe` or `fit` (instead of describe or it) Jasmine will run only those tests.

## Functional Testing

> Test user journeys and private functions.

This is setup with `karma.functional.js` (by default, you can rename this if you also update `caddy.config.js`).
If you do not wish to run any functional tests you can set `karma.functional:false` within `caddy.config.js`.

## Unit Tests

> Test complex snippets of code and saving code coverage reports.

This is setup with `karma.unit.js` (by default, you can rename this if you also update `caddy.config.js`).
If you do not wish to run any functional tests you can set `karma.unit:false` within `caddy.config.js`.

## Code Coverage

> See how much of your code is (unit) tested

Code coverage is produced automatically (when unit tests run) and can form part of your testing process.
Within `karma.unit.js`, update the `watermarks` object.
If the coverage percentage drops below any of the first values, the tests will fail.


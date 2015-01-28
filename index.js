'use strict';
var build = require('./tasks/build');
var test = require('./tasks/test');
var release = require('./tasks/release');
var serve = require('./tasks/serve');
var paths = require('./paths');

module.exports = {
    paths: paths,
    tasks: {
        build: build,
        test: test,
        release: release,
        serve: serve
    }
}
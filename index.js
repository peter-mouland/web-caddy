'use strict';
var build = require('./tasks/build');
var test = require('./tasks/test');
var release = require('./tasks/release');
var serve = require('./tasks/serve');
var init = require('./tasks/init');
var clean = require('./tasks/clean');
var pkg = require('./package.json');

module.exports = {
    init: init,
    clean: clean,
    build: build,
    test: test,
    release: release,
    serve: serve,
    version: pkg.version
};
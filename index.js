'use strict';
var copy = require('./tasks/copy');
var build = require('./tasks/build');
var test = require('./tasks/test');
var release = require('./tasks/release');
var serve = require('./tasks/serve');
var init = require('./tasks/init');
var clean = require('./tasks/clean');
var bump = require('./tasks/bump');
var pkg = require('./package.json');

module.exports = {
    init: init,
    clean: clean,
    copy: copy,
    build: build,
    test: test,
    bump: bump,
    release: release,
    serve: serve,
    version: pkg.version
};
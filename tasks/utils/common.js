var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var log = require('./log');
var helper = require('./config-helper');

var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var pkg = component.pkg;
var paths = helper.parsePaths(component.paths);

helper.configCheck(component);

module.exports = {
    Promise: Promise,
    paths: paths,
    log: log,
    pkg : component.pkg,
    component: component
};
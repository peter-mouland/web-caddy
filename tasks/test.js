var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var build = require('./build');
var clean = require('./clean');
var log = require('./utils/log');
var fs = require('./utils/fs');
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var helper = require('./utils/config-helper');
var paths = helper.parsePaths(component.paths);
var TestWrapper = require('./wrappers/' + (component.test || 'karma'));

helper.configCheck(component);

function tdd(options){
    options = Array.isArray(options) ? options[0] : options;
    options = options || (component[component.test]) || {};
    var test = new TestWrapper(options);
    return test.run(false);
}

function quick(options){
    if (!component.test){
        log.info('Test set to false within component.config.js : skipping');
        return Promise.resolve();
    }
    options = Array.isArray(options) ? options[0] : options;
    options = options || (component[component.test]) || {};
    var test = new TestWrapper(options);

    return clean.test().then(function(){
        return test.run(true);
    }).then(function(){
        return test.coverage();
    }).then(log.onSuccess).catch(log.onError);
}

function all(options){
    return build.all().then(function() {
        return quick(options);
    }).catch(log.onError);
}

module.exports = {
    tdd: tdd,
    all: all,
    quick: quick
};
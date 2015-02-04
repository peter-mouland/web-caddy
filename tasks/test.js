var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var build = require('./build');
var log = require('./utils/log');
var file = require('./utils/file');
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var helper = require('./utils/config-helper');
var paths = helper.parsePaths(component.paths);
var testWrapper = require('./wrappers/karma');
var test = new testWrapper(component.testConfig);

function once(){
    return test.run(true);
}

function tdd(){
    return test.run(false);
}

function coverage(){
    return test.coverage();
}

function all(){
    if (!component.test){
        log.info('Test set to false within component.config.js : skipping')
        return Promise.resolve();
    }
    return build.all().then(function() {
        return once();
    }).then(function(){
        return test.coverage();
    }).catch(log.onError);
}

module.exports = {
    tdd: tdd,
    once: once,
    coverage: coverage,
    all: all
}
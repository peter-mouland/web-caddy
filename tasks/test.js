var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var component, Test;

function checkConfig(){
    component = helper.getConfig();
    if (component.test){
        Test = require('./wrappers/' + (component.test || 'karma'));
    } else {
        log.info('Test set to false within component.config.js : skipping');
        return Promise.resolve();
    }
}

function tdd(options){
    checkConfig();
    options = options || (component[component.test]) || {};
    return new Test(options).run(false);
}

function run(options){
    checkConfig();
    options = options || (component[component.test]) || {};
    var test = new Test(options);
    var clean = require('./clean');
    return clean.test().then(function(){
        return test.run(true);
    }).then(function(){
        return test.coverage();
    }).then(log.onSuccess).catch(log.onError);
}

module.exports = {
    tdd: tdd,
    run: run,
    all: run
};
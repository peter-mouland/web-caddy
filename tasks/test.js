var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, Test;

function checkConfig(){
    config = helper.getConfig();
    if (config.test){
        Test = require('./wrappers/' + (config.test || 'karma'));
    } else {
        log.info('Test set to false within caddy.config.js : skipping');
        return Promise.resolve();
    }
}

function tdd(options){
    checkConfig();
    options = options || (config[config.test]) || {};
    return new Test(options).run(false);
}

function run(options){
    checkConfig();
    options = options || (config[config.test]) || {};
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
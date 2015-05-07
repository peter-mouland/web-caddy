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
        //todo: verbose?
        //log.info('Test set to false within caddy.config.js : skipping');
        return Promise.resolve();
    }
}

function all(options, singleRun){
    checkConfig();
    options = options || (config[config.test]) || {};
    var unitPromise, functionalPromise;
    unitPromise = functionalPromise = Promise.resolve();
    if (options.unit){
        log.info(' * unit tests started');
        unitPromise = new Test(options).run(singleRun, options.unit);
    }
    if (options.functional){
        log.info(' * functional tests started');
        functionalPromise = new Test(options).run(singleRun, options.functional);
    }
    return Promise.all([unitPromise,functionalPromise]);
}

function tdd(options){
    return all(options, false);
}

function run(options){
    var clean = require('./clean');
    return clean('test').then(function(){
        log.info('Testing :');
        return all(options, true);
    }).then(function(){
        options = options || (config[config.test]) || {};
        return new Test(options).coverage();
    }).then(log.onSuccess).catch(log.onError);
}

var commands = {
    run: run,
    tdd: tdd,
    all: run
};

module.exports = function(cmd, options){
    return (commands[cmd]) ? commands[cmd](options) : 0;
};
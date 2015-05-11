var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, TestWrapper, test = {}, i=0;

function checkConfig(){
    config = helper.getConfig();
    if (config.test){
        TestWrapper = require('./wrappers/' + (config.test || 'karma'));
    } else {
        //todo: verbose?
        //log.info('Test set to false within caddy.config.js : skipping');
        return Promise.resolve();
    }
}

function all(options, singleRun){
    options = options || (config[config.test]) || {};
    var unitPromise, functionalPromise;
    unitPromise = functionalPromise = Promise.resolve();
    if (options.unit){
        log.info(' * unit tests started');
        unitPromise = new TestWrapper(options).run(singleRun, options.unit);
    }
    if (options.functional){
        log.info(' * functional tests started');
        functionalPromise = new TestWrapper(options).run(singleRun, options.functional);
    }
    return Promise.all([unitPromise,functionalPromise]);
}

test.tdd = function(options){
    return all(options, false);
};

test.all = function(options){
    return all(options, true).then(function(){
        options = options || (config[config.test]) || {};
        return new TestWrapper(options).coverage();
    }).then(log.onSuccess).catch(log.onError);
};

var prepare = {
    all: function(){ return clean.test(); },
    noop: function(){ return Promise.resolve(); }
};

function run(task, options){
    checkConfig();
    return (prepare[task] || prepare.noop)().then(function() {
        log.info('Testing :', task);
        if (!!test[task]) return test[task](options);
        //if (!copy[task]) return help[task](options);
    });
}

module.exports = {
    'tdd': function(options){ return run('tdd', options); },
    all:  function(options){ return run('all', options); }
};
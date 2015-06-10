var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var extend = require('util')._extend;
var config, TestWrapper, test = {}, i=0;

function checkConfig(){
    config = helper.getConfig();
    if (config.tasks.test){
        TestWrapper = require('./wrappers/karma');
    } else {
        //todo: verbose?
        //log.info('Test set to false within caddy.config.js : skipping');
        return Promise.resolve();
    }
}

function all(options, singleRun){
    return unit(options, singleRun).then(function(){
        return functional(options, singleRun);
    });
}

function unit(options, singleRun){
    options = extend(config[config.tasks.test] || {}, options);
    if (options.unit){
        log.info(' * unit tests started');
        return new TestWrapper(options).run(singleRun, options.unit);
    }
    return Promise.resolve();
}

function functional(options, singleRun){
    options = extend(config[config.tasks.test] || {}, options);
    if (options.functional){
        log.info(' * functional tests started');
        return new TestWrapper(options).run(singleRun, options.functional);
    }
    return Promise.resolve();
}

test.tdd = function(options){
    return all(options, false);
};

test.all = function(options){
    return all(options, true).then(log.onSuccess).catch(log.onError);
};

var prepare = {
    all: function(){ return clean.test(); },
    noop: function(){ return Promise.resolve(); }
};

function run(task, options){
    checkConfig();
    options = options || {};
    return (prepare[task] || prepare.noop)().then(function() {
        log.info('Testing :', task);
        return test[task](options);
    });
}

module.exports = {
    'tdd': function(options){ return run('tdd', options); },
    all:  function(options){ return run('all', options); }
};
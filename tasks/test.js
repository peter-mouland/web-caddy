var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var extend = require('util')._extend;
var test = {};

function all(options, singleRun){
    var testWrapper = require('./wrappers/karma');
    if (typeof options==='string') options = [options];
    log.info(' * Karma Runing: ' + options[0]);
    return testWrapper(singleRun, options[0]).then(function(){
        if (options.length<2){ return Promise.resolve(); }
        log.info(' * Karma Runing: ' + options[1]);
        return testWrapper(singleRun, options[1]);
    });
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

function exec(task, options){
    var config = helper.getConfig();
    if (!config.tasks.test){        return Promise.resolve();    }

    options = extend(config[config.tasks.test] || {}, options);
    return (prepare[task] || prepare.noop)().then(function() {
        log.info('Testing :', task);
        return test[task](options);
    });
}

module.exports = {
    'tdd': function(options){ return exec('tdd', options); },
    all:  function(options){ return exec('all', options); }
};
var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var component = helper.getConfig();
var Test = require('./wrappers/' + (component.test || 'karma'));

function tdd(options){
    options = Array.isArray(options) ? options[0] : options;
    options = options || (component[component.test]) || {};
    var test = new Test(options);
    return test.run(false);
}

function run(options){
    if (!component.test){
        log.info('Test set to false within component.config.js : skipping');
        return Promise.resolve();
    }
    options = Array.isArray(options) ? options[0] : options;
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
    run: run
};
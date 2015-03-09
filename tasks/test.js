var utils = require('./utils/common');
var paths = utils.paths;
var Promise = utils.Promise;
var pkg = utils.pkg;
var log = utils.log;
var component = utils.component;

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
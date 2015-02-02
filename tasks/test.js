var Promise = require('es6-promise').Promise;
var chalk = require('chalk');
var findup = require('findup-sync');

var build = require('./build');
var component = require(findup('component.config.js') || '../component-structure/component.config.js');
var paths = component.paths;
var testWrapper = require('./wrappers/karma');
var test = new testWrapper(paths.test);

function onError(err, exitOnError) {
    console.log(chalk.red(err));
    if (exitOnError) process.exit(1);
}
function info(msg) {
    console.log(chalk.cyan(msg));
}

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
        info('Test set to false within component.config.js : skipping')
        return Promise.resolve();
    }
    return build.all().then(function() {
        return once();
    }).then(function(){
        return test.coverage();
    }).catch(onError);
}

module.exports = {
    tdd: tdd,
    once: once,
    coverage: coverage,
    all: all
}
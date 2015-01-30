var Promise = require('es6-promise').Promise;
var chalk = require('chalk');
var findup = require('findup-sync');

var build = require('./build');
var component = require(findup('component.config.js') || '../component-structure/component.config.js');
var paths = component.paths;
var testWrapper = require('./utils/karma');
var test = new testWrapper(paths.test);

function onError(err, exitOnError) {
    console.log(chalk.red(err));
    if (exitOnError) process.exit(1);
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
    return build.all().then(function() {
        return once();
    }, onError).then(function(){
        return test.coverage().catch(onError);
    }, onError);
}

module.exports = {
    tdd: tdd,
    once: once,
    coverage: coverage,
    all: all
}
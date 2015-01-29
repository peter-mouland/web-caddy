var Promise = require('es6-promise').Promise;
var karma = require('karma').server;
var chalk = require('chalk');
var findup = require('findup-sync');

var helper = require('../index.js');
var component = require(findup('component.config.js') || './component-structure/component.config');
var paths = component.paths;
var karmaConfig = findup(paths.test.config);

function onError(err, exitOnError) {
    console.log(chalk.red(err));
    if (exitOnError) process.exit(1);
}

function runKarma(singleRun){
    return new Promise(function(resolve, reject) {
        karma.start({
            configFile: karmaConfig,
            singleRun: singleRun
        }, function(err){
            err && reject(err)
            !err && resolve()
        });
    });
}

function once(){
    return runKarma(true);
}

function tdd(){
    return runKarma(false);
}

function coverage(){
    return new Promise(function(resolve, reject) {
        var summaryFile = findup(paths.test.summary)
        if (!summaryFile){ onError('You must have run tests first')}
        var results = require(summaryFile);
        var config = require(karmaConfig);
        var coverage = config({
            set: function (conf) {
                return conf;
            }
        }).coverageReporter;
        var thresholds = coverage.reporters[0].watermarks;
        var err = false;
        for (var file in results) {
            for (var threshold in thresholds) {
                if (results[file][threshold].pct < thresholds[threshold][0]) {
                    onError(file + ' : ' + threshold + ' Coverage is too low (<' + thresholds[threshold][0] + '%)');
                    err = true;
                }
            }
        }
        err && reject('Coverage Failed');
        !err && resolve();
    })
}

function all(){
    return helper.tasks.build.all().then(function() {
        return once();
    }, onError).then(function(){
        return coverage().catch(onError);
    }, onError);
}

module.exports = {
    tdd: tdd,
    once: once,
    coverage: coverage,
    all: all
}
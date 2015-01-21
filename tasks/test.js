var Promise = require('es6-promise').Promise;
var karma = require('karma').server;
var chalk = require('chalk');
var paths = require('../paths');
var findup = require('findup-sync');
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

function singleRun(){
    return runKarma(true);
}

function tdd(){
    return runKarma(false);
}

function coverage(){
    return new Promise(function(resolve, reject) {
        var results = require(findup(paths.test.summary));
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
        err && reject();
        !err && resolve();
    })
}

function all(){
    return singleRun().then(function(){
        return coverage().catch(onError);
    }, onError);
}

module.exports = {
    tdd: tdd,
    singleRun: singleRun,
    coverage: coverage,
    all: all
}
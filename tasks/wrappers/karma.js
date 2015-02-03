var Promise = require('es6-promise').Promise;
var karma = require('karma').server;
var findup = require('findup-sync');
var log = require('../utils/log');

function Karma(paths){
    this.summaryPath = paths.summary;
    this.configPath = paths.config;
}

Karma.prototype.run = function(singleRun){
    var config = findup(this.configPath);
    return new Promise(function(resolve, reject) {
        karma.start({
            configFile: config,
            singleRun: singleRun
        }, function(err){
            err && reject(err)
            !err && resolve()
        });
    });
}

Karma.prototype.coverage = function(){
    var config = findup(this.configPath);
    var summaryPath = findup(this.summaryPath);
    return new Promise(function(resolve, reject) {
        if (!summaryPath){ log.onError('You must have run tests first')}
        var results = require(summaryPath);
        var coverage = require(config)({
            set: function (conf) {
                return conf;
            }
        }).coverageReporter;
        var thresholds = coverage.reporters[0].watermarks;
        var err = false;
        for (var file in results) {
            for (var threshold in thresholds) {
                if (results[file][threshold].pct < thresholds[threshold][0]) {
                    log.warn(file + ' : ' + threshold + ' Coverage is too low (<' + thresholds[threshold][0] + '%)');
                    err = true;
                }
            }
        }
        err && reject('Coverage Failed');
        !err && resolve();
    })
}

module.exports = Karma;
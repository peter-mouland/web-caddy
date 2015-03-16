var Promise = require('es6-promise').Promise;
var karma = require('karma').server;
var findup = require('findup-sync');
var log = require('../utils/log');

function Karma(options){
    this.summaryPath = options.unitCoverage || options.summary;//options.summary deprecated
    this.unitConfigPath = options.unit || options.config;//options.configPath deprecated
    this.functionalConfigPath = options.functional;
}

Karma.prototype.run = function(singleRun){
    return Promise.all([
        this.test(singleRun, this.unitConfigPath),
        this.test(singleRun, this.functionalConfigPath)
    ]);
};

Karma.prototype.test = function(singleRun, configPath){
    return new Promise(function(resolve, reject) {
        if (!configPath) {
            resolve();
        }
        karma.start({
            configFile: findup(configPath),
            singleRun: singleRun
        }, function(err){
            err && reject(err);
            !err && resolve();
        });
    });
};

Karma.prototype.coverage = function(){
    if ((process.cwd() + '/').indexOf('/test/')>-1){
        log.warn('You are in project called test.  You will not get any coverage results.\n > Please rename your project.');
    }
    var self = this;
    return new Promise(function(resolve, reject) {
        if (!self.unitConfigPath) resolve();
        var config = findup(self.unitConfigPath);
        var summaryPath = findup(self.summaryPath);
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
                    var fileDir = file.replace(process.cwd(),'');
                    log.warn(fileDir + ' : ' + threshold + ' Coverage is too low (<' + thresholds[threshold][0] + '%)');
                    err = true;
                }
            }
        }
        log.info(['To view coverage results please run',
            ' $ component serve test/coverage/phantomjs/'].join('\n'));
        err && reject('Test Coverage FAILED');
        !err && resolve('Test Coverage SUCCESS');
    });
};

module.exports = Karma;
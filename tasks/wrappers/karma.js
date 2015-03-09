var Promise = require('es6-promise').Promise;
var karma = require('karma').server;
var findup = require('findup-sync');
var log = require('../utils/log');

function Karma(options){
    if (!options || !options.summary || !options.config){
        log.onError('Karma requires config with `summary` and `config`.');
    }
    this.summaryPath = options.summary;
    this.configPath = options.config;
}

Karma.prototype.run = function(singleRun){
    var config = findup(this.configPath);
    return new Promise(function(resolve, reject) {
        karma.start({
            configFile: config,
            singleRun: singleRun
        }, function(err){
            err && reject(err);
            !err && resolve();
        });
    });
};

Karma.prototype.coverage = function(){
    if ((process.cwd() + '/').indexOf('/test')){
        log.warn('You are in project called test.  You will not get any coverage results.\n > Please rename your project.');
    }
    var self = this;
    var config = findup(this.configPath);
    var summaryPath = findup(this.summaryPath);
    return new Promise(function(resolve, reject) {
        if (!summaryPath){ log.onError('You must have run tests first. Summary file not found in : ' + self.summaryPath);}
        if (!config){ log.onError('Karma config file could not be found in : ' + self.configPath);}
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
            ' * $ component serve test/coverage/phantomjs/'].join('\n'));
        err && reject('Test Coverage FAILED');
        !err && resolve('Test Coverage SUCCESS');
    });
};

module.exports = Karma;
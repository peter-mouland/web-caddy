var Promise = require('es6-promise').Promise;
var karma = require('karma').server;
var findup = require('findup-sync');
var log = require('../utils/log');

function run(singleRun, configPath){
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
}

module.exports = run;
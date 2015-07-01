var Promise = require('es6-promise').Promise;
var extend = require('util')._extend;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var config;

function bump(location, options){
    var build = require('./build');
    var Bump = require('./utils/bump');
    var filesToBump = location || config.tasks.bump;
    return new Bump(filesToBump, options).run()
        .then(function(version){
            if (!version) return;
            log.info(" * Now on " + version);
            return version;
        }).catch(log.onError);
}

function exec(location, options){
    config = helper.getConfig();
    if (!config.tasks.bump && !location) return Promise.resolve();

    options = extend(config.bump || {}, options || {});
    log.info('Bumping :');
    return bump(location, options);
}

module.exports = exec;
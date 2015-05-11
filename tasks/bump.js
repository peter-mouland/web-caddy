var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var config;

function all(type){
    if (type == 'current') return Promise.resolve(config.pkg.version);

    var build = require('./build');
    var Bump = require('./utils/bump');
    var newVersion;
    return new Bump(['./package.json','./README.md', config.paths.source + '/**/version.js'], {type: type }).run()
        .then(function(version){
            log.info(" * Now on " + version);
            newVersion = version;
            return build.html({version:version});
        }).then(function(){
            return newVersion;
        }).catch(log.onError);
}

function exec(task, options){
    config = helper.getConfig();
    log.info('Bumping :');
    switch (task){
        case 'all': all(options); break;
        //default: help(task); break; //todo: help
    }
}

module.exports = {
    all:  function(options){ exec('all', options); }
};
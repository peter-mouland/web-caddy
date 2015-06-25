var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var config, bump = {};

bump.all = function all(options){
    var build = require('./build');
    var Bump = require('./utils/bump');
    var newVersion;
    var filesToBump = config.tasks.bump;
    return new Bump(filesToBump, options).run()
        .then(function(version){
            log.info(" * Now on " + version);
            newVersion = version;
            return build.html({version:version});
        }).then(function(){
            return newVersion;
        }).catch(log.onError);
};

function exec(task, options){
    config = helper.getConfig();
    if (!config.tasks.bump) return Promise.resolve();
    options = options || {};
    log.info('Bumping :');
    return bump[task](options);
}

module.exports = {
    all:  function(options){ return exec('all', options); },
    adhoc:  function(type){ return exec('all', { type : type }); }
};
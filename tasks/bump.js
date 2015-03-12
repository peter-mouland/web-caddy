var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var component, paths, pkg;

function bump(type){
    component = helper.getConfig();
    if (type == 'current') return Promise.resolve(component.pkg.version);
    log.info("\nBumping version : " + type );
    var build = require('./build');
    var Bump = require('./utils/bump');
    var newVersion;
    return new Bump(['./package.json','./README.md', component.paths.source.root + '/**/version.js'], {type: type }).run()
        .then(function(version){
            newVersion = version;
            return build.html({version:version});
        }).then(function(){
            return newVersion;
        }).catch(log.onError);
}

function run(type){
    return bump(type).catch(log.onError);
}

module.exports = {
    run: run,
    adhoc: run
};

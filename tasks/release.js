var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var git = require('./utils/git');
var helper = require('./utils/config-helper');
var component, paths, pkg;

function bump(type){
    component = helper.getConfig();
    log.info("\nBumping version ...  " + type );
    var build = require('./build');
    var Bump = require('./utils/bump');
    var newVersion;
    return new Bump(['./package.json','./README.md', './**/version.js'], {type: type }).run()
        .then(function(version){
            newVersion = version;
            return build.html({version:version});
        }).then(function(){
            return newVersion;
        }).catch(log.onError);
}

function ghPagesRelease(message){
    var ghPages = require('gh-pages');
    component = helper.getConfig();
    message = Array.isArray(message) ? message[0] : message;
    message = message || 'Update';
    log.info("\nReleasing to gh-pages ... \n");
    return new Promise(function(resolve, reject){
        ghPages.publish(component.paths.site.root, {message: message }, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
}

function s3(version){
    component = helper.getConfig();
    if (!component.release){
        log.info('Skipping S3 : `Release` set to false within component.config.js');
        return Promise.resolve();
    }
    log.info("\nReleasing to S3 ... \n");
    version = Array.isArray(version) ? version[0] : version;
    version = version || component.pkg.version;
    var options = (component[component.release]) || {};
    var prefix = options.directoryPrefix || '';
    var Release = require('./wrappers/' + (component.release || 's3'));
    return new Release(component.paths.site.root + '/**/*.*', prefix + component.pkg.name + '/' + version +'/', options).write();
}

function releaseGit(version){
    component = helper.getConfig();
    version = Array.isArray(version) ? version[0] : version;
    version = version || component.pkg.version;
    return git.release(version);
}

function run(type){
    var bumpedVersion;
    if (!git.checkRemote()){
        log.onError('No valid Remote Git URL.\nPlease update your `.git/config` file or run:\n $ component init git');
    }
    return releaseGit(type).then(function(version){
        bumpedVersion = version;
        return releaseGit(version);
    }).then(function(){
        return ghPagesRelease('v' + bumpedVersion);
    }).then(function(){
        return s3(bumpedVersion);
    }).catch(log.onError);
}

module.exports = {
    git: releaseGit,
    bump: bump,
    'gh-pages': ghPagesRelease,
    s3: s3,
    run: run
};

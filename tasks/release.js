var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var git = require('./utils/git');
var helper = require('./utils/config-helper');
var component, paths, pkg;

function ghPagesRelease(message){
    var ghPages = require('gh-pages');
    component = helper.getConfig();
    message = message || 'Update';
    log.info("\nReleasing to gh-pages : `" + message + "`\n");
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
    version = version || component.pkg.version;
    if (!component.release){
        log.info('Skipping S3 : `Release` set to false within component.config.js');
        return Promise.resolve();
    }
    log.info("\nReleasing to S3 : " + version + "\n");
    var options = (component[component.release]) || {};
    var prefix = options.directoryPrefix || '';
    var Release = require('./wrappers/' + (component.release || 's3'));
    return new Release(component.paths.site.root + '/**/*.*', prefix + component.pkg.name + '/' + version +'/', options).write();
}

function releaseGit(version){
    if (!git.checkRemote()){
        log.onError('No valid Remote Git URL.\nPlease update your `.git/config` file or run:\n $ component init git');
    }
    component = helper.getConfig();
    version = version || component.pkg.version;
    log.info('Start release to Git : ' + version);
    return git.release(version);
}

function run(type){
    var bump = require('./bump').run;
    var bumpedVersion;
    return bump(type).then(function(version) {
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
    'gh-pages': ghPagesRelease,
    s3: s3,
    run: run,
    adhoc: run
};

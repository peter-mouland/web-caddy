var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, paths, pkg;

function getConfig(){
    config = helper.getConfig();
}

function ghPagesRelease(message){
    getConfig();
    var release = helper.matches(config.release, ['gh-pages']);
    if (!release) return Promise.resolve();

    var ghPages = require('gh-pages');
    message = message || 'Update';
    log.info("\n * gh-pages\n");
    return new Promise(function(resolve, reject){
        ghPages.publish(config.paths.target, {message: message }, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
}

function s3(version){
    getConfig();
    var release = helper.matches(config.release, ['s3']);
    if (!release) return Promise.resolve();

    log.info("\ * s3\n");
    var Release = require('./wrappers/s3');
    var options = config.s3 || {};
    var target = options.target || '';
    if (version){
        target = target.replace(/("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g, '$1' + version + '$2');
    }
    return new Release(config.paths.target + '/**/*.*', target, options).write();
}

function releaseGit(version){
    getConfig();
    var release = helper.matches(config.release, ['git']);
    if (!release) return Promise.resolve();

    var git = require('./utils/git');
    if (!git.checkRemote()){
        return log.onError(['No valid Remote Git URL.',
            'Please update your `.git/config` file or run:',
            '$ caddy init git'].join('\n'));
    }
    version = version || config.pkg.version;
    log.info(' * Git');
    return git.release(version);
}

function releaseBower(version){
    getConfig();
    var release = helper.matches(config.release, ['bower']);
    if (!release) return Promise.resolve();

    var git = require('./utils/git');
    var bower = require('./wrappers/bower');
    if (!git.checkRemote()){
        return log.onError(['No valid Remote Git URL.',
            'Please update your `.git/config` file or run:',
            '$ caddy init git'].join('\n'));
    }
    version = version || config.pkg.version;
    log.info(' * Bower');
    return bower.release(version).catch(log.onError);
}

function run(type){
    log.info('Releasing :');
    var bump = require('./bump').run;
    var bumpedVersion;
    return bump(type || 'current').then(function(version) {
        bumpedVersion = version;
        return releaseGit(version);
    }).then(function(){
        return ghPagesRelease('v' + bumpedVersion);
    }).then(function(){
        return s3(bumpedVersion);
    }).catch(log.onError);
}

module.exports = {
    bower: releaseBower,
    git: releaseGit,
    'gh-pages': ghPagesRelease,
    s3: s3,
    run: run,
    all: run,
    adhoc: run
};

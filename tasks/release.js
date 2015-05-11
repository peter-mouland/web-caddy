var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var bump = require('./bump');
var config, paths, pkg, release = {};

function initConfig(){
    config = helper.getConfig();
}

release.ghPages = function ghPagesRelease(message){
    var release = helper.matches(config.release, ['gh-pages']);
    if (!release) return Promise.resolve();

    var ghPages = require('gh-pages');
    message = message || 'Update';
    log.info(" * gh-pages");
    return new Promise(function(resolve, reject){
        ghPages.publish(config.paths.target, {message: message }, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
};

release.s3 = function s3(version){
    var release = helper.matches(config.release, ['s3']);
    if (!release) return Promise.resolve();

    log.info(" * S3");
    var Release = require('./wrappers/s3');
    var options = config.s3 || {};
    var target = options.target || '';
    if (version){
        target = target.replace(/("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g, '$1' + version + '$2');
    }
    return new Release(config.paths.target + '/**/*.*', target, options).write();
};

release.git = function releaseGit(version){
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
};

release.bower = function releaseBower(version){
    var release = helper.matches(config.release, ['bower']);
    if (!release) return Promise.resolve();

    log.info(" * Bower");
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
};

release.all = function all(options){
    var bumpedVersion = options.version;
    return release.git(bumpedVersion).then(function(){
        return release.ghPages('v' + bumpedVersion);
    }).then(function(){
        return release.s3(bumpedVersion);
    }).catch(log.onError);
};

var prepare = {
    all: function(type){ return bump.all(type || 'current'); },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, options){
    initConfig();
    if (!config.release) return Promise.resolve();
    return (prepare[task] || prepare.noop)().then(function(version){
        log.info('Releasing :');
        if (version) (options || {}).version = version;
        if (!!release[task]) return release[task](options);
        //if (!release[task]) return help[task](options);
    });
}

module.exports = {
    'bower': function(options){ return exec('bower', options); },
    'git':  function(options){  return exec('git', options); },
    'gh-pages':  function(options){  return exec('ghPages', options); },
    's3':  function(options){  return exec('s3', options); },
    'all':  function(options){ return exec('all', options); }
};
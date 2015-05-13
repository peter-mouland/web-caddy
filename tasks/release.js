var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var bump = require('./bump');
var extend = require('util')._extend;
var config, paths, pkg, release = {};

function initConfig(){
    config = helper.getConfig();
}

release.ghPages = function (options){
    var release = helper.matches(config.release, ['gh-pages']);
    if (!release) return Promise.resolve();

    var ghPages = require('gh-pages');
    log.info(" * gh-pages");
    options.message = options.message || 'v' + options.version;
    return new Promise(function(resolve, reject){
        ghPages.publish(config.paths.target, options, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
};

release.s3 = function (options){
    var release = helper.matches(config.release, ['s3']);
    if (!release) return Promise.resolve();

    log.info(" * S3");
    var Release = require('./wrappers/s3');
    options = extend(config.s3 || {}, options);
    var target = options.target || '';
    if (options.version){
        target = target.replace(/("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g, '$1' + options.version + '$2');
    }
    return new Release(config.paths.target + '/**/*.*', target, options).write();
};

release.git = function (options){
    var release = helper.matches(config.release, ['git']);
    if (!release) return Promise.resolve();

    var git = require('./utils/git');
    var version = options.version || config.pkg.version;
    log.info(' * Git');
    if (!git.checkRemote()){
        return log.onError(['No valid Remote Git URL.',
            'Please update your `.git/config` file or run:',
            '$ caddy init git'].join('\n'));
    }
    return git.release(version);
};

release.bower = function (options){
    var release = helper.matches(config.release, ['bower']);
    if (!release) return Promise.resolve();

    var git = require('./utils/git');
    var bower = require('./wrappers/bower');
    var version = options.version || config.pkg.version;
    log.info(" * Bower");
    if (!git.checkRemote()){
        return log.onError(['No valid Remote Git URL.',
            'Please update your `.git/config` file or run:',
            '$ caddy init git'].join('\n'));
    }
    return bower.release(version).catch(log.onError);
};

release.all = function (options){
    return release.bower(options).then(function(){
        return release.git(options);
    }).then(function(){
        return release.ghPages(options);
    }).then(function(){
        return release.s3(options);
    });
};

var prepare = {
    all: function(options){
        if (!options.type) return prepare.noop();
        return bump.all(options);
    },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, options){
    initConfig();
    if (!config.release) return Promise.resolve();
    options = options || {};
    return (prepare[task] || prepare.noop)(options).then(function(version){
        log.info('Releasing :');
        if (version) options.version = version;
        return release[task](options);
    });
}

module.exports = {
    'bower': function(options){ return exec('bower', options); },
    'git':  function(options){  return exec('git', options); },
    'gh-pages':  function(options){ return exec('ghPages', options); },
    's3':  function(options){  return exec('s3', options); },
    'all':  function(options){ return exec('all', options); },
    'adhoc':  function(type){ return exec('all', { type : type }); }
};
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
    var release = helper.matches(config.tasks.release, ['gh-pages']);
    if (!release) return Promise.resolve();

    var ghPages = require('gh-pages');
    log.info(" * gh-pages");
    options.message = options.message || options.tag;
    return new Promise(function(resolve, reject){
        options.tag = false;
        ghPages.publish(config.paths.target, options, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
};

release.s3 = function (options){
    var release = helper.matches(config.tasks.release, ['s3']);
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
    var release = helper.matches(config.tasks.release, ['git']);
    if (!release) return Promise.resolve();

    var git = require('./utils/git');
    log.info(' * Git');
    if (!git.checkRemote()){
        return log.onError(['No valid Remote Git URL.',
            'Please update your `.git/config` file or run:',
            '$ caddy init git'].join('\n'));
    }
    return git.release(options);
};

release.bower = function (options){
    var release = helper.matches(config.tasks.release, ['bower']);
    if (!release) return Promise.resolve();

    var git = require('./utils/git');
    var bower = require('./wrappers/bower');
    log.info(" * Bower");
    if (!git.checkRemote()){
        return log.onError(['No valid Remote Git URL.',
            'Please update your `.git/config` file or run:',
            '$ caddy init git'].join('\n'));
    }
    return bower.release(options).catch(log.onError);
};

release.all = function (options){
    options.tag = 'v' +  ((options.version) ? options.version : config.pkg.version);
    return release.bower(options).then(function(){
        options.tagged = true;
        return release.git(options);
    }).then(function(){
        return release.ghPages(options);
    }).then(function(){
        return release.s3(options);
    }).catch(log.onError);
};

function exec(task, options){
    initConfig();
    options = options || {};
    if (!config.tasks.release) return Promise.resolve();
    log.info('Releasing :');
    return release[task](options);
}

module.exports = {
    'bower': function(options){ return exec('bower', options); },
    'git':  function(options){  return exec('git', options); },
    'gh-pages':  function(options){ return exec('ghPages', options); },
    's3':  function(options){  return exec('s3', options); },
    'all':  function(options){ return exec('all', options); }
};
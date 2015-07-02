var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var bump = require('./bump');
var extend = require('util')._extend;
var config, release = {};

release.ghPages = function (options){
    var release = helper.matches(config.tasks.release, ['gh-pages']);
    if (!release) return Promise.resolve();

    var ghPages = require('gh-pages');
    log.info(" * gh-pages");
    options.message = options.message || options.tag;
    options.basePath = options.basePath || config.buildPaths[0].target;
    return new Promise(function(resolve, reject){
        options.tag = false;
        ghPages.publish(options.basePath, options, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
};

release.s3 = function (options){
    var release = helper.matches(config.tasks.release, ['s3']);
    if (!release) return Promise.resolve();

    var Release = require('./wrappers/s3');
    options = extend(config.s3 || {}, options);
    var target = options.target || '';
    if (options.version){
        target = target.replace(/("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g, '$1' + options.version + '$2');
    }
    log.info(" * S3 (" + options.bucket + ":" + target + ")");
    return new Release(config.s3.baseDir + '/**/*.*', target, options).write();
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

release.all = function (options){
    return release.git(options).then(function(){
        return release.ghPages(options);
    }).then(function(){
        return release.s3(options);
    }).catch(log.onError);
};

function exec(task, options){
    config = helper.getConfig();
    options = options || {};
    options.tag = 'v' +  (options.version || config.pkg.version);
    if (!config.tasks.release) return Promise.resolve();
    log.info('Releasing :');
    return release[task](options);
}

module.exports = {
    'git':  function(options){  return exec('git', options); },
    'gh-pages':  function(options){ return exec('ghPages', options); },
    's3':  function(options){  return exec('s3', options); },
    'all':  function(options){ return exec('all', options); }
};
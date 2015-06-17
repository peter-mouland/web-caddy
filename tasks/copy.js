var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, copy = {};

function copyFiles(fileType, msg, glob){
    log.info(msg);
    var promises = [];
    config.buildPaths.forEach(function(pathObj, i){
        pathObj.targets.forEach(function(target, i){
            var src = path.join(pathObj.source, glob || config.globs[fileType]);
            promises.push(fs.glob(src).then(function(fileObjs){
                var promises = [];
                fileObjs.forEach(function(fileObj){
                    var outFile = path.join(target, fileObj.relativeDir);
                    promises.push(fs.copy(fileObj.path, outFile));
                });
                return promises;
            }));
        });
    });
    return promises;
}

copy.serverConfig = function serverConfig(){
    var verify = helper.matches(config.tasks.copy, ['server-config']);
    if (!verify) return Promise.resolve();
    return copyFiles('serverConfig', ' * Server Config');
};

copy.fonts = function fonts() {
    var verify = helper.matches(config.tasks.copy, ['fonts']);
    if (!verify) return Promise.resolve();
    return copyFiles('fonts', ' * Fonts');
};

copy.images = function images() {
    var verify = helper.matches(config.tasks.copy, ['images']);
    if (!verify) return Promise.resolve();
    return copyFiles('images', ' * Images');
};

copy.other = function images() {
    if (!config.tasks.copy) return Promise.resolve();
    var promises = [];
    config.tasks.copy.forEach(function(copy){
        if (['fonts', 'images', 'server-config'].indexOf(copy)>=0) return;
        return copyFiles('other', ' * Others', copy);
    });
    return Promise.all(promises);
};

copy.all = function all(){
    return Promise.all([
        copy.fonts(),
        copy.images(),
        copy.serverConfig(),
        copy.other()
    ]).catch(log.warn);
};

var prepare = {
    all: function(){ return clean.copy(); },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, options){
    config = helper.getConfig();
    options = options || {};
    if (!config.tasks.copy) return Promise.resolve();
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Copying :');
        return copy[task](options);
    });
}

module.exports = {
    'server-config': function(options){ return exec('serverConfig', options); },
    'other': function(options){ return exec('other', options); },
    fonts:  function(options){ return exec('fonts', options); },
    images:  function(options){ return exec('images', options); },
    all:  function(options){ return exec('all', options); }
};

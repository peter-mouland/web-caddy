var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, paths, globs, pkg, copy = {};

function initConfig(){
    config = helper.getConfig();
    globs = config.globs;
    paths = config.paths;
    pkg = config.pkg;
}

function copyFiles(fileType){
    var location = [];
    paths.source && location.push(globs.source[fileType]);
    paths.demo && location.push(globs.demo[fileType]);
    return fs.glob(location).then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function(fileObj){
            var outFile = path.join(paths.target, fileObj.relativeDir);
            promises.push(fs.copy(fileObj.path, outFile));
        });
        return promises;
    }).catch(log.warn);
}

copy.serverConfig = function serverConfig(){
    var verify = helper.matches(config.copy, ['server-config']);
    if (!verify) return Promise.resolve();
    log.info(' * Server Config');
    return copyFiles('serverConfig');
};

copy.fonts = function fonts() {
    var verify = helper.matches(config.copy, ['fonts']);
    if (!verify) return Promise.resolve();
    log.info(' * Fonts');
    return copyFiles('fonts');
};

copy.images = function images() {
    var verify = helper.matches(config.copy, ['images']);
    if (!verify) return Promise.resolve();
    log.info(' * Images');
    return copyFiles('images');
};

copy.all = function all(){
    return Promise.all([
        copy.serverConfig(),
        copy.fonts(),
        copy.images()
    ]).catch(log.warn);
};

var prepare = {
    all: function(){ return clean.copy(); },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, options){
    initConfig();
    if (!config.copy) return Promise.resolve();
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Copying :');
        return copy[task](options);
    });
}

module.exports = {
    'server-config': function(options){ return exec('serverConfig', options); },
    fonts:  function(options){ return exec('fonts', options); },
    images:  function(options){ return exec('images', options); },
    all:  function(options){ return exec('all', options); }
};
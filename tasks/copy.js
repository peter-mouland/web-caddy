var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, paths, globs, pkg;

function initConfig(){
    config = helper.getConfig();
    globs = config.globs;
    paths = config.paths;
    pkg = config.pkg;
}

function copy(fileType){
    var location = [];
    paths.source && location.push(globs.source[fileType]);
    paths.demo && location.push(globs.demo[fileType]);
    return fs.glob(location).then(function(fileObjs){
        var promises = []
        fileObjs.forEach(function(fileObj){
            var outFile = path.join(paths.target, fileObj.relativeDir);
            promises.push(fs.copy(fileObj.path, outFile))
        });
        return promises;
    }).catch(log.warn);
}

function serverConfig(){
    initConfig();
    var doCopy = helper.matches(config.copy, ['server-config']);
    if (!doCopy || !paths.target) return Promise.resolve();

    return copy('serverConfig').then(function(){
        log.info(' * Server Config Complete');
    });
}

function fonts() {
    initConfig();
    var doCopy = helper.matches(config.copy, ['fonts']);
    if (!doCopy || !paths.target) return Promise.resolve();

    return copy('fonts').then(function(){
        log.info(' * Fonts Complete');
    });
}

function images() {
    initConfig();
    var doCopy = helper.matches(config.copy, ['images']);
    if (!doCopy || !paths.target) return Promise.resolve();

    return copy('images').then(function(){
        log.info(' * Images Complete');
    });
}

function run(){
    return clean('copy').then(function(){
        log.info('Copying :');
        return Promise.all([
                serverConfig(),
                fonts(),
                images()
            ]);
    }).catch(log.warn);
}

module.exports = {
    'server-config': serverConfig,
    images: images,
    fonts: fonts,
    run: run,//todo: choose run or all, not both!
    all: run//todo: choose run or all, not both!
};
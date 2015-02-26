var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var log = require('./utils/log');
var fs = require('./utils/fs');
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var helper = require('./utils/config-helper');
var paths = helper.parsePaths(component.paths);

function styles(){
    log.info('deleting styles :');
    var stylesPaths = [];
    paths.dist && stylesPaths.push(paths.dist.styles + '/**/*');
    paths.site && stylesPaths.push(paths.site.styles + '/**/*');
    return fs.del(stylesPaths);
}

function scripts(){
    log.info('deleting scripts :');
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist + '/**/*');
    paths.site && delPaths.push(paths.site + '/**/*');
    return fs.del(delPaths);
}

function fonts(){
    if (paths.site && paths.site.fonts) {
        log.info('deleting fonts :');
        return fs.del(paths.site.fonts + '/**/*');
    } else {
        log.info('Skipping `fonts` clean.');
        return Promise.resolve();
    }
}

function images(){
    if (paths.site && paths.site.images) {
        log.info('deleting images :');
        return fs.del(paths.site.images + '/**/*');
    } else {
        log.info('Skipping `images` clean.');
        return Promise.resolve();
    }
}

function all(){
    log.info('deleting all :');
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist.root + '/**/*');
    paths.site && delPaths.push(paths.site.root + '/**/*');
    return fs.del(delPaths).catch(log.onError);
}

module.exports = {
    all: all,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts
};
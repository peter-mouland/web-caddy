var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, pkg, globs;

function initConfig(){
    config = helper.getConfig();
    globs = config.globs;
    pkg = config.pkg;
}

function serverConfig(){
    log.info(' * Server config files');
    initConfig();
    return fs.del(globs.target.serverConfig);
}

function html(){
    log.info(' * HTML');
    initConfig();
    return fs.del(globs.target.html);
}

function styles(){
    log.info(' * Styles');
    initConfig();
    return fs.del(globs.target.styles);
}

function scripts(){
    log.info(' * Scripts');
    initConfig();
    return fs.del(globs.target.scripts);
}

function fonts(){
    log.info(' * Fonts');
    initConfig();
    return fs.del(globs.target.fonts);
}

function images(){
    initConfig();
    log.info(' * Images');
    return fs.del(globs.target.images);
}

function test(){
    initConfig();
    log.info(' * Test report');
    return fs.del(globs.testCoverage);
}

function adHoc(location, options){
    log.info(' * adHoc : ' + location);
    return fs.del(location);
}

function all(){
    return Promise.all([serverConfig(), html(), styles(), scripts(), fonts(), images()]).catch(log.onError);
}

function copy(){
    return Promise.all([serverConfig(), fonts(), images()]).catch(log.onError);
}

function build(){
    return Promise.all([html(), styles(), scripts()]).catch(log.onError);
}

var commands = {
    all: all,
    copy: copy,
    build: build,
    'server-config': serverConfig,
    test: test,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts
};

module.exports = function(location, options){
    log.info('Deleting :');
    return (commands[location]) ? commands[location](options) : adHoc(location, options);
};
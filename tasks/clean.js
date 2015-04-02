var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, paths, pkg;

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    pkg = config.pkg;
}

function serverConfig(){
    log.info('deleting server config files');
    initConfig();
    var htmlPaths = [];
    paths.site && htmlPaths.push(paths.site.root + '/{CNAME,.htaccess,robots.txt}');
    return fs.del(htmlPaths);
}

function html(){
    log.info('deleting HTML');
    initConfig();
    var htmlPaths = [];
    paths.dist && htmlPaths.push(paths.dist.root + '/*.{html,jade,ms,mustache}');
    paths.site && htmlPaths.push(paths.site.root + '/*.{html,jade,ms,mustache}');
    return fs.del(htmlPaths);
}

function styles(){
    log.info('deleting styles');
    initConfig();
    var stylesPaths = [];
    paths.dist && stylesPaths.push(paths.dist.styles + '/**/*.css');
    paths.site && stylesPaths.push(paths.site.styles + '/**/*.css');
    return fs.del(stylesPaths);
}

function scripts(){
    log.info('deleting scripts');
    initConfig();
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist.scripts + '/**/*.js');
    paths.site && delPaths.push(paths.site.scripts + '/**/*.js');
    return fs.del(delPaths);
}

function fonts(){
    initConfig();
    if (paths.site && paths.site.fonts) {
        log.info('deleting fonts');
        return fs.del(paths.site.fonts + '/**/*.{svg,ttf,eot,woff}');
    } else {
        log.info('Skipping `fonts` clean.');
        return Promise.resolve();
    }
}

function images(){
    initConfig();
    if (paths.site && paths.site.images) {
        log.info('deleting images');
        return fs.del(paths.site.images + '/**/*.{png,svg,jpg,gif}');
    } else {
        log.info('Skipping `images` clean.');
        return Promise.resolve();
    }
}

function test(){
    initConfig();
    log.info('deleting test results');
    return fs.del('./test/coverage/**/*');
}

function all(){
    return Promise.all([serverConfig(), html(), styles(), scripts(), fonts(), images()]).catch(log.onError);
}

module.exports = {
    all: all,
    'server-config': serverConfig,
    test: test,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts
};
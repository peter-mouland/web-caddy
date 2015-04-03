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
    log.info(' * Server config files');
    initConfig();
    return fs.del(paths.site.root + '/{CNAME,.htaccess,robots.txt}');
}

function html(){
    log.info(' * HTML');
    initConfig();
    return fs.del(paths.site.root + '/*.{html,jade,ms,mustache}');
}

function styles(){
    log.info(' * Styles');
    initConfig();
    return fs.del(paths.site.styles + '/**/*.css');
}

function scripts(){
    log.info(' * Scripts');
    initConfig();
    return fs.del(paths.site.scripts + '/**/*.js');
}

function fonts(){
    log.info(' * Fonts');
    initConfig();
    return fs.del(paths.site.fonts + '/**/*.{svg,ttf,eot,woff}');
}

function images(){
    initConfig();
    log.info(' * Images');
    return fs.del(paths.site.images + '/**/*.{png,svg,jpg,gif}');
}

function test(){
    initConfig();
    log.info(' * Test report');
    return fs.del('./test/coverage/**/*');
}

function all(){
    return Promise.all([serverConfig(), html(), styles(), scripts(), fonts(), images()]).catch(log.onError);
}

var directories = {
    all: all,
    'server-config': serverConfig,
    test: test,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts
};

module.exports = function(location, options){
    log.info('Deleting :');
    if (location.indexOf('/')<0 && location.indexOf('\\')<0) directories[location]();
    return fs.del(location);
};
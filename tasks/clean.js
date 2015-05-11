var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, pkg, globs, clean = {};

function initConfig(){
    config = helper.getConfig();
    globs = config.globs;
    pkg = config.pkg;
}

clean.serverConfig = function serverConfig(){
    log.info(' * Server config files');
    return fs.del(globs.target.serverConfig);
};

clean.html = function html(){
    log.info(' * HTML');
    return fs.del(globs.target.html);
};

clean.styles = function styles(){
    log.info(' * Styles');
    return fs.del(globs.target.styles);
};

clean.scripts =  function scripts(){
    log.info(' * Scripts');
    return fs.del(globs.target.scripts);
};

clean.fonts = function fonts(){
    log.info(' * Fonts');
    return fs.del(globs.target.fonts);
};

clean.images = function images(){
    initConfig();
    log.info(' * Images');
    return fs.del(globs.target.images);
};

clean.test = function test(){
    log.info(' * Test report');
    return fs.del(globs.testCoverage);
};

clean.adhoc = function adHoc(location, options){
    log.info(' * adHoc : ' + location);
    return fs.del(location);
};

clean.all = function all(){
    return Promise.all([clean.copy(), clean.build()]).catch(log.onError);
};

clean.copy = function copy(){
    return Promise.all([clean.serverConfig(), clean.fonts(), clean.images()]).catch(log.onError);
};

clean.build = function build(){
    return Promise.all([clean.html(), clean.styles(), clean.scripts()]).catch(log.onError);
};

function exec(task, options){
    initConfig();
    log.info('Deleting :');
    if (clean[task]) return clean[task](options);
    //if (!clean[task]) return help[task](options); todo: help function
}

module.exports = {
    'copy': function(options){ return exec('copy', options); },
    'build': function(options){ return exec('build', options); },
    'server-config': function(options){ return exec('serverConfig', options); },
    'test': function(options){ return exec('test', options); },
    'html': function(options){ return exec('html', options); },
    'styles': function(options){ return exec('styles', options); },
    'scripts': function(options){ return exec('scripts', options); },
    'fonts': function(options){ return exec('fonts', options); },
    'images': function(options){ return exec('images', options); },
    'all': function(options){ return exec('all', options); }
};
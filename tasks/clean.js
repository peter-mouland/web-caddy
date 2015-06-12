var Promise = require('es6-promise').Promise;
var path = require('path');
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, clean = {};

function setTargets(buildPaths){
    var targets = [];
    buildPaths.forEach(function(pathObj, i){
        pathObj.targets.forEach(function(target, i){
            if (targets.indexOf(target)<0) {
                targets.push(target);
            }
        });
    });
    return targets;
}

function del(fileType, msg){
    log.info(msg);
    var promises = [];
    var targets = setTargets(config.buildPaths);
    targets.forEach(function(target){
        promises.push(fs.del(path.join(target, config.globs[fileType])));
    });
    return Promise.all(promises);
}

clean.serverConfig = function serverConfig(){
    return del('serverConfig', ' * Server config files');
};

clean.html = function html(){
    return del('html', ' * html');
};

clean.styles = function styles(){
    return del('styles', ' * Styles');
};

clean.scripts =  function scripts(){
    return del('scripts', ' * Scripts');
};

clean.fonts = function fonts(){
    return del('fonts', ' * Fonts');
};

clean.images = function images(){
    return del('images', ' * Images');
};

clean.test = function test(){
    log.info(' * Test report');
    return fs.del(config.globs.testCoverage);
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
    config = helper.getConfig();
    log.info('Deleting :');
    return clean[task](options);
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
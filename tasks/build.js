var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var UglifyJS = require("./wrappers/uglifyjs");
var extend = require('util')._extend;
var path = require('path');
var clean = require('./clean');
var config, build = {};

function buildPromises(wrapper, fileType, options){
    var fn = require('./wrappers/' + wrapper);
    var promises = [];
    config.buildPaths.forEach(function(pathObj, i){
        var src = path.join(pathObj.source, config.globs[fileType]);
        pathObj.targets.forEach(function(target){
            promises.push(new fn(src, target, options).write());
        });
    });
    return promises;
}

function wait(fileObjs){
    return new Promise(function(resolve, reject) {
        setTimeout(function(){ resolve(fileObjs); }, 100);
    });
}

build.html = function html(options) {
    var htmlWrapper = helper.matches(config.tasks.build, ['jade','mustache']);
    if (!htmlWrapper) return Promise.resolve();
    log.info(' * HTML');

    options = extend(config.pkg || {}, options);
    options.now = Date().split(' ').splice(0,5).join(' ');
    var promises = buildPromises(htmlWrapper, 'html', options);
    return Promise.all(promises).then(build.htmlMin).then(options.reload).catch(log.warn);
};

//todo: location for consistency or fileObjs for speed??
build.htmlMin = function htmlMin(fileObjs) {
    var htmlWrapper = helper.matches(config.tasks.build, ['html-min']);
    if (!htmlWrapper) return Promise.resolve();
    log.info(' * HTML Min');

    var HtmlMin = require('./wrappers/html-min');
    var promises = [];
    fileObjs.forEach(function(fileObjs){
        promises.push(new HtmlMin(fileObjs).write());
    });
    return Promise.all(promises).catch(log.warn);
};

build.scripts = function scripts(options){
    var scriptsWrapper = helper.matches(config.tasks.build, ['browserify','requirejs']);
    if (!scriptsWrapper) return Promise.resolve();
    log.info(' * Scripts');

    options = extend(config[scriptsWrapper] || {}, options);
    options.browserify = config.pkg.browserify;
    options.browser = config.pkg.browser;
    options["browserify-shim"] = config.pkg["browserify-shim"];

    var fn = require('./wrappers/' + scriptsWrapper);
    var promises = [];
    config.buildPaths.forEach(function(pathObj, i){
        var src = path.join(pathObj.source, config.globs.scripts);
        pathObj.targets.forEach(function(target){
            promises.push(new fn(src, target, options).write().then(wait).then(function(fileObjPromises){
                if (options.dev || !pathObj.minify) return Promise.resolve();
                return build.jsMin(fileObjPromises);//todo copy duplicates rather than rebuild
            }));
        });
    });
    return Promise.all(promises).then(options.reload).catch(log.warn);
};

build.jsMin = function (fileObjs){
    log.info(' * Minifying JS');
    var promises = [];
    fileObjs.forEach(function (fileObj, i) {
        log.info('    * ' + fileObj.name);
        promises.push(new UglifyJS(fileObj).write());
    });
    return Promise.all(promises);
};

build.styles = function styles(options){
    var stylesWrapper = helper.matches(config.tasks.build, ['sass']);
    if (!stylesWrapper) return Promise.resolve();
    log.info(' * Styles');

    options = extend(config[stylesWrapper] || {}, options);
    var promises = buildPromises(stylesWrapper, 'styles', options);
    return Promise.all(promises).then(options.reload).catch(log.warn);
};

build.all = function all(options){
    return Promise.all([
        build.scripts(options),
        build.styles(options),
        build.html(options)
    ]).catch(log.warn);
};

var prepare = {
    all: function(){ return clean.build(); },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, options){
    config = helper.getConfig();
    options = options || {};
    if (!config.tasks.build && task == 'all') return Promise.resolve();
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Building :');
        return build[task](options);
    });
}

module.exports = {
    html: function(options){ return exec('html', options); },
    styles:  function(options){ return exec('styles', options); },
    scripts:  function(options){ return exec('scripts', options); },
    all:  function(options){ return exec('all', options); }
};
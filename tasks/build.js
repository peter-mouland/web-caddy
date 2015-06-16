var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var extend = require('util')._extend;
var path = require('path');
var clean = require('./clean');
var config, build = {};

function buildPromises(wrapper, fileType, options){
    var Fn = require('./wrappers/' + wrapper);
    var promises = [];
    config.buildPaths.forEach(function(pathObj, i){
        var src = path.join(pathObj.source, config.globs[fileType]);
        pathObj.targets.forEach(function(target){
            var newOptions = extend({minify:(!options.dev && pathObj.minify)}, options || {});
            promises.push((new Fn(src, target, newOptions)).write());
        });
    });
    return Promise.all(promises).then(options.reload).catch(log.warn);
}

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

build.html = function html(options) {
    var wrapper = helper.matches(config.tasks.build, ['jade','mustache']);
    if (!wrapper) return Promise.resolve();
    log.info(' * HTML');

    options = extend(config.pkg || {}, options || {});
    options.now = Date().split(' ').splice(0,5).join(' ');
    return buildPromises(wrapper, 'html', options);
};

build.scripts = function scripts(options){
    var wrapper = helper.matches(config.tasks.build, ['browserify','requirejs']);
    if (!wrapper) return Promise.resolve();
    log.info(' * Scripts');

    options = extend(config[wrapper] || {}, options);
    options.browserify = config.pkg.browserify;
    options.browser = config.pkg.browser;
    options["browserify-shim"] = config.pkg["browserify-shim"];

    return buildPromises(wrapper, 'scripts', options);
};

build.styles = function styles(options){
    var wrapper = helper.matches(config.tasks.build, ['sass']);
    if (!wrapper) return Promise.resolve();
    log.info(' * Styles');

    options = extend(config[wrapper] || {}, options);
    options.appRoot = config.appRoot;
    return buildPromises(wrapper, 'styles', options);
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
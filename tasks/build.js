var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, paths, globs, pkg, build = {};

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    globs = config.globs;
    pkg = config.pkg;
}

build.html = function html(replacements) {
    var htmlWrapper = helper.matches(config.build, ['jade','mustache']);
    if (!htmlWrapper) return Promise.resolve();
    log.info(' * HTML');

    var Html = require('./wrappers/' + htmlWrapper);
    replacements = replacements || config.pkg;
    replacements.now = Date().split(' ').splice(0,5).join(' ');
    return Promise.all([
        paths.demo && new Html(globs.demo.html, paths.target, replacements).write(),
        paths.target && new Html(globs.source.html, paths.target, replacements).write()
    ]).then(build.htmlMin).catch(log.warn);
};

//todo: location for consistency or fileObjs for speed??
build.htmlMin = function htmlMin(fileObjs) {
    var htmlWrapper = helper.matches(config.build, ['html-min']);
    if (!htmlWrapper) return Promise.resolve();
    log.info(' * HTML Min');

    var Html = require('./wrappers/html-min');
    var promises = [];
    fileObjs.forEach(function(fileObjs){
        promises.push(new Html(fileObjs).write());
    });
    return Promise.all(promises).catch(log.warn);
};

build.scripts = function scripts(options){
    var scriptsWrapper = helper.matches(config.build, ['browserify','requirejs']);
    if (!scriptsWrapper) return Promise.resolve();
    log.info(' * Scripts');

    var Scripts = require('./wrappers/' + scriptsWrapper);
    options = options || config[scriptsWrapper] || {};
    options.browserify = pkg.browserify;
    options.browser = pkg.browser;
    options["browserify-shim"] = pkg["browserify-shim"];
    return Promise.all([
        paths.demo && new Scripts(globs.demo.scripts, paths.target, options).write(),
        paths.target && new Scripts(globs.source.scripts, paths.target, options).write()
    ]).catch(log.warn);
};

build.styles = function styles(options){
    var stylesWrapper = helper.matches(config.build, ['sass']);
    if (!stylesWrapper) return Promise.resolve();
    log.info(' * Styles');

    var Styles = require('./wrappers/' + stylesWrapper);
    options = options || (config[stylesWrapper]) || {};
    return Promise.all([
        paths.target && new Styles(globs.source.styles, paths.target, options).write(),
        paths.demo && new Styles(globs.demo.styles, paths.target, options).write()
    ]).catch(log.warn);
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
    initConfig();
    if (!config.build) return Promise.resolve();
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Building :');
        if (build[task]) return build[task](options);
        //if (!build[task]) return help[task](options);
    });
}

module.exports = {
    html: function(options){ return exec('html', options); },
    styles:  function(options){ return exec('styles', options); },
    scripts:  function(options){ return exec('scripts', options); },
    all:  function(options){ return exec('all', options); }
};
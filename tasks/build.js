var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, paths, globs, pkg;

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    globs = config.globs;
    pkg = config.pkg;
}

function html(replacements) {
    initConfig();
    var build = helper.matches(config.build, ['jade','mustache']);
    if (!build) return Promise.resolve();

    var Html = require('./wrappers/' + build);
    replacements = replacements || config.pkg;
    replacements.now = Date().split(' ').splice(0,5).join(' ');
    return Promise.all([
        paths.demo && new Html(globs.demo.html, paths.target, replacements).write(),
        paths.target && new Html(globs.source.html, paths.target, replacements).write()
    ]).then(function(fileObjs){
        log.info(' * HTML Complete');
        return htmlMin(fileObjs);
    }).catch(log.warn);
}

//todo: location for consistency or fileObjs for speed??
function htmlMin(fileObjs) {
    var build = helper.matches(config.build, ['html-min']);
    if (!build) return Promise.resolve();

    var Html = require('./wrappers/html-min');
    var promises = [];
    fileObjs.forEach(function(fileObjs){
        promises.push(new Html(fileObjs).write());
    });
    return Promise.all(promises).then(function(){
        log.info(' * HTML Min Complete');
    }).catch(log.warn);
}

function scripts(options){
    initConfig();
    var build = helper.matches(config.build, ['browserify','requirejs']);
    if (!build) return Promise.resolve();

    var Scripts = require('./wrappers/' + build);
    options = options || config[build] || {};
    options.browserify = pkg.browserify;
    options.browser = pkg.browser;
    options["browserify-shim"] = pkg["browserify-shim"];
    return Promise.all([
        paths.demo && new Scripts(globs.demo.scripts, paths.target, options).write(),
        paths.target && new Scripts(globs.source.scripts, paths.target, options).write()
    ]).then(function(){
        log.info(' * Scripts Complete');
    }).catch(log.warn);
}

function styles(options){
    initConfig();
    var build = helper.matches(config.build, ['sass']);
    if (!build) return Promise.resolve();

    var Styles = require('./wrappers/' + build);
    options = options || (config[build]) || {};
    return Promise.all([
        paths.target && new Styles(globs.source.styles, paths.target, options).write(),
        paths.demo && new Styles(globs.demo.styles, paths.target, options).write()
    ]).then(function(){
        log.info(' * Styles Complete');
    }).catch(log.warn);
}

function run(replacements){
    return clean('build').then(function(){
        log.info('Building :');
        return Promise.all([
                scripts(),
                styles(),
                html(replacements)
            ]);
    }).catch(log.warn);
}

module.exports = {
    html: html,
    styles: styles,
    scripts: scripts,
    run: run,//todo: choose run or all, not both!
    all: run//todo: choose run or all, not both!
};
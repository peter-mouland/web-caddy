var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, paths, pkg;

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    pkg = config.pkg;
}

//todo: move to copy task
function serverConfigFiles(){
    initConfig();
    var source = paths.source.root +'/' + '{CNAME,.htaccess,robots.txt}';
    return fs.copy(source, paths.site.root);
}

function html(replacements) {
    initConfig();
    var build = helper.matches(config.build, ['jade','mustache']);
    if (!build || !paths.site) return Promise.resolve();

    var Html = require('./wrappers/' + build);
    replacements = replacements || config.pkg;
    replacements.now = Date().split(' ').splice(0,5).join(' ');
    var src = [];
    paths.demo && src.push(paths.demo.root + '/*.{html,jade,mustache,ms}');
    paths.source && src.push(paths.source.root + '/*.{html,jade,mustache,ms}');
    return new Html(src, paths.site.root, replacements).write()
        .then(function(fileObjs){
            log.info(' * HTML Complete');
            return htmlMin(fileObjs);
        })
        .catch(log.warn);
}

//todo: location for consistency or fileObjs for speed??
function htmlMin(fileObjs) {
    var build = helper.matches(config.build, ['html-min']);
    if (!build || !paths.site) return Promise.resolve();

    var Html = require('./wrappers/html-min');
    return new Html(fileObjs).write().then(function(){
        log.info(' * HTML Min Complete');
    }).catch(log.warn);
}

//todo: move to copy task
function fonts() {
    initConfig();
    var build = helper.matches(config.build, ['fonts']);
    if (!build || !paths.site) return Promise.resolve();

    var location = [];
    paths.source && paths.source.fonts && location.push(paths.source.fonts + '/**/*.{eot,ttf,woff,svg}');
    paths.demo && paths.demo.fonts && location.push(paths.demo.fonts + '/**/*.{eot,ttf,woff,svg}');
    return fs.copy(location, paths.site.fonts);
}

//todo: move to copy task
function images() {
    initConfig();
    var build = helper.matches(config.build, ['images']);
    if (!build || !paths.site) return Promise.resolve();

    var location = [];
    paths.source && paths.source.images && location.push(paths.source.images + '/**/*');
    paths.demo && paths.demo.images && location.push(paths.demo.images + '/**/*');
    return fs.copy(location, paths.site.images);
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
        paths.demo && paths.demo.scripts && new Scripts(paths.demo.scripts, paths.site.scripts, options).write(),
        paths.site && paths.site.scripts && new Scripts(paths.source.scripts, paths.site.scripts, options).write()
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
        paths.site && paths.site.styles && new Styles(paths.source.styles, paths.site.styles, options).write(),
        paths.demo && paths.demo.styles && new Styles(paths.demo.styles, paths.site.styles, options).write()
    ]).then(function(){
        log.info(' * Styles Complete');
    }).catch(log.warn);
}

function run(replacements){
    return clean('all').then(function(){
        log.info('Building :');
        return Promise.all([
                serverConfigFiles(),
                scripts(),
                fonts(),
                images(),
                styles(),
                html(replacements)
            ]);
    }).catch(log.warn);
}

module.exports = {
    html: html,
    'server-config-files': serverConfigFiles,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts,
    run: run,//todo: choose run or all, not both!
    all: run//todo: choose run or all, not both!
};
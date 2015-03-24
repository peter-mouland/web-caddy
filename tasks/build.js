var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var component, paths, pkg;

function initConfig(){
    component = helper.getConfig();
    paths = component.paths;
    pkg = component.pkg;
}

function matches(config, plugins){
    //for backwards compatibility. deprecate in version 2
    var compatibility = [];
    if (config.fonts) compatibility.push('fonts');
    if (config.images) compatibility.push('images');
    if (config.styles) compatibility.push(config.styles);
    if (config.html) compatibility.push(config.html);
    if (config.scripts) compatibility.push(config.scripts);
    if (compatibility.length) config = compatibility;

    return config && config.map(function(i){
        if (plugins.indexOf(i)>-1) return i;
    }).join('');
}

var clean = require('./clean');

function html(replacements) {
    initConfig();
    var build = matches(component.build, ['jade','mustache']);
    if (!build || !paths.demo){
        log.info('Skipping build html');
        return Promise.resolve();
    }
    replacements = replacements || {};
    var Html = require('./wrappers/' + build);
    var htmlMinify = require('html-minifier').minify;

    var now = Date().split(' ').splice(0,5).join(' ');
    var version = replacements.version || component.pkg.version;
    var name = replacements.name || component.pkg.name;
    replacements.site = {now: now, version:version, name: name};
    var src = [ paths.demo.root + '/*.{html,jade,mustache,ms}'];
    var htmlPromise = new Html(src, paths.site.root, replacements).write();
    return htmlPromise.then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function(fileObj){
            fileObj.contents = htmlMinify(fileObj.contents, {
                removeAttributeQuotes: true,
                collapseBooleanAttributes : true,
                collapseWhitespace: true,
                useShortDoctype: true,
                removeComments:true,
                removeCommentsFromCdata:true,
                removeEmptyAttributes: true
            });
            promises.push(fs.write(fileObj));
        });
        return Promise.all(promises);
    }).then(function(){
        log.info('Build HTML Complete');
    }).catch(log.warn);
}

function fonts() {
    initConfig();
    if (!component.build.fonts) {
        log.info('skipping build fonts');
        return Promise.resolve();
    }
    var location = [
        paths.source.fonts + '/**/*',
        paths.bower.fonts + '/**/*.{eot,ttf,woff,svg}'
    ];
    return fs.copy(location, paths.site.fonts).catch(log.warn);
}

function images() {
    initConfig();
    if (!paths.site) {
        log.info('skipping build images');
        return Promise.resolve();
    }
    var src = paths.demo.images + '/**/*';
    fs.copy(src, paths.site.images).catch(log.warn);
}

function scripts(options){
    initConfig();
    var build = matches(component.build, ['browserify','requirejs']);
    if (!build){
        log.info('skipping build scripts');
        return Promise.resolve();
    }
    var Scripts = require('./wrappers/' + build);
    options = options || component[build] || {};
    options.browserify = pkg.browserify;
    return Promise.all([
        paths.dist && paths.dist.scripts && new Scripts(paths.source.scripts, paths.dist.scripts, options).write(),
        paths.demo && paths.demo.scripts && new Scripts(paths.demo.scripts, paths.site.scripts, options).write(),
        paths.site && paths.site.scripts && new Scripts(paths.source.scripts, paths.site.scripts, options).write()
    ]).then(function(){
        log.info('Build Scripts Complete');
    }).catch(log.warn);
}

function styles(options){
    initConfig();
    var build = matches(component.build, ['sass']);
    if (!build){
        log.info('Skipping build Sass');
        return Promise.resolve();
    }
    var Styles = require('./wrappers/' + build);
    options = options || (component[build]) || {};
    return Promise.all([
        paths.dist && paths.dist.styles && new Styles(paths.source.styles, paths.dist.styles, options).write(),
        paths.site && paths.site.styles && new Styles(paths.source.styles, paths.site.styles, options).write(),
        paths.demo && paths.demo.styles && new Styles(paths.demo.styles, paths.site.styles, options).write()
    ]).then(function(){
        log.info('Build Styles Complete');
    }).catch(log.warn);
}

function run(replacements){
    return clean.all().then(function(){
        log.info('Build :');
        return Promise.all([
                scripts(),
                fonts(),
                images(),
                styles(),
                html(replacements)
            ]);
    }).then(function(){
        log.info('Build All Complete');
    }).catch(log.warn);
}

module.exports = {
    html: html,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts,
    run: run,
    all: run
};
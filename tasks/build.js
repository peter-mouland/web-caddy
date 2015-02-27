var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var log = require('./utils/log');
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);

var clean = require('./clean');
var fs = require('./utils/fs');
var Scripts = require('./wrappers/' + (component.build.scripts || 'browserify'));
var Styles = require('./wrappers/' + (component.build.styles || 'sass'));
var Html = require('./wrappers/' + (component.build.html || 'mustache'));
var helper = require('./utils/config-helper');
var paths = helper.parsePaths(component.paths);
var now = Date().split(' ').splice(0,5).join(' ');

function buildHtml(replacements) {
    replacements = (Array.isArray(replacements)) ? {} : replacements || {};
    if (!component.build.html){
        log.info('build.html set to false within component.config.js : skipping building html');
        return Promise.resolve();
    }
    if (!component.paths.demo){
        log.info('paths.demo set to false within component.config.js : skipping building html');
        return Promise.resolve();
    }
    var version = replacements.version || component.pkg.version;
    var name = replacements.name || component.pkg.name;
    replacements.site = {now: now, version:version, name: name};
    var src = [ paths.demo.root + '/*.{html,jade,mustache,ms}'];
    var htmlPromise = new Html(src, paths.site.root, replacements).write();
    return htmlPromise.then(function(){
            return 'Build HTML Complete';
    }).catch(log.onError);
}

function fonts() {
    if (!component.build.fonts) {
        log.info('build.fonts within component.config.js is set to false : skipping copying fonts');
        return Promise.resolve();
    }
    var location = [
        paths.source.fonts + '/**/*',
        paths.bower.fonts + '/**/*.{eot,ttf,woff,svg}'
    ];
    return fs.copy(location, paths.site.fonts).catch(log.onError);
}

function images() {
    if (!paths.site) {
        log.info('paths.site within component.config.js is missing : skipping copying images');
        return Promise.resolve();
    }
    var src = paths.demo.images + '/**/*';
    fs.copy(src, paths.site.images).catch(log.onError);
}

function buildScripts(){
    if (!component.build.scripts){
        log.info('build.scripts set to false within component.config.js : skipping building scripts');
        return Promise.resolve();
    }
    return Promise.all([
        new Scripts(paths.source.scripts, paths.dist.scripts, component.build.scripts).write(),
        paths.demo && paths.demo.scripts && new Scripts(paths.demo.scripts, paths.site.scripts, component.build.scripts).write(),
        paths.site && paths.site.scripts && new Scripts(paths.source.scripts, paths.site.scripts, component.build.scripts).write()
    ]).then(function(){
        return 'Build Scripts Complete';
    }).catch(log.onError);
}

function buildStyles(){
    if (!component.build.styles){
        log.info('build.styles set to false within component.config.js : skipping building styles');
        return Promise.resolve();
    }
    return Promise.all([
        new Styles(paths.source.styles, paths.dist.styles).write(),
        paths.site && paths.site.styles && new Styles(paths.source.styles, paths.site.styles).write(),
        paths.demo && paths.demo.styles && new Styles(paths.demo.styles, paths.site.styles).write()
    ]).then(function(){
        return 'Build Styles Complete';
    }).catch(log.onError);
}

function all(replacements){
    replacements = (Array.isArray(replacements)) ? {} : replacements;
    return clean.all().then(function(){
        log.info('Build All :');
        return Promise.all([
                buildScripts(),
                fonts(),
                images(),
                buildStyles(),
                buildHtml(replacements)
            ]);
    }).then(function(){
        return 'Build All Complete';
    }).catch(log.onError);
}

module.exports = {
    html: buildHtml,
    styles: buildStyles,
    scripts: buildScripts,
    images: images,
    fonts: fonts,
    all: all
};
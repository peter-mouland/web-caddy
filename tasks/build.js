var Promise = require('es6-promise').Promise;
var minify = require('html-minifier').minify;
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

helper.configCheck(component);

function html(replacements) {
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
    return htmlPromise.then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function(fileObj){
            fileObj.contents = minify(fileObj.contents, {
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
            return 'Build HTML Complete';
    }).catch(log.warn);
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
    return fs.copy(location, paths.site.fonts).catch(log.warn);
}

function images() {
    if (!paths.site) {
        log.info('paths.site within component.config.js is missing : skipping copying images');
        return Promise.resolve();
    }
    var src = paths.demo.images + '/**/*';
    fs.copy(src, paths.site.images).catch(log.warn);
}

function scripts(options){
    if (!component.build.scripts){
        log.info('build.scripts set to false within component.config.js : skipping building scripts');
        return Promise.resolve();
    }
    options = options || (component[component.build.scripts]) || {};
    return Promise.all([
        paths.dist && paths.dist.scripts && new Scripts(paths.source.scripts, paths.dist.scripts, options).write(),
        paths.demo && paths.demo.scripts && new Scripts(paths.demo.scripts, paths.site.scripts, options).write(),
        paths.site && paths.site.scripts && new Scripts(paths.source.scripts, paths.site.scripts, options).write()
    ]).then(function(){
        return 'Build Scripts Complete';
    }).catch(log.warn);
}

function buildStyles(options){
    if (!component.build.styles){
        log.info('build.styles set to false within component.config.js : skipping building styles');
        return Promise.resolve();
    }
    options = options || (component[component.build.scripts]) || {};
    return Promise.all([
        paths.dist && paths.dist.styles && new Styles(paths.source.styles, paths.dist.styles, options).write(),
        paths.site && paths.site.styles && new Styles(paths.source.styles, paths.site.styles, options).write(),
        paths.demo && paths.demo.styles && new Styles(paths.demo.styles, paths.site.styles, options).write()
    ]).then(function(){
        return 'Build Styles Complete';
    }).catch(log.warn);
}

function all(replacements){
    replacements = (Array.isArray(replacements)) ? {} : replacements;
    return clean.all().then(function(){
        log.info('Build All :');
        return Promise.all([
                scripts(),
                fonts(),
                images(),
                buildStyles(),
                html(replacements)
            ]);
    }).then(function(){
        return 'Build All Complete';
    }).catch(log.warn);
}

module.exports = {
    html: html,
    styles: buildStyles,
    scripts: scripts,
    images: images,
    fonts: fonts,
    all: all
};
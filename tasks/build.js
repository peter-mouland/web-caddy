var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var log = require('./utils/log');
var file = require('./utils/file');
var scripts = require('./wrappers/browserify');    //config.buildScripts
var styles = require('./wrappers/sass');           //config.buildStyles
var html = require('./wrappers/html-concat');      //config.buildHTML
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var paths = component.paths;

function buildHtml(version) {
    if (!component.buildHTML){ return Promise.resolve();}
    version = Array.isArray(version) ? version[0] : version;
    version = version || component.pkg.version;
    var src = [ paths.demo.root + '/index.html', paths.demo.root + '/*/*.html'];
    var dest = paths.site.root + '/index.html';
    return file.del(dest).then(function(){
        return new html(src, dest, {version:version}).write()
    }).then(function(){
        return 'Build HTML Complete'
    }).catch(log.onError);
}

function fonts() {
    if (!paths.site) return Promise.resolve();
    var location = [
        paths.source.fonts + '/**/*',
        paths.bower.fonts + '/**/*.{eot,ttf,woff,svg}'
    ];
    var dest = paths.site.fonts;
    return file.del(dest + '/**/*').then(function() {
        return file.copy(location, dest)
    }).catch(log.onError);
}

function images() {
    if (!paths.site) return Promise.resolve();
    var src = paths.demo.images + '/**/*';
    var dest = paths.site.images;
    return file.del(dest + '/**/*').then(function(){
        return file.copy(src, dest);
    }).catch(log.onError);
}

function buildScripts(){
    if (!component.buildScripts){ return Promise.resolve();}
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist.scripts + '/**/*')
    paths.site && delPaths.push(paths.site.scripts + '/**/*')
    return file.del(delPaths).then(function(){
        return Promise.all([
            new scripts(paths.source.scripts, paths.dist.scripts).write(),
            paths.demo && paths.demo.scripts && new scripts(paths.demo.scripts, paths.site.scripts).write(),
            paths.site && paths.site.scripts && new scripts(paths.source.scripts, paths.site.scripts).write()
        ])
    }).then(function(){
        return 'Build Scripts Complete'
    }).catch(log.onError);
}

function buildStyles(){
    if (!component.buildStyles){ return Promise.resolve();}
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist.styles + '/**/*')
    paths.site && delPaths.push(paths.site.styles + '/**/*')
    return file.del(delPaths).then(function() {
        return Promise.all([
            new styles(paths.source.styles, paths.dist.styles).write(),
            paths.site && paths.site.styles && new styles(paths.source.styles, paths.site.styles).write(),
            paths.demo && paths.demo.styles && new styles(paths.demo.styles, paths.site.styles).write()
        ]);
    }).then(function(){
        return 'Build Styles Complete'
    }).catch(log.onError);
}

function all(args){
    return Promise.all([
        buildScripts(),
        fonts(),
        images(),
        buildStyles(),
        buildHtml(args)
    ]).then(function(){
        return 'Build All Complete'
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
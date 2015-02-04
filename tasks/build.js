var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var log = require('./utils/log');
var fs = require('./utils/fs');
var scripts = require('./wrappers/browserify');    //config.buildScripts
var styles = require('./wrappers/sass');           //config.buildStyles
var html = require('./wrappers/html-concat');      //config.buildHTML
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var helper = require('./utils/config-helper');
var paths = helper.parsePaths(component.paths);

function buildHtml(version) {
    if (!component.buildHTML){
        log.info('buildHTML set to false within component.config.js : skipping building html')
        return Promise.resolve();
    }
    version = Array.isArray(version) ? version[0] : version;
    version = version || component.pkg.version;
    var src = [ paths.demo.root + '/index.html', paths.demo.root + '/*/*.html'];
    var dest = paths.site.root + '/index.html';
    return fs.del(dest).then(function(){
        return new html(src, dest, {version:version}).write()
    }).then(function(){
        return 'Build HTML Complete'
    }).catch(log.onError);
}

function fonts() {
    if (!component.buildFonts) {
        log.info('buildFonts within component.config.js is set to false : skipping copying fonts')
        return Promise.resolve();
    }
    var location = [
        paths.source.fonts + '/**/*',
        paths.bower.fonts + '/**/*.{eot,ttf,woff,svg}'
    ];
    var dest = paths.site.fonts;
    return fs.del(dest + '/**/*').then(function() {
        return fs.copy(location, dest)
    }).catch(log.onError);
}

function images() {
    if (!paths.site) {
        log.info('paths.site within component.config.js is missing : skipping copying images')
        return Promise.resolve();
    }
    var src = paths.demo.images + '/**/*';
    var dest = paths.site.images;
    return fs.del(dest + '/**/*').then(function(){
        return fs.copy(src, dest);
    }).catch(log.onError);
}

function buildScripts(){
    if (!component.buildScripts){
        log.info('buildScripts set to false within component.config.js : skipping building scripts')
        return Promise.resolve();
    }
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist.scripts + '/**/*')
    paths.site && delPaths.push(paths.site.scripts + '/**/*')
    return fs.del(delPaths).then(function(){
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
    if (!component.buildStyles){
        log.info('buildStyles set to false within component.config.js : skipping building styles')
        return Promise.resolve();
    }
    var delPaths = [];
    paths.dist && delPaths.push(paths.dist.styles + '/**/*')
    paths.site && delPaths.push(paths.site.styles + '/**/*')
    return fs.del(delPaths).then(function() {
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
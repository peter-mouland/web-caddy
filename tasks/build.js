var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var component, paths, pkg;

function initConfig(){
    component = helper.getConfig();
    paths = component.paths;
    pkg = component.pkg;
}

function serverConfigFiles(){
    initConfig();
    var source = paths.source.root +'/' + '{CNAME,.htaccess,robots.txt}';
    return fs.copy(source, paths.site.root);
}

function html(replacements) {
    initConfig();
    replacements = replacements || {};
    if (!component.build.html || !component.paths.demo){
        log.info('build.html or paths.demo set to false within component.config.js : skipping building html');
        return Promise.resolve();
    }
    var Html = require('./wrappers/' + (component.build.html || 'mustache'));
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
    initConfig();
    if (!paths.site) {
        log.info('paths.site within component.config.js is missing : skipping copying images');
        return Promise.resolve();
    }
    var src = paths.demo.images + '/**/*';
    fs.copy(src, paths.site.images).catch(log.warn);
}

function scripts(options){
    initConfig();
    if (!component.build.scripts){
        log.info('build.scripts set to false within component.config.js : skipping building scripts');
        return Promise.resolve();
    }
    var Scripts = require('./wrappers/' + (component.build.scripts || 'browserify'));
    options = options || (component[component.build.scripts]) || {};
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
    if (!component.build.styles){
        log.info('build.styles set to false within component.config.js : skipping building styles');
        return Promise.resolve();
    }
    var Styles = require('./wrappers/' + (component.build.styles || 'sass'));
    options = options || (component[component.build.scripts]) || {};
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
                serverConfigFiles(),
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
    'server-config-files': serverConfigFiles,
    styles: styles,
    scripts: scripts,
    images: images,
    fonts: fonts,
    run: run
};
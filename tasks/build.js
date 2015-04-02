var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, paths, pkg;

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    pkg = config.pkg;
}

var clean = require('./clean');

function serverConfigFiles(){
    initConfig();
    var source = paths.source.root +'/' + '{CNAME,.htaccess,robots.txt}';
    return fs.copy(source, paths.site.root);
}
function html(replacements) {
    initConfig();
    var build = helper.matches(config.build, ['jade','mustache']);
    if (!build || !paths.site){
        log.info('Skipping build html');
        return Promise.resolve();
    }
    replacements = replacements || {};
    var Html = require('./wrappers/' + build);
    var htmlMinify = require('html-minifier').minify;
    var now = Date().split(' ').splice(0,5).join(' ');
    var version = replacements.version || config.pkg.version;
    var name = replacements.name || config.pkg.name;
    replacements.site = {now: now, version:version, name: name};
    var src = [];
    paths.demo && src.push(paths.demo.root + '/*.{html,jade,mustache,ms}');
    paths.source && src.push(paths.source.root + '/*.{html,jade,mustache,ms}');
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
    var build = helper.matches(config.build, ['fonts']);
    if (!build || !paths.site) {
        log.info('skipping build fonts');
        return Promise.resolve();
    }
    var location = [];
    paths.source && paths.source.fonts && location.push(paths.source.fonts + '/**/*.{eot,ttf,woff,svg}');
    paths.bower && paths.bower.fonts && location.push(paths.bower.fonts + '/**/*.{eot,ttf,woff,svg}');
    return fs.copy(location, paths.site.fonts);
}

function images() {
    initConfig();
    var build = helper.matches(config.build, ['images']);
    if (!build || !paths.site) {
        log.info('skipping build images');
        return Promise.resolve();
    }
    var location = [];
    paths.source && paths.source.images && location.push(paths.source.images + '/**/*');
    paths.demo && paths.demo.images && location.push(paths.demo.images + '/**/*');
    return fs.copy(location, paths.site.images);
}

function scripts(options){
    initConfig();
    var build = helper.matches(config.build, ['browserify','requirejs']);
    if (!build){
        log.info('skipping build scripts');
        return Promise.resolve();
    }
    var Scripts = require('./wrappers/' + build);
    options = options || config[build] || {};
    options.browserify = pkg.browserify;
    options.browser = pkg.browser;
    options["browserify-shim"] = pkg["browserify-shim"];
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
    var build = helper.matches(config.build, ['sass']);
    if (!build){
        log.info('Skipping build Sass');
        return Promise.resolve();
    }
    var Styles = require('./wrappers/' + build);
    options = options || (config[build]) || {};
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
    run: run,
    all: run
};
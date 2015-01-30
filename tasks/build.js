var Promise = require('es6-promise').Promise;
var chalk = require('chalk');
var findup = require('findup-sync');
var now = Date().split(' ').splice(0,5).join(' ');

var file = require('./utils/file');
var scripts = require('./utils/browserify');
var styles = require('./utils/sass');
var htmlConcat = require('./utils/html-concat');

var component = require(findup('component.config.js') || '../component-structure/component.config.js');
var paths = component.paths;

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function onSuccess(out) {
    console.log(chalk.green(out));
}

function html(version) {
    version = Array.isArray(version) ? version[0] : version;
    version = version || component.pkg.version;
    var src = [ paths.demo.root + '/index.html', paths.demo.root + '/*/*.html'];
    var dest = paths.site.root + '/index.html';
    return file.del(dest ).then(function(){
        return htmlConcat.create(src, dest)
    }).then(function(){
        return updateDocs({version:version});
    }).then(function(){
        return 'Build HTML Complete'
    });
}

function updateDocs(options){
    options = Array.isArray(options) ? options[0] : options
    if (!options || !options.version) onError({message:"build.updateDocs({version:'x.x.x'}) is required.\n got " + JSON.stringify(options)})
    var version = options.version;
    var htmlReplacements = [
        {replace : '{{ site.version }}', with: version},
        {replace : '{{ site.time }}', with: options.now || now}
    ];
    var mdReplacements = [
        {replace : /[0-9]+\.[0-9]+\.[0-9]/g, with: version}
    ].concat(htmlReplacements);

    return Promise.all([
        file.replace( [paths.site.root + '/**/*.html'], htmlReplacements)
        , file.replace( ['./README.md'], mdReplacements)
    ]).then(function(){
        return 'Build Docs Complete'
    });
}

function fonts() {
    var location = [
        paths.source.fonts + '/**/*',
        paths.bower.fonts + '/**/*.{eot,ttf,woff,svg}'
    ];
    var dest = paths.site.fonts;
    return file.del(dest + '/**/*').then(function() {
        return file.copy(location, dest)
    });
}

function images() {
    var src = paths.demo.images + '/**/*';
    var dest = paths.site.images;
    return file.del(dest + '/**/*').then(function(){
        return file.copy(src, dest);
    });
}

function buildScripts(){
    return file.del([paths.dist.scripts + '/**/*', paths.site.scripts + '/**/*']).then(function(){
        return Promise.all([
            new scripts(paths.source.scripts, paths.dist.scripts).write(),
            new scripts(paths.demo.scripts, paths.site.scripts).write(),
            new scripts(paths.source.scripts, paths.site.scripts).write()
        ])
    }).then(function(){
        return 'Build Scripts Complete'
    }).catch(onError);
}

function buildStyles(){
    return file.del([paths.dist.styles + '/**/*', paths.site.styles + '/**/*']).then(function() {
        return Promise.all([
            new styles(paths.source.styles, paths.dist.styles).write(),
            new styles(paths.source.styles, paths.site.styles).write(),
            new styles(paths.demo.styles, paths.site.styles).write()
        ]);
    }).then(function(){
        return 'Build Styles Complete'
    }).catch(onError);
}

function all(args){
    return Promise.all([
        buildScripts(),
        fonts(),
        images(),
        buildStyles(),
        html(args)
    ]).then(function(){
        return 'Build All Complete'
    });
}

module.exports = {
    html: html,
    styles: styles,
    scripts: buildScripts,
    images: images,
    fonts: fonts,
    updateDocs: updateDocs,
    all: all
};
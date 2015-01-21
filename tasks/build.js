var Promise = require('es6-promise').Promise;
var chalk = require('chalk');
var file = require('./utils/file');
var bower = require('./utils/bower');
var browserify = require('./utils/browserify');
var sass = require('./utils/sass');
var html = require('./utils/html');
var paths = require('../paths');
var now = Date().split(' ').splice(0,5).join(' ');
var pkg = require('../package.json'); //todo: should be parent package

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function onSuccess(out) {
    console.log(chalk.green(out));
}

function componentHtml() {
    var src = [ paths.demo.root + '/index.html', paths.demo.root + '/*/*.html'];
    var dest = paths.site['root']+ '/index.html'
    return file.del(dest ).then(function(){
        return html.create(src, dest)
    }).then(componentUpdateDocs);
}

function componentUpdateDocs(options){
    var version = options.version || pkg.version;
    var htmlReplacements = [
        {replace : '{{ site.version }}', with: version},
        {replace : '{{ site.time }}', with: options.now || now}
    ];
    var mdReplacements = [
        {replace : /[0-9]+\.[0-9]+\.[0-9]/g, with: version}
    ].concat(htmlReplacements);

    return Promise.all([
        file.replace( [paths.site['root'] + '/**/*.html'], htmlReplacements)
        , file.replace( ['./README.md'], mdReplacements)
    ]);
}

function componentFonts() {
    var location = [
        paths.source['fonts'] + '/**/*',
        paths.bower['fonts'] + '/**/*.{eot,ttf,woff,svg}'
    ];
    var dest = paths.site['fonts'];
    return file.del(dest + '/**/*').then(function() {
        return file.copy(location, dest)
    });
}

function componentImages() {
    var src = paths.demo['images'] + '/**/*';
    var dest = paths.site['images'];
    return file.del(dest + '/**/*').then(function(){
        return file.copy(src, dest);
    });
}

function componentJS(){
    return Promise.all([
        browserify.js(paths['source'].js, paths['dist'].js),
        browserify.js(paths['demo'].js, paths['site'].js),
        browserify.js(paths['source'].js, paths['site'].js)
    ]);
}

function componentJSMin(){
    return Promise.all([
        browserify.jsMin(paths['site'].js, paths['site'].js),
        browserify.jsMin(paths['dist'].js, paths['dist'].js)
    ]);
}

function componentJSAll(){
    return file.del([paths['dist'].js + '/**/*', paths['site'].js + '/**/*']).then(function(){
        return componentJS().then(componentJSMin)
    });
}

function componentSass(){
    return file.del([paths['dist'].css + '/**/*', paths['site'].css + '/**/*']).then(function() {
        return Promise.all([
            sass(paths['source'].sass, paths['dist'].css),
            sass(paths['demo'].sass, paths['site'].css),
            sass(paths['source'].sass, paths['site'].css)
        ]);
    });
}

function allComponentAssets(){
    return Promise.all([
        componentJS(),
        componentFonts(),
        componentImages(),
        componentSass(),
        componentHtml()
    ]);
}

module.exports = {
    html: componentHtml,
    css: componentSass,
    js: componentJSAll,
    images: componentImages,
    fonts: componentFonts,
    updateDocs: componentUpdateDocs,
    all: allComponentAssets
};
var Promise = require('es6-promise').Promise;
var file = require('./utils/file');
var browserify = require('./utils/browserify');
var sass = require('./utils/sass');
var paths = require('../paths');

function writeHTML(locationGlob, destinationPath){
    return file.glob(locationGlob).then(function(files){
        return file.concat(files)
    }).then(function(content){
        return file.write(destinationPath, 'index.html', content)
    });
}

function copyFile(location, destination){
    return file.glob(location).then(function(files){
        return file.copy(files, destination)
    });
}

function componentFonts() {
    var location = [
        paths.source['fonts'] + '/**/*',
        paths.bower['fonts'] + '/**/*.{eot,ttf,woff,svg}'
    ];
    return copyFile(location, paths.site['fonts'])
}

function componentImages() {
    return copyFile(paths.demo['images'] + '/**/*', paths.site['images'])
}

function componentHtml() {
    var location = [ paths.demo.root + '/index.html', paths.demo.root + '/*/*.html'];
    return writeHTML(location, paths.site.root)
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
        browserify.jsMin(paths['demo'].js, paths['demo'].js)
    ]);
}

function componentJSAll(){
    return componentJS().then(componentJSMin)
}

function componentSass(){
    return Promise.all([
        sass(paths['source'].sass, paths['dist'].css),
        sass(paths['demo'].sass, paths['site'].css),
        sass(paths['source'].sass, paths['site'].css)
    ]);
}

function component(){
    return Promise.all([
        componentJSAll(),
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
    component: component
};
var Promise = require('es6-promise').Promise;
var browserSync = require('browser-sync');
var file = require('./utils/file');
var paths = require('../paths');
var build = require('./build');

function loadBrowser(baseDir){
    var baseDir = Array.isArray(baseDir) ? baseDir[0] : baseDir;
    baseDir = baseDir || paths.site.root;
    browserSync({
        //proxy:'localhost:9876'
        port: 3456,
        server: {
            baseDir: baseDir
        }
    });
}

var buildAndReload = {
    html: function() {
        return build.html().then(browserSync.reload)
    },
    js: function() {
        return build.js().then(browserSync.reload)
    },
    css: function() {
        return build.css().then(browserSync.reload)
    }
}

var watch = function(){
    var htmlPaths = [ paths.demo['root'] + '/**/*.html'];
    var sassPaths = [ paths.source['sass'] + '/**/*', paths.demo['sass'] + '/**/*'];
    var jsPaths =   [ paths.source['js'] + '/**/*',   paths.demo['js'] + '/**/*'];
    file.watch(htmlPaths, [buildAndReload.html]);
    file.watch(sassPaths, [buildAndReload.css]);
    file.watch(jsPaths,   [buildAndReload.js]);
}

var serve = function(args){
    return new Promise(function(resolve, reject){
        loadBrowser(args);
        watch();
        resolve()
    })
}


module.exports = {
    quick: serve,
    all: function(args){
        return build.all().then(function(){
            return serve(args);
        })
    }
}
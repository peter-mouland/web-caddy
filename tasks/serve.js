var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var browserSync = require('browser-sync');
var file = require('./utils/file');

var build = require('./build');
var component = require(findup('component.config.js'));
var paths = component.paths;

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
    scripts: function() {
        return build.scripts().then(browserSync.reload)
    },
    styles: function() {
        return build.styles().then(browserSync.reload)
    }
}

function watch(){
    var htmlPaths = [ paths.demo.root + '/**/*.html'];
    var stylesPaths = [ paths.source.styles + '/**/*', paths.demo.styles + '/**/*'];
    var scriptsPaths =   [ paths.source.scripts + '/**/*',   paths.demo.scripts + '/**/*'];
    file.watch(htmlPaths, [buildAndReload.html]);
    file.watch(stylesPaths, [buildAndReload.styles]);
    file.watch(scriptsPaths,   [buildAndReload.scripts]);
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
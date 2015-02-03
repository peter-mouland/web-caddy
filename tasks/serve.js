var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var browserSync = require('browser-sync');
var nodemon = require('nodemon');
var chalk = require('chalk');
var file = require('./utils/file');

var build = require('./build');
var component = require(findup('component.config.js') || '../component-structure/component.config.js');
var paths = component.paths;

function info(msg) {
    console.log(chalk.cyan(msg));
}

function loadBrowser(args){
    args = Array.isArray(args) ? args[0] : args;
    var baseDir = args || component.serve || paths.site.root;
    console.log(args)
    startServer(args).then(function(proxy){
        var config = {
            port: 3456,
            server: {
                baseDir: baseDir
            }
        }
        if (proxy){
            config = { proxy: proxy.host, port:proxy.port }
        }
        browserSync(config);
    })
}

var buildAndReload = {
    html: function() {    return build.html().then(browserSync.reload)  },
    scripts: function() { return build.scripts().then(browserSync.reload)  },
    styles: function() {  return build.styles().then(browserSync.reload)   }
};

function startServer(args){
    var serve = args || component.serve;
    if (Array.isArray(serve) || typeof serve==='string') return Promise.resolve();
    return new Promise(function(resolve, reject){
        nodemon({
            script: serve.script,
            env: serve.env
        }).on('start', function(ee){
            info('Server Started')
            resolve(serve);
        });
    });
}

function watch(){
    var htmlPaths = [ ];
    var stylesPaths = [paths.source.styles + '/**/*' ];
    var scriptsPaths =   [paths.source.scripts + '/**/*' ];
    if (paths.demo){
        htmlPaths.push(paths.demo.root + '/**/*.html')
        stylesPaths.push(paths.demo.styles + '/**/*');
        scriptsPaths.push(paths.demo.styles + '/**/*');
    }
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
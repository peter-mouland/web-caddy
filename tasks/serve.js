var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var browserSync = require('browser-sync');
var nodemon = require('nodemon');
var fs = require('./utils/fs');
var log = require('./utils/log');
var build = require('./build');
var componentConfigPath = findup('component.config.js') || log.onError('You must have a component.config.js in the root of your project.');
var component = require(componentConfigPath);
var helper = require('./utils/config-helper');
var paths = helper.parsePaths(component.paths);

helper.configCheck(component);

function loadBrowser(options){
    options = Array.isArray(options) && options.length>0 ? options[0] : (component[component.serve]) || {};
    return startServer(options).then(function(){
        if (!options.server && !options.proxy){
            log.warn('component.config.js may be incorrect. please check');
        }
        browserSync(options);
    });
}

function startServer(options){
    if (!component.serve || component.serve === 'staticApp') return Promise.resolve();
    return new Promise(function(resolve, reject){
        nodemon(options).on('start', function(e){
            log.info('Server Started');
            resolve();
        });
    });
}

var buildAndReload = {
    html: function() {    return build.html().then(browserSync.reload);     },
    scripts: function() { return build.scripts().then(browserSync.reload);  },
    styles: function() {  return build.styles().then(browserSync.reload);   },
    images: function() {  return build.images().then(browserSync.reload);   }
};

function watch(){
    var htmlPaths = [ ];
    var stylesPaths = [paths.source.styles + '/**/*' ];
    var scriptsPaths =   [paths.source.scripts + '/**/*' ];
    var imagesPaths =   [paths.source.images + '/**/*' ];
    if (paths.demo){
        htmlPaths.push(paths.demo.root + '/**/*.{html,ms,mustache,jade}');
        stylesPaths.push(paths.demo.styles + '/**/*');
        scriptsPaths.push(paths.demo.styles + '/**/*');
        imagesPaths.push(paths.demo.images + '/**/*');
    }
    fs.watch(htmlPaths, [buildAndReload.html]);
    fs.watch(stylesPaths, [buildAndReload.styles]);
    fs.watch(scriptsPaths,   [buildAndReload.scripts]);
    fs.watch(imagesPaths,   [buildAndReload.images]);
}


function quick(args){
    return loadBrowser(args).then(function(){
        watch();
    });
}

module.exports = {
    quick: quick,
    all: function(args){
        return build.all().then(function(){
            return quick(args);
        });
    }
};
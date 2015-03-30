var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var component;

var browserSync = require('browser-sync');
var build = require('./build');

function start(options){
    component = helper.getConfig();
    options = options || (component[component.serve]) || {};
    return nodeApp(options).then(function(){
        if (!options.server && !options.proxy){
            log.warn('component.config.js may be incorrect. please check');
        }
        browserSync(options);
    });
}

function nodeApp(options){
    component = helper.getConfig();
    if (options.server) return Promise.resolve();
    var nodemon = require('nodemon');
    return new Promise(function(resolve, reject){
        nodemon(options).on('start', function(e){
            log.info('Server Started');
            resolve();
        });
    });
}

function buildAndReload(task){
    return function(){ build[task]().then(browserSync.reload); };
}

function watch(){
    if (!component.build) return;
    component = helper.getConfig();
    var paths = component.paths;
    var fs = require('./utils/fs');
    var htmlPaths = [ ];
    var stylesPaths = [paths.source.styles + '/**/*' ];
    var imagesPaths =   [paths.source.images + '/**/*' ];
    if (paths.demo){
        htmlPaths.push(paths.demo.root + '/**/*.{html,ms,mustache,jade}');
        stylesPaths.push(paths.demo.styles + '/**/*');
        imagesPaths.push(paths.demo.images + '/**/*');
    }
    fs.watch(htmlPaths, [buildAndReload('html')]);
    fs.watch(stylesPaths, [buildAndReload('styles')]);
    fs.watch(imagesPaths,   [buildAndReload('images')]);
    //todo: use configHelper.matches on merge
    if (component.build.scripts=='browserify' ){
        new Browserify(paths.source.scripts, paths.site.scripts).watch().catch(log.onError);
        if (paths.demo && paths.demo.scripts){
            new Browserify(paths.demo.scripts, paths.site.scripts).watch().catch(log.onError);
        }
    } else {
        var scriptsPaths = [paths.source.scripts + '/**/*' ];
        paths.demo && scriptsPaths.push(paths.demo.scripts + '/**/*');
        fs.watch(scriptsPaths,   [buildAndReload('scripts')]);
    }
}

function adhoc(path){
    component = helper.getConfig();
    //todo: test if path ext is js or html
    //    : if html serve staticApp
    //    : if js serve nodeApp
    component.serve = 'staticApp';
    return start({
        server: { baseDir : path },
        port: 3456
    });
}

function run(args){
    return start(args).then(function(){
        watch();
    }).catch(log.onError);
}

module.exports = {
    run: run,
    all: run,
    adhoc: adhoc
};
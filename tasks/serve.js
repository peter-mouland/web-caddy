var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var config;

var browserSync = require('browser-sync');
var build = require('./build');

function start(options){
    config = helper.getConfig();
    options = options || (config[config.serve]) || {};
    return nodeApp(options).then(function(){
        if (!options.server && !options.proxy){
            log.warn('caddy.config.js may be incorrect. please check');
        }
        browserSync(options);
    });
}

function nodeApp(options){
    config = helper.getConfig();
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
    if (!config.build) return;
    config = helper.getConfig();
    var paths = config.paths;
    var fs = require('./utils/fs');
    var htmlPaths = [ paths.source + '/**/*.{html,ms,mustache,jade}'];
    var stylesPaths = [paths.source.styles + '/**/*' ];
    var imagesPaths =   [paths.source.images + '/**/*' ];
    if (paths.demo){
        htmlPaths.push(paths.demo + '/**/*.{html,ms,mustache,jade}');
        stylesPaths.push(paths.demo.styles + '/**/*');
        imagesPaths.push(paths.demo.images + '/**/*');
    }
    fs.watch(htmlPaths, [buildAndReload('html')]);
    fs.watch(stylesPaths, [buildAndReload('styles')]);
    fs.watch(imagesPaths,   [buildAndReload('images')]);
    //todo: use configHelper.matches on merge
    if (config.build.scripts=='browserify' || (
        config.build.indexOf && config.build.indexOf('browserify')>-1) ){
        new Browserify(paths.source.scripts, paths.target.scripts).watch(browserSync);
        if (paths.demo && paths.demo.scripts){
            new Browserify(paths.demo.scripts, paths.target.scripts).watch(browserSync);
        }
    } else {
        var scriptsPaths = [paths.source.scripts + '/**/*' ];
        paths.demo && scriptsPaths.push(paths.demo.scripts + '/**/*');
        fs.watch(scriptsPaths,   [buildAndReload('scripts')]);
    }
}

function adhoc(path){
    config = helper.getConfig();
    //todo: test if path ext is js or html
    //    : if html serve staticApp
    //    : if js serve nodeApp
    config.serve = 'staticApp';
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
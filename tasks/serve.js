var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var browserSync = require('browser-sync');
var build = require('./build');
var config, paths, globs, pkg;

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    globs = config.globs;
    pkg = config.pkg;
}

function start(options){
    initConfig();
    options = options || (config[config.serve]) || {};
    options.server = options.server || { baseDir : paths.target };
    return nodeApp(options).then(function(){
        log.warn('Server Started :');
        if (!options.server && !options.proxy){
            log.warn('caddy.config.js may be incorrect. please check');
        }
        browserSync(options);
    });
}

function nodeApp(options){
    initConfig();
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
    initConfig();
    var paths = config.paths;
    var fs = require('./utils/fs');
    var htmlPaths = [ globs.source.html.replace('*.{','**/*.{') ];
    var stylesPaths = [globs.source.styles.replace('{.,*}','**').replace('!(_)','') ];
    if (paths.demo){
        htmlPaths.push(globs.demo.html.replace('*.{','**/*.{'));
        stylesPaths.push(globs.demo.styles.replace('{.,*}','**').replace('!(_)',''));
    }
    fs.watch(htmlPaths, [buildAndReload('html')]);
    fs.watch(stylesPaths, [buildAndReload('styles')]);

    if (helper.matches(config.build, ['browserify'])){
        new Browserify(globs.source.scripts, paths.target).watch(browserSync);
        if (paths.demo){
            new Browserify(globs.demo.scripts, paths.target).watch(browserSync);
        }
    } else if (helper.matches(config.build, ['requirejs'])){
        var scriptsPaths = [globs.source.scripts.replace('{.,*}','**') ];
        paths.demo && scriptsPaths.push(globs.demo.scripts.replace('{.,*}','**'));
        fs.watch(scriptsPaths,   [buildAndReload('scripts')]);
    }
}

function adhoc(baseDir){
    initConfig();
    //todo: test if path ext is js or html
    //    : if html serve staticApp
    //    : if js serve nodeApp
    config.serve = 'staticApp';
    return start({
        server: { baseDir : baseDir }
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
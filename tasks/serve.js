var utils = require('./utils/common');
var paths = utils.paths;
var Promise = utils.Promise;
var pkg = utils.pkg;
var log = utils.log;
var component = utils.component;

var browserSync = require('browser-sync');
var build = require('./build');

function start(options){
    options = Array.isArray(options) && options.length>0 ? options[0] : (component[component.serve]) || {};
    return nodeApp(options).then(function(){
        if (!options.server && !options.proxy){
            log.warn('component.config.js may be incorrect. please check');
        }
        browserSync(options);
    });
}

function nodeApp(options){
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
    var fs = require('./utils/fs');
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
    fs.watch(htmlPaths, [buildAndReload('html')]);
    fs.watch(stylesPaths, [buildAndReload('styles')]);
    fs.watch(scriptsPaths,   [buildAndReload('scripts')]);
    fs.watch(imagesPaths,   [buildAndReload('images')]);
}

function adhoc(path){
    //todo: test if path ext is js or html
    //    : if html serve staticApp
    //    : if js serve nodeApp
    component.serve = 'staticApp';
    return start([{
        server: { baseDir : path },
        port: 3456
    }]);
}

function run(args){
    return start(args).then(function(){
        watch();
    });
}

module.exports = {
    run: run,
    adhoc: adhoc
};
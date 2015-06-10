var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var browserSync = require('browser-sync');
var extend = require('util')._extend;
var build = require('./build');
var config, paths, globs, pkg, serve = {};

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    globs = config.globs;
    pkg = config.pkg;
}

function getWatchOptions(options){
    var files = [];
    var htmlPaths = [ globs.source.html.replace('*.{','**/*.{') ];
    var stylesPaths = [globs.source.styles.replace('{.,*}','**').replace('!(_)','') ];
    var scriptsPaths = [globs.source.scripts.replace('{.,*}','**') ];
    if (paths.demo){
        htmlPaths.push(globs.demo.html.replace('*.{','**/*.{'));
        stylesPaths.push(globs.demo.styles.replace('{.,*}','**').replace('!(_)',''));
        scriptsPaths.push(globs.demo.scripts.replace('{.,*}','**'));
    }
    var chokidarOptions = {
        persistent: true
    };
    var callBack = function(task){
        return function(event, file){
            switch (event) {
                case 'change':
                    log.info(['Watch: `' + file + '` changed'].join('\n'));
                    options.reload = browserSync.reload;
                    build[task](options).catch(log.onError);
                    break;
                default :
                    log.info('   * ' + ((event=='add')?'watch':event) + ' ' + file);
                    break;
            }
        };
    };
    files.push({ match: htmlPaths, fn: callBack('html'), options: chokidarOptions });
    files.push({ match: stylesPaths, fn: callBack('styles'), options: chokidarOptions });
    if (helper.matches(config.tasks.build, ['browserify'])) {
        browserifyWatch();
    } else {
        files.push({ match: scriptsPaths, fn: callBack('scripts'), options: chokidarOptions });
    }
    return files;
}

function startBrowserSync(options) {
    log.info(' * Started');
    options.files = getWatchOptions(options);
    browserSync(options); //todo: http://www.browsersync.io/docs/api/
}

function browserifyWatch(){
    (new Browserify(globs.source.scripts, paths.target)).watch(browserSync);
    if (paths.demo){
        (new Browserify(globs.demo.scripts, paths.target)).watch(browserSync);
    }
}

function nodeApp(options){
    var nodemon = require('nodemon');
    return new Promise(function(resolve, reject){
        nodemon(options).on('start', function(e){
            resolve(options);
        });
    });
}

serve.adhoc = function (baseDir){
    if (baseDir.split('.').pop() === 'js'){
        return serve.staticApp({
            server: { baseDir : baseDir }
        });
    } else {
        return serve.nodeApp({
            script: baseDir
        });
    }
};

serve.staticApp = function(options){
    if (!options.server) options.server = { baseDir : paths.target };
    return startBrowserSync(options);
};

serve.nodeApp = function(options){
    if (!options.proxy) options.proxy = 'http://localhost:3000';
    if (!options.port) options.port = 3001;
    return nodeApp(options).then(startBrowserSync);
};

serve.all = function (options){
    options = extend(config[config.tasks.serve] || {}, options);
    return serve[config.tasks.serve](options);
};

function exec(task, options){
    initConfig();
    options = options || {};
    if (!config.tasks.serve) return Promise.resolve();
    log.info('Server :');
    return serve[task](options);
}

module.exports = {
    adhoc: function(options){ return exec('adhoc', options); },
    all:  function(options){ return exec('all', options); }
};
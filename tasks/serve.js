var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var browserSync = require('browser-sync');
var build = require('./build');
var config, paths, globs, pkg, serve = {};

function initConfig(){
    config = helper.getConfig();
    paths = config.paths;
    globs = config.globs;
    pkg = config.pkg;
}

function getWatchOptions(){
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
                    log.info(['Watch: File `' + file + '` has been changed, running build.' + task + '()'].join('\n'));
                    build(task).then(browserSync.reload);
                    break;
                default :
                    log.info(' * ' + event + ' ' + file);
                    break;
            }
        };
    };
    files.push({ match: htmlPaths, fn: callBack('html'), options: chokidarOptions });
    files.push({ match: stylesPaths, fn: callBack('styles'), options: chokidarOptions });
    if (helper.matches(config.build, ['browserify'])) {
        browserifyWatch();
    } else {
        files.push({ match: scriptsPaths, fn: callBack('scripts'), options: chokidarOptions });
    }
    return files;
}

function start(options){
    options = options || (config[config.serve]) || {};
    //todo: test: does this now work as nodeApp??
    options.server = options.server || { baseDir : paths.target };
    return nodeApp(options).then(function(){
        log.warn('Server Started :');
        if (!options.server && !options.proxy){ //todo: now a problem?
            log.warn('caddy.config.js may be incorrect. please check');
        }
        options.files = getWatchOptions();
        browserSync(options);
    });
}

function browserifyWatch(){
    new Browserify(globs.source.scripts, paths.target).watch(browserSync);
    if (paths.demo){
        new Browserify(globs.demo.scripts, paths.target).watch(browserSync);
    }
}

function nodeApp(options){
    if (options.server) return Promise.resolve();
    var nodemon = require('nodemon');
    return new Promise(function(resolve, reject){
        nodemon(options).on('start', function(e){
            log.info('Server Started');
            resolve();
        });
    });
}

serve.adhoc = function adhoc(baseDir){
    //todo: test if path ext is js or html
    //    : if html serve staticApp
    //    : if js serve nodeApp
    config.serve = 'staticApp';
    return start({
        server: { baseDir : baseDir }
    });
};

serve.all = function all(args){
    return start(args).catch(log.onError);
};

function exec(task, options){
    initConfig();
    if (!config.serve) return Promise.resolve();
    log.info('Serving :');
    if (serve[task]) return serve[task](options);
    //if (!serve[task]) return help[task](options);
}

module.exports = {
    adhoc: function(options){ return exec('adhoc', options); },
    all:  function(options){ return exec('all', options); }
};
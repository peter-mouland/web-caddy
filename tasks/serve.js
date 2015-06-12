var Promise = require('es6-promise').Promise;
var path = require('path');
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var browserSync = require('browser-sync');
var extend = require('util')._extend;
var build = require('./build');
var config, serve = {};

function getWatchOptions(options){
    var files = [],
        htmlPaths = [],
        stylesPaths = [],
        scriptsPaths = [];
    config.buildPaths.forEach(function(pathObj, i){
        htmlPaths.push(path.join(pathObj.source, config.globs.html.replace('*.{','**/*.{')));
        stylesPaths.push(path.join(pathObj.source, config.globs.styles.replace('{.,*}','**').replace('!(_)','')));
        scriptsPaths.push(path.join(pathObj.source, config.globs.scripts.replace('{.,*}','**')));
    });
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
                    //todo: verbose mode?
                    //log.info('   * ' + ((event=='add')?'watch':event) + ' ' + file);
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
    config.buildPaths.forEach(function(pathObj, i){
        var src = path.join(pathObj.source, config.globs.scripts);
        pathObj.targets.forEach(function(target){
            new Browserify(src, target).watch(browserSync);
        });
    });
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
        return serve.nodeApp({
            script: baseDir
        });
    } else {
        return serve.staticApp({
            server: { baseDir : baseDir }
        });
    }
};

serve.staticApp = function(options){
    if (!options.server) {
        var targets = '';
        config.buildPaths.forEach(function(pathObj){ targets += ',' + pathObj.targets.join(',');});
        targets = targets.split(',').filter(function removeDuplicates(elem, pos, self) {
            return self.indexOf(elem) === pos && elem !== '';
        });
        options.server = { baseDir : targets };
    }
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
    config = helper.getConfig();
    options = options || {};
    if (!config.tasks.serve) return Promise.resolve();
    log.info('Server :');
    return serve[task](options);
}

module.exports = {
    adhoc: function(options){ return exec('adhoc', options); },
    all:  function(options){ return exec('all', options); }
};
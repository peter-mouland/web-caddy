var Promise = require('es6-promise').Promise;
var path = require('path');
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var Browserify = require('./wrappers/browserify.js');
var browserSync = require('browser-sync').create();
var extend = require('util')._extend;
var build = require('./build');
var config, serve = {};

function getWatchOptions(options){
    var files = [],
        htmlPaths = [],
        stylesPaths = [],
        scriptsPaths = [];
    config.buildPaths.forEach(function(pathObj, i){
        htmlPaths.push(path.join(pathObj.source,    '**/*.{html,jade,ms,mustache}'));
        stylesPaths.push(path.join(pathObj.source,  '**/*.{css,scss,sass}'));
        scriptsPaths.push(path.join(pathObj.source, '**/*.js'));
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
                    if (options.verbose){
                        log.info('   * ' + ((event=='add')?'watch':event) + ' ' + file);
                    }
                    break;
            }
        };
    };
    files.push({ match: htmlPaths, fn: callBack('html'), options: chokidarOptions });
    files.push({ match: stylesPaths, fn: callBack('styles'), options: chokidarOptions });
    if (helper.matches(config.tasks.build, ['browserify'])) {
        browserifyWatch(options);
    } else {
        files.push({ match: scriptsPaths, fn: callBack('scripts'), options: chokidarOptions });
    }
    return files;
}

function startBrowserSync(options) {
    log.info(' * Started');
    options.files = getWatchOptions(options);
    browserSync.init(options);
}

function browserifyWatch(options){
    config.buildPaths.forEach(function(pathObj, i){
        var src = path.join(pathObj.source, config.buildGlobs.scripts);
        new Browserify(src, pathObj.target, options).watch(browserSync);
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

serve.staticApp = function(options){
    if (!options.server) {
        var targets = config.buildPaths.map(function(pathObj){ return pathObj.target;});
        targets = targets.filter(function removeDuplicates(elem, pos, self) {
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

serve.all = function (baseDir){
    if (!baseDir) log.onError('Please pass either a node server file or a static directtory to serve');
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

function exec(options){
    config = helper.getConfig();
    if (!config.tasks.serve) return Promise.resolve();

    log.info('Server :');
    if (['all','nodeApp','staticApp'].indexOf(options)<0) {
        return serve.all(options);
    } else {
        options = extend(config[config.tasks.serve] || {}, options);
        return serve[config.tasks.serve](options);
    }
}

module.exports = exec;
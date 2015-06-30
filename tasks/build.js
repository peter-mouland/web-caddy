var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var helper = require('./utils/config-helper');
var extend = require('util')._extend;
var path = require('path');
var clean = require('./clean');
var config, build = {};

build.htmlMin = function htmlMin(source, target, options) {
    var htmlWrapper = helper.matches(config.tasks.build, ['html-min']);
    if (!htmlWrapper) return Promise.resolve();
    log.info(' * HTML Min');

    var Fn = require('./wrappers/html-min');
    return (new Fn(source, target, options)).write().catch(log.onError);
};

build.html = function html(source, target, options) {
    var wrapper = helper.matches(config.tasks.build, ['jade','mustache']);
    if (!wrapper) return Promise.resolve();
    log.info(' * HTML: ' + source);

    options.now = Date().split(' ').splice(0,5).join(' ');
    options.pkg = extend(config.pkg || {}, options.pkg || {}); //allow nodeAPI to be ruler of config
    var Fn = require('./wrappers/' + wrapper);
    return (new Fn(source, target, options)).write().catch(log.onError);
};

build.scripts = function scripts(source, target, options){
    var wrapper = helper.matches(config.tasks.build, ['browserify','requirejs']);
    if (!wrapper) return Promise.resolve();
    log.info(' * Scripts');

    options.browserify = config.pkg.browserify;
    options.browser = config.pkg.browser;
    options["browserify-shim"] = config.pkg["browserify-shim"];

    var Fn = require('./wrappers/' + wrapper);
    return (new Fn(source, target, options)).write().catch(log.onError);
};

build.styles = function styles(source, target, options){
    var wrapper = helper.matches(config.tasks.build, ['sass']);
    if (!wrapper) return Promise.resolve();
    log.info(' * Styles');

    options.appRoot = config.appRoot;
    var Fn = require('./wrappers/' + wrapper);
    return (new Fn(source, target, options)).write().catch(log.onError);
};

var prepare = {
    all: function(){ return clean.build(); },
    noop: function(){ return Promise.resolve(); }
};

//pipe all task execution through here to unify task prep and config normalisation
function exec(subtask, source, target, options){
    config = helper.getConfig();
    //get out if config does not exist && node API did not pass a source/target
    //if (!config.tasks.build && task == 'all') return Promise.resolve();
    if (subtask == 'all' && source) log.onError('Please refrain from using `.all`. from the NodeJS script');
    if (!config.tasks.build && !source) return Promise.resolve();

    //do prep-task then do copy task
    return (prepare[subtask] || prepare.noop)().then(function(){
        log.info('Building :' );
        subtask = (subtask === 'all') ? ['html', 'styles', 'scripts'] : subtask;
        //normalise the args into an array of tasks
        var tasks = helper.normaliseBuild(subtask, config, source, target, options || { });
        var promises = tasks.map(function(params){
            return build[params.subTask](params.source, params.target, params.options).then(params.options.reload).catch(log.warn);
        });
        return Promise.all(promises);
    }).catch(log.onError);
}

module.exports = {
    html: function(source, target, options){ return exec('html', source, target, options); },
    styles:  function(source, target, options){ return exec('styles', source, target, options); },
    scripts:  function(source, target, options){ return exec('scripts', source, target, options); },
    all:  function(source, target, options){     return exec('all', source, target, options); }
};
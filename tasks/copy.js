var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, copy = {};

function copyFiles(fileType, glob){
    var promises = [];
    config.buildPaths.forEach(function(pathObj, i){
        pathObj.targets.forEach(function(target, i){
            var src = path.join(pathObj.source, glob || config.globs[fileType]);
            promises.push(fs.glob(src).then(function(fileObjs){
                log.info(' * ' + src + ' > ' + target);
                var promises = [];
                fileObjs.forEach(function(fileObj){
                    var outFile = path.join(target, fileObj.relativeDir);
                    promises.push(fs.copy(fileObj.path, outFile));
                });
                return promises;
            }));
        });
    });
    return promises;
}
copy.adhoc = function images() {
    if (!config.tasks.copy) return Promise.resolve();
    var promises = [];

    if (config.tasks.copy.indexOf('server-config')>-1) {
        log.warn('Please update caddy.config.js\nReplace \'server-config\' with : \'/*{CNAME,.htaccess,robots.txt,manifest.json}\'')
    }
    config.tasks.copy.forEach(function(copy){
        return copyFiles('other', copy);
    });
    return Promise.all(promises);
};

copy.all = function all(){
    return copy.adhoc().catch(log.warn);
};

var prepare = {
    all: function(){ return clean.copy(); },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, options){
    config = helper.getConfig();
    options = options || {};
    if (!config.tasks.copy) return Promise.resolve();
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Copying :');
        return copy[task](options);
    });
}

module.exports = {
    'server-config': function(options){ return exec('serverConfig', options); },
    'other': function(options){ return exec('other', options); },
    fonts:  function(options){ return exec('fonts', options); },
    images:  function(options){ return exec('images', options); },
    all:  function(options){ return exec('all', options); }
};

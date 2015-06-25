var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, copy = {};

copy.files = function(pathObj, options){
    //allow singular or plural (strings or arrays)
    if (!pathObj.targets) pathObj.targets = [pathObj.target];
    if (!options.globs) options.globs = [options.glob];

    //for each glob, find each match in the source and copy to the target
    var promises = options.globs.map(function(glob){
        return fs.glob(path.join(pathObj.source, glob));
    });

    return Promise.all(promises)
        .then(function reducePromiseArrays(promiseResults){
            return promiseResults.reduce(function(a, b) {
                return a.concat(b);
            });
        })
        .then(function copyFilesToTargets(fileObjs){
            var promises = [];
            fileObjs.forEach(function(fileObj){
                pathObj.targets.forEach(function(target, i){
                    var outFile = path.join(target, fileObj.relativeDir);
                    log.info(' * ' + pathObj.source + '/'  + fileObj.name + ' > ' + outFile + '/' + fileObj.name);
                    promises.push(fs.copy(fileObj.path, outFile));
                });
            });
            return Promise.all(promises);
        })
};

copy.all = function all(pathsObj, options) {
    var promises = [];
    pathsObj.forEach(function(pathObj, i) {
        promises.push(copy.files(pathObj, options));
    });
    return Promise.all(promises);
};

//individual prep-tasks. can be custom for each function
var prepare = {
    all: function(){ return clean.copy(); },
    noop: function(){ return Promise.resolve(); }
};

function exec(task, pathObj, options){
    config = helper.getConfig();

    //get out if config does not exist && node API did not pass a pathObj
    if (!config.tasks.copy && !pathObj) return Promise.resolve();

    //set default options for when called using CLI
    options = options || { globs: config.tasks.copy };
    pathObj = pathObj || config.buildPaths;

    //do prep-task then do copy task
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Copying :');
        return copy[task](pathObj, options);
    }).catch(log.onError);
}

//force all function calls through exec so we can set default options + get config once.
module.exports = {
    all:  function(pathObj, options){ return exec('all', pathObj, options); },
    files:  function(pathObj, options){ return exec('files', pathObj, options); }
};

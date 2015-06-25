var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var clean = require('./clean');
var config, copy = {};

copy.files = function(source, target, options){
    log.info(' * ' + source + ' > ' + target);
    return fs.glob(source)
        .then(function copyFilesToTargets(fileObjs){
            var promises = fileObjs.map(function(fileObj){
                var outFile = path.join(target, fileObj.relativeDir);
                if (options.verbose){
                    log.info('   * ' + fileObj.path + ' > ' + outFile + '/' + fileObj.name);
                }
                return fs.copy(fileObj.path, outFile);
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

//pipe all task execution through here to unify task prep and config normalisation
function exec(task, source, target, options){
    config = helper.getConfig();
    //get out if config does not exist && node API did not pass a source/target
    if (!config.tasks.copy && !source) return Promise.resolve();

    //normalise the args into an array of tasks
    var tasks = helper.normaliseArgs('copy', config, source, target, options || { });

    //do prep-task then do copy task
    return (prepare[task] || prepare.noop)().then(function(){
        log.info('Copying :');
        var promises = tasks.map(function(taskParams){
            return copy[task](taskParams.source, taskParams.target, taskParams.options)
        });
        return Promise.all(promises);
    }).catch(log.onError);
}

//force all function calls through exec so we can set default options + get config once.
module.exports = {
    all:  function(source, target, options){ return exec('all', source, target, options); },
    files:  function(source, target, options){ return exec('files', source, target, options); }
};

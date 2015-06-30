var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var fs = require('./utils/fs');
var path = require('path');
var helper = require('./utils/config-helper');
var config;

function copy(source, target, options){
    log.info(' * ' + source + ' > ' + target);
    return fs.glob(source)
        .then(function copyFilesToTarget(fileObjs){
            var promises = fileObjs.map(function(fileObj){
                var outFile = path.join(target, fileObj.relativeDir);
                if (options.verbose){
                    log.info('   * ' + fileObj.path + ' > ' + outFile + '/' + fileObj.name);
                }
                return fs.copy(fileObj.path, outFile);
            });
            return Promise.all(promises);
        });
}

//pipe all task execution through here to unify task prep and config normalisation
function exec(subTask, source, target, options){
    var tasks = [];
    config = helper.getConfig();
    //get out if config does not exist && node API did not pass a source/target
    if (!config.tasks.copy && !source) return Promise.resolve();

    //normalise the args into an array of tasks
    if (source){  //from node API
        tasks = [{ source: source, target: target, options: options|| { }}];
    } else {  //from node CLI
        tasks = helper.normaliseCopy(subTask, config, options || { });
    }

    log.info('Copying :');
    var promises = tasks.map(function(params){
        return copy(params.source, params.target, params.options);
    });
    return Promise.all(promises).catch(log.onError);
}

//force all function calls through exec so we can set default options + get config once.
module.exports = {
    all:  function(source, target, options){ return exec('all', source, target, options); },
    files:  function(source, target, options){ return exec('files', source, target, options); }
};

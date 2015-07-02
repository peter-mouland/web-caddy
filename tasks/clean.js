var Promise = require('es6-promise').Promise;
var path = require('path');
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config;

function clean(location, options){
    log.info(' * ' + location);
    return fs.del(location, options).then(function(delPaths){
        if (options.verbose && delPaths.length){
            delPaths.forEach(function(delPath){
                log.info('    * ' + delPath.replace(config.appRoot,''));
            });
        }
    });
}

//pipe all task execution through here to unify config normalisation
function exec(subtask, location, options){
    var tasks;
    config = helper.getConfig();

    var globsArr = [config.buildGlobs[subtask]];
    if (subtask==='copy') globsArr = config.tasks.copy;
    if (subtask==='build') globsArr = Object.keys(config.buildGlobs).map(function(key){ return config.buildGlobs[key]; });
    if (subtask==='all') globsArr = ['/**'];

    //normalise the args into an array of tasks
    if (location && typeof location === 'object'){  //from node API
        tasks = [{ source: globsArr, options: location}];
    } else if (location && typeof location != 'object'){  //from node API
        tasks = [{ source: location, options: options || { }}];
    } else {  //from node CLI
        tasks = helper.normaliseClean(globsArr, config.buildPaths, options || { });
    }

    //do prep-task then do copy task
    log.info('Cleaning :');
    var promises = tasks.map(function(params){
        return clean(params.source, params.options);
    });
    return Promise.all(promises).catch(log.onError);
}

module.exports = {
    'copy': function(location, options){ return exec('copy', location, options || arguments[2]); },
    'build': function(location, options){ return exec('build', location, options || arguments[2]); },
    'html': function(location, options){ return exec('html', location, options || arguments[2]); },
    'styles': function(location, options){ return exec('styles', location, options || arguments[2]); },
    'scripts': function(location, options){ return exec('scripts', location, options || arguments[2]); },
    'all': function(location, options){ return exec('all', location, options || arguments[2]); }
};
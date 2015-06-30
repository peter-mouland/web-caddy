var Promise = require('es6-promise').Promise;
var path = require('path');
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, clean = {};

function setTargets(buildPaths){ //todo: use reduce
    // return buildPaths.reduce(function(accum, current) {
    //    if (accum.indexOf(current) < 0) {
    //        accum.push(current);
    //    }
    //    return accum;
    //}
    var targets = [];
    buildPaths.forEach(function(pathObj, i){
        if (targets.indexOf(pathObj.target)<0) {
            targets.push(pathObj.target);
        }
    });
    return targets;
}

function delType(fileType, msg){
    log.info(msg);
    var targets = setTargets(config.buildPaths);
    var promises = targets.map(function(target){
        return fs.del(path.join(target, config.globs[fileType]));
    });
    return Promise.all(promises);
}

clean.html = function html(){
    return delType('html', ' * html');
};

clean.styles = function styles(){
    return delType('styles', ' * Styles');
};

clean.scripts =  function scripts(){
    return delType('scripts', ' * Scripts');
};

clean.adhoc = function adHoc(location, options){
    log.info(' * adHoc : ' + location);
    return fs.del(location);
};

clean.all = function all(){
    return Promise.all([clean.copy(), clean.build()]).catch(log.onError);
};

clean.build = function build(){
    return Promise.all([clean.html(), clean.styles(), clean.scripts()]).catch(log.onError);
};

clean.copy = clean.adhoc;

//pipe all task execution through here to unify task prep and config normalisation
function exec(task, location, options){
    var tasks;
    config = helper.getConfig();

    //normalise the args into an array of tasks
    if (location){  //from node API
        tasks = [{ location: location, options: options}];
    } else {  //from node CLI
        tasks = helper.normaliseCopy(task, config, options || { }, 'target');
    }

    //do prep-task then do copy task
    log.info('Cleaning :');
    var promises = tasks.map(function(params){
        return clean[task](params.source, params.options);
    });
    return Promise.all(promises).catch(log.onError);
}

module.exports = {
    'adhoc': function(location, options){ return exec('adhoc', location, options); },
    'copy': function(location, options){ return exec('copy', location, options); },
    'build': function(location, options){ return exec('build', location, options); },
    'html': function(location, options){ return exec('html', location, options); },
    'styles': function(location, options){ return exec('styles', location, options); },
    'scripts': function(location, options){ return exec('scripts', location, options); },
    'all': function(location, options){ return exec('all', location, options); }
};
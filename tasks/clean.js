var Promise = require('es6-promise').Promise;
var path = require('path');
var log = require('./utils/log');
var fs = require('./utils/fs');
var helper = require('./utils/config-helper');
var config, clean = {};

function setTargets(buildPaths){
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

clean.test = function test(){
    log.info(' * Test report');
    return fs.del(config.globs.testCoverage);
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
function exec(task, source, target, options){
    config = helper.getConfig();

    //normalise the args into an array of tasks
    if (source){  //from node API
        tasks = [{ source: source, target: target, options: options}];
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
    'adhoc': function(source, target, options){ return exec('adhoc', source, target, options); },
    'copy': function(source, target, options){ return exec('copy', source, target, options); },
    'build': function(source, target, options){ return exec('build', source, target, options); },
    'test': function(source, target, options){ return exec('test', source, target, options); },
    'html': function(source, target, options){ return exec('html', source, target, options); },
    'styles': function(source, target, options){ return exec('styles', source, target, options); },
    'scripts': function(source, target, options){ return exec('scripts', source, target, options); },
    'all': function(source, target, options){ return exec('all', source, target, options); }
};
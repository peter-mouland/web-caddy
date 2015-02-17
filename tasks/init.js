var log = require('./utils/log');
var exec = require('./utils/exec').exec;
var git = require('./utils/git');
var bower = require('./utils/bower');


function initBower(){
    return bower.register().catch(function(err){
        log.onError('Error: Bower Register ' + err);
    });
}

function initGit(repo){
    log.info("\nInitialising Git ... \n");
    return git.init().then(function(output){
        log.onSuccess(output);
        return git.add(['.']);
    }).then(function(output){
        log.onSuccess(output);
        return git.commit('first commit');
    }).then(function(output){
        log.onSuccess(output);
        return  git.remote(['add', 'origin', repo]);
    }).then(function(output){
        log.onSuccess(output);
        return git.push(['-u', 'origin', 'master']);
    }).catch(log.onError);
}

function initGhPages(){
    log.info("\nInitialising gh-pages ... \n");
    return git.checkout(['--orphan', 'gh-pages']).then(function(output){
        log.onSuccess(output);
        return git.rm(['-rf', '.']);
    }).then(function(output){
        log.onSuccess(output);
        return exec('touch',['gh-pages-initialised.md']);
    }).then(function(output){
        log.onSuccess(output);
        return git.add(['gh-pages-initialised.md']);
    }).then(function(output){
        log.onSuccess(output);
        return git.commit('Init gh-pages');
    }).then(function(output){
        log.onSuccess(output);
        return git.push(['--set-upstream','origin','gh-pages']);
    }).then(function(output){
        log.onSuccess(output);
        return git.checkout(['master']);
    }).catch(log.onError)
}

module.exports = {
    bower: initBower,
    git: initGit,
    ghPages: initGhPages
}
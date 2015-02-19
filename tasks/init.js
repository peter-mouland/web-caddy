var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var exec = require('./utils/exec').exec;
var git = require('./utils/git');
var fs = require('./utils/fs');
var bower = require('./utils/bower');
var shell = require("shelljs");
var prompt = require("prompt");
var findup = require('findup-sync');

function initBower(){
    return bower.register().catch(function(err){
        log.onError('Error: Bower Register ' + err);
    });
}

function localGit(){
    log.info("\nInitialising Git Locally... \n");
    return git.init().then(function(output){
        log.onSuccess(output);
        return git.add(['.']);
    }).then(function(output){
        log.onSuccess(output);
        return git.commit('first commit');
    }).catch(log.onError);
}

function askForGitRepo(gitRepo){
    return new Promise(function(resolve, reject){
        if (gitRepo && gitRepo.length>0) resolve(gitRepo)
        prompt.colors = false;
        prompt.start();
        prompt.get([{
            description: 'GitHub Repository SSH URL',
            name: 'repo'
        }], function(err, result) {
            if (!result) resolve('');
            var gitUrlMatch = result.repo.match(/.com\:(.*)\//);
            if (!gitUrlMatch){
                resolve('');
            }
            resolve(result.repo)
        });
    });
}

function replaceGitVariables(repo, componentName){
    var repoMatch = repo && repo.match(/.com\:(.*)\//);
    if (!repoMatch){
        log.info(
            ['Github Repository URL invalid:',
                'When you are ready to push to git, Please run:',
                '`component init remoteGit` '
            ].join('\n'));
        return Promise.resolve();
    }
    var SSH = (repoMatch) ? repo : '{{ git.SSH-URL }}';
    var HTTPS = (repoMatch) ? repo.replace('git@', 'https://').replace('.com:','.com/') : '{{ git.HTTPS-URL }}';
    var io = (repoMatch) ? repo.replace(repoMatch[1],'').replace('git@', 'http://' + repoMatch[1] + '.').replace('.com:','.io') : '{{ git.HTTPS-URL }}';
    var author = shell.exec('git config user.name', {silent:true}).output.replace(/\s+$/g, '');
    var email = shell.exec('git config user.email', {silent:true}).output.replace(/\s+$/g, '');
    var replacements = [
        { replace: /{{ git.SSH-URL }}/g, with: SSH },
        { replace: /{{ git.HTTPS-URL }}/g, with: HTTPS},
        { replace: /{{ git.io-URL }}/g, with: io},
        { replace: /{{ git.username }}/g, with: repoMatch[1]},
        { replace: /{{ git.author }}/g, with: author},
        { replace: /{{ git.email }}/g, with: email }
    ];
    var dest = process.cwd();
    if (!componentName){
        var componentConfigPath = findup('component.config.js');
        var component = require(componentConfigPath);
        componentName = component.pkg.name;
    }

    if (dest.indexOf('/' + componentName)==-1){
        dest = path.join(dest, componentName)
    }
    return fs.replace(dest + '**/*.*', replacements);
}

function remoteGit(gitRepo, component){
    log.info("\nInitialising Git Remotely... \n");
    return askForGitRepo(gitRepo)
        .then(function(reply) {
            gitRepo = reply;
            return replaceGitVariables(gitRepo, component)
        }).then(function(){
            return pushFirstPush(gitRepo)
        }).then(function(){
            return initGhPages(gitRepo)
        }).catch(log.onError);
}

function pushFirstPush(repo){
    if (!repo) return Promise.resolve();
    return git.remote(['add', 'origin', repo])
        .then(function(output){
            log.onSuccess(output);
            return git.add(['.']);
        }).then(function(output){
            log.onSuccess(output);
            return git.commit('first commit');
        }).then(function(output){
            return git.push(['-u', 'origin', 'master']);
    }).catch(log.onError);
}

function initGhPages(repo){
    if (!repo) return Promise.resolve();
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
    localGit: localGit,
    remoteGit: remoteGit
}
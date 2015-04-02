var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var path = require('path');
var exec = require('./utils/exec').exec;
var git = require('./utils/git');
var fs = require('./utils/fs');
var bower = require('./utils/bower');
var helper = require('./utils/config-helper');
var prompt = require("prompt");
require('colors');

function initBower(){
    return bower.register().catch(function(err){
        log.onError('Error: Bower Register ' + err);
    });
}

function remoteGit(gitRepo, project){
    log.info("\nInitialising Git Remotely... \n");
    return askForGitRepo(gitRepo)
        .then(function(reply) {
            gitRepo = reply;
            return replaceGitVariables(gitRepo, project);
        }).then(function(){
            return pushFirstPush(gitRepo);
        }).then(function(){
            return initGhPages(gitRepo);
        }).catch(log.onError);
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
    return new Promise(function(resolve){
        if (gitRepo && gitRepo.length>0) resolve(gitRepo);
        prompt.start();
        prompt.get([{
            description: 'GitHub Repository URL'.bgBlack.white + ' (leave blank if none)'.bgBlack.white.dim,
            name: 'repo',
            default: git.checkRemote() || ''
        }], function(err, result) {
            if (!result) return resolve('');
            resolve(git.validRepo(result.repo));
        });
    });
}

function replaceGitVariables(repo, project){
    if (!git.validRepo(repo)){
        log.info(['',
            'Github Repository SSH URL invalid:',
                'When you are ready to push to git, Please run:',
                '`caddy init git` '
            ].join('\n'));
        return Promise.resolve();
    }
    var username = git.repoUsername(repo);
    var isSSH = repo.indexOf('git@')>-1;
    var sshUrl = (isSSH) ? repo : repo.replace('https://', 'git@').replace('.com/', '.com:');
    var httpUrl = (!isSSH) ? repo : repo.replace('git@', 'https://').replace('.com:','.com/');
    var ioUrl = sshUrl.replace(username,'').replace('git@', 'http://' + username + '.').replace('.com:','.io').replace(project + '.git', project);
    var replacements = [
        { replace: /{{ git.SSH-URL }}/g, with: sshUrl },
        { replace: /{{ git.HTTPS-URL }}/g, with: httpUrl},
        { replace: /{{ git.io-URL }}/g, with: ioUrl},
        { replace: /{{ git.username }}/g, with: username},
        { replace: /{{ git.author }}/g, with: git.user.name},
        { replace: /{{ git.email }}/g, with: git.user.email }
    ];
    if (!project){
        var config = helper.getConfig();
        project = config.pkg.name;
    }
    var dest = process.cwd();
    if (dest.indexOf('/' + project)==-1){
        dest = path.join(dest, project);
    }
    return fs.replace(dest + '**/*.*', replacements);
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
        }).then(function(){
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
    }).catch(log.onError);
}

module.exports = {
    bower: initBower,
    'gh-pages': initGhPages,
    localGit: localGit,
    git: remoteGit
};
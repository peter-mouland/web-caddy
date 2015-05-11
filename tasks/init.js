var Promise = require('es6-promise').Promise;
var log = require('./utils/log');
var path = require('path');
var exec = require('./utils/exec').exec;
var git = require('./utils/git');
var fs = require('./utils/fs');
var bower = require('./wrappers/bower');
var helper = require('./utils/config-helper');
var prompt = require("prompt");
var init = {};
require('colors');


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

init.bower = function(){
    log.info(" * Bower");
    return bower.register().catch(function(err){
        log.onError('Error: Bower Register ' + err);
    });
};

init.remoteGit = function(options){
    options = options || {};
    log.info(" * Remote GIT");
    var gitRepo = options.gitRepo,
        project = options.project;
    return askForGitRepo(gitRepo)
        .then(function(reply) {
            gitRepo = reply;
            return replaceGitVariables(gitRepo, project);
        }).then(function(){
            return pushFirstPush(gitRepo);
        }).then(function(){
            return init.ghPages(gitRepo);
        }).catch(log.onError);
};

init.localGit = function(){
    log.info(" * Local GIT");
    return git.init().then(function(output){
        log.onSuccess(output);
        return git.add(['.']);
    }).then(function(output){
        log.onSuccess(output);
        return git.commit('first commit');
    }).catch(log.onError);
};

init.ghPages = function(repo){
    if (!repo) return Promise.resolve();
    log.info(" * gh-pages");
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
};

function run(task, options){
    log.info('Initialising :', task);
    if (init[task]) return init[task](options);
    //if (!copy[task]) return help[task](options);
}

module.exports = {
    'bower': function(options){ return run('bower', options); },
    'gh-pages':  function(options){ return run('ghPages', options); },
    localGit:  function(options){ return run('localGit', options); },
    git:  function(options){ return run('remoteGit', options); }
};
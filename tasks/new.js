var Promise = require('es6-promise').Promise;
var replaceStream = require('replacestream');
var shell = require("shelljs");
var prompt = require("prompt");
var log = require('./utils/log');
var exec = require('./utils/exec').exec;
var git = require('./utils/git');
var fs = require('./utils/fs');
var bower = require('./utils/bower');

function npmGlobalPath() {
    return shell.exec('npm config get prefix', {silent:true}).output.replace(/\s+$/g, '') + "/lib/node_modules" ;
}

function renameFiles(component){
    return Promise.all([
        fs.rename('./dot.gitignore', 'dot',''),
        fs.rename('./**/main.*', 'main',component)
    ]);
}

function initStructure(dir, component, repo, author){
    log.info("\nCopying Component Files ... \n");
    return fs.copyDirectory(
        dir,
        './' + component,
        function(read, write, file){
            read.pipe(replaceStream('{{ component }}', component))
                .pipe(replaceStream('{{ git.username }}', repo.match(/.com\:(.*)\//)[1]))
                .pipe(replaceStream('{{ git.author }}', author))
                .pipe(write);
    });
}

function initComponent(dir, component, repo, author) {
    return initStructure(dir, component, repo, author).then(function(output) {
        shell.cd(component);
        return renameFiles(component);
    }).then(function(output){
        return initGit(repo);
    }).then(function(output){
        log.onSuccess(output);
        return initGhPages();
    }).then(function(output){
        log.onSuccess(output);
        return installNpms();
    }).then(function(output){
        log.onSuccess(output);
        log.info("\nInstalling Bower Modules ... \n");
        return bower.install();
    }).then(function(){
        log.info('Ready! \nPlease go to your new directory: `cd ' + component + '`');
    }).catch(log.onError);
}

function installNpms(){
    log.info("\nInstalling Node Modules ... \n");
    return exec('npm',['install']).then(function(output){
        log.onSuccess(output);
    }).catch(log.onError);
}
function initBower(){
    return bower.register().catch(function(err){
        log.onError('Error: Bower Register ** ' + err);
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

function all(){
    console.log("Creating your component...");
    return new Promise(function(resolve, reject){
        prompt.start();
        prompt.get([{
            description: 'Component Name',
            name: 'name'
        }, {
            description: 'GitHub Repository SSH URL',
            name: 'repo'
        }], function(err, result) {
            if (!result) return;
            var component = result.name;
            var gitUrlMatch = result.repo.match(/.com\:(.*)\//);

            var author = shell.exec('git config user.name', {silent:true}).output.replace(/\s+$/g, '');
            var moduleDir = npmGlobalPath() + '/component-helper/component-structure';

            if (!gitUrlMatch){
                reject('Github Repository URL must be a url');
            }
            if (fs.existsSync(component)){
                reject('Component `' + component + '` already exists');
            }
            if (component.indexOf(' ')>-1){
                reject('Component `' + component + '` must not contain spaces');
        }
            initComponent(moduleDir, component, result.repo, author)
                .then(resolve).catch(reject);
        });
    });
}

module.exports = {
    all: all,
    bower: initBower,
    git: initGit,
    ghPages: initGhPages
};
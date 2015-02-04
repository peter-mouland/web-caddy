var Promise = require('es6-promise').Promise;
var replaceStream = require('replacestream');
var shell = require("shelljs");
var log = require('./utils/log');
var spawn = require('./utils/spawn').spawn;
var git = require('./utils/git');
var fs = require('./utils/fs');
var bower = require('./utils/bower');

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
    }).catch(log.onError);
}

function installNpms(){
    log.info("\nInstalling Node Modules ... \n");
    return spawn('npm',['install']).then(function(output){
        log.onSuccess(output);
    }).catch(log.onError);
}
function initBower(bowerCfg, repoUrl){
    return bower.register([bowerCfg.name, repoUrl]).catch(function(){
        log.info(['** Not intialising Bower ** ',
                            'bower.release is set to false in component.config.js'].join('\n'));
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
        return spawn('touch',['gh-pages-initialised.md']);
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
    ghPages: initGhPages,
    structure: initStructure,
    component: initComponent
};
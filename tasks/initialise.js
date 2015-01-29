var Promise = require('es6-promise').Promise;
var spawn = require('./utils/spawn').spawn;
var git = require('./utils/git');
var fileUtil = require('./utils/file');
var bower = require('./utils/bower');
var replaceStream = require('replacestream');
var shell = require("shelljs");
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function onSuccess(output) {
    if (!output) return;
    console.log(chalk.green(output.message));
}

function renameFiles(component){
    return Promise.all([
        fileUtil.rename('./dot.gitignore', 'dot',''),
        fileUtil.rename('./**/main.*', 'main',component)
    ]);
}

function initStructure(dir, component, repo, author){
    console.log("\nCopying Component Files ... \n");
    return fileUtil.copyDirectory(
        dir,
        './' + component,
        function(read, write, file){
            read.pipe(replaceStream('{{ component }}', component))
                .pipe(replaceStream('{{ git.username }}', repo.match(/.com\:(.*)\//)[0]))
                .pipe(replaceStream('{{ git.author }}', author))
                .pipe(write);
    });
}

function initComponent(dir, component, repo, author) {
    return initStructure(dir, component, repo, author).then(function(output) {
        onSuccess(output);
        shell.cd(component);
        return renameFiles(component);
    }, onError).then(function(output){
        onSuccess(output);
        return initGit(repo);
    }, onError).then(function(output){
        onSuccess(output);
        return initGhPages();
    }, onError).then(function(output){
        onSuccess(output);
        return installNpms();
    }, onError).then(function(output){
        onSuccess(output);
        console.log("\nInstalling Bower Modules ... \n");
        return bower.install();
    }, onError);
}

function installNpms(){
    console.log("\nInstalling Node Modules ... \n");
    return spawn('npm',['install']).then(function(output){
        onSuccess(output);
    }, onError);
}
function initBower(bowerCfg, repoUrl){
    return bower.register([bowerCfg.name, repoUrl]).catch(function(){
        console.log(['** Not intialising Bower ** ',
                            'bower.release is set to false in component.config.js'].join('\n'));
    });
}

function initGit(repo){
    console.log("\nInitialising Git ... \n");
    return git.init().then(function(output){
        onSuccess(output);
        return git.add(['.']);
    }, onError).then(function(output){
        onSuccess(output);
        return git.commit('first commit');
    }, onError).then(function(output){
        onSuccess(output);
        return  git.remote(['add', 'origin', repo]);
    }, onError).then(function(output){
        onSuccess(output);
        return git.push(['-u', 'origin', 'master']);
    }, onError);
}

function initGhPages(){
    console.log("\nInitialising gh-pages ... \n");
    return git.checkout(['--orphan', 'gh-pages']).then(function(output){
        onSuccess(output);
        return git.rm(['-rf', '.']);
    }, onError).then(function(output){
        onSuccess(output);
        return spawn('touch',['gh-pages-initialised.md']);
    }, onError).then(function(output){
        onSuccess(output);
        return git.add(['gh-pages-initialised.md']);
    }, onError).then(function(output){
        onSuccess(output);
        return git.commit('Init gh-pages');
    }, onError).then(function(output){
        onSuccess(output);
        return git.push(['--set-upstream','origin','gh-pages']);
    }, onError).then(function(output){
        onSuccess(output);
        return git.checkout(['master']);
    }, onError)
}

module.exports = {
    bower: initBower,
    git: initGit,
    ghPages: initGhPages,
    structure: initStructure,
    component: initComponent
};
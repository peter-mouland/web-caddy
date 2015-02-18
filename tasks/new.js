var Promise = require('es6-promise').Promise;
var replaceStream = require('replacestream');
var shell = require("shelljs");
var prompt = require("prompt");
var init = require('./init');
var log = require('./utils/log');
var exec = require('./utils/exec').exec;
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

function createStructure(dir, component, repo, author){
    log.info("\nCopying Component Files ... \n");
    return fs.copyDirectory(dir, './' + component,
        function(read, write, file){
            read.pipe(replaceStream('{{ component }}', component))
                .pipe(replaceStream('{{ git.username }}', repo.match(/.com\:(.*)\//)[1]))
                .pipe(replaceStream('{{ git.author }}', author))
                .pipe(write);
    });
}

function newComponent(dir, component, repo, author) {
    return createStructure(dir, component, repo, author).then(function(output) {
        shell.cd(component);
        return renameFiles(component);
    }).then(function(output){
        return init.git(repo);
    }).then(function(output){
        log.onSuccess(output);
        return init.ghPages();
    }).then(function(output){
        log.onSuccess(output);
        return installNpms();
    }).then(function(output){
        log.onSuccess(output);
        log.info("\nInstalling Bower Modules ... \n");
        return bower.install();
    }).then(function(){
        log.info([
            'Ready!',
            ' * Please go to your new directory : `cd ' + component + '`',
            ' * view the basic site : `component serve`',
            ' * to see more tasks please see : `https://github.com/skyglobal/component-helper/blob/master/API.md`'
        ].join('\n'));
    }).catch(log.onError);
}

function installNpms(){
    log.info("\nInstalling Node Modules ... \n");
    return exec('npm',['install']).then(function(output){
        log.onSuccess(output);
    }).catch(log.onError);
}

function createAll(componentName){
    console.log("Creating new component " + componentName);
    return new Promise(function(resolve, reject){
        prompt.start();
        prompt.get([{
            description: 'GitHub Repository SSH URL',
            name: 'repo'
        }], function(err, result) {
            if (!result) return;
            var gitUrlMatch = result.repo.match(/.com\:(.*)\//);

            var author = shell.exec('git config user.name', {silent:true}).output.replace(/\s+$/g, '');
            var moduleDir = npmGlobalPath() + '/component-helper/component-structure';

            if (!gitUrlMatch){
                reject('Github Repository URL must be a url');
            }
            if (fs.existsSync(componentName)){
                reject('Component `' + componentName + '` already exists');
            }
            newComponent(moduleDir, componentName, result.repo, author)
                .then(resolve).catch(reject);
        });
    });
}

module.exports = createAll;
'use strict';
var Promise = require('es6-promise').Promise;
var spawn = require('./utils/spawn').spawn;
var git = require('./utils/git');
var bower = require('./utils/bower');
var fs = require("fs");
var ncp = require('ncp').ncp;
var replaceStream = require('replacestream');
var chalk = require('chalk');
var glob = require('glob');
var shell = require("shelljs");
var exec = shell.exec;

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function onSuccess(output) {
    if (!output) return;
    console.log(chalk.green(output.message));
}

function npmGlobalPath() {
    return exec('npm config get prefix', {silent:true}).output.replace(/\s+$/g, '') + "/lib/node_modules/" ;
}

function renameFiles(component){
    return new Promise(function(resolve, reject) {
        fs.rename('./dot.gitignore', './.gitignore');
        glob('./**/main.*', function (err, files) {
            if (err) reject();
            files.forEach(function (file, i) {
                fs.rename(file, file.replace('main', component));
                if (files.length - 1 === i){
                    resolve();
                }
            });
        });
    });
}

function initStructure(pkg, component, repo){
    var moduleDir = npmGlobalPath() + pkg.name;
    console.log("\nCopying Component Files ... \n");
    return new Promise(function(resolve, reject){
        ncp(moduleDir + '/component-structure',
            './' + component,
            { stopOnErr: true,
                transform: function(read, write, file){
                    read.pipe(replaceStream('{{ component }}', component))
                        .pipe(replaceStream('{{ git.username }}', repo.match(/.com\:(.*)\//)[1]))
                        .pipe(replaceStream('{{ git.author }}', exec('git config user.name', {silent:true}).output.replace(/\s+$/g, '')))
                        .pipe(write);
                }
            },
            function(err){
                err && reject();
                !err && resolve();
            }
        );
    });
}

function initComponent(pkg, component, repo) {
    return initStructure(pkg, component, repo).then(function(output) {
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
        return initNPM();
    }, onError);
}

function initNPM(){
    console.log("\nInstalling Node Modules ... \n");
    return spawn('npm',['install']).then(function(output){
        onSuccess(output);
    }, onError);
}
function initBower(bowerCfg, repoUrl){
    return bower.register([bowerCfg.name, repoUrl]).catch(function(){
        console.log(['** Not intialising Bower ** ',
                            'Config is set to false in config/index.js'].join('\n'));
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
        return git.push(['-u', 'origin', 'master']).catch(onError);
    });
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
    })
}

module.exports = {
    bower: initBower,
    git: initGit,
    ghPages: initGhPages,
    structure: initStructure,
    component: initComponent
};
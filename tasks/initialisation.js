'use strict';
var Promise = require('es6-promise').Promise;
var spawn = require('./../utils/spawn-promised').spawn;
var git = require('./../utils/git-promised');
var bower = require('./../utils/bower-promised');
var fs = require("fs");
var ncp = require('ncp').ncp;
var replaceStream = require('replacestream');
var glob = require('glob');
var shell = require("shelljs");
var exec = shell.exec;

function onError(err){
    console.log(err.message);
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
            function(){
                shell.cd(component);
                resolve();
            }
        );
    });
}

function initComponent(pkg, component, repo) {
    return initStructure(pkg, component, repo).then(function() {
        return renameFiles(component);
    }, onError).then(function(){
        return initGit(repo);
    }, onError).then(function(){
        return initGhPages();
    }, onError);
}

function initBower(bowerCfg, repoUrl){
    return bower.register([bowerCfg.name, repoUrl]).catch(function(){
        console.log(['** Not intialising Bower ** ',
                            'Config is set to false in config/index.js'].join('\n'));
    });
}

function initGit(repo){
    return git.init().then(function(){
        return  git.remote(['add', 'origin', repo]);
    }, onError).then(function(){
        return git.add(['gulpfile.js', 'package.json']);
    }, onError).then(function(){
        return git.commit('first commit');
    }, onError).then(function(){
        return git.push(['-u', 'origin', 'master']);
    }, onError);
}

function initGhPages(){
    git.checkout(['--orphan', 'gh-pages']).then(function(msg){
        return git.checkout(['gh-pages'])
    }, onError).then(function(){
        return git.rm(['-rf', '.']);
    }, onError).then(function(){
        return spawn('touch',['gh-pages-initialised.md']);
    }, onError).then(function(){
        return git.add(['gh-pages-initialised.md']);
    }, onError).then(function(){
        return git.commit(['Init gh-pages']);
    }, onError).then(function(){
        return git.commit(['--set-upstream','origin','gh-pages']);
    }, onError).then(function(){
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
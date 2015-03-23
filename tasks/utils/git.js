var Promise = require('es6-promise').Promise;
var exec = require('./exec').exec;
var log = require('./log');
var shell = require("shelljs");

function runGitCommand(cmd, args){
    args.unshift(cmd);
    return exec('git', args);
}

module.exports = {
    commit : function(comment) {
        if (shell.exec('git status', {silent: true}).output.indexOf('nothing to commit')>-1){
            return Promise.resolve('Nothing to commit');
        } else {
            return exec('git',['commit', '-m', '"' + comment + '"']);
        }
    },
    tag : function(version) {
        return exec('git', ['tag', '-a', version, '-m', version]);
    },
    init : function() {
        return runGitCommand('init', []);
    },
    checkout : function(arrFiles) {
        return runGitCommand('checkout', arrFiles);
    },
    add : function(arrFiles) {
        return runGitCommand('add', arrFiles);
    },
    push : function(arrCmds) {
        return runGitCommand('push', arrCmds);
    },
    rm : function(arrCmds) {
        return runGitCommand('rm', arrCmds);
    },
    remote : function(arrCmds) {
        return runGitCommand('remote', arrCmds);
    },
    user: (function(){
        return {
            name: shell.exec('git config user.name', {silent:true}).output.replace(/\s+$/g, ''),
            email : shell.exec('git config user.email', {silent:true}).output.replace(/\s+$/g, '')
        };
    }()),
    release: function release(version){
        var git = this;
        return git.commit('v' + version).then(function() {
            return git.push(['origin', 'master']);
        }).then(function(){
            return git.tag('v' + version).catch(function(msg){
                log.warn(msg);
            });
        }).then(function(){
            return git.push(['origin', 'master', 'v' + version]);
        });
    },
    validRepo: function validepo(repo){
        return (
        repo && (repo.match(/.com\:(.*)\//) ||
            repo.match(/http(.*)\/.git/))
        ) ? repo : false;
    },
    checkRemote: function checkGit(){
        var repo = shell.exec('git config --get remote.origin.url', {silent:true}).output.replace(/\s+$/g, '');
        return this.validRepo(repo);
    },
    repoUsername: function(repo){
        return (repo.match(/.com\:(.*)\//) && repo.match(/.com\:(.*)\//)[1]) || repo.split('/')[3];
    }
};
var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var bower = require('bower');

function install(args){
    return new Promise(function(resolve, reject){
        var exec = bower.commands.install(args);
        exec.on('end', resolve);
        exec.on('error', reject);
    })
}

function register(){
    var pkg = require(findup('./package.json'));
    var bowerPkg = require(findup('./bower.json'));
    return new Promise(function(resolve, reject){
        var exec = bower.commands.register(bowerPkg.name, pkg.repository.url);
        exec.on('end', resolve);
        exec.on('error', reject);
    })
}

module.exports = {
    register : register,
    install : install
};
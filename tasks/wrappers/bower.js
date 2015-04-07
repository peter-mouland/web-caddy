var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var bower = require('bower');
var log = require('../utils/log');

function install(args){
    log.info("\nInstalling Bower Modules ... \n");
    return new Promise(function(resolve, reject){
        var exec = bower.commands.install(args);
        exec.on('end', resolve);
        exec.on('error', reject);
    });
}

function register(){
    log.info("\nRegistering git repo with Bower ... \n");
    var pkg = require(findup('./package.json'));
    var bowerPkg = require(findup('./bower.json'));
    return new Promise(function(resolve, reject){
        var exec = bower.commands.register(bowerPkg.name, pkg.repository.url);
        exec.on('end', resolve);
        exec.on('error', reject);
    });
}

function release(message){
    var ghPages = require('gh-pages');
    var pkg = require(findup('./package.json'));
    var bowerPkg = require(findup('./bower.json'));
    var src = bowerPkg.ignore ? bowerPkg.ignore.map(function(glob){
        return (glob.indexOf('!')===0) ? glob.substr(1) : "!" + glob;
    }) : ['.'];
    src = '{' + src.join(',') + '}';
    message = message || 'Bower Release';
    log.info("\nReleasing Bower\n");
    return new Promise(function(resolve, reject){
        ghPages.publish('.', {
            src: src,
            message: message,
            branch: 'bower',
            tag: pkg.version}, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
}

module.exports = {
    release : release,
    register : register,
    install : install
};
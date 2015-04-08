var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var bower = require('bower');
var log = require('../utils/log');
var fs = require('../utils/fs');

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

function filesInGitPlusBowerFiles(){
    var parser = require('gitignore-parser');
    var gitignore = parser.compile(fs.readFileSync('.gitignore', 'utf8'));
    var bowerPkg = require(findup('./bower.json'));
    return fs.glob(bowerPkg.ignore).then(function(fileObjs){
        var files = fileObjs.map(function(fileObj){
            return fileObj.path.replace(fileObj.base,'');
        });
        files = files.filter(gitignore.denies);
        files = files.map(function(file){
            return '!' + file;
        });
        files.unshift('**/*');
        return fs.glob(files);
    }).then(function(fileObjs){
        return fileObjs.map(function(fileObj){
            return fileObj.path.replace(fileObj.base,'');
        });
    });
}

function release(opts){
    log.info("\nReleasing Bower\n");
    var ghPages = require('gh-pages');
    var pkg = require(findup('./package.json'));
    opts = opts || {};

    return filesInGitPlusBowerFiles().then(function(files){
        return ghPages.publish('.',{
            src: '*{' + files.join(',') + '}',
            message: opts.message || 'Bower Release',
            branch: opts.branch || 'latest',
            tag: pkg.version}, log.onError);
    }).then(function() {
        return ghPages.clean();
    }, log.onError);
}

module.exports = {
    release : release,
    register : register,
    install : install
};
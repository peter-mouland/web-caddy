var Promise = require('es6-promise').Promise;
var findup = require('findup-sync');
var bower = require('bower');
var log = require('../utils/log');
var fs = require('../utils/fs');

function install(args){
    return new Promise(function(resolve, reject){
        var exec = bower.commands.install(args);
        exec.on('end', resolve);
        exec.on('error', reject);
    });
}

function register(){
    var pkg = require(findup('./package.json'));
    var bowerPkg = require(findup('./bower.json'));
    return new Promise(function(resolve, reject){
        var exec = bower.commands.register(bowerPkg.name, pkg.repository.url);
        exec.on('end', resolve);
        exec.on('error', reject);
    });
}

function filesInGitPlusBowerFiles(){
    var bowerPkg = require(findup('./bower.json'));
    var files;
    log.info('    * Finding files that match bower.json');
    if (['**/.*','**/*'].indexOf(bowerPkg.ignore[0]) >=0){
        files = bowerPkg.ignore.map(function(glob, i){
            if (i===0) return '';
            return (glob.charAt(0) === '!') ? glob.substr(1) : glob;
        });
        files = files.filter(function(file){ return file!=='';});
        files = '*{' + files.join(',') + '}';
    } else {
        log.onError('Please invers bower.json "ignore" array.\n  ie. use \'**/*\' as the first item');
        //var exclusionGlob = './!(node_modules|bower_components)*{*,**/**}';
        //fs.glob(exclusionGlob).then(function(fileObjs){
        //
        //});
    }
    return fs.glob(files).then(function(fileObjs){
        log.info('    * Found ' + fileObjs.length + ' file(s)');
        return fileObjs.map(function(fileObj){
            //todo: verbose mode?
            return fileObj.path.replace(fileObj.base,'');
        });
    });
}

function release(opts){
    var ghPages = require('gh-pages');
    opts = opts || {};

    return filesInGitPlusBowerFiles().then(function(files){
        return new Promise(function(resolve, reject){
            return ghPages.publish('.',{
                src: '*{' + files.join(',') + '}',
                message: opts.message || 'Bower Release',
                branch: opts.branch || 'latest',
                tag: opts.tag},  function(err) {
                ghPages.clean();
                err && reject(err);
                !err && resolve();
            });
        });
    }).catch(log.onError);
}

module.exports = {
    release : release,
    register : register,
    install : install
};
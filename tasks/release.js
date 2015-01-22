var Promise = require('es6-promise').Promise;
var semver = require('semver');
var ghPages = require('gh-pages');
var file   = require('./utils/file');
var git = require('./utils/git');
var bump = require('./utils/bump');
var aws = require('./utils/aws');
var build = require('./build');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function gitRelease(version){
    return git.commit('Version bump for release').then(function(){
       return git.push(['origin', 'master']);
    }).then(function(){
       return git.tag('v' + version);
    }).then(function(){
        return git.push(['origin', 'master', 'v' + version]);
    });
}

function versionBump(version, type){
    version = semver.inc(version, type);
    return bump('./*.json', {type: type}).then(function(){
        return build.updateDocs({version: version})
    }).then(function(){
        return version;
    });
}

function ghPagesRelease(dir){
    dir = dir || './_site'
    return new Promise(function(resolve, reject){
        ghPages.publish(dir, function(err) {
            err && reject(err)
            !err && resolve()
        });
    });
}

function awsRelease(fileGlob, version, name, config){
    var s3 = aws.setup(config)
    return file.read(fileGlob).then(function(files){
        var promises = []
        files.forEach(function(fileObj){
            promises.push(s3.upload(fileObj,{ path: 'test/components/' + name + '/' + version }).catch(onError))
        })
        return Promise.all(promises);
    },onError)
}

function all(fileGlob, type, name, config){
    return versionBump(type).then(function(version){
        return Promise.all([
            gitRelease(version),
            ghPagesRelease(),
            awsRelease(fileGlob, version, name, config)
        ]);
    });
}

module.exports = {
    git: gitRelease,
    versionBump: versionBump,
    ghPages: ghPagesRelease,
    aws: awsRelease,
    all: all
};

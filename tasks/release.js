var Promise = require('es6-promise').Promise;
var semver = require('semver');
var ghPages = require('gh-pages');
var file   = require('./utils/file');
var git = require('./utils/git');
var bump = require('./utils/bump').bump;
var aws = require('./utils/aws');
var build = require('./build');
var chalk = require('chalk');
var test   = require('./test');
var paths   = require('../paths');

var findup = require('findup-sync');
var packageFilePath = findup('package.json');
var configPath = findup('config/index.js');
var compConfig = require(configPath || '../component-structure/config');
var pkg = require(packageFilePath || '../package.json');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function info(msg) {
    console.log(chalk.cyan(msg));
}
function onSuccess(msg) {
    console.log(chalk.red(msg));
}

function gitRelease(version){
    version = Array.isArray(version) ? version[0] : version
    version = version || pkg.version;
    return git.add(['.']).then(function() {
        return git.commit('v' + version);
    }).then(function(){
       return git.push(['origin', 'master']);
    }).then(function(){
       return git.tag('v' + version);
    }).then(function(){
        return git.push(['origin', 'master', 'v' + version]);
    }).catch(onError);
}

function versionBump(type){
    type = Array.isArray(type) ? type[0] : type
    type = type || 'patch';
    info("\nBumping version ... \n");
    var version = semver.inc(pkg.version, type);
    return bump('./*.json', {type: type}).then(function(){
        return build.html(version)
    }).then(function(){
        return version;
    }).catch(onError);
}

function ghPagesRelease(message){
    message = Array.isArray(message) ? message[0] : message
    message = message || 'Update';
    info("\nReleasing to gh-pages ... \n");
    return new Promise(function(resolve, reject){
        ghPages.publish(paths.site.root, {message: message }, function(err) {
            err && reject(err)
            !err && resolve()
        });
    });
}

function awsRelease(version){
    version = Array.isArray(version) ? version[0] : version
    version = version || pkg.version;
    if (!compConfig.aws){
        info('AWS release set to false. skipping\nIf this is an error update the config and run `gulp release:aws`')
        return
    }
    info("\nReleasing to AWS ... \n");
    var s3 = aws.setup(compConfig.aws)
    return file.read('./_site/**/*.*').then(function(files){
        if (!files.length) onError({message: 'No files found to release to AWS\n' + glob})
        var promises = []
        files.forEach(function(fileObj){
            promises.push(s3.upload(fileObj,{ path: 'components/' + pkg.name + '/' + version +'/'}).catch(onError))
        })
        return Promise.all(promises);
    }).catch(onError)
}

function all(args, type){
    var bumpedVersion
    return build.all().then(function() {
        return test.all();
    }).then(function(){
        return versionBump(type)
    }).then(function(version){
        bumpedVersion = version;
        return gitRelease(version);
    }).then(function(){
        return ghPagesRelease('v' + bumpedVersion);
    }).then(function(){
       return awsRelease(bumpedVersion)
    }).catch(onError);
}

module.exports = {
    git: gitRelease,
    versionBump: versionBump,
    'gh-pages': ghPagesRelease,
    aws: awsRelease,
    all: all
};

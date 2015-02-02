var Promise = require('es6-promise').Promise;
var semver = require('semver');
var findup = require('findup-sync');
var ghPages = require('gh-pages');
var chalk = require('chalk');

var build = require('./build');
var file   = require('./utils/file');
var git = require('./utils/git');
var bump = require('./utils/bump').bump;
var Release = require('./wrappers/aws'); //config.release

var test = require('./test');
var component = require(findup('component.config.js') || '../component-structure/component.config.js');
var pkg = component.pkg;
var paths = component.paths;

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

function update(version){
    var replacements = [{replace : /("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g, with: '$1' + version + '$2'}]
    return file.replace( ['./README.md', './**/version.js'], replacements)
}

function versionBump(type){
    type = Array.isArray(type) ? type[0] : type
    type = type || 'patch';
    info("\nBumping version ... \n");
    var version = semver.inc(pkg.version, type) || semver.valid(type);
    return bump('./*.json', {version:version}).then(function(){
        return Promise.all([update(version), build.html(version)])
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
            ghPages.clean();
            err && reject(err)
            !err && resolve()
        });
    });
}

function cloud(version){
    info("\nReleasing to " + component.release + " ... \n");
    version = Array.isArray(version) ? version[0] : version
    version = version || pkg.version;
    if (!component.release){
        info('Release set to false within component.config.js : skipping')
        return Promise.resolve();
    }
    var prefix = component.releaseConfig.directoryPrefix || '';
    return new Release(paths.site.root + '/**/*.*', prefix + pkg.name + '/' + version +'/', component.releaseConfig).write()
}

function all(args, type){
    var bumpedVersion
    return test.all().then(function() {
        return versionBump(type)
    }).then(function(version){
        bumpedVersion = version;
        return gitRelease(version);
    }).then(function(){
        return ghPagesRelease('v' + bumpedVersion);
    }).then(function(){
       return release(bumpedVersion)
    }).catch(onError);
}

module.exports = {
    git: gitRelease,
    versionBump: versionBump,
    'gh-pages': ghPagesRelease,
    cloud: cloud,
    all: all
};

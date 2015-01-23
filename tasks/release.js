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
    return git.add(['.']).then(function() {
        return git.commit('v' + version);
    }).then(function(){
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

function awsRelease(version, name, config){
    if (!config.release){
        console.log('AWS release set to false. skipping\nIf this is an error update the config and run `gulp release:aws`')
        return
    }
    var s3 = aws.setup(config)
    return file.read('./_site/**/*.*').then(function(files){
        if (!files.length) onError({message: 'No files found to release to AWS\n' + glob})
        var promises = []
        files.forEach(function(fileObj){
            promises.push(s3.upload(fileObj,{ path: 'test/components/' + name + '/' + version +'/'}).catch(onError))
        })
        return Promise.all(promises);
    },onError)
}

function all(version, name, config, type){
    return versionBump(version, type).then(function(version){
        return Promise.all([
            gitRelease(version),
            ghPagesRelease(),
            awsRelease(version, name, config)
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

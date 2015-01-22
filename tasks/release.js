var Promise = require('es6-promise').Promise;
var semver = require('semver');
var ghPages = require('gh-pages');
var path = require('path');
var file = require('./utils/file');
var git = require('./utils/git');
var bump = require('./utils/bump');
var build = require('./build');
var pkg = require('../package.json');

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
    dir = dir || '_site'
    return new Promise(function(resolve, reject){
        ghPages.publish(path.join(__dirname, dir), function(err) {
            err && reject(err)
            !err && resolve()
        });
    });
}

function awsRelease(){
    //var configPath = findup('config/index.js');
    //var config = require(configPath);
    //if (config.aws && config.aws.bucket && config.aws.release) {
    //    console.log('** Pushing to Amazon S3 : ' + config.aws.bucket + ' **\n');
    //    var awsS3 = plugins['aws-s3'].setup(config.aws);
    //    return gulp.src([
    //        paths['site']['root'] + '/**/*.*'])
    //        .pipe(awsS3.upload({ path: 'components/' + pkg.name + '/' + pkg.version + '/' } ));
    //} else {
    //    console.log('** Amazon S3 release skipped **\n' +
    //    'AWS variables are not set \n' +
    //    ' or \n' +
    //    ' aws.release in config/index.js set to false\n');
    //    return cb();
    //}
}

function all(type){
    return versionBump(type).then(function(version){
        return Promise.all([
            gitRelease(version),
            ghPagesRelease(),
            awsRelease(version)
        ]);
    });
}

module.exports = {
    git: gitRelease,
    versionBump: versionBump,
    ghPages: ghPagesRelease,
    aws: awsRelease,
    component: all
};
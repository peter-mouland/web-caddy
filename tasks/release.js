var utils = require('./utils/common');
var paths = utils.paths;
var Promise = utils.Promise;
var pkg = utils.pkg;
var log = utils.log;
var component = utils.component;

var Release = require('./wrappers/' + (component.release || 's3'));

function gitRelease(version){
    var git = require('./utils/git');
    version = Array.isArray(version) ? version[0] : version;
    version = version || pkg.version;
    return git.add(['.']).then(function() {
        return git.commit('v' + version);
    }).then(function(){
       return git.push(['origin', 'master']);
    }).then(function(){
       return git.tag('v' + version);
    }).then(function(){
        return git.push(['origin', 'master', 'v' + version]);
    }).catch(log.onError);
}

function update(version){
    var fs   = require('./utils/fs');
    var replacements = [{
        replace : /("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g,
        with: '$1' + version + '$2'}
    ];
    return fs.replace( ['./README.md', './**/version.js'], replacements);
}

function getPreid(){
    var preid = pkg.version.split('-')[1];
    preid = (preid) ? preid.split('.')[0] : 'beta';
    return preid;
}


function getVersion(type){
    var semver = require('semver');
    type = Array.isArray(type) ? type[0] : type;
    if (type) type = type.split('--version=')[1];
    type = type || 'patch';
    type = semver.inc(pkg.version, type, getPreid()) || semver.valid(type);
    return type;
}

function versionBump(type){
    log.info("\nBumping version ...  " + type );
    var bump = require('./utils/bump').bump;
    var build = require('./build');
    var version = getVersion(type);
    return bump('./*.json', {version:version}).then(function(){
        return Promise.all([update(version), build.html({version:version})]);
    }).then(function(){
        return version;
    }).catch(log.onError);
}

function ghPagesRelease(message){
    var ghPages = require('gh-pages');
    message = Array.isArray(message) ? message[0] : message;
    message = message || 'Update';
    log.info("\nReleasing to gh-pages ... \n");
    return new Promise(function(resolve, reject){
        ghPages.publish(paths.site.root, {message: message }, function(err) {
            ghPages.clean();
            err && reject(err);
            !err && resolve();
        });
    });
}

function s3(version){
    if (!component.release){
        log.info('Release set to false within component.config.js : skipping');
        return Promise.resolve();
    }
    log.info("\nReleasing to S3 ... \n");
    version = Array.isArray(version) ? version[0] : version;
    version = version || pkg.version;
    var options = (component[component.release]) || {};
    var prefix = options.directoryPrefix || '';
    return new Release(paths.site.root + '/**/*.*', prefix + pkg.name + '/' + version +'/', options).write();
}

function run(type){
    var bumpedVersion;
    return versionBump(type).then(function(version){
        bumpedVersion = version;
        return gitRelease(version);
    }).then(function(){
        return ghPagesRelease('v' + bumpedVersion);
    }).then(function(){
        return s3(bumpedVersion);
    }).catch(log.onError);
}

module.exports = {
    git: gitRelease,
    versionBump: versionBump,
    'gh-pages': ghPagesRelease,
    s3: s3,
    run: run
};

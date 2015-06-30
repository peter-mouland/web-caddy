var Promise = require('es6-promise').Promise;
var semver = require('semver');
var fs = require('./fs');
var log = require('./log');

function Bump(files, opts){
    this.files = files;
    this.options = opts || {};
}

Bump.prototype.possibleNewline = function possibleNewline(jsonSting) {
    return (jsonSting.slice(-1) === '\n') ? '\n' : '';
};

Bump.prototype.space = function space(json) {
    var match = json.match(/^(?:(\t+)|( +))"/m);
    return match ? (match[1] ? '\t' : match[2].length) : '';
};

Bump.prototype.getPreid = function getPreid(version){
    var preid = version.split('-')[1];
    preid = (preid) ? preid.split('.')[0] : 'beta';
    return preid;
};

Bump.prototype.bumpVersion = function bumpVersion(version){
    var type = this.options.type || 'patch';
    if (type.indexOf('--version=')>-1) {
        type = type.split('--version=')[1];
    } else if (type == 'current'){
        return  semver.valid(version);
    }
    version = semver.inc(version, type, this.getPreid(version)) || semver.valid(type);
    if (!version){
        log.onError('Invalid semVer type: ' + type);
    }
    return version;
};

Bump.prototype.updateJson = function updateJson(fileObj){
    var content, contentJSON;
    content = Buffer.isBuffer(fileObj.contents) ? fileObj.contents.toString('utf-8') : fileObj.contents ;

    try {
        contentJSON = JSON.parse(content);
    } catch (e) {
        return {err: 'Problem parsing JSON file'};
    }
    this.currentVersion = contentJSON.version;
    this.updatedVersion = this.bumpVersion(this.currentVersion);
    contentJSON.version = this.updatedVersion;
    fileObj.version  = this.updatedVersion;
    fileObj.contents = new Buffer(JSON.stringify(contentJSON, null, void 0 || this.space(content)) + this.possibleNewline(content));
    return fileObj;
};

Bump.prototype.updateFile = function updateFile(fileObj){
    if (!this.updatedVersion) {
        log.onError([
            'Please ensure the glob passed to Bump includes a JSON file first.',
            ' * i.e. `package.json`.',
            'This is used to determine the new version.'].join('\n'));
    }
    var replacements = [{
        replace : /("|\/)[0-9]+\.[0-9]+\.[0-9]\-?(?:(?:[0-9A-Za-z-]+\.?)+)?("|\/)/g,
        with: '$1' + this.updatedVersion + '$2'}
    ];
    return fs.replace(fileObj.path, replacements);
};

Bump.prototype.updateJsonFile = function updateJsonFile(fileObj) {
    var self = this;
    return new Promise(function(resolve, reject){
        fileObj = self.updateJson(fileObj);
        fileObj.err && reject(fileObj.err);
        !fileObj.err && resolve(fileObj);
    }).then(function(fileObj){
        return fs.write(fileObj);
    }).catch(log.onError);
};

Bump.prototype.update = function update(fileObjs){
    var self = this;
    var promises = [];
    fileObjs.forEach(function(fileObj){
        if (fileObj.ext == 'json'){
            promises.push(self.updateJsonFile(fileObj));
        } else  {
            promises.push(self.updateFile(fileObj));
        }
    });
    return Promise.all(promises);
};

Bump.prototype.run = function run(){
    var self = this;
    return fs.read(this.files).then(function(fileObjs){
        if (fileObjs.length === 0 ){
            return log.warn(' * no files found matching: ' + self.files);
        }
        return self.update(fileObjs);
    }).then(function(){
        return self.updatedVersion;
    }).catch(log.onError);
};


module.exports = Bump;
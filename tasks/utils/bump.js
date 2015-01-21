var Promise = require('es6-promise').Promise;
var semver = require('semver');
var file = require('./file');

var possibleNewline = function (json) {
    var lastChar = (json.slice(-1) === '\n') ? '\n' : '';
    return lastChar;
};

var space = function space(json) {
    var match = json.match(/^(?:(\t+)|( +))"/m);
    return match ? (match[1] ? '\t' : match[2].length) : '';
};

var updateJsonFile = function(fileObj, opts) {
    return new Promise(function(resolve, reject){
        opts = opts || {};
        var key = opts.key || 'version';
        var indent = opts.indent || void 0;
        var type = semver.inc('0.0.1', opts.type) || 'patch';
        var version = semver.valid(opts.version, opts.type) || null;
        var json, content;
        json = fileObj.contents.toString('utf-8');

        try {
            content = JSON.parse(json);
        } catch (e) {
            return reject('Problem parsing JSON file');
        }

        if (version) {
            content[key] = version;
        } else if (semver.valid(content[key])) {
            content[key] = semver.inc(content[key], type);
        } else {
            return reject('Detected invalid semver ' + key);
        }
        fileObj.contents = new Buffer(JSON.stringify(content, null, indent || space(json)) + possibleNewline(json));

        resolve(fileObj);
    }).then(function(fileObj){
        return file.write(fileObj.path, fileObj.contents)
    });
}

var updateJson = function(newFileObjs, opts){
    var promises = [];
    newFileObjs.forEach(function(fileObj){
        promises.push(updateJsonFile(fileObj, opts))
    });
    return Promise.all(promises);
}

var bump = function(files, opts){
    return file.read(files).then(function(newFileObjs){
        return updateJson(newFileObjs, opts)
    });
}


module.exports = bump;
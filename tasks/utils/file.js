var log = require('./log');
var nodePath = require('path');
//todo: update to use more of https://nodejs.org/api/path.html#path_path_delimiter

module.exports = function File(fileObj){
    if (!fileObj.path) {
        return log.onError('File: fileObj.path is required');
    }

    var path;
    var name;
    var dir;
    var relativeDir;
    var ext;
    var slash = nodePath.sep;
    var cwd = fileObj.cwd;
    var base = fileObj.base;
    var contents = fileObj.contents;

    Object.defineProperty(this, 'cwd', {
        get: function () {
            return cwd;
        }
    });

    Object.defineProperty(this, 'base', {
        get: function () {
            return base;
        }
    });

    Object.defineProperty(this, 'relativeDir', {
        get: function () {
            return relativeDir;
        }
    });

    Object.defineProperty(this, 'path', {
        get: function () {
            return path;
        },
        set: function (value) {
            path = nodePath.normalize(value);
            var outDirs = path.split(slash);
            outDirs.pop();

            name = path.split(slash).pop();
            dir = outDirs.join(slash);
            relativeDir = (base) ? (dir + '/').replace(base,'') : undefined;
            ext = name.split('.').pop();
        }
    });

    Object.defineProperty(this, 'contents', {
        get: function () {
            return contents;
        },
        set: function (value) {
            contents = value;
        }
    });

    Object.defineProperty(this, 'name', {
        get: function () {
            return name;
        },
        set: function (value) {
            if (value.indexOf('/') > -1 || value.indexOf('\\') > -1) {
                return log.onError('File name cannot contain slashes');
            }

            var outDirs = path.split(slash);
            outDirs.pop();

            this.path = outDirs.join(slash) + slash + value;
        }
    });

    Object.defineProperty(this, 'dir', {
        get: function () {
            return dir;
        },
        set: function (value) {
            this.path = value + slash + name;
        }
    });

    Object.defineProperty(this, 'ext', {
        get: function () {
            return ext;
        },
        set: function (value) {
            var arrPath = path.split('.');
            arrPath.pop();
            this.path = arrPath.join('.') + '.' + value;
        }
    });

    this.path = nodePath.normalize(fileObj.path);
};
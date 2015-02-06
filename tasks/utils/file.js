var log = require('./log');

module.exports = function File(fileObj){
    if (!fileObj.path) {
        return log.onError('File: fileObj.path is required')
    }

    var path;
    var name;
    var dir;
    var ext;
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

    Object.defineProperty(this, 'path', {
        get: function () {
            return path;
        },
        set: function (value) {
            var outDirs = value.split('/');
            outDirs.pop();

            path = value;
            name = path.split('/').pop();
            dir = outDirs.join('/');
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
            if (value.indexOf('/') > -1) {
                return log.onError('File name cannot contain slashes');
            }

            var outDirs = path.split('/');
            outDirs.pop();

            this.path = outDirs.join('/') + '/' + value;
        }
    });

    Object.defineProperty(this, 'dir', {
        get: function () {
            return dir;
        },
        set: function (value) {
            this.path = value + '/' + name;
        }
    });

    Object.defineProperty(this, 'ext', {
        get: function () {
            return ext;
        },
        set: function (value) {
            var arrPath = path.split('.');
            arrPath.pop();
            this.path = arrPath.join('.') + '.' + value
        }
    });

    this.path = fileObj.path;
};
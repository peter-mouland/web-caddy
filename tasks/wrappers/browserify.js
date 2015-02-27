var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var UglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function Browserify(location, destination){
    this.location = location;
    this.destination = destination;
}

Browserify.prototype.file = function(fileObj) {
    var self = this;
    return new Promise(function(resolve, reject){
        browserify(fileObj.path).bundle(function(err, contents){
            err && reject(err);
            var newFile = new File({ path: path.resolve(self.destination, fileObj.name) });
            newFile.contents = contents;
            !err && resolve(newFile);
        });
    });
};

Browserify.prototype.write = function(){
    var self = this;
    return fs.glob(this.location + '/*.js').then(function(fileObjs){
        if (fileObjs.length===0){
            log.info('no .js files found within `' + self.location + '`');
        }
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return fs.write(fileObjs);
    }).then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.minify(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return fs.write(fileObjs);
    });
};

Browserify.prototype.minify = function(fileObj){
    var newFile = new File({ path: fileObj.path });
    newFile.name = fileObj.name.replace('.js','.min.js');
    newFile.dir = this.destination;
    newFile.contents = UglifyJS.minify(fileObj.path).code;
    return Promise.resolve(newFile);
};

module.exports = Browserify;
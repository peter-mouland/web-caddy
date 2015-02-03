var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var UglifyJS = require("uglify-js");
var file = require('../utils/file');
var log = require('../utils/log');

function Browserify(location, destination){
    this.location = location;
    this.destination = destination;
}

Browserify.prototype.browserifyFile = function(fileObj) {
    var self = this;
    return new Promise(function(resolve, reject){
        browserify(fileObj.path).bundle(function(err, contents){
            err && reject(err)
            fileObj.contents = contents;
            fileObj.path = path.resolve(self.destination, fileObj.name);
            fileObj.dir = self.destination;
            !err && resolve(fileObj)
        });
    });
}

Browserify.prototype.write = function(){
    var self = this;
    return file.glob(this.location + '/*.js').then(function(fileObjs){
        if (fileObjs.length===0){
            log.info('no .js files found within `' + self.location + '`')
        }
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.browserifyFile(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return file.write(fileObjs);
    }).then(function(fileObjs){
        return self.minify(fileObjs);
    }).catch(log.onError);
}

Browserify.prototype.minify = function(fileObjs){
    var self = this;
    var promises = [];
    fileObjs.forEach(function (fileObj, i) {
        fileObj.contents = UglifyJS.minify(fileObj.path).code;
        fileObj.name = fileObj.name.replace('.js','.min.js')
        fileObj.dir = self.destination;
        fileObj.path = self.destination + '/' + fileObj.name;
        promises.push(file.write(fileObj));
    });
    return Promise.all(promises);
}

module.exports = Browserify
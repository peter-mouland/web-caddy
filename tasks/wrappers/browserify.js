var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var UglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var log = require('../utils/log');

function Browserify(location, destination){
    this.location = location;
    this.destination = destination;
}

Browserify.prototype.file = function(fileObj) {
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
    return fs.glob(this.location + '/*.js').then(function(fileObjs){
        if (fileObjs.length===0){
            log.info('no .js files found within `' + self.location + '`')
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
    }).catch(log.onError);
}

Browserify.prototype.minify = function(fileObj){
        fileObj.contents = UglifyJS.minify(fileObj.path).code;
        fileObj.name = fileObj.name.replace('.js','.min.js')
        fileObj.dir = this.destination;
        fileObj.path = this.destination + '/' + fileObj.name;
    return Promise.resolve(fileObj);
}

module.exports = Browserify
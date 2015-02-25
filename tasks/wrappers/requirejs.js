var Promise = require('es6-promise').Promise;
var requirejs = require('requirejs');
var path = require('path');
var UglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function RequireJS(location, destination, config){
    this.location = location;
    this.destination = destination;
    this.config = config;
}

RequireJS.prototype.file = function(fileObj) {
    var config = {
        baseUrl: fileObj.base,
        name: fileObj.name.replace('.js',''),
        out: path.join(this.destination, fileObj.name),
        generateSourceMaps: true,
        preserveLicenseComments: false,
        optimize: "none",
        mainConfigFile: this.config.mainConfigFile
    };
    return new Promise(function(resolve, reject){
        requirejs.optimize(config, resolve, reject);
    });
};

RequireJS.prototype.write = function(){
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
        return fs.glob(self.destination + '/*.js');
    }).then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.minify(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return fs.write(fileObjs);
    }).catch(log.onError);
};

RequireJS.prototype.minify = function(fileObj){
    var newFile = new File({ path: fileObj.path });
    newFile.name = fileObj.name.replace('.js','.min.js');
    newFile.dir = this.destination;
    newFile.contents = UglifyJS.minify(fileObj.path).code;
    return Promise.resolve(newFile);
};

module.exports = RequireJS;
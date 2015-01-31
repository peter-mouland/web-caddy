var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var UglifyJS = require("uglify-js");
var file = require('../utils/file');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function info(msg) {
    console.log(chalk.cyan(msg));
}

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
            info('no js files found: ' + self.location)
        }
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.browserifyFile(fileObj));
        });
        return Promise.all(promises);
    }, onError).then(function(fileObjs){
        return file.write(fileObjs);
    }, onError).then(function(fileObjs){
        return self.minify(fileObjs);
    }, onError);
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
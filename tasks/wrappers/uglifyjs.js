var Promise = require('es6-promise').Promise;
var path = require('path');
var uglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var File = require('../utils/file');

function UglifyJS(fileObj, destination, options){
    this.fileObj = fileObj;
    this.destination = destination;
    this.options = options || {};
}

UglifyJS.prototype.write = function(){
    var fileObj = this.fileObj;
    var dir = path.join(this.destination, fileObj.relativeDir);
    var filePath = path.join(dir, fileObj.name);
    var newFile = new File({ path: fileObj.path });
    newFile.dir = dir;
    newFile.name = fileObj.name.replace('.js','.min.js');
    var ugly = uglifyJS.minify(path.resolve(filePath), this.options);
    newFile.contents = ugly.code;
    return fs.write(newFile);
};

module.exports = UglifyJS;
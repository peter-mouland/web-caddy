var Promise = require('es6-promise').Promise;
var path = require('path');
var uglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var File = require('../utils/file');

function UglifyJS(fileObj, options){
    this.fileObj = fileObj;
    this.options = options || {};
}

UglifyJS.prototype.write = function(){
    var fileObj = this.fileObj;
    var ugly = uglifyJS.minify(fileObj.path, this.options);
    var newFile = new File({ path: fileObj.path });
    newFile.name = fileObj.name.replace('.js','.min.js');
    newFile.contents = ugly.code;
    return fs.write(newFile);
};

module.exports = UglifyJS;
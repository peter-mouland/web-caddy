var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var UglifyJS = require("uglify-js");
var fileUtil = require('./file');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function browserifyFile(fileObj) {
    return new Promise(function(resolve, reject){
        browserify(fileObj.path).bundle(function(err, contents){
            err && reject(err)
            fileObj.contents = contents;
            !err && resolve(fileObj)
        });
    });
}

function browserifyFiles(glob){
    return fileUtil.glob(glob).then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(browserifyFile(fileObj));
        });
        return Promise.all(promises);
    }, onError);
}

function saveFileObjects(fileObjs, destination){
    var promises = [];
    fileObjs.forEach(function (fileObj, i) {
        fileObj.path = path.resolve(destination, fileObj.name);
        fileObj.dir = destination;
        promises.push(fileUtil.write(fileObj));
    });
    return Promise.all(promises);
}

function writeJs(location, destination){
    return browserifyFiles(location + '/*.js').then(function(fileObjs){
        return saveFileObjects(fileObjs, destination);
    }, onError);
}

function writeJsMin(location, destination){
    return fileUtil.glob(location + '/!(*.min).js').then(function(files){
        files.forEach(function (fileObj, i) {
            fileObj.contents = UglifyJS.minify(fileObj.path).code;
            fileObj.path = destination + '/' + fileObj.name.replace('.js','.min.js');
            return fileUtil.write(fileObj);
        });
        return files;
    }, onError);
}

module.exports = {
    js: writeJs,
    jsMin: writeJsMin
};
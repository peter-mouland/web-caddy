var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var UglifyJS = require("uglify-js");
var fileUtil = require('./file');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function browserifyFiles(glob){
    return fileUtil.glob(glob).then(function(files){
        var promises = [];
        files.forEach(function (file, i) {
            promises.push(browserifyFile(file));
        });
        return Promise.all(promises);
    }, onError);
}

function browserifyFile(filename) {
    return new Promise(function(resolve, reject){
        browserify(filename).bundle(function(err, src){
            if(err) reject(err)
            else resolve({ path: filename, src:src} )
        });
    });
}

function saveFileObjects(fileObjs, destination){
    var promises = [];
    fileObjs.forEach(function (fileObj, i) {
        var jsFile = destination + '/' + fileUtil.detail(fileObj.path).name;
        promises.push(fileUtil.write(jsFile, fileObj.src));
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
        files.forEach(function (file, i) {
            var minCode = UglifyJS.minify(file).code;
            var minFile = destination + '/' + fileUtil.detail(file).name.replace('.js','.min.js');
            return fileUtil.write(minFile, minCode);
        });
        return files;
    }, onError);
}

module.exports = {
    js: writeJs,
    jsMin: writeJsMin
};
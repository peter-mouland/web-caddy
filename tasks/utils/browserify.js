var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var UglifyJS = require("uglify-js");
var fileUtil = require('./file');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function browserifyFiles(files){
    if (!Array.isArray(files)) return browserifyFile(files);
    var promises = [];
    files.forEach(function (file, i) {
        promises.push(browserifyFile(file));
    });
    return Promise.all(promises);
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
        var jsFile = fileUtil.detail(destination + '/' + fileUtil.detail(fileObj.path).name);
        promises.push(fileUtil.write(jsFile.dir, jsFile.name, fileObj.src));
    });
    return Promise.all(promises);
}

function writeJs(location, destination){
    return fileUtil.glob(location + '/*.js')
        .then(browserifyFiles, onError)
        .then(function(fileObjs){
            return saveFileObjects(fileObjs, destination);
        }, onError);
}

function writeJsMin(location, destination){
    return fileUtil.glob(location + '/!(*.min).js').then(function(files){
        var arrMinFiles = [];
        files.forEach(function (file, i) {
            var min = UglifyJS.minify(file).code;
            var jsFile = fileUtil.detail(destination + '/' + fileUtil.detail(file).name);
            var minFile = jsFile.name.replace('.js','.min.js');
            arrMinFiles.push(jsFile.dir + minFile)
            return fileUtil.write(jsFile.dir, jsFile.name.replace('.js','.min.js'), min);
        });
        return files;
    }, onError);
}

module.exports = {
    js: writeJs,
    jsMin: writeJsMin
};
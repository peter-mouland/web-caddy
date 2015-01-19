var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var UglifyJS = require("uglify-js");
var fileUtil = require('../utils/file');
var paths = require('./paths');

var browserifyRender = function(filename) {
    return new Promise(function(resolve, reject){
        browserify(filename).bundle(function(err, src){
            if(err) reject(err)
            else resolve({ path: filename, src:src} )
        });
    });
};

function writeJs(location, destination){
    return fileUtil.glob(location + '/*.js').then(function(files){
        var promises = [];
        files.forEach(function (file, i) {
            var promise = browserifyRender(file).then(function(fileObj){
                var jsFile = fileUtil.detail(destination + '/' + fileUtil.detail(fileObj.path).name);
                return fileUtil.write(jsFile.dir, jsFile.name, fileObj.src);
            });
            promises.push(promise);
        });
        return Promise.all(promises);
    })
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
    });
}

function writeAllJS(){
    var promises = [
        writeJs(paths['source'].js, paths['dist'].js),
        writeJs(paths['demo'].js, paths['site'].js),
        writeJs(paths['source'].js, paths['site'].js)
    ];
    return Promise.all(promises).then(function(){
        var promises = [
            writeJsMin(paths['site'].js, paths['site'].js),
            writeJsMin(paths['demo'].js, paths['demo'].js)
        ];
        return Promise.all(promises);
    })
}

module.exports = {
    js: writeJs,
    jsMin: writeJsMin,
    all: writeAllJS
};
var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var UglifyJS = require("uglify-js");
var sass = require('node-sass');
var fileUtil = require('../utils/file');
var glob = require('glob');
var paths = require('./paths');

var globPromise = function(globString){
    return new Promise(function(resolve, reject) {
        glob(globString, function (err, files) {
            if (err) reject(err);
            else resolve(files);
        });
    });
}

function sassRender(file){
    return new Promise(function(resolve, reject){
        sass.render({
            file: file,
            outputStyle: 'nested',
            success: function(out){
                resolve(out);
            },
            error: function(err){
                reject(err);
            }
        })
    });
}

function writeSass(location, destination) {
    return globPromise(location + '/**/!(_)*.scss').then(function(files) {
        var promises = [];
        files.forEach(function (file, i) {
            var promise = sassRender(file).then(function(output){
                var sassFile = fileUtil.detail(file);
                var cssFile = fileUtil.detail(destination + '/' + sassFile.name);
                var css = autoprefixer().process(output.css).css;
                return fileUtil.write(cssFile.dir, cssFile.name, css)
            });
            promises.push(promise);
        });
        return Promise.all(promises);
    });
}

var browserifyRender = function(filename) {
    return new Promise(function(resolve, reject){
        browserify(filename).bundle(function(err, src){
            if(err) reject(err)
            else resolve({ path: filename, src:src} )
        });
    });
};

function writeJs(location, destination){
    return globPromise(location + '/*.js').then(function(files){
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
    return globPromise(location + '/!(*.min).js').then(function(files){
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

module.exports = {
    sass: writeSass,
    js: writeJs,
    jsMin: writeJsMin
};
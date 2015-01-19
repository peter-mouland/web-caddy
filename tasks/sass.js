var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var fileUtil = require('../utils/file');
var paths = require('./paths');

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
    return fileUtil.glob(location + '/**/!(_)*.scss').then(function(files) {
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

function writeAllCSS(){
    var promises = [
        writeSass(paths['source'].sass, paths['dist'].css),
        writeSass(paths['demo'].sass, paths['site'].css),
        writeSass(paths['source'].sass, paths['site'].css)
    ];
    return Promise.all(promises);
}

module.exports = {
    sass: writeSass,
    all: writeAllCSS
};
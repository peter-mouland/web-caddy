var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var fileUtil = require('./file');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
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
    return fileUtil.glob(location + '/**/!(_)*.scss').then(function(files) {
        var promises = [];
        files.forEach(function (file, i) {
            var promise = sassRender(file).then(function(output){
                var sassFile = fileUtil.detail(file);
                var css = autoprefixer().process(output.css).css;
                return fileUtil.write(destination + '/' + sassFile.name.replace('.scss','.css'), css)
            },onError);
            promises.push(promise);
        });
        return Promise.all(promises);
    }, onError);
}

module.exports = writeSass;
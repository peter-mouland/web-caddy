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
        files.forEach(function (fileObj, i) {
            var promise = sassRender(fileObj.path).then(function(output){
                fileObj.contents = autoprefixer().process(output.css).css;
                fileObj.path = destination + '/' + fileObj.name.replace('.scss','.css');
                return fileUtil.write(fileObj)
            },onError);
            promises.push(promise);
        });
        return Promise.all(promises);
    }, onError);
}

module.exports = writeSass;
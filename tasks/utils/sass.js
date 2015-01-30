var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var path = require('path');
var file = require('./file');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function info(msg) {
    console.log(chalk.cyan(msg));
}

function Sass(location, destination){
    this.location = location;
    this.destination = destination;
}

Sass.prototype.render = function(fileObj){
    var self = this;
    return new Promise(function(resolve, reject){
        sass.render({
            file: fileObj.path,
            outputStyle: 'nested',
            success: function(output){
                var newFileObj = {
                    contents : autoprefixer().process(output.css).css,
                    name : fileObj.name.replace('.scss','.css'),
                    path : path.resolve(self.destination, fileObj.name),
                    dir : self.destination
                };
                resolve(newFileObj);
            },
            error: function(err){
                reject(err);
            }
        })
    });
}

Sass.prototype.write = function() {
    var self = this;
    return file.glob(this.location + '/**/!(_)*.scss').then(function(files) {
        if (files.length===0){
            info('no scss files found: ' + self.location)
        }
        var promises = [];
        files.forEach(function (fileObj, i) {
            var promise = self.render(fileObj).then(function(fileObj){
                return file.write(fileObj)
            },onError);
            promises.push(promise);
        });
        return Promise.all(promises);
    }, onError);
}

module.exports = Sass;
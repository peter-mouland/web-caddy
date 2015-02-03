var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var path = require('path');
var file = require('../utils/file');
var log = require('../utils/log');

function Sass(location, destination){
    this.location = location;
    this.destination = destination;
}

Sass.prototype.render = function(fileObj, outputStyle){
    var self = this;
    return new Promise(function(resolve, reject){
        var name = fileObj.name.replace('.scss','.css');
        if (outputStyle === 'compressed'){
            name = name.replace('.css','.min.css')
        }
        var newFileObj = {
            name : name,
            path : path.resolve(self.destination, fileObj.name),
            dir : self.destination
        };
        sass.render({
            file: fileObj.path,
            outputStyle: outputStyle || 'nested',
            //sourceMap: true,
            //outFile: './' + path.join(self.destination, name),
            precision: 3,
            success: function(output){
                newFileObj.contents = autoprefixer().process(output.css).css,
                resolve(newFileObj);
            },
            error: function(err){
                reject(err);
            }
        })
    });
}

Sass.prototype.renderMin = function(fileObj){
    return this.render(fileObj, 'compressed');
}

Sass.prototype.write = function() {
    var self = this;
    return file.glob(this.location + '/**/!(_)*.scss').then(function(files) {
        if (files.length===0){
            log.info('no scss files found: ' + self.location)
        }
        var promises = [];
        files.forEach(function (fileObj, i) {
            var promise = self.render(fileObj).then(function(fileObj){
                return file.write(fileObj)
            }).then(function(){
                return self.renderMin(fileObj)
            }).then(function(fileObj){
                return file.write(fileObj)
            });
            promises.push(promise);
        });
        return Promise.all(promises);
    }).catch(log.onError);
}

module.exports = Sass;
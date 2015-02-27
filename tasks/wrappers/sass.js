var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var path = require('path');
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function Sass(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

Sass.prototype.file = function(fileObj, outputStyle){
    var self = this;
    var options = this.options;
    return new Promise(function(resolve, reject){
        var name = fileObj.name.replace('.scss','.css');
        if (outputStyle === 'compressed'){
            name = name.replace('.css','.min.css');
        }
        var newFileObj = new File({path: path.resolve(self.destination, name)});
        options.file = fileObj.path;
        options.outputStyle = outputStyle || options.outputStyle || "nested";
        options.precision  = options.precision || 3;
        options.success = function(output){
                newFileObj.contents = autoprefixer().process(output.css).css,
                resolve(newFileObj);
        };
        options.error = reject;
        sass.render(options);
    });
};

Sass.prototype.minify = function(files){
    var self = this;
    var promises = [];
    files.forEach(function(fileObj){
        promises.push(self.file(fileObj, 'compressed'));
    });
    return Promise.all(promises);
};

Sass.prototype.write = function() {
    var self = this;
    return fs.glob(this.location + '/**/!(_)*.scss').then(function(files) {
        if (files.length===0){
            log.info('no scss files found: ' + self.location);
        }
        var promises = [];
        files.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObj){
        return fs.write(fileObj);
    }).then(function(fileObj){
        return self.minify(fileObj);
    }).then(function(fileObj){
        return fs.write(fileObj);
    }).catch(log.onError);
};

module.exports = Sass;

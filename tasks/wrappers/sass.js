var autoprefixer = require('autoprefixer');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var path = require('path');
var extend = require('util')._extend;
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
    var dir;
    var name = fileObj.name.replace('.scss','.css');
    if (outputStyle === 'compressed'){
        name = name.replace('.css','.min.css');
        dir = fileObj.dir;
    } else {
        dir = path.join(this.destination,fileObj.relativeDir);
    }
    var outFile = path.resolve(dir, name);
    var newFileObj = new File({path:outFile});
    return new Promise(function(resolve, reject){
        var defaults = {
            file : fileObj.path,
            outputStyle : outputStyle || "nested",
            precision  : 3,
            success : function(output){
                newFileObj.contents = autoprefixer().process(output.css).css;
                resolve(newFileObj);
            },
            error : function(e){
                log.warn('Sass Error');
                reject(e);
            }
        };
        var options = extend(defaults, self.options);
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
    return fs.glob(this.location).then(function(files) {
        //todo: verbose?
        //if (files.length===0){
            //log.info('no scss files found: ' + self.location);
        //}
        var promises = [];
        files.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return fs.write(fileObjs);
    }).then(function(fileObj){
        return self.minify(fileObj);
    }).then(function(fileObj){
        return fs.write(fileObj);
    });
};

module.exports = Sass;

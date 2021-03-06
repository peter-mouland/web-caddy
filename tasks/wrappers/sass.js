var autoprefixer = require('autoprefixer-core');
var postcss      = require('postcss');
var Promise = require('es6-promise').Promise;
var sass = require('node-sass');
var path = require('path');
var extend = require('util')._extend;
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function wait(fileObjs){
    return new Promise(function(resolve, reject) {
        setTimeout(function(){ resolve(fileObjs); }, 100);
    });
}

function Sass(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

Sass.prototype.file = function(fileObj, outputStyle){
    var dir;
    var name = fileObj.name.replace('.scss','.css');
    var defaults = {
        file : fileObj.path,
        outputStyle : outputStyle || "nested",
        precision  : 3
    };
    var options = extend(defaults, this.options);
    if (outputStyle === 'compressed'){
        name = name.replace('.css','.min.css');
        dir = fileObj.dir;
    } else {
        dir = path.join(this.destination,fileObj.relativeDir);
    }
    var outFile = path.resolve(dir, name);
    var newFileObj = new File({path:outFile});
    return new Promise(function(resolve, reject){
        if (options.verbose){
            log.info('   * ' + fileObj.path.replace(options.appRoot,''));
        }
        sass.render(options,
            function(error, result){
                if (error){
                    log.warn('Sass Error');
                    reject(error);
                } else {
                    resolve(result);
                }
            });
    }).then(function (result) {
        return postcss([ autoprefixer ]).process(result.css);
    }).then(function(result){
        result.warnings().forEach(function (warn, i) {
            if (i===0) log.warn('Sass (autoprefixer) Error');
            log.warn(warn.toString());
        });
        newFileObj.contents = postcss([ autoprefixer ]).process(result.css).css;
        return newFileObj;
    });
};

Sass.prototype.minify = function(files){
    log.info(' * Minifying Styles: ' + this.destination);
    var self = this;
    var promises = [];
    files.forEach(function(fileObj){
        promises.push(self.file(fileObj, 'compressed'));
    });
    return Promise.all(promises).then(function(fileObjs){
        return fs.write(fileObjs);
    });
};

Sass.prototype.write = function() {
    var self = this;
    return fs.glob(this.location).then(function(files) {
        if (self.options.verbose && files.length===0){
            log.info('no scss files found: ' + self.location);
        }
        var promises = [];
        files.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return fs.write(fileObjs);
    }).then(function(fileObjs){
        return wait(fileObjs);
    }).then(function(fileObjs){
        if (!self.options.minify || self.options.dev) return Promise.resolve();
        return self.minify(fileObjs);
    });
};

module.exports = Sass;

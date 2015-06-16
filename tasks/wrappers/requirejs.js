var Promise = require('es6-promise').Promise;
var requirejs = require('requirejs');
var path = require('path');
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function RequireJS(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

RequireJS.prototype.file = function(fileObj) {
    var config = {
        baseUrl: path.join(fileObj.base,fileObj.relativeDir),
        name: fileObj.name.replace('.js',''),
        out: path.join(this.destination, fileObj.relativeDir, fileObj.name),
        generateSourceMaps: true,
        preserveLicenseComments: false,
        optimize: "none",
        mainConfigFile: this.options.mainConfigFile
    };
    return new Promise(function(resolve, reject){
        requirejs.optimize(config, function(args){
            var fileObj = new File({path:args.split('\n')[1]});
            resolve(fileObj);
        }, reject);
    });
};

RequireJS.prototype.write = function(){
    var self = this;
    return fs.glob(this.location).then(function(fileObjs){
        if (self.options.verbose && fileObjs.length===0){
            log.info('no .js files found within `' + self.location + '`');
        }
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        return Promise.all(promises);
    });
};

module.exports = RequireJS;
var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var debowerify = require('debowerify');
var path = require('path');
var UglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function Browserify(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

Browserify.prototype.buildVendor = function(options){
    var self = this;
    if (!options.vendorBundle) return Promise.resolve();
    delete this.options.entries;
    return new Promise(function(resolve, reject) {
        var v_ws = fs.createWriteStream(path.resolve(self.destination, 'vendor.js'));
        browserify()
            .transform('debowerify')
            .require(options.vendorBundle)
            .bundle().pipe(v_ws)
            .on('end', resolve);
        v_ws.on('error', reject);
    });
};

Browserify.prototype.mapExternalFiles = function() {
    if (!this.options.vendorBundle) return;
    return this.options.vendorBundle.map(function (v) {
        if (typeof v === 'string') return v;
        return v.expose;
    });
};

Browserify.prototype.file = function(fileObj) {
    var self = this;
    var options = this.options || {};
    return new Promise(function(resolve, reject){
        options.entries = fileObj.path;
        var b_ws = fs.createWriteStream(path.resolve(self.destination, fileObj.name));
        var b = browserify(options);
        //b.require(fileObj.path, {expose: fileObj.name.split('.')[0]});
        b.external(self.mapExternalFiles());
        b.bundle().pipe(b_ws);
        b.on('end', resolve);
        b_ws.on('error', reject);
    });
};

Browserify.prototype.write = function(){
    var self = this;
    var options = this.options || {};
    return fs.glob(this.location + '/*.js').then(function(fileObjs){
        if (fileObjs.length===0){
            log.info('no .js files found within `' + self.location + '`');
        }
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        if (options.vendorBundle){
            promises.push(self.buildVendor(options));
        }
        return Promise.all(promises);
    }).then(function(fileObjs){
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.minify(fileObj));
        });
        return Promise.all(promises);
    }).then(function(fileObjs){
        return fs.write(fileObjs);
    });
};

Browserify.prototype.minify = function(fileObj){
    var newFile = new File({ path: fileObj.path });
    newFile.name = fileObj.name.replace('.js','.min.js');
    newFile.dir = this.destination;
    newFile.contents = UglifyJS.minify(fileObj.path).code;
    return Promise.resolve(newFile);
};

module.exports = Browserify;
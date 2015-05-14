/* global clearTimeout*/
var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var extend = require('util')._extend;
var watchify = require('watchify');
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function mapExternalFiles(vendorBundle) {
    if (!vendorBundle) return;
    return vendorBundle.map(function (v) {
        return (typeof v === 'string') ? v : v.expose;
    });
}

function bundle(b, fileObj, outFile) {
    var b_ws = fs.createWriteStream(path.resolve(outFile));
    b.bundle().pipe(b_ws);
    return new Promise(function(resolve, reject) {
        b_ws.end = function(){
            //todo: verbose mode?
            //log.info(' * ' + outFile + ' saved' );
            fileObj.path = outFile;
            return resolve(fileObj);
        };
        b_ws.on('error', reject);
    });
}

function Watch (location, destination, options) {
    this.options = options || {};
    this.options.entries = options.fileObj.path;
    this.fileObj = options.fileObj;
    this.browserSync = options.browserSync;
    this.outFile = path.join(destination, this.fileObj.relativeDir, this.fileObj.name);
    var b = browserify(options, watchify.args);
    var vendor = mapExternalFiles(this.options.vendorBundle);
    if (vendor){
        b.external(vendor);
    }
    b.require(this.fileObj.path, {expose: this.fileObj.name.split('.')[0]});
        return this.file(b);
}

Watch.prototype.reloadOnce = function() {
    clearTimeout(this.reloadTimout);
    this.reloadTimout = setTimeout(this.browserSync.reload, 150);
};

Watch.prototype.file = function(b) {
    var self = this;
    this.w = watchify(b); //, { delay: 1000 }
    log.info('   * watch ' + this.fileObj.relativeDir + this.fileObj.name ); //+ fileObj.name
    this.w.on('update', function () {
            bundle(self.w, self.fileObj, self.outFile).then(self.reloadOnce.bind(self)).catch(log.onError);
    });
    this.w.bundle();
};


function Browserify(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options || {};
    this.checkForDeboweify();
}

Browserify.prototype.checkForDeboweify = function(){
    var options = this.options;
    if (options.vendorBundle && options.browserify && options.browserify.transform && options.browserify.transform.indexOf('debowerify')>-1){
        log.onError([
            'The browserify transform `debowerify` does not currenlty work with `vendorBundle`.',
            'Please remove `debowerify` from browserify.transform within your package.json.',
            ' * https://github.com/eugeneware/debowerify/issues/62'
        ].join('\n'));
    }
};

Browserify.prototype.buildVendor = function(fileObj, options){
    if (!options.vendorBundle) return Promise.resolve();
    delete this.options.entries;
    var outFile = path.join(this.destination, options.vendorTarget);
    var vendorFile = new File({ path: outFile });
    var v_ws = fs.createWriteStream(vendorFile.path);
    browserify().require(options.vendorBundle).bundle().pipe(v_ws);
    return new Promise(function(resolve, reject) {
        v_ws.end = function(){
            return resolve(vendorFile);
        };
        v_ws.on('error', reject);
    });
};

Browserify.prototype.file = function(fileObj, browserSync) {
    var options = this.options || {};
    options.entries = fileObj.path;
    var b = browserify(options, (browserSync) ? watchify.args : undefined);
    var vendor = mapExternalFiles(this.options.vendorBundle);
    if (vendor){
        b.external(vendor);
    }
    b.require(fileObj.path, {expose: fileObj.name.split('.')[0]});
    return bundle(b, fileObj, path.join(this.destination, fileObj.relativeDir, fileObj.name));
};

Browserify.prototype.watch = function(browserSync) {
    var self = this;
    return fs.glob(this.location).then(function(fileObjs) {
        fileObjs.forEach(function (fileObj, i) {
            var options = extend(self.options || {},{
                fileObj: fileObj,
                browserSync:browserSync
            });
            new Watch(self.location, self.destination, options);
        });
    }).catch(log.onError);
};

Browserify.prototype.write = function(){
    var self = this;
    var options = this.options || {};
    return fs.glob(this.location).then(function(fileObjs){
        //todo: verbose mode?
        //if (fileObjs.length===0){
        //    log.info('no .js files found within `' + self.location + '`');
        //}
        var promises = [];
        fileObjs.forEach(function (fileObj, i) {
            promises.push(self.file(fileObj));
        });
        if (options.vendorBundle){
            options.vendorBundle.forEach(function (vendorObj, i) {
                var fileObj = new File({ path: vendorObj.file || vendorObj });
                promises.push(self.buildVendor(fileObj, options));
            });
        }
        return Promise.all(promises);
    });
};

module.exports = Browserify;
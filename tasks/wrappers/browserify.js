var Promise = require('es6-promise').Promise;
var browserify = require('browserify');
var path = require('path');
var UglifyJS = require("uglify-js");
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function Browserify(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
    this.checkForDeboweify();
}

Browserify.prototype.checkForDeboweify = function(){
    var options = this.options;
    if (options.browserify && options.browserify.transform && options.browserify.transform.indexOf('debowerify')>-1){
        log.onError([
            'The browserify transform `debowerify` does not currenlty work with `vendorBundle`.',
            'Please remove `debowerify` from browserify.transform within your package.json.',
            ' * https://github.com/eugeneware/debowerify/issues/62'
        ].join('\n'));
    }
};

Browserify.prototype.buildVendor = function(options){
    var self = this;
    if (!options.vendorBundle) return Promise.resolve();
    delete this.options.entries;
    return new Promise(function(resolve, reject) {
        var vendorPath = path.resolve(self.destination, 'vendor.js');
        var newFile = new File({ path: vendorPath });
        var v_ws = fs.createWriteStream(vendorPath);
        browserify()
            .require(options.vendorBundle)
            .bundle().pipe(v_ws)
            .on('end', function(){
                return resolve(newFile);
            });
        v_ws.on('error', reject);
    });
};

Browserify.prototype.mapExternalFiles = function() {
    if (!this.options.vendorBundle) return;
    var options = this.options;
    return this.options.vendorBundle.map(function (v) {
        var dependency = (typeof v === 'string') ? v : v.expose;
        if (options.browser && options.browser[dependency]){
            log.warn(['You have `browser.' + dependency + '` within your package.json.',
                'This may cause problems. Ensure within the `vendorBundle` you have:',
            ' * bower_components: have the full path  e.g. {file:\'./bower_components/path/' + dependency + '.js\',expose:\'' + dependency + '\'}',
            ' * node_module: have the node name within the `vendorBundle` e.g. \'' + dependency + '\'',
            ''].join('\n'))
        }
        return dependency;
    });
};

Browserify.prototype.file = function(fileObj) {
    var self = this;
    var options = this.options || {};
    var vendor = self.mapExternalFiles();
    return new Promise(function(resolve, reject) {
        options.entries = fileObj.path;
        var b_ws = fs.createWriteStream(path.resolve(self.destination, fileObj.name));
        var b = browserify(options);
        if (vendor){
            b.external(vendor);
        }
        b.require(fileObj.path, {expose: fileObj.name.split('.')[0]});
        b.bundle().pipe(b_ws);
        b.on('end', function(){
            return resolve(fileObj);
        });
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
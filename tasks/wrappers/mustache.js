var Promise = require('es6-promise').Promise;
var path = require('path');
var mustache = require('mustache');
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');

function Mustache(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

Mustache.prototype.getPartialFile = function(base, partial){
    return new Promise(function(resolve, reject){
        var ext = partial.split('.');
        var fileName = (ext.length>1) ? partial : partial + '.*';
        fs.read(path.join(base , fileName)).then(function(fileObjs){
            var contents = [];
            fileObjs.forEach(function(fileObj){
                contents.push(fileObj.contents.toString('utf-8'));
            });
            resolve({partial: partial, contents: contents.join('\n')});
        }).catch(reject);
    });
};

Mustache.prototype.getPartials = function(fileObj){
    var self = this;
    var promises = [];
    var arrParsed = mustache.parse(fileObj.contents.toString('utf-8'));
    arrParsed.forEach(function (item) {
        if (item[0] == '>') {
            promises.push(self.getPartialFile(fileObj.base, item[1]));
        }
    });
    return Promise.all(promises);
};

Mustache.prototype.renderFile = function(fileObj){
    var self = this;
    var replacements = this.options;
    return this.getPartials(fileObj).then(function(partialObjs){
        var partials = {};
        partialObjs.forEach(function(partialObj){
            partials[partialObj.partial] = partialObj.contents;
        });
        var contents = mustache.render(fileObj.contents.toString(), replacements, partials);
        var file = new File({path: path.join(self.destination,fileObj.name), contents:contents});
        file.ext = 'html';
        return file;
    })
}

Mustache.prototype.render = function(fileObjs){
    var self = this;
    var promises = [];
    fileObjs.forEach(function(fileObj){
        promises.push(self.renderFile(fileObj));
    });
    return Promise.all(promises);
};

Mustache.prototype.write = function(){
    var self = this;
    return fs.read(this.location)
        .then(function(fileObjs){
            return self.render(fileObjs);
        }).then(function(fileObjs){
            return fs.write(fileObjs);
        }).catch(log.onError);
};

module.exports = Mustache;
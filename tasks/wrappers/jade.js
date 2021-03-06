var Promise = require('es6-promise').Promise;
var path = require('path');
var jade = require('jade');
var fs = require('../utils/fs');
var File = require('../utils/file');

function Jade(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

Jade.prototype.renderFile = function(fileObj){
    var replacements = this.options;
    var render = jade.compile(fileObj.contents.toString('utf-8'), { filename: fileObj.path, pretty: true });
    var outFile = path.join(this.destination,fileObj.relativeDir, fileObj.name);
    var file = new File({path: outFile, contents:render(replacements)});
    file.ext = 'html';
    return file;
};

Jade.prototype.render = function(fileObjs){
    var self = this;
    var promises = [];
    fileObjs.forEach(function(fileObj){
        promises.push(self.renderFile(fileObj));
    });
    return Promise.all(promises);
};

Jade.prototype.write = function(){
    var self = this;
    return fs.read(this.location)
        .then(function(fileObjs){
            return self.render(fileObjs);
        }).then(function(fileObjs){
            return fs.write(fileObjs);
        });
};

module.exports = Jade;
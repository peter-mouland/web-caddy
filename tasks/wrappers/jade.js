var Promise = require('es6-promise').Promise;
var path = require('path');
var jade = require('jade');
var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');
var now = Date().split(' ').splice(0,5).join(' ');

function Jade(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

Jade.prototype.renderFile = function(fileObj){
    var self = this;
    var replacements = {
        site: {
            version: this.options.version,
            time: this.options.now || now
        }
    };
    var render = jade.compile(fileObj.contents.toString('utf-8'), { filename: fileObj.path, pretty: true });
    var file = new File({path: path.join(self.destination,fileObj.name), contents:render(replacements)});
    file.ext = 'html';
    return file;
};

Jade.prototype.render = function(fileObjs){
    var self = this;
    var promises = [];
    fileObjs.forEach(function(fileObj){
        console.log(fileObj.path)
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
        }).catch(log.onError);
};

module.exports = Jade;
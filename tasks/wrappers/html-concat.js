var fs = require('../utils/fs');
var File = require('../utils/file');
var log = require('../utils/log');
var now = Date().split(' ').splice(0,5).join(' ');
//maybe upgrade to https://github.com/assemble/assemble

function HTML(location, destination, options){
    this.location = location;
    this.destination = destination;
    this.options = options;
}

HTML.prototype.concatContent = function(fileObjs){
    return fileObjs.map(function(file){
        return file.contents;
    }).join('\n');
}

HTML.prototype.concatFiles = function(){
    var self = this;
    return fs.read(this.location)
        .then(function(fileObjs){
            return self.concatContent(fileObjs)
        }).then(function(contents){
            var fileObj = new File({path:self.destination, contents:contents})
            return fs.write(fileObj)
        }).catch(log.onError);
}

HTML.prototype.update = function(){
    var replacements = [
        {replace : '{{ site.version }}', with:  this.options.version},
        {replace : '{{ site.time }}', with: this.options.now || now}
    ];
    return fs.replace(this.destination, replacements)
}

HTML.prototype.write = function(){
    var self = this;
    return this.concatFiles().then(function(){
        return self.update();
    }).catch(log.onError);
}

module.exports = HTML;
var file = require('../utils/file');
var log = require('./utils/log');
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
    return file.read(this.location)
        .then(function(fileObjs){
            return self.concatContent(fileObjs)
        }).then(function(contents){
            var detail = file.detail(self.destination)
            var fileObj = { //todo: new File(destination)
                ext:   detail.ext,
                dir:   detail.dir,
                path: self.destination,
                name: detail.name,
                contents : contents
            };
            return file.write(fileObj)
        }).catch(log.onError);
}

HTML.prototype.update = function(){
    var replacements = [
        {replace : '{{ site.version }}', with:  this.options.version},
        {replace : '{{ site.time }}', with: this.options.now || now}
    ];
    return file.replace(this.destination, replacements)
}

HTML.prototype.write = function(){
    var self = this;
    return this.concatFiles().then(function(){
        return self.update();
    }).catch(log.onError);
}

module.exports = HTML;
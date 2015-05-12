var Promise = require('es6-promise').Promise;
var fs = require('../utils/fs');
var htmlMinify = require('html-minifier').minify;

function HTML(fileObjs, options){
    this.fileObjs = fileObjs;
    this.options = options || {
        removeAttributeQuotes: true,
        collapseBooleanAttributes : true,
        collapseWhitespace: true,
        useShortDoctype: true,
        removeComments:true,
        removeCommentsFromCdata:true,
        removeEmptyAttributes: true
    };
}

HTML.prototype.min = function(fileObj){
    fileObj.contents = htmlMinify(fileObj.contents, this.options);
    return fs.write(fileObj);
};

HTML.prototype.write = function(){
    var self = this;
    var promises = [];
    this.fileObjs && this.fileObjs.forEach(function (fileObj, i) {
        promises.push(self.min(fileObj));
    });
    return Promise.all(promises);
};

module.exports = HTML;
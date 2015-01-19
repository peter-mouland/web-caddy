var Promise = require('es6-promise').Promise;
var fs = require("fs");
var mkdirp = require('mkdirp');

function write(dir, name, contents){
    mkdirp(dir);
    var string = (Buffer.isBuffer(contents)) ? contents.toString('utf-8') : contents;
    return new Promise(function(resolve, reject){
        fs.writeFile(dir + '/' + name, string, function(err, written, buffer){
            if (err){
                reject(err);
            }
            resolve(dir + '/' + name);
        });
    });
}

function detail(file){
    var outFile = file.split('/').pop();
    var outDirs = file.split('/')
    outDirs.pop()
    var outDir = outDirs.join('/')
    return {
        dir: outDir,
        name: outFile
    }
}

module.exports = {
    detail: detail,
    write: write
}
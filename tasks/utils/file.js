var Promise = require('es6-promise').Promise;
var fs = require("fs-extra");
var glob = require('glob');
var ncp = require('ncp').ncp;

function write(dir, name, contents){
    fs.mkdirs(dir);
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

function readFile(path, fileName){
    path = (fileName) ? path + '/' + fileName : path;
    return new Promise(function(resolve, reject){
        fs.readFile(path, function(err, data){
            if (err){
                reject(err);
            }
            resolve(data);
        });
    });
}

function readFiles(files){
    if (!Array.isArray(files)) return readFile(files);
    var promises = []
    files.forEach(function(file){
        promises.push(readFile(file))
    })
    return Promise.all(promises)
}

function copy(src, dest){
    fs.mkdirs(dest);
    return new Promise(function(resolve, reject){
        fs.copy(src,dest, function(err, data){
            if (err){
                reject(err);
            }
            resolve(data);
        });
    });
}

function concat(files){
    return readFiles(files).then(function(contents){
        return contents.join('\n');
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

function globString(globString){
    return new Promise(function(resolve, reject) {
        glob(globString, function (err, files) {
            if (err) reject(err);
            else resolve(files);
        });
    });
}

function globArray(globArray){
    if (!Array.isArray(globArray)) return globString(globArray);
    var promises = []
    globArray.forEach(function(str){
        promises.push(globString(str))
    })
    return Promise.all(promises).then(function(arrFiles){
        var files = []
        arrFiles.forEach(function(arrFile){
            files = files.concat(arrFile)
        });
        return files;
    })
}

function copyAndReplaceFile(src, dest, transform){
    return new Promise(function(resolve, reject){
        ncp(src, dest, { stopOnErr: true, transform: transform },
            function(err){
                err && reject(err);
                !err && resolve();
            }
        );
    });
}

function copyAndReplace(srcs, dest, transform){
    if (!Array.isArray(srcs)) return copyAndReplaceFile(srcs, dest, transform);
    var promises = []
    srcs.forEach(function(src){
        promises.push(copyAndReplaceFile(src, dest, transform))
    })
    return Promise.all(promises);
}

module.exports = {
    detail: detail,
    copy: copy,
    write: write,
    read: readFiles,
    concat: concat,
    copyAndReplace: copyAndReplace,
    glob: globArray
}
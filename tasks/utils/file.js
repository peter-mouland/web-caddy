var Promise = require('es6-promise').Promise;
var del = require('del');
var fs = require("fs-extra");
var path = require('path');
var ncp = require('ncp').ncp;
var chalk = require('chalk');
var gs = require('glob-stream');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function mkdir(dir){
    return new Promise(function(resolve, reject) {
        fs.mkdirs(dir, function (err) {
            err && reject(err);
            !err && resolve();
        });
    });
}

function write(fileObj){
    var string = (Buffer.isBuffer(fileObj.contents)) ? fileObj.contents.toString('utf-8') : fileObj.contents;
    return mkdir(fileObj.dir).then(function(){
        return new Promise(function(resolve, reject){
            fs.writeFile(fileObj.path, string, function(err, written, buffer){
                err && reject(err);
                !err && resolve(fileObj);
            });
        });
    })
}

function stat(filePath){
    return new Promise(function(resolve, reject){
        fs.stat(filePath, function(err, data){
            if (err){
                reject(err);
            }
            resolve(data);
        });
    });
}

function readFile(fileObj){
    var promises = [
        stat(fileObj.path),
        new Promise(function(resolve, reject){
            fs.readFile(fileObj.path, function(err, data){
                if (err){
                    reject(err);
                }
                resolve(data);
            });
        })
    ]
    return Promise.all(promises).then(function(outputs){
        fileObj.contents =  outputs[1]
        fileObj.stat = outputs[0]
        return fileObj;
    });
}

function read(src){
    return glob(src).then(function(files) {
        var promises = []
        files.forEach(function(fileObj) {
            promises.push(readFile(fileObj))
        })
        return Promise.all(promises)
    }, onError);
}

function replaceInFile(fileObj, replacements){
    return readFile(fileObj).then(function(fileObj){
        fileObj.contents = fileObj.contents.toString('utf-8')
        replacements.forEach(function(replace){
            fileObj.contents = fileObj.contents.replace(replace.replace, replace.with);
        })
        return write(fileObj);
    }, onError)
}

function replace(src, replacement){
    return glob(src).then(function(files) {
        var promises = []
        files.forEach(function (fileObj) {
            promises.push(replaceInFile(fileObj, replacement))
        })
        return Promise.all(promises)
    }, onError)
}

function copyFile(fileObj, dest){
    return mkdir(dest).then(function(){
        return new Promise(function(resolve, reject){
            fs.copy(fileObj.path, dest + '/' + fileObj.name, function(err, data){
                err && reject(err);
                !err && resolve(data);
            });
        });
    });
}

function copy(src, dest){
    return glob(src).then(function(files){
        var promises = []
        files.forEach(function(fileObj) {
            return copyFile(fileObj, dest)
        });
        return Promise.all(promises);
    }, onError);
}

function detail(file){
    var outFile = file.split('/').pop();
    var outDirs = file.split('/')
    outDirs.pop()
    var outDir = outDirs.join('/')
    var ext = outFile.split('.').pop()
    return {
        dir: outDir,
        name: outFile,
        ext: ext
    }
}

function glob(globArray){
    var stream = gs.create(globArray);
    return new Promise(function(resolve, reject){
        var files = [];
        stream.on('data', function(fileObj){
            var fileDetail = detail(fileObj.path)
            fileObj.dir = fileDetail.dir
            fileObj.ext = fileDetail.ext
            fileObj.name = fileDetail.name
            files.push(fileObj)
        });
        stream.on('end', function(err){
            err && reject(err)
            !err && resolve(files)
        });

    });
}

function copyDirectory(src, dest, transform){
    return new Promise(function(resolve, reject){
        ncp(src, dest, { stopOnErr: true, transform: transform },
            function(err){
                err && reject(err);
                !err && resolve();
            }
        );
    });
}

function renameFile(fileObj, replace, withThis){
    return new Promise(function(resolve, reject){
        fileObj.name = fileObj.name.replace(replace, withThis)
        fs.rename(fileObj.path, path.join(fileObj.dir, fileObj.name), function(err){
            err && reject(err)
            !err && resolve(fileObj)
        });
    })
}

function rename(src, replace, withThis){
    return glob(src).then(function(files) {
        var promises = []
        files.forEach(function (fileObj, i) {
            promises.push(renameFile(fileObj,replace, withThis))
        });
        return Promise.all(promises);
    });
}

function clean(globby){
    return new Promise(function(resolve, reject){
        return del(globby, function (err, paths){
            err && reject(err);
            !err && setTimeout(function(){resolve(paths)},50);
        });
    });
}

module.exports = {
    detail: detail,
    rename: rename,
    copy: copy,
    write: write,
    read: read,
    del: clean,
    copyDirectory: copyDirectory,
    replace: replace,
    glob: glob
};
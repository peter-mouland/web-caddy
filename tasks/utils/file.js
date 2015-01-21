var Promise = require('es6-promise').Promise;
var del = require('del');
var fs = require("fs-extra");
var glob = require('glob');
var chalk = require('chalk');
var ncp = require('ncp').ncp;

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function write(path, contents){
    var file = detail(path);
    fs.mkdirs(file.dir);
    var string = (Buffer.isBuffer(contents)) ? contents.toString('utf-8') : contents;
    return new Promise(function(resolve, reject){
        fs.writeFile(path, string, function(err, written, buffer){
            if (err){
                reject(err);
            }
            resolve(path);
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
            resolve({
                path: path,
                contents: data
            });
        });
    });
}

function read(src){
    return globArray(src).then(function(files) {
        var promises = []
        files.forEach(function (file) {
            promises.push(readFile(file))
        })
        return Promise.all(promises)
    }, onError);
}

function replaceInFile(file, replacements){
    return readFile(file).then(function(fileObj){
        fileObj.contents = fileObj.contents.toString('utf-8')
        replacements.forEach(function(replace){
            fileObj.contents = fileObj.contents.replace(replace.replace, replace.with);
        })
        return write(fileObj.path, fileObj.contents);
    }, onError)
}

function replace(src, replacement){
    return globArray(src).then(function(files) {
        var promises = []
        files.forEach(function (file) {
            promises.push(replaceInFile(file, replacement))
        })
        return Promise.all(promises)
    }, onError)
}

function copyFile(src, dest){
    fs.mkdirs(dest);
    var file = detail(src)
    return new Promise(function(resolve, reject){
        fs.copy(src, dest + '/' + file.name, function(err, data){
            if (err){
                reject(err);
            }
            resolve(data);
        });
    });
}

function copy(src, dest){
    return globArray(src).then(function(files){
        var promises = []
        files.forEach(function(file) {
            return copyFile(file, dest)
        });
        return Promise.all(promises);
    }, onError);
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
    }, onError)
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
    copy: copy,
    write: write,
    read: read,
    del: clean,
    copyDirectory: copyDirectory,
    replace: replace,
    glob: globArray
}
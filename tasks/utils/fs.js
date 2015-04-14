var Promise = require('es6-promise').Promise;
var del = require('del');
var fs = require("fs-extra");
var path = require('path');
var ncp = require('ncp').ncp;
var gs = require('glob-stream');
var chokidar = require('chokidar');
var mkdirp = require('mkdirp');
var log = require('./log');
var File = require('./file');

function mkdir(dir){
    return new Promise(function(resolve, reject) {
        mkdirp(dir, function (err) {
            err && reject(err);
            !err && resolve();
        });
    });
}

function writeFile(fileObj){
    var string = (Buffer.isBuffer(fileObj.contents)) ? fileObj.contents.toString('utf-8') : fileObj.contents;
    return mkdir(fileObj.dir).then(function(){
        return new Promise(function(resolve, reject){
            fs.writeFile(path.join(fileObj.dir,fileObj.name), string, function(err, written, buffer){
                err && reject(err);
                !err && resolve(fileObj);
            });
        });
    });
}

function write(src){
    if (!Array.isArray(src)) return writeFile(src);
    var promises = [];
    src.forEach(function (fileObj, i) {
        promises.push(writeFile(fileObj));
    });
    return Promise.all(promises);
}

function stat(filePath){
    return new Promise(function(resolve, reject){
        fs.stat(filePath, function(err, data){
            err && reject(err);
            !err && resolve(data);
        });
    });
}

function readPromise(fileObj){
    return new Promise(function(resolve, reject){
        fs.readFile(fileObj.path, function(err, data){
            err && reject(err);
            !err && resolve(data);
        });
    });
}

function readFile(fileObj){
    return Promise.all([stat(fileObj.path), readPromise(fileObj)]).then(function(outputs){
        fileObj.stat = outputs[0];
        fileObj.contents =  outputs[1];
        return fileObj;
    });
}

function read(src){
    return glob(src).then(function(files) {
        var promises = [];
        files.forEach(function(fileObj) {
            promises.push(readFile(fileObj));
        });
        return Promise.all(promises);
    }, log.onError);
}

function replaceInFile(fileObj, replacements){
    return readFile(fileObj).then(function(fileObj){
        fileObj.contents = fileObj.contents.toString('utf-8');
        replacements.forEach(function(replace){
            fileObj.contents = fileObj.contents.replace(replace.replace, replace.with);
        });
        return write(fileObj);
    }, log.onError);
}

function replace(src, replacement){
    return glob(src).then(function(files) {
        var promises = [];
        files.forEach(function (fileObj) {
            promises.push(replaceInFile(fileObj, replacement));
        });
        return Promise.all(promises);
    }, log.onError);
}

function copyFile(fileObj, dest){
    return mkdir(dest).then(function(){
        return new Promise(function(resolve, reject){
            fs.copy(fileObj.path, dest + '/' + fileObj.name, function(err){
                err && reject(err);
                // wait for copy to stop messing with the file :(
                // todo: start polling stat.size
                !err && setTimeout(resolve,100);
            });
        });
    }, log.onError);
}

function copy(srcGlob, destinationDirectory){
    return glob(srcGlob).then(function(files){
        var promises = [];
        files.forEach(function(fileObj) {
            promises.push(copyFile(fileObj, destinationDirectory));
        });
        return Promise.all(promises);
    }, log.onError);
}

function glob(globArray){
    var stream = gs.create(globArray, { allowEmpty: true });
    return new Promise(function(resolve, reject){
        var files = [];
        stream.on('data', function(fileObj){
            files.push(new File(fileObj));
        });
        stream.on('end', function(err){
            err && reject(err);
            !err && resolve(files);
        });

    });
}

function copyDirectory(src, dest, transform){
    return new Promise(function(resolve, reject){
        ncp(src, dest, { stopOnErr: true, transform: transform },
            function(err){
                err && reject(err);
                // wait for copy to stop messing with the file :(
                // todo: start polling stat.size
                !err && setTimeout(resolve,100);
            }
        );
    });
}

function renameFile(fileObj, replace, withThis){
    return new Promise(function(resolve, reject){
        var name = fileObj.name.replace(replace, withThis);
        var file = new File({path: path.join(fileObj.dir, name)});
        fs.rename(fileObj.path, file.path, function(err){
            err && reject(err);
            !err && resolve(file);
        });
    });
}

function rename(src, replace, withThis){
    return glob(src).then(function(files) {
        var promises = [];
        files.forEach(function (fileObj, i) {
            promises.push(renameFile(fileObj,replace, withThis));
        });
        return Promise.all(promises);
    });
}

function clean(globby){
    return new Promise(function(resolve, reject){
        return del(globby, function (err, delPath){
            err && reject(err);
            !err && setTimeout(function(){resolve(delPath);},150); //up timeout for windows. grr.
        });
    });
}

function watch(src, actions){
    chokidar
        .watch(src, { persistent: true})
        .on('change', function(path) {
            console.log('Watch: File', path, 'has been changed');
            actions.forEach(function(action){
                action();
            });
        })
        .on('add', function(path) {    console.log('Watch: File', path, 'has been added'); })
        .on('addDir', function(path) { console.log('Watch: Directory', path, 'has been added'); })
        .on('error', function(error) { console.log('Watch: Error happened', error); })
        .on('ready', function() {      console.log('Watch: Initial scan complete. Ready for changes.'); })
    ;
}

function createWriteStream(path, options){
    var arr = path.split('/');
    arr.pop();
    mkdirp(arr.join('/'));
    return fs.createWriteStream(path, options);
}

module.exports = {
    mkdir: mkdir,
    read: read,
    write: write,
    del: clean,
    copy: copy,
    rename: rename,
    copyDirectory: copyDirectory,
    replace: replace,
    watch: watch,
    glob: glob,
    readFileSync: fs.readFileSync,
    existsSync: fs.existsSync,
    createWriteStream: createWriteStream
};
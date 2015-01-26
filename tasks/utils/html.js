var chalk = require('chalk');
var file = require('./file');
//maybe upgrade to https://github.com/assemble/assemble

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function concatContent(fileObjs){
    return fileObjs.map(function(file){
        return file.contents;
    }).join('\n');
}

function concatFiles(files){
    return file.read(files)
        .then(function(fileObjs){
            return concatContent(fileObjs)
        }, onError);
}

function create(locationGlob, destination){
    return concat(locationGlob).then(function(contents){
        var detail = file.detail(destination)
        var fileObj = { //todo: new File(destination)
            ext:   detail.ext,
            dir:   detail.dir,
            path: destination,
            name: detail.name,
            contents : contents
        };
        return file.write(fileObj)
    }, onError);
}

module.exports = {
    _concatContent: concatContent,
    _concatFiles: concatFiles,
    create: create
};
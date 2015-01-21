var chalk = require('chalk');
var file = require('./file');

//maybe upgrade to https://github.com/assemble/assemble

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function onSuccess(out) {
    console.log(chalk.green(out));
}

function concat(files){
    return file.read(files).then(function(newFileObj){
        return newFileObj.map(function(file){
            return file.contents;
        }).join('\n');
    }, onError);
}

function create(locationGlob, destination){
    return concat(locationGlob).then(function(content){
        return file.write(destination, content)
    }, onError);
}

module.exports = {
    create: create
};
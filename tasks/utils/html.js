var Promise = require('es6-promise').Promise;
var chalk = require('chalk');
var file = require('./file');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function onSuccess(out) {
    console.log(chalk.green(out));
}

function concat(files){
    return file.read(files).then(function(contents){
        return contents.join('\n');
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
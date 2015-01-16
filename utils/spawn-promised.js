
var Promise = require('es6-promise').Promise;
var child_process = require('child_process');
var spawn = child_process.spawn;

module.exports = {
    spawn : function spawned(cmd, args){
        return new Promise(function(resolve, reject){
            var spawner = spawn(cmd, args);
            spawner.stdout.on('data', function (data) {
                console.log(cmd + ' ' + args[0] + ': ' + data);
            });
            spawner.stderr.on('data', function (data) {
                reject({message: cmd + ' ' + args[0] + ' Error: ' + data});
            });
            spawner.on('close', function (code) {
                resolve({ message: cmd + ' ' + args[0] + ' Complete'});
            });
        });
    }
};


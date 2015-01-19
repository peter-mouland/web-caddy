
var Promise = require('es6-promise').Promise;
var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;

module.exports = {
    spawn : function spawned(cmd, args){
        return new Promise(function(resolve, reject){
            exec(cmd + ' ' + args.join(' '),
                function (error, stdout, stderr) {
                    stdout && console.log(stdout);
                    stderr && console.log(stderr);
                    if (error !== null) {
                        reject({message: cmd + ' ' + args[0] + ' Error: ' + error});
                    } else {
                        resolve({ message: cmd + ' ' + args[0] + ' Complete'});
                    }
                });
        });
    }
};


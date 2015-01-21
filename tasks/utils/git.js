var spawn = require('./spawn').spawn;

function runGitCommand(cmd, args){
    args.unshift(cmd);
    return spawn('git', args);
}

module.exports = {
    commit : function(comment) {
        return spawn('git',['commit', '-m', '"' + comment + '"']);
    },
    tag : function(version) {
        return spawn('git', ['tag', '-a', version, '-m', version]);
    },
    init : function() {
        return runGitCommand('init', [])
    },
    checkout : function(arrFiles) {
        return runGitCommand('checkout', arrFiles)
    },
    add : function(arrFiles) {
        return runGitCommand('add', arrFiles)
    },
    push : function(arrCmds) {
        return runGitCommand('push', arrCmds)
    },
    rm : function(arrCmds) {
        return runGitCommand('rm', arrCmds)
    },
    remote : function(arrCmds) {
        return runGitCommand('remote', arrCmds)
    }
};
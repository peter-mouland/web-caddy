var exec = require('./exec').exec;

function runGitCommand(cmd, args){
    args.unshift(cmd);
    return exec('git', args);
}

module.exports = {
    commit : function(comment) {
        return exec('git',['commit', '-m', '"' + comment + '"']);
    },
    tag : function(version) {
        return exec('git', ['tag', '-a', version, '-m', version]);
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
var spawn = require('./spawn-promised').spawn;

module.exports = {
    checkout : function(arrFiles) {
        arrFiles.unshift('checkout');
        return spawn('git', arrFiles);
    },
    add : function(arrFiles) {
        arrFiles.unshift('add');
        return spawn('git', arrFiles);
    },

    commit : function(comment) {
        return spawn('git',['commit', '-m', '"' + comment + '"']);
    },

    push : function(arrCmds) {
        arrCmds.unshift('push');
        return spawn('git', arrCmds);
    },
    rm : function(arrCmds) {
        arrCmds.unshift('rm');
        return spawn('git', arrCmds);
    },
    init : function() {
        return spawn('git', ['init']);
    },
    remote : function(arrCmds) {
        arrCmds.unshift('remote');
        return spawn('git', arrCmds);
    }
};
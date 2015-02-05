var exec = require('./exec').exec;

module.exports = {
    register : function(arrCmds) {
        arrCmds.unshift('register');
        return exec('bower', arrCmds);
    },

    install : function() {
        return exec('bower', ['install']);
    }
};
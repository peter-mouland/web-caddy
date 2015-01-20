var spawn = require('./spawn').spawn;

module.exports = {
    register : function(arrCmds) {
        arrCmds.unshift('register');
        return spawn('bower', arrCmds);
    },

    install : function(arrCmds) {
        arrCmds.unshift('install');
        return spawn('bower', arrCmds);
    }
};
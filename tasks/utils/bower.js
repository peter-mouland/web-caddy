var spawn = require('./spawn').spawn;

module.exports = {
    register : function(arrCmds) {
        arrCmds.unshift('register');
        return spawn('bower', arrCmds);
    },

    install : function() {
        return spawn('bower', ['install']);
    }
};
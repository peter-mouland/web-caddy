var spawn = require('./spawn-promised').spawn;

module.exports = {
    register : function(arrCmds) {
        return spawn('bower', arrCmds);
    }
};
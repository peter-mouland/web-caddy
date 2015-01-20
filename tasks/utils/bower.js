var spawn = require('./spawn').spawn;

module.exports = {
    register : function(arrCmds) {
        return spawn('bower', arrCmds);
    }
};
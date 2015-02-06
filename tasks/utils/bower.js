var exec = require('./exec').exec;
var findup = require('findup-sync');

module.exports = {
    register : function() {
        var pkg = require(findup('./package.json'));
        var bowerPkg = require(findup('./bower.json'));
        return exec('bower', ['register', bowerPkg.name, pkg.repository.url]);
    },

    install : function() {
        return exec('bower', ['install']);
    }
};
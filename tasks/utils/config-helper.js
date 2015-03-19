var log = require('../utils/log');
var findup = require('findup-sync');
var config;

var helper = {
    getConfig : function(){
        if (config) return config;
        var configPath = findup('component.config.js');
        config = (configPath) ? require(configPath) : false;
        config.paths = this.parsePaths(config.paths);
        return config;
    },
    parsePaths : function(paths) {
        ['scripts', 'styles', 'fonts', 'icons', 'images'].forEach(function (asset, i) {
            for (var pathName in paths) {
                if (!paths[pathName][asset]) {
                    paths[pathName][asset] = paths[pathName].root + '/' + asset;
                }
            }
        });
        return paths;
    },
    configCheck : function(){
        var config = this.getConfig();
        var message = [
            'Your `component.config.js` seems to be out of date.'
        ];
        if (!config){
            log.onError('You must have a component.config.js in the root of your project.');
        }
        if (!config.pkg.version){
            message.push(' * The package.json requires as a `version` string (even "version": "0.0.0" is fine)');
        }
        if (config.s3 && config.s3.directoryPrefix){
            message.push(' * Please update `directoryPrefix` to `target` within the `s3` config.  See API.md#s3');
        }
        //check build config
        if (config.build && config.build.scripts && !config[config.build.scripts]){
            message.push(' * There is no build scripts config object: `' + config.build.scripts + ':{...}`');
        }
        //check test config
        if (config.test && !config[config.test]){
            message.push(' * There is no test config object: `' + config.test + ': {...}`');
        }

        //check serve config
        if (config.serve && !config[config.serve]){
            message.push(' * There is no server config object:  `' + config.serve + ':{...}`');
        }

        //check release config
        if (config.release && !config[config.release]){
            message.push(' * There is no release config object:  `' + config.release + ':{...}`');
        }

        if (message.length>1){
            log.onError(message.join('\n'));
            return message.join('\n');
        }
        return true;
    }
};

module.exports = helper;
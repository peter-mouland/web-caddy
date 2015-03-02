var log = require('../utils/log');

module.exports = {
    parsePaths : function parsePaths(paths) {
        ['scripts', 'styles', 'fonts', 'icons', 'images'].forEach(function (asset, i) {
            for (var pathName in paths) {
                if (!paths[pathName][asset]) {
                    paths[pathName][asset] = paths[pathName].root + '/' + asset;
                }
            }
        });
        return paths;
    },
    configCheck : function configCheck(config){
        var message = [
            'Your `component.config.js` seems to be out of date.'
        ];
        //check build config
        if (config.build.scripts && !config[config.build.scripts]){
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
            message.push(' * There is no server config object:  `' + config.release + ':{...}`');
        }

        if (message.length>1){
            log.onError(message.join('\n'));
            return message.join('\n');
        }
        return true;
    }
};
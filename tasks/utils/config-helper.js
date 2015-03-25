var log = require('../utils/log');
var findup = require('findup-sync');
var config;

var helper = {
    matches: function matches(config, plugins){
        //for backwards compatibility. deprecate in version 2
        var compatibility = [];
        if (config.fonts) compatibility.push('fonts');
        if (config.images) compatibility.push('images');
        if (config.styles) compatibility.push(config.styles);
        if (config.html) compatibility.push(config.html);
        if (config.scripts) compatibility.push(config.scripts);
        if (compatibility.length) config = compatibility;

        return config && config.map(function(i){
                if (plugins.indexOf(i)>-1) return i;
            }).join('');
    },
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
        var error = [
            'Your `component.config.js` seems to be incorrect.'
        ];
        var warn = [
            'Your `component.config.js` seems to be out of date.'
        ];
        if (!config){
            log.onError('You must have a component.config.js in the root of your project.');
        }
        if (!config.pkg.version){
            error.push(' * The package.json requires as a `version` string (even "version": "0.0.0" is fine)');
        }
        //check old config
        if (config.build && !Array.isArray(config.build)){
            warn.push(' * Please update `build` to be an array of items to be built.');
        }
        if (config.release && !Array.isArray(config.release)){
            warn.push(' * Please update `release` to be an array of items to be released.');
        }
        if (config.s3 && config.s3.directoryPrefix){
            warn.push(' * Please update `directoryPrefix` to `target` within the `s3` config.  See API.md#s3');
        }
        //check build config
        if (config.build && config.build.indexOf && config.build.indexOf('requirejs')>=0 && !config.requirejs){
            error.push(' * There is no scripts config object:  `requirejs:{...}`');
        }
        //check test config
        if (config.test && !config[config.test]){
            error.push(' * There is no test config object: `' + config.test + ': {...}`');
        }

        //check serve config
        if (config.serve && !config[config.serve]){
            error.push(' * There is no server config object:  `' + config.serve + ':{...}`');
        }

        //check release config
        if (config.release.indexOf('s3')>=0 && !config.s3){
            error.push(' * There is no release config object:  `s3:{...}`');
        }

        if (error.length>1){
            log.onError(error.join('\n'));
            return error.join('\n');
        }
        if (warn.length>1){
            log.warn(warn.join('\n'));
            return warn.join('\n');
        }
        return true;
    }
};

module.exports = helper;
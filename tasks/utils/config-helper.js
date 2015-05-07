var log = require('../utils/log');
var findup = require('findup-sync');
var fs = require('../utils/fs');
var config;

var helper = {
    matches: function matches(config, plugins){
        return config && config.map(function(i){
            if (plugins.indexOf(i)>-1) return i;
        }).join('');
    },
    getConfig : function(){
        if (config) return config;
        var configPath = findup('caddy.config.js');
        config = (configPath) ? require(configPath) : false;
        this.createGlobs(config);
        return config;
    },
    pathGlob : function (path, type){
        switch (type) {
            case 'serverConfig':
                return path + '/*{CNAME,.htaccess,robots.txt}';
            case 'html':
                return path + '/*.{html,jade,ms,mustache}';
            case 'styles':
                return path + '/{.,*}/!(_)*.{css,scss,sass}';
            case 'scripts':
                return path + '/{.,*}/*.js';
            case 'fonts':
                return path + '/{.,*}/*.{svg,ttf,woff,eot}';
            case 'images':
                return path + '/{.,*}/*.{ico,png,jpg,jpeg,gif,svg}';
        }
    },
    createGlobs : function(config) {
        var self = this;
        config.globs = {
            'testCoverage':'./test/coverage/**/*'
        };
        ['scripts', 'styles', 'fonts', 'images', 'serverConfig', 'html'].forEach(function (asset, i) {
            for (var pathName in config.paths) {
                config.globs[pathName] = config.globs[pathName] || {};
                config.globs[pathName][asset] = self.pathGlob(config.paths[pathName], asset);
            }
        });
    },
    configCheck : function(){
        var config = this.getConfig();
        var error = [
            'Your `caddy.config.js` seems to be incorrect.'
        ];
        var warn = [
            'Your `caddy.config.js` seems to be out of date.'
        ];
        if (!config){
            log.onError('You must have a caddy.config.js in the root of your project.');
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
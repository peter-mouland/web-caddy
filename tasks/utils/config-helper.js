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
    createGlobs : function(config) {
        config.globs = {
            'testCoverage':'./test/coverage/**/*',
            'serverConfig':  '/*{CNAME,.htaccess,robots.txt}',
            'html':  '/*.{html,jade,ms,mustache}',
            'styles':  '/{.,*}/!(_)*.{css,scss,sass}',
            'scripts': '/{.,*}/*.js',
            'fonts': '/{.,*}/*.{svg,ttf,woff,eot}',
            'images': '/{.,*}/*.{ico,png,jpg,jpeg,gif,svg}'
        };
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
        if (!config.tasks){
            error.push(' * Please ensure there is a `tasks` object within your caddy.config.js');
        }
        if (!config.buildPaths){
            error.push(' * Please ensure there is a `buildPaths` object within your caddy.config.js');
        }
        //check build config
        if (config.tasks && config.tasks.build && config.tasks.build.indexOf && config.tasks.build.indexOf('requirejs')>=0 && !config.requirejs){
            error.push(' * There is no scripts config object:  `requirejs:{...}`');
        }
        //check test config
        if (config.tasks && config.tasks.test && !config[config.tasks.test]){
            error.push(' * There is no test config object: `' + config.tasks.test + ': {...}`');
        }

        //check release config
        if (config.tasks && config.tasks.release && config.tasks.release.indexOf('s3')>=0 && !config.s3){
            error.push(' * There is no release config object:  `s3:{...}`');
        } else if (config.tasks && config.tasks.release && config.tasks.release.indexOf('s3')>=0 && config.s3.profile &&
            (config.s3.secret || config.s3.accessKey)){
            error.push(' * Your s3 config need either `profile` OR `secret/accessKey` not all.');
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
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
            'testCoverage':'./test/coverage/**/*'
        };
        for (var pathName in config.paths) {
            config.globs[pathName] = {
                'serverConfig': config.paths[pathName] + '/*{CNAME,.htaccess,robots.txt}',
                'html': config.paths[pathName] + '/*.{html,jade,ms,mustache}',
                'styles': config.paths[pathName] + '/{.,*}/!(_)*.{css,scss,sass}',
                'scripts': config.paths[pathName] + '/{.,*}/*.js',
                'fonts': config.paths[pathName] + '/{.,*}/*.{svg,ttf,woff,eot}',
                'images': config.paths[pathName] + '/{.,*}/*.{ico,png,jpg,jpeg,gif,svg}'
            };
        }
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
            warn.push(' * Please ensure there is a `tasks` object within your caddy.config.js');
        }
        //check build config
        if (config.tasks.build && config.tasks.build.indexOf && config.tasks.build.indexOf('requirejs')>=0 && !config.requirejs){
            error.push(' * There is no scripts config object:  `requirejs:{...}`');
        }
        //check test config
        if (config.tasks.test && !config[config.tasks.test]){
            error.push(' * There is no test config object: `' + config.tasks.test + ': {...}`');
        }

        //check release config
        if (config.tasks.release && config.tasks.release.indexOf('s3')>=0 && !config.s3){
            error.push(' * There is no release config object:  `s3:{...}`');
        } else if (config.tasks.release && config.tasks.release.indexOf('s3')>=0 && config.s3.profile &&
            (config.s3.secret || config.s3.accessKey)){
            error.push(' * Your s3 config need either `profile` OR `secret/accessKey` not all.');
        }
        //if (config.tasks.release && config.tasks.release.indexOf('git')>=0  && config.tasks.release.indexOf('bower')>=0){
        //    error.push(' * There is no need to release to `git` and `bower` as both commands `tag` your release.\n * Please choose one.');
        //}

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
var findup = require('findup-sync');
var path = require('path');
var extend = require('util')._extend;
var fs = require('../utils/fs');
var log = require('../utils/log');
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
        if (config){
            config.appRoot = configPath.replace('caddy.config.js','');
            this.createBuildPaths(config);
            this.createBuildGlobs(config);
        }
        return config;
    },
    createBuildGlobs : function(config) {
        config.buildGlobs = config.buildGlobs || {
            'html':    '/{.,*}/!(_)*.{html,jade,ms,mustache}',
            'styles':  '/{.,*}/!(_)*.{css,scss,sass}',
            'scripts': '/{.,*}/!(_)*.js'
        };
    },
    createBuildPaths : function(config) {
        if (config.buildPaths || !config.paths){ return; }
        config.buildPaths = [];
        config.paths.source && config.buildPaths.push({ source: config.paths.source, target:config.paths.target});
        config.paths.demo && config.buildPaths.push({ source: config.paths.demo, target: config.paths.target});
    },
    normaliseCopy : function (globsArr, buildPaths, options){
        var executables = buildPaths.map(function(buildPath){
            //add any other buildPath configs onto options object
            var configOptions = JSON.parse(JSON.stringify(buildPath));
            delete configOptions.target;
            delete configOptions.source;
            options = extend(configOptions || {}, options || {});
            return globsArr.map(function(glob){
                return {
                    source: path.join(buildPath.source, glob),
                    target: buildPath.target,
                    options: options
                };
            });
        });
        executables = executables.reduce(function(a, b) {
            return a.concat(b);
        });
        return executables;
    },
    normaliseClean : function (globsArr, buildPaths, options){
        var executables = buildPaths.map(function(buildPath){
            //add any other buildPath configs onto options object
            var configOptions = JSON.parse(JSON.stringify(buildPath));
            delete configOptions.target;
            delete configOptions.source;
            options = extend(configOptions || {}, options || {});
            return globsArr.map(function(glob){
                if (Array.isArray(buildPath.target)) log.onError('buildPath target must be a string.');
                return {
                    source: path.join(buildPath.target, glob),
                    target: buildPath.target,
                    options: options
                };
            });
        });
        executables = executables.reduce(function(a, b) {
            return a.concat(b);
        });
        return executables;
    },
    normaliseBuild : function (subtasks, config, source, target, options){
        if (Array.isArray(target)) { log.onError('target must be a string, is currently : ' + target); }
        if (!Array.isArray(subtasks)) subtasks = [subtasks];
        var executables;
        if (source){  //from node API
            executables = subtasks.map(function(subtask){
                return { subTask: subtask, source: source, target: target, options: options};
            });
        } else {
            executables = config.buildPaths.map(function(buildPath){
                //add any other buildPath configs onto options object
                var configOptions = JSON.parse(JSON.stringify(buildPath));
                delete configOptions.target;
                delete configOptions.source;
                var opts = extend(configOptions || {}, options || {});
                return subtasks.map(function(subtask){
                    return {
                        subTask: subtask,
                        source: path.join(buildPath.source, config.buildGlobs[subtask]),
                        target: buildPath.target,
                        options: opts
                    };
                });
            });
            executables = executables.reduce(function(a, b) {
                return a.concat(b);
            });
        }
        return executables;
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
        config.buildPaths.forEach(function(buildPath){
            if (Array.isArray(buildPath.targets)) {
                error.push(' * Please ensure there is a `buildPaths.targets` singular and a string i.e. `buildPath.target`');
            }
        });
        //check copy config
        if (config.tasks && config.tasks.copy && config.tasks.copy.indexOf('server-config')>-1) {
            error.push('Please update caddy.config.js\nReplace \'server-config\' with : \'/*{CNAME,.htaccess,robots.txt,manifest.json}\'');
        }
        //check build config
        if (config.tasks && config.tasks.build && config.tasks.build.indexOf && config.tasks.build.indexOf('requirejs')>=0 && !config.requirejs){
            error.push(' * There is no scripts config object:  `requirejs:{...}`');
        }
        //check test config
        if ((config.tasks && config.tasks.test) || config.karma){
            error.push(' * Please remove test and karma objects from your caddy.config.js\n Please use karma directly see docs/test.md for help ');
        }

        //check release config
        if (config.tasks && config.tasks.release && config.tasks.release.indexOf('s3')>=0 && !config.s3){
            error.push(' * There is no release config object:  `s3:{...}`');
        } else if (config.tasks && config.tasks.release && config.tasks.release.indexOf('s3')>=0 && config.s3.profile &&
            (config.s3.secret || config.s3.accessKey)){
            error.push(' * Your s3 config need either `profile` OR `secret/accessKey` not all.');
        } else if (config.tasks && config.tasks.release && config.tasks.release.indexOf('bower')>=0) {
            error.push(['caddy release bower has been removed.',
                ' * To release to bower please tag you git releases.',
                ' * We recommend not adding `dist` directory to git, instead use the S3'].join('\n'));
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
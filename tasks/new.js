var Promise = require('es6-promise').Promise;
var replaceStream = require('replacestream');
var shell = require("shelljs");
var init = require('./init');
var log = require('./utils/log');
var exec = require('./utils/exec').exec;
var fs = require('./utils/fs');
var bower = require('./utils/bower');

function npmGlobalPath() {
    return shell.exec('npm config get prefix', {silent:true}).output.replace(/\s+$/g, '') + "/lib/node_modules" ;
}

function renameFiles(component){
    return Promise.all([
        fs.rename('./dot.gitignore', 'dot',''),
        fs.rename('./**/main.*', 'main',component)
    ]);
}

function copyBoilerplate(component){
    log.info("\nCopying Component Files ... \n");
    var moduleDir = npmGlobalPath() + '/web-caddy/boilerplate';
    return fs.copyDirectory(moduleDir, './' + component,
        function(read, write, file){
            read.pipe(replaceStream('{{ component }}', component))
                .pipe(write);
    });
}

function newComponent(component) {
    if (fs.existsSync(component)){
        log.onError('Component `' + component + '` already exists');
    }
    return copyBoilerplate(component).then(function(output) {
        shell.cd(component);
        return renameFiles(component);
    }).then(function(output){
        return init.localGit();
    }).then(function(output){
        log.onSuccess(output);
        return installNpms();
    }).then(function(output){
        log.onSuccess(output);
        return bower.install();
    }).then(function(output){
        log.onSuccess(output);
        return init.git(undefined, component);
    }).then(function(){
        log.info(['',
            'Ready!',
            ' * Please go to your new directory:        $ cd ' + component,
            ' * View the basic site, run:               $ npm start',
            ' * Test on the fly, run in a new tab:      $ npm run tdd',
            ' * To see more tasks please go to : ',
            '   https://github.com/peter-mouland/web-caddy/blob/master/docs/API.md'
        ].join('\n'));
    }).catch(log.onError);
}

function installNpms(){
    log.info("\nInstalling Node Modules ... \n");
    return exec('npm',['install']).then(function(output){
        log.onSuccess(output);
    }).catch(log.onError);
}

module.exports = newComponent;
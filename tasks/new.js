var Promise = require('es6-promise').Promise;
var replaceStream = require('replacestream');
var shell = require("shelljs");
var init = require('./init');
var log = require('./utils/log');
var exec = require('./utils/exec').exec;
var fs = require('./utils/fs');
var bower = require('./wrappers/bower');

function hyphensToSpaces(str){
    var s = str.replace(/(?:^|-)\S/g, function(a) { return a.toUpperCase(); });
    return s.replace(/-/g, ' ');
}
function hyphensToCamel(str){
    return str.replace(/-(.)/g,function(a,b){return b.toUpperCase();});
}

function npmGlobalPath() {
    return shell.exec('npm config get prefix', {silent:true}).output.replace(/\s+$/g, '') + "/lib/node_modules" ;
}

function renameFiles(project){
    return Promise.all([
        fs.rename('./dot.gitignore', 'dot',''),
        fs.rename('./**/main.*', 'main',project)
    ]);
}

function copyBoilerplate(project){
    log.info(" * Copying Files");
    var moduleDir = npmGlobalPath() + '/web-caddy/boilerplate';
    return fs.copyDirectory(moduleDir, './' + project,
        function(read, write, file){
            read.pipe(replaceStream('{{ project }}', project))
                .pipe(replaceStream('{{ project.toCamelCase }}', hyphensToCamel(project)))
                .pipe(replaceStream('{{ project.toWord }}', hyphensToSpaces(project)))
                .pipe(write);
    });
}

function newComponent(project) {
    if (fs.existsSync(project)){
        log.onError('`' + project + '` already exists');
    }
    log.onSuccess('Creating New Project :');
    return copyBoilerplate(project).then(function(output) {
        shell.cd(project);
        return renameFiles(project);
    }).then(function(output){
        return init.localGit();
    }).then(function(output){
        log.onSuccess(output);
        log.info(" * Installing Bower Modules");
        return bower.install();
    }).then(function(output){
        for (var i in output){
            log.info( '   * Installed ' + i);
        }
        return init.git({project: project});
    }).then(function(){
        log.info(['',
            'Ready!',
            ' * Please go to your new directory:        $ cd ' + project,
            ' * Install Node Modules:                   $ npm i',
            ' * View the basic site, run:               $ npm start',
            ' * Test on the fly, run in a new tab:      $ npm run tdd',
            ' * To see more tasks please go to : ',
            '   https://github.com/peter-mouland/web-caddy/blob/master/docs'
        ].join('\n'));
    }).catch(log.onError);
}

module.exports = newComponent;
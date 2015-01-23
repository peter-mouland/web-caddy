var Promise = require('es6-promise').Promise;
var chalk = require('chalk');
var file = require('./utils/file');
var bower = require('./utils/bower');
var browserify = require('./utils/browserify');
var sassUtil = require('./utils/sass');
var htmlUtil = require('./utils/html');
var paths = require('../paths');
var now = Date().split(' ').splice(0,5).join(' ');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}
function onSuccess(out) {
    console.log(chalk.green(out));
}

function html(version) {
    if (!version) onError({message:"build.html(version) is required"})
    var src = [ paths.demo.root + '/index.html', paths.demo.root + '/*/*.html'];
    var dest = paths.site['root']+ '/index.html'
    return file.del(dest ).then(function(){
        return htmlUtil.create(src, dest)
    }).then(function(){
        return updateDocs({version:version});
    });
}

function updateDocs(options){
    if (!options || !options.version) onError({message:"build.updateDocs({version:'x.x.x'}) is required.\n got " + JSON.stringify(options)})
    var version = options.version;
    var htmlReplacements = [
        {replace : '{{ site.version }}', with: version},
        {replace : '{{ site.time }}', with: options.now || now}
    ];
    var mdReplacements = [
        {replace : /[0-9]+\.[0-9]+\.[0-9]/g, with: version}
    ].concat(htmlReplacements);

    return Promise.all([
        file.replace( [paths.site['root'] + '/**/*.html'], htmlReplacements)
        , file.replace( ['./README.md'], mdReplacements)
    ]);
}

function fonts() {
    var location = [
        paths.source['fonts'] + '/**/*',
        paths.bower['fonts'] + '/**/*.{eot,ttf,woff,svg}'
    ];
    var dest = paths.site['fonts'];
    return file.del(dest + '/**/*').then(function() {
        return file.copy(location, dest)
    });
}

function images() {
    var src = paths.demo['images'] + '/**/*';
    var dest = paths.site['images'];
    return file.del(dest + '/**/*').then(function(){
        return file.copy(src, dest);
    });
}

function jsDev(){
    return Promise.all([
        browserify.js(paths['source'].js, paths['dist'].js),
        browserify.js(paths['demo'].js, paths['site'].js),
        browserify.js(paths['source'].js, paths['site'].js)
    ]);
}

function jsMin(){
    return Promise.all([
        browserify.jsMin(paths['site'].js, paths['site'].js),
        browserify.jsMin(paths['dist'].js, paths['dist'].js)
    ]);
}

function js(){
    return file.del([paths['dist'].js + '/**/*', paths['site'].js + '/**/*']).then(function(){
        return jsDev().then(jsMin)
    });
}

function sass(){
    return file.del([paths['dist'].css + '/**/*', paths['site'].css + '/**/*']).then(function() {
        return Promise.all([
            sassUtil(paths['source'].sass, paths['dist'].css),
            sassUtil(paths['demo'].sass, paths['site'].css),
            sassUtil(paths['source'].sass, paths['site'].css)
        ]);
    });
}

function all(version){
    if (!version) onError({message:"build.all : version is required\ngot " + version})
    return Promise.all([
        jsDev(),
        fonts(),
        images(),
        sass(),
        html(version)
    ]);
}

module.exports = {
    html: html,
    css: sass,
    js: js,
    images: images,
    fonts: fonts,
    updateDocs: updateDocs,
    all: all
};
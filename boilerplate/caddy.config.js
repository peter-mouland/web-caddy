var pkg = require('./package.json');
/*
 To configure this file further, please see http://
 */

//use the following as defaults and remove the details from this config file?
//create a defualt.config.js in caddy that this merges from?
//javascriptsDir: ['js','scripts','javascript','javascripts']
//stylesheetsDir: ['css','sass','scss','styles','stylesheets']
//karmaConfigs: ['karma.config.js','karma.functional.js','karma.unit.js']
//unitCoverage:'coverage/summary.json'
//staticApp:{
//    server: { baseDir : '_site' }, //todo: use `target`
//    port: 3456 //todo: make this dynamic
//}
//
//module.exports = {
//    pkg: pkg,
//    paths: {
//        source: "./src",
//        demo: "./demo", //supporting code used to demonstrate
//        target: './_site',
//        tests: 'test'
//    },
//    copy: ['fonts', 'images'],
//    build: ['sass', 'mustache', 'browserify'],
//    test: 'karma',
//    release: ['git'],
//    serve: 'staticApp'
//};


module.exports = {
    build: ['fonts', 'images', 'sass', 'mustache', 'browserify', 'html-min'], //plus 'requirejs', 'jade'
    test: 'karma', // or false. mocha not yet available.
    release: ['git', 'gh-pages', 's3', 'bower'], // ['git', 'gh-pages','s3'] or false.
    serve: 'staticApp', // `staticApp` or `nodeApp`
    browserify: {
        insertGlobals : true,
        detectGlobals : false
    },
    karma:{
        functional: './test/karma.functional.js', // string or false. Karma config file.
        unit: './test/karma.unit.js', // string or false. Karma config file with coverage setup.
        unitCoverage: './test/coverage/summary.json'// code coverage summary for unit tests
    },
    s3: { // add your aws release config here.
        bucket: process.env.YOUR_AWS_BUCKET,
        region: process.env.YOUR_AWS_REGION,
        profile: pkg.name, // profile to be used in ~/.aws/credentials
        target: pkg.name + '/' + pkg.version + '/' //target release destination i.e. 'components/'
    },
    staticApp:{
        server: { baseDir : '_site' }, // '_site' or ['_site','bower_component'] etc using 'browserSync' api
        port: 3456 //todo: make this dynamic
    },
    paths: {
        /*
         All paths also have `script`, `styles`, `fonts`, `icons` and `images` properties
         Feel free to specify a custom path i.e.  add `scripts: './src/js'`
         */
        source: { //source files to build your component / site
            root: "./src"
        },
        "demo": { // files used to demo the source code or an accompanying site.
            root: "./demo"
        },
        "site": { // Final build (Compiled demo + source) code pushed to your chosen release cloud i.e. AWS
            root: './_site'
        }
    },
    pkg: pkg
};
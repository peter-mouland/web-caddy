var pkg = require('./package.json');
/*
 To configure this file further, please see http://
 */

//use the following as defaults and remove the details from this config file?
//create a defualt.config.js in caddy that this merges from?
//karmaConfigs: ['karma.*.js','karma.functional.js','karma.unit.js']
//unitCoverage:'coverage/summary.json'
//staticApp:{
//    server: { baseDir : '_site' },
//    port: 3456
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

//document:
//browserify: {
//    insertGlobals : true,
//        detectGlobals : false
//},

//document:
//staticApp:{
//    server: { baseDir : '_site' }, // '_site' or ['_site','bower_component'] etc using 'browserSync' api
//    port: 3456 //todo: make this dynamic
//}

module.exports = {
    pkg: pkg,
    paths: {
        source: "./src",
        "demo": "./demo",
        "target": './_site'
    },
    copy: ['fonts', 'images', 'server-config'],
    build: ['sass', 'mustache', 'browserify', 'html-min'], //plus 'requirejs', 'jade'
    test: 'karma', // or false. mocha not yet available.
    release: ['git', 'gh-pages', 's3', 'bower'], // ['git', 'gh-pages','s3'] or false.
    serve: 'staticApp', // `staticApp` or `nodeApp`
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
    }
};
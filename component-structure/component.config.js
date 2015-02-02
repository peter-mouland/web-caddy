var findup = require('findup-sync');
var bowerPath = findup('bower.json');
var pkg = require(findup('package.json') || './package.json');
var bower = (bowerPath) ? require(bowerPath) : {};

module.exports = {
    bower: bower,
    buildTool: 'gulp', //or grunt
    buildStyles: 'sass', // or less
    buildHTML: 'html-concat', // moustache or assemble or jekyll
    buildScripts: 'browserify', // or requirejs
    release: 'aws', // or false,
    releaseConfig: { //add you release config here... this is for AWS
        bucket: process.env.YOUR_AWS_BUCKET,
        accessKey: process.env.YOUR_AWS_ACCESS_KEY_ID,
        secret: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        region: process.env.YOUR_AWS_REGION,
        directoryPrefix: false
    },
    test: 'karma', //or mocha
    paths: {
        "bower": {
            root: './bower_components',
            fonts: './bower_components/*/dist/fonts'
        },
        "test": { // where your tests config, specs and reports are saved
            root: './test',
            specs: './test/specs',
            config: './test/karma.conf.js',
            summary: './test/coverage/summary.json'
        },
        "site": { //used to save the compiled demo code + pushed to chosen release destination i.e. AWS
            root: './_site',
            scripts: "./_site/scripts",
            styles: './_site/styles',
            fonts: './_site/fonts',
            icons: './_site/icons',
            images: './_site/images'
        },
        "demo": { // files used to demo the source code or an accompanying site
            root: "./demo",
            scripts: "./demo/scripts",
            styles: './demo/styles',
            fonts: './demo/fonts',
            icons: './demo/icons',
            images: './demo/images'
        },
        source: { //source files to build your component / site
            root: "./src",
            scripts: "./src/scripts",
            styles: './src/styles',
            fonts: './src/fonts',
            icons: './src/icons',
            images: './src/images'
        },
        dist : { //destination of your compiled source to be redistributed i.e. via bower
            root: "./dist",
            scripts: "./dist/scripts",
            styles: "./dist/styles",
            fonts: './dist/fonts',
            icons: './dist/icons',
            images: './dist/images'
        }
    },
    pkg: pkg
};
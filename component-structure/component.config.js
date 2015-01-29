var findup = require('findup-sync');
var bowerPath = findup('bower.json');
var pkg = require(findup('package.json') || './package.json');

var bower = (bowerPath) ? require(bowerPath) : {};
bower.release = false;

module.exports = {
    bower: bower,
    aws:{
        release: false,
        bucket: process.env.YOUR_AWS_BUCKET,
        key: process.env.YOUR_AWS_ACCESS_KEY_ID,
        secret: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        region: process.env.YOUR_AWS_REGION
    },
    paths: {
        "bower": {
            root: './bower_components',
            fonts: './bower_components/*/dist/fonts',
        },
        "test": {
            root: './test',
            config: './test/karma.conf.js',
            summary: './test/coverage/summary.json'
        },
        "site": {
            root: './_site',
            scripts: "./_site/scripts",
            styles: './_site/styles',
            fonts: './_site/fonts',
            icons: './_site/icons',
            images: './_site/images'
        },
        "demo": {
            root: "./demo",
            scripts: "./demo/scripts",
            styles: './demo/styles',
            fonts: './demo/fonts',
            icons: './demo/icons',
            images: './demo/images'
        },
        source: {
            root: "./src",
            scripts: "./src/scripts",
            styles: './src/styles',
            fonts: './src/fonts',
            icons: './src/icons',
            images: './src/images'
        },
        dist : {
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
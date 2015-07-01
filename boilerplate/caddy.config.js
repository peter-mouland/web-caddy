var pkg = require('./package.json');
var imagesAndFontsGlob = '/{.,*}/*.{ico,png,jpg,jpeg,gif,svg,ttf,woff,eot}';
var serverFilesGlob = '/*{CNAME,.htaccess,robots.txt,manifest.json}';

module.exports = {
    pkg: pkg,
    buildPaths: [
        {source: "./src", target: './_site', minify: true},
        {source: "./examples", target: './_site'}
    ],
    tasks : {
        copy: [imagesAndFontsGlob, serverFilesGlob],
        bump: ['package.json','README.md', '*/app.json'],
        build: ['sass', 'mustache', 'browserify'],
        serve: 'staticApp',
        test: 'karma',
        release: ['git', 'gh-pages']
    },
    karma: ['./test/karma.functional.js',  './test/karma.unit.js']
};
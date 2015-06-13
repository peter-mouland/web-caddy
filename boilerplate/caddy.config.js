var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist'], minify: true},
        {source: "./examples", targets: ['./_site']}
    ],
    tasks : {
        copy: ['fonts', 'images', 'server-config'],
        build: ['sass', 'mustache', 'browserify'],
        serve: 'staticApp',
        test: 'karma',
        release: ['git', 'gh-pages']
    },
    karma: ['./test/karma.functional.js',  './test/karma.unit.js']
};
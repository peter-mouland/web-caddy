var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist']},
        {source: "./examples", targets: ['./_site']}
    ],
    tasks : {
        copy: ['fonts', 'images', 'server-config'],
        build: ['sass', 'mustache', 'browserify'],
        serve: 'staticApp',
        test: 'karma',
        release: ['git', 'gh-pages']
    },
    'gh-pages': {
        directory: '_site'
    },
    karma:{
        functional: './test/karma.functional.js',
        unit: './test/karma.unit.js'
    }
};
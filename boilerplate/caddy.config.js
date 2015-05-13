var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    paths: {
        source: "./src",
        "demo": "./demo",
        "target": './_site'
    },
    tasks : {
        copy: ['fonts', 'images', 'server-config'],
        build: ['sass', 'mustache', 'browserify'],
        serve: 'staticApp',
        test: 'karma',
        release: ['git', 'gh-pages']
    },
    karma:{
        functional: './test/karma.functional.js',
        unit: './test/karma.unit.js',
        unitCoverage: './test/coverage/summary.json'
    }
};
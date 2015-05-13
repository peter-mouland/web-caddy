var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    paths: {
        source: "./src",
        "demo": "./demo",
        "target": './_site'
    },
    copy: ['fonts', 'images', 'server-config'],
    build: ['sass', 'mustache', 'browserify'],
    test: 'karma',
    release: ['git', 'gh-pages'],
    serve: 'staticApp',
    karma:{
        functional: './test/karma.functional.js',
        unit: './test/karma.unit.js',
        unitCoverage: './test/coverage/summary.json'
    }
};
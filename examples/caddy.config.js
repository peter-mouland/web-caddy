var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    paths: {
        source: "./src",
        "demo": "./demo",
        "target": './_site'
    },
    tasks: {
        copy: ['fonts','images','server-config'],
        build: ['sass', 'mustache', 'browserify'],
        serve: 'staticApp',
        test: 'karma',
        release: ['git', 'gh-pages', 's3', 'bower']
    },
    browserify: {
        insertGlobals: true,
        detectGlobals: false,
        noParse: [
            './bower_components/d3/d3.js'
        ],
        vendorBundle: [
            {file: './bower_components/d3/d3.js', expose: 'd3'}
        ],
        vendorTarget: 'scripts/vendor.js'
    },
    karma:{
        functional: './test/karma.functional.js', // string or false. Karma config file.
        unit: './test/karma.unit.js', // string or false. Karma config file with coverage setup.
        unitCoverage: './test/coverage/summary.json'// code coverage summary for unit tests
    },
    s3: { // add your aws release config here.
        bucket: 'prod-bucket',
        region: 'eu-west-1',
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        //profile: pkg.name, //or false. Used in ~/.aws/credentials
        target: pkg.name + '/' + pkg.version + '/' //target release destination i.e. 'components/'
    }
};

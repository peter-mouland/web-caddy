var pkg = require('./package.json');

module.exports = {
    pkg: pkg,
    buildPaths: [
        {source: "./src", targets: ['./_site', './dist'], minify: true},
        {source: "./examples", targets: ['./_site']},
        {source: './test/fixtures', targets: ['./_test']}
    ],
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
    karma: ['./test/karma.functional.js','./test/karma.unit.js'],
    sass: {
        includePaths: 'bower_components'
    },
    s3: { // add your aws release config here.
        baseDir: '_site',
        bucket: 'prod-bucket',
        region: 'eu-west-1',
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        //profile: pkg.name, //or false. Used in ~/.aws/credentials
        target: pkg.name + '/' + pkg.version + '/' //target release destination i.e. 'components/'
    }
};

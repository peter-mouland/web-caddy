var pkg = require('./package.json');
var imagesAndFontsGlob = '/{.,*}/*.{ico,png,jpg,jpeg,gif,svg,ttf,woff,eot}';
var serverFilesGlob = '/*{CNAME,.htaccess,robots.txt,manifest.json}';

module.exports = {
    pkg: pkg,
    buildPaths: [
        {source: "./src", target: './_site', minify: true, verbose: true},
        {source: "./examples", target: './_site'},
        {source: './test/fixtures', target: './_test'}
    ],
    tasks: {
        copy: [imagesAndFontsGlob, serverFilesGlob],
        build: ['sass', 'mustache', 'browserify'],
        bump: ['package.json','README.md', '*/app.json'],
        serve: 'staticApp',
        release: ['git', 'gh-pages', 's3']
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

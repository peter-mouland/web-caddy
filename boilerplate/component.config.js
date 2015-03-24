var pkg = require('./package.json');

module.exports = {
    build: ['fonts', 'images', 'sass', 'mustache', 'browserify'], //plus 'requirejs', 'jade'
    test: 'karma', // or false. mocha not yet available.
    release: ['git', 'gh-pages', 's3'], // ['git', 'gh-pages','s3'] or false.
    serve: 'staticApp', // `staticApp` or `nodeApp`
    browserify: {
        insertGlobals : true,
        detectGlobals : false
    },
    //requirejs: { //exampe config for requireJS
    //    mainConfigFile: 'src/scripts/require.config.js'
    //},
    karma:{
        functional: './test/karma.functional.js', // string or false. Karma config file.
        unit: './test/karma.unit.js', // string or false. Karma config file with coverage setup.
        unitCoverage: './test/coverage/summary.json'// code coverage summary for unit tests
    },
    s3: { // add your aws release config here.
        bucket: process.env.YOUR_AWS_BUCKET,
        region: process.env.YOUR_AWS_REGION,
        profile: pkg.name, // profile to be used in ~/.aws/credentials
        target: pkg.name + '/' + pkg.version + '/' //target release destination i.e. 'components/'
    },
    staticApp:{
        server: { baseDir : '_site' }, // '_site' or ['_site','bower_component'] etc using 'browserSync' api
        port: 3456
    },
    //nodeApp:{ //example config for nodeApp
    //  port: 3456
    //  script : 'src/app/server.js', //server script
    //  proxy: 'http://localhost:3000',
    //  env: { NODE_ENV: 'local'} // env vars
    //},
    paths: {
        /*
        All paths also have `script`, `styles`, `fonts`, `icons` and `images` properties
        Feel free to specify a custom path i.e. `scripts: './src/js'`
        */
        "bower": {
            root: './bower_components',
            fonts: './bower_components/*/dist/fonts'
        },
        source: { //source files to build your component / site
            root: "./src"
        },
        "demo": { // files used to demo the source code or an accompanying site.
                  // not files you would want to distribute.
            root: "./demo"
        },
        dist : { // Compiled source code to be redistributed i.e. via bower
            root: "./dist"
        },
        "site": { // Final build (Compiled demo + source) code pushed to your chosen release cloud i.e. AWS
            root: './_site'
        }
    },
    pkg: pkg
};
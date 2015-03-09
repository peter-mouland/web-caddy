var bower = require('./bower.json');
var pkg = require('./package.json');

module.exports = {
    bower: bower,
    build: {
        fonts: true, // true or false. Set to false if you are doing your own thing in the fonts directory
        images: true, // true or false.
        styles: 'sass', // 'sass'. less not yet available
        html: 'mustache',// 'mustache' or 'jade'. handlebars not yet available
        scripts: 'browserify' // 'browserify' or 'requirejs'
    },
    test: 'karma', // or false. mocha not yet available.
    release: 's3', // or false.
    serve: 'staticApp', // `staticApp` or `nodeApp`
    browserify: {
        insertGlobals : true,
        detectGlobals : false
    },
    //requirejs: { //exampe config for requireJS
    //    mainConfigFile: 'src/scripts/require.config.js'
    //},
    karma:{  //  where your tests config and coverage summary locations
        config: './test/karma.conf.js',
        summary: './test/coverage/summary.json'
    },
    s3: { // add your aws release config here.
        bucket: process.env.YOUR_AWS_BUCKET,
        region: process.env.YOUR_AWS_REGION,
        profile: pkg.name, // profile to be used in ~/.aws/credentials
        directoryPrefix: false //prefix your target release destination i.e. 'components/'
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
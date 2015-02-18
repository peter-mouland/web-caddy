var bower = require('./bower.json');
var pkg = require('./package.json');

module.exports = {
    bower: bower,
    build: {
        fonts: true, // true or false. Set to false if you are doing your own thing in the fonts directory
        styles: 'sass', // 'sass'. less not yet available
        html: 'mustache',// 'mustache'. handlebars not yet available
        scripts: 'browserify' // 'browserify' or 'requirejs'
    },
    test: { // or false.  where your tests config, specs and reports are saved
        type: 'karma',//or mocha not yet available
        config: './test/karma.conf.js',
        summary: './test/coverage/summary.json'
    },
    release: { // or false. add you release config here.
        type: 'aws',
        bucket: process.env.YOUR_AWS_BUCKET,
        accessKey: process.env.YOUR_AWS_ACCESS_KEY_ID,
        secret: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        region: process.env.YOUR_AWS_REGION,
        directoryPrefix: false //prefix your target release destination
    },
    serve: {
        type:'static', // `static` or `node`
        directories : '_site', //only for `static` : '_site' or ['_site','bower_component'] etc
        port: 3456 // for `static` and `node`
        //script : 'src/app/server.js', //server script only for `node`
        //host: 'http://localhost:3000', // host only for `node`
        //env: { NODE_ENV: 'local'} // env vars only for `node`
    },
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
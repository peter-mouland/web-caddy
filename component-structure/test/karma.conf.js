module.exports = function(config) {
    config.set({
        basePath: '..',
        browsers: ['Chrome', 'PhantomJS'],
        frameworks: ['commonjs', 'jasmine'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'src/**/*.js': ['commonjs', 'coverage'],
            'test/**/*.js': ['commonjs']
        },
        coverageReporter: {
            type : 'html',
            dir : 'test/coverage/'
        },
        files: [
            'src/**/*.js',
            'test/**/*.spec.js'
        ],
        exclude: [
            'src/**/*.requirejs.js'
        ],
        browserify: {
            debug: false
        }
    });
};
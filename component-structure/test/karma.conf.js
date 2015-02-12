module.exports = function(config) {
    return config.set({
        basePath: '..',
        browsers: ['PhantomJS'],
        frameworks: ['commonjs', 'jasmine'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'src/**/*.js': ['commonjs', 'coverage'],
            'bower_components/bskyb-*/src/**/*.js': ['commonjs'],
            'test/**/*.js': ['commonjs'],
            '_site/*.html': ['html2js']
        },
        plugins:['karma-html2js-preprocessor', 'karma-coverage', 'karma-commonjs', 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-chrome-launcher'],
        coverageReporter: {
            dir : 'test/coverage/',
            reporters: [
                { type: 'html',
                    subdir: function(browser) {
                        return browser.toLowerCase().split(/[ /-]/)[0];
                    },
                    watermarks: {
                        statements: [75, 85],
                        lines: [75, 85],
                        functions: [75, 85],
                        branches:[50, 85]
                    }},
                { type: 'json-summary', subdir: '.', file: 'summary.json' },
            ]
        },
        files: [
            {pattern: '_site/*.html', watched: false },
            {pattern: 'bower_components/bskyb-*/src/**/*.js', included: true },
            {pattern: '_site/**/*.*', included: false, served: true},
            'src/**/*.js',
            'test/**/*.spec.js'
        ],
        exclude: [
            'src/**/*.requirejs.js'
        ]
    });
};
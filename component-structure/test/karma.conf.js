module.exports = function(config) {
    return config.set({
        basePath: '..',
        browsers: ['PhantomJS'],
        frameworks: ['commonjs', 'jasmine'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'src/**/*.js': ['commonjs', 'coverage'],
            'test/**/*.js': ['commonjs']
        },
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
                        branches:[75, 85]
                    }},
                { type: 'json-summary', subdir: '.', file: 'summary.json' },
            ]
        },
        files: [
            'src/**/*.js',
            'test/**/*.spec.js'
        ],
        exclude: [
            'src/**/*.requirejs.js'
        ]
    });
};
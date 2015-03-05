module.exports = function(config) {
    var karmaConfig = {
        basePath: '..',
        browsers: ['PhantomJS'],
        frameworks: ['browserify', 'jasmine'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'test/**/*.js': ['browserify'],
            '_site/*.html': ['html2js']
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
            {pattern: '_site/**/*.*', included: true, served: true, watched: true},
            'test/**/*.spec.js'
        ],
        exclude: [
            '**/*.png',
            '**/*.min.js',
            '**/*.requirejs.js'
        ]
    };
    var pkg = require('../package.json');
    var istanbul = require('browserify-istanbul');
    var transform =  istanbul({ ignore: ['**/bower_components/**']  });
    karmaConfig.browser = pkg.browser || {};
    karmaConfig["browserify-shim"] = pkg["browserify-shim"] || {};
    karmaConfig.browserify = pkg.browserify || {};
    if (karmaConfig.browserify.transform) {
        karmaConfig.browserify.transform.push(transform);
    } else {
        karmaConfig.browserify.transform = [ transform ];
    }
    return config.set(karmaConfig);
};
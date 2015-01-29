module.exports = {
    "bower": {
        root: './bower_components',
        fonts: './bower_components/*/dist/fonts'
    },
    "test": {
        root: './test',
        config: './test/karma.conf.js',
        phantom: './test/coverage/phantomjs',
        summary: './test/coverage/summary.json'
    },
    "site": {
        root: './_site',
        scripts: "./_site/scripts",
        styles: './_site/styles',
        fonts: './_site/fonts',
        icons: './_site/icons',
        images: './_site/images'
    },
    "demo": {
        root: "./demo",
        scripts: "./demo/scripts",
        styles: './demo/styles',
        fonts: './demo/fonts',
        icons: './demo/icons',
        images: './demo/images'
    },
    source: {
        root: "./src",
        scripts: "./src/scripts",
        styles: './src/styles',
        fonts: './src/fonts',
        icons: './src/icons',
        images: './src/images'
    },
    dist : {
        root: "./dist",
        scripts: "./dist/scripts",
        styles: "./dist/styles",
        fonts: './dist/fonts',
        icons: './src/icons',
        images: './src/images'
    }
};
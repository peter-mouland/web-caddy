var browserSync = require('browser-sync');

function loadBrowser(baseDir){
    browserSync({
        port: 3456,
        server: {
            baseDir: baseDir
        }
    });
}

module.exports = loadBrowser
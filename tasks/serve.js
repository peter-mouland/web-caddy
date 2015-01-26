var browserSync = require('browser-sync');

function loadBrowser(baseDir){
    browserSync({
        //proxy:'localhost:9876'
        port: 3456,
        server: {
            baseDir: baseDir
        }
    });
}

module.exports = loadBrowser
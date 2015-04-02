var gulp = require('gulp');
var caddy = require('web-caddy');
var paths = caddy.paths;
var argv = process.argv.slice(3).toString();

function onError(err) {
    console.log(err.message || err);
    process.exit(1);
}

gulp.task('build', function() {
    return caddy.build.run().catch(onError);
});

gulp.task('serve',  function() {
    return caddy.serve.run().catch(onError);
});

gulp.task('test', function(){
    return caddy.test.run().catch(onError);
});

gulp.task('release', function(){
    var version = argv.split('--version=')[1];
    return caddy.release.run(version).catch(onError);
});
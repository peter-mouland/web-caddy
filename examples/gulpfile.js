var gulp = require('gulp');
var caddy = require('web-caddy');
var argv = process.argv.slice(3).toString();

function onError(err) {
    console.log(err.message || err);
    process.exit(1);
}

gulp.task('build', function() {
    return caddy.build.all().catch(onError);
});

gulp.task('serve',  function() {
    return caddy.serve.all().catch(onError);
});

gulp.task('test', function(){
    return caddy.test.all().catch(onError);
});

gulp.task('release', function(){
    var version = argv.split('--version=')[1];
    return caddy.release.all({version:version}).catch(onError);
});
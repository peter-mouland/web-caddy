'use strict';

var gulp = require('gulp');
var helper = require('component-helper');
var paths = helper.paths;
var argv = process.argv.slice(3).toString();

function onError(err) {
    console.log(err.message || err);
    process.exit(1);
}

gulp.task('build', function() {
    return helper.build.all().catch(onError)
});

gulp.task('serve',  function() {
    return helper.serve.all().catch(onError);
});

gulp.task('test', function(){
    return helper.test.all().catch(onError);
});

gulp.task('release', function(){
    var version = argv.split('--version=')[1];
    return helper.release.all(null, version).catch(onError);
});
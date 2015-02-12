'use strict';

var gulp = require('gulp');
var component = require('component-helper');
var paths = component.paths;
var argv = process.argv.slice(3).toString();

function onError(err) {
    console.log(err.message || err);
    process.exit(1);
}

gulp.task('build', function() {
    return component.build.all().catch(onError)
});

gulp.task('serve',  function() {
    return component.serve.all().catch(onError);
});

gulp.task('test', function(){
    return component.test.all().catch(onError);
});

gulp.task('release', function(){
    var version = argv.split('--version=')[1];
    return component.release.all(null, version).catch(onError);
});
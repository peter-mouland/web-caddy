'use strict';

var gulp = require('gulp');
var componentHelper = require('component-helper');
var paths = componentHelper.paths;
var tasks = componentHelper.tasks;

function onError(err) {
    console.log(err.message || err);
    process.exit(1);
}

gulp.task('build', function() {
    return tasks.build.all().catch(onError)
});

gulp.task('serve',  ['build'], function() {
    return tasks.serve.all().catch(onError);
});

gulp.task('test', ['build'], function(){
    return tasks.test.all().catch(onError);
});

gulp.task('release', ['build', 'test'], function(){
    return tasks.release.all().catch(onError);;
});
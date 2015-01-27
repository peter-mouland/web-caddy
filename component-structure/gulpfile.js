'use strict';

var gulp = require('gulp');
var componentHelper = require('component-helper')(gulp);
var paths = componentHelper.paths;

gulp.task('pre-build', ['custom-gulp-task-1'], function(cb){
    //exmape  task
    return cb();
});

gulp.task('custom-gulp-task-1', function(cb){
    //exmape  task
   return cb();
});
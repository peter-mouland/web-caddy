'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var skyComponentHelper = require('gulp-sky-component-helper')(gulp, pkg);
var paths = skyComponentHelper.paths;
var runSequence = require('run-sequence');

gulp.task('pre-build', function(cb){
    //example pre-build task, which is automatically part of the build process
    return runSequence('custom-gulp-task-1', cb);
});

gulp.task('custom-gulp-task-1', function(cb){
    //exmape empty task
   return cb();
});
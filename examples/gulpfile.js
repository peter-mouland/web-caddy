'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var skyComponentHelper = require('gulp-sky-component-helper')(gulp, pkg);
var paths = skyComponentHelper.paths;
var runSequence = require('run-sequence');

gulp.task('pre-build', function(cb){
    //this task is a part of the build process
//    return runSequence('custom-gulp-task-1','custom-gulp-task-2', cb);
});
'use strict';

var gulp = require('gulp');
var componentHelper = require('../index.js')(gulp, {root: '.'});
var paths = componentHelper.paths;
var runSequence = require('run-sequence');


gulp.task('pre-build', function(cb){
    console.log('test setting pre-build works!')
    return cb();
});

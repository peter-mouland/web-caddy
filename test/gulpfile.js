'use strict';

var gulp = require('gulp');
var pkg = require('../package.json');
var componentHelper = require('../')(gulp, pkg);
var paths = componentHelper.paths;


gulp.task('pre-build', function(cb){
    console.log('test setting pre-build works!')
    return cb();
});

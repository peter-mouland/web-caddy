'use strict';

var gulp = require('gulp');
var pkg = require('../package.json');
var skyComponentHelper = require('../')(gulp, pkg);
var paths = skyComponentHelper.paths;


gulp.task('pre-build', function(cb){
    console.log('test setting pre-build works!')
    return cb();
});

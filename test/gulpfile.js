'use strict';
console.log('Gulp started: ', Date());
var gulp = require('gulp');
var componentHelper = require('../index.js')(gulp, {root: '.'});
var paths = componentHelper.paths;
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('test:clean', function(cb){
    return del([
        './demo',
        './src',
        './*.md',
        './.gitignore',
        './*.gitignore',
        './bower.json'
    ], cb);
});



/*
 * MOCK TASKS
 * We dont want to actually run any commit commands when testing!
 */
gulp.task('pre-build', function(cb){
    console.log('test setting pre-build works!');
    return cb();
});

gulp.task('release:gh-pages', function (cb) {
    console.log('in "mock" gh-pages');
    return cb();
});

gulp.task('git-tag', function(cb) {
    console.log('in "mock" git-tag');
    return cb();
});

gulp.task('git-commit-push', function(cb){
    console.log('in "mock" git-commit-push');
    return cb();
});

gulp.task('init:gh-pages', function(cb) {
    console.log('in "mock" initGHPages');
    return cb();
});

gulp.task('init:master', function(cb) {
    console.log('in "mock" initMaster');
    return cb();
});

gulp.task('init:bower', function(cb) {
    console.log('in "mock" init:bower');
    return cb();
});

gulp.task('release:aws', function(cb) {
    console.log('in "mock" release:aws');
    return cb();
});
'use strict';
var gulp;
var pkg;
var browserSync = require('browser-sync');
var plugins = require('gulp-load-plugins')();
var paths = require('./paths');


function copyDir(location, fileType){
    var files = (fileType === 'css') ? '/main.css' : '/**/*';
    return gulp.src([paths[location][fileType] + files])
        .pipe(gulp.dest(paths.dist[fileType]));
}

function awsUpload(fileType, awsS3){
    var path = 'components/' + pkg.name.replace('bskyb-','') + '/' + pkg.version + '/' + fileType + '/';
    return gulp.src(paths.dist[fileType] + '/**/*')
        .pipe(awsS3.upload({ path: path } ));
}

function updateDocs(files){
    var now = Date().split(' ').splice(0,5).join(' ');
    return gulp.src(files, { base : './' })
        .pipe(plugins.replace(/[0-9]+\.[0-9]+\.[0-9]/g, pkg.version))
        .pipe(plugins.replace(/{{ site.version }}/g, pkg.version))
        .pipe(plugins.replace(/{{ site.time }}/g, now))
        .pipe(gulp.dest('./'));
}

function createBaseStructure(){
    //todo
}

function initBower(){
    //todo
}

function initGHPages(){
    //todo
}

function gulpTasks(globalGulp, globalPkg){
    gulp = globalGulp;
    pkg = globalPkg;
    var runSequence = require('run-sequence').use(gulp);


    gulp.task('pre-build', function(cb){
        //
    });

    gulp.task('sass', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
        return gulp.src([
                paths.source['sass'] + '/**/*.scss',
                paths.demo['sass'] + '/**/*.scss',
                paths.site['sass'] + '/**/*.scss'])
            .pipe(plugins.sass({
                includePaths: ['bower_components'],
                outputStyle: 'nested'
            }))
            .pipe(plugins.autoprefixer())
            .pipe(gulp.dest(paths.site['css']))
            .pipe(browserSync.reload({stream:true}));
    });

    gulp.task('bower', function() {
        return plugins.bower()
    });

    gulp.task('gh-pages', function () {
        gulp.src(paths.site['root'] + "/**/*")
            .pipe(plugins.deploy({
                cacheDir: '.tmp'
            })).pipe(gulp.dest('/tmp/gh-pages'));
    });



    gulp.task('run-release-bower', function(cb) {
        plugins.run('git tag -a v'+ pkg.version +' -m "release v' + pkg.version +' for bower"; git push origin master v'+ pkg.version).exec();
    });

    gulp.task('browserSync', function() {
        browserSync({
            port: 3456,
            server: {
                baseDir: paths.site['root']
            }
        });
    });

    gulp.task('create-bower-dist', function() {
        copyDir('site', 'css');
        copyDir('site','sass');
        copyDir('site','fonts');
        return copyDir('source','sass');

    });

    gulp.task('aws', function() {
        var awsS3 = plugins.awsS3.setup({bucket: process.env.AWS_SKYGLOBAL_BUCKET});
        awsUpload('css',awsS3);
        awsUpload('js', awsS3);
        awsUpload('fonts', awsS3);
        awsUpload('icons', awsS3);
    });

    gulp.task('watch', function() {
        gulp.watch(paths.site['root'], ['create-site']);
        gulp.watch([paths.source['sass'] + '/**/*',paths.demo['sass']], ['sass']);
    });

    gulp.task('create-site', function createSite() {
        return gulp.src([paths.demo['root'] + '/index.html',
                paths.demo['root'] +'/_includes/*.html'])
            .pipe(plugins.concat('index.html'))
            .pipe(gulp.dest(paths.site['root']));
    });

    gulp.task('build', function(cb) {
        return runSequence('clean', 'pre-build', ['create-site','bower'], ['update-docs-version', 'sass'],'create-bower-dist',
            cb
        );
    });

//remove temporary directors
    gulp.task('clean', function(cb) {
        return gulp.src([
            './.tmp',
            paths.site['root'],
            paths.dist['root']
        ], {base: './'})
            .pipe(plugins.clean());
    });

//update the version number used within all documentation and html
    gulp.task('update-docs-version-within-md', function(){
        return updateDocs(['README.md']);
    });
    gulp.task('update-docs-version-within-site', function(){
        return updateDocs([paths.site['root'] + '/**/*.html']);
    });
    gulp.task('update-docs-version', function(cb){
        return runSequence(['update-docs-version-within-site', 'update-docs-version-within-md'],cb);
    });


    /*
     * Common Gulp tasks
     */
    gulp.task('init', function() {
        return gulp.src(__dirname + '/component-structure/**/*')
            .pipe(plugins.replace(/{{ component }}/g, pkg.name))
            .pipe(gulp.dest('./'));
    });

    gulp.task('serve', function(callback) {
        return runSequence(
            'build',
            ['browserSync', 'watch'],
            callback
        );
    });

    gulp.task('release:bower', function(cb) {
        return runSequence(
            'build',
            'run-release-bower',
            cb
        );
    });

    gulp.task('release:gh-pages', function(cb) {
        return runSequence(
            'build',
            'gh-pages',
            cb
        );
    });

    gulp.task('release:cdn', function(cb) {
        return runSequence(
            'build',
            'aws',
            cb
        );
    });

    return {
        paths: paths
    }
}


module.exports = gulpTasks;
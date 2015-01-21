'use strict';
var gulp;
var pkg;

var findup = require('findup-sync');
var browserSync = require('browser-sync');
var semver = require('semver');
var minimist = require('minimist');
var paths = require('./paths');
var init = require('./tasks/initialise');
var build = require('./tasks/build');
var test = require('./tasks/test');

var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-gh-pages': 'gh-pages',
        'gulp-aws-s3': 'aws-s3'
    }
});
var knownArgs = {
    string: 'version',
    default: { version: 'patch' }
};
var args = minimist(process.argv.slice(2), knownArgs);


function handleError(err, exitOnError) {
    var displayErr = plugins.util.colors.red(err);
    plugins.util.log(displayErr);
    if (exitOnError) process.exit(1);
}

function watch(){
    gulp.watch(paths.demo['root'] + '/**/*.html', ['html']);
    gulp.watch([
        paths.source['sass'] + '/**/*',
        paths.demo['sass'] + '/**/*'], ['sass']);
    gulp.watch([
        paths.source['js'] + '/**/*',
        paths.demo['js'] + '/**/*'], ['js']);
}

function loadBrowser(baseDir){
    browserSync({
        port: 3456,
        server: {
            baseDir: baseDir
        }
    });
}

function gulpTasks(globalGulp){
    gulp = globalGulp;
    var packageFilePath = findup('package.json');
    pkg = require(packageFilePath);
    var runSequence = require('run-sequence').use(gulp);

    /*
     * Building
     */
    gulp.task('sass', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
        return build.css().then(function(){
            browserSync.reload({stream:false});
        });
    });

    gulp.task('js', function() {
        browserSync.notify('<span style="color: grey">Running:</span> JS compiling');
        return build.js().then(function(){
            browserSync.reload({stream:false});
        });
    });

    gulp.task('html', function() {
        browserSync.notify('<span style="color: grey">Running:</span> HTML compiling');
        return build.html().then(function(){
            browserSync.reload({stream:false});
        });
    });

    gulp.task('build', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Site compiling');
        return build.all().then(function(){
            browserSync.reload({stream:false})
        })
    });

    gulp.task('update-docs', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Docs compiling');
        return build.updateDocs({version: pkg.version}).then(function(){
            browserSync.reload({stream:false})
        })
    });

    /*
     * Serving
     */
    gulp.task('serve:quick', function(callback) {
        loadBrowser(paths.site['root']);
        watch();
    });

    gulp.task('serve', ['build', 'serve:quick']);

    /*
     * Testing
     */
    gulp.task('test:single-run', function (done) {
        return test.singleRun().catch(function(){
            process.exit(1);
        });
    });
    gulp.task('test:tdd', function (done) {
        return test.tdd().catch(function(){
            process.exit(1);
        });
    });
    gulp.task('test', ['test:single-run'], function(cb){
        return test.coverage().catch(function(){
            process.exit(1);
        })
    });

    /*
     * RELEASING
     */
    gulp.task('bump-version', function(cb){
        pkg.version = semver.inc(pkg.version, args.version);
        return gulp.src('./*.json')
            .pipe(plugins.bump({type: args.version}))
            .pipe(gulp.dest('./'));
    });

    gulp.task('git:commit-push', function(cb){
        return plugins.run(
            'git commit -am "Version bump for release";' +
            'git push origin master').exec('', cb);
    });
    gulp.task('git:tag', function(cb) {
        console.log('** Tagging Git : v' +  pkg.version + ' **\n');
        return plugins.run(
                'git tag -a v'+ pkg.version +' -m "release v' + pkg.version +'"; ' +
                'git push origin master v'+ pkg.version
        ).exec('', cb);
    });

    gulp.task('release:gh-pages', function () {
        return gulp.src(paths.site['root'] + "/**/*")
            .pipe(plugins['gh-pages']({
                cacheDir: '.tmp'
            })).pipe(gulp.dest('/tmp/gh-pages'));
    });
    gulp.task('release:aws', function(cb) {
        var configPath = findup('config/index.js');
        var config = require(configPath);
        if (config.aws && config.aws.bucket && config.aws.release) {
            console.log('** Pushing to Amazon S3 : ' + config.aws.bucket + ' **\n');
            var awsS3 = plugins['aws-s3'].setup(config.aws);
            return gulp.src([
                paths['site']['root'] + '/**/*.*'])
                .pipe(awsS3.upload({ path: 'components/' + pkg.name + '/' + pkg.version + '/' } ));
        } else {
            console.log('** Amazon S3 release skipped **\n' +
                'AWS variables are not set \n' +
                ' or \n' +
                ' aws.release in config/index.js set to false\n');
            return cb();
        }
    });

    gulp.task('release', ['build', 'test', 'bump-version', 'update-docs', 'git:commit-push', 'git:tag', 'release:gh-pages', 'release:aws']);

    gulp.task('transfer:user', function(cb) {
      if (!gulp.env.oldUser || !gulp.env.newUser){
          handleError('You must give `old-user` and `new-user` arguments i.e,');
          handleError('`gulp rename-user --old-user=someone --new-user=someone-else`', true);
      }
      return gulp.src('./*')
        .pipe(plugins.replace(gulp.env.oldUser, gulp.env.newUser))
        .pipe(gulp.dest('./'));
    });

    return {
        paths: paths
    }
}

module.exports = gulpTasks;

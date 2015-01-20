'use strict';
var gulp;
var pkg;

var findup = require('findup-sync');
var browserSync = require('browser-sync');
var semver = require('semver');
var minimist = require('minimist');
var paths = require('./paths');
var karma = require('karma').server;
var init = require('./tasks/initialisations');
var build = require('./tasks/build');

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

function gulpTasks(globalGulp){
    gulp = globalGulp;
    var packageFilePath = findup('package.json');
    pkg = require(packageFilePath);
    var runSequence = require('run-sequence').use(gulp);

    gulp.task('browserSync', function() {
        browserSync({
            port: 3456,
            server: {
                baseDir: paths.site['root']
            }
        });
    });

    gulp.task('sass', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
        return build.css().then(function(){
            browserSync.reload({stream:true});
        });
    });

    gulp.task('js', function() {
        browserSync.notify('<span style="color: grey">Running:</span> JS compiling');
        return build.js().then(function(){
            browserSync.reload({stream:true});
        });
    });

    gulp.task('html', function() {
        browserSync.notify('<span style="color: grey">Running:</span> HTML compiling');
        return build.html().then(function(){
            browserSync.reload({stream:true});
        });
    });

    gulp.task('build', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Site compiling');
        return build.all().then(function(){
            browserSync.reload({stream:true})
        })
    });

    gulp.task('update-docs', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Docs compiling');
        return build.updateDocs({version: pkg.version}).then(function(){
            browserSync.reload({stream:true})
        })
    });

    gulp.task('watch', function() {
        gulp.watch(paths.demo['root'] + '/**/*.html', ['html']);
        gulp.watch([
            paths.source['sass'] + '/**/*',
            paths.demo['sass'] + '/**/*'], ['sass']);
        gulp.watch([
            paths.source['js'] + '/**/*',
            paths.demo['js'] + '/**/*'], ['js']);
    });

    gulp.task('bump-version', function(cb){
        pkg.version = semver.inc(pkg.version, args.version);
        return gulp.src('./*.json')
            .pipe(plugins.bump({type: args.version}))
            .pipe(gulp.dest('./'));
    });

    gulp.task('serve', ['build'], function(callback) {
        return runSequence(
            ['browserSync', 'watch'],
            callback
        );
    });

    gulp.task('git:commit-push', function(cb){
        return plugins.run(
                'git commit -am "Version bump for release";' +
                'git push origin master').exec('', cb);
    });

    /*
     * TESTING
     */
    gulp.task('test:single-run', function (done) {
        karma.start({
            configFile: findup(paths.test.config),
            singleRun: true
        }, done);
    });
    gulp.task('test:tdd', function (done) {
        karma.start({
            configFile: findup(paths.test.config)
        }, done);
    });
    gulp.task('test', ['test:single-run'], function(cb){
        var results = require(findup(paths.test.summary));
        var config = require(findup(paths.test.config));
        var coverage = config({set: function(conf){return conf;}}).coverageReporter;
        var thresholds = coverage.reporters[0].watermarks;
        var err = false;
        for (var file in results){
            for (var threshold in thresholds){
                if (results[file][threshold].pct < thresholds[threshold][0]){
                    handleError(file + ' : ' + threshold + ' Coverage is too low (<' + thresholds[threshold][0] + '%)');
                    err = true;
                }
            }
        }
        if (err) process.exit(1);
        cb();
    });

    /*
     * RELEASING
     */
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


    gulp.task('release', function(cb) {
        return runSequence(
            'build',
            'test',
            'bump-version',
            'update-docs',
            'git:commit-push',
            'git:tag',
            'release:gh-pages',
            'release:aws',
            cb
        );
    });

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

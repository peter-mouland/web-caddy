'use strict';
var gulp;
var pkg;

var findup = require('findup-sync');
var browserSync = require('browser-sync');
var del = require('del');
var semver = require('semver');
var browserify = require('browserify');
var minimist = require('minimist');
var transform = require('vinyl-transform');
var paths = require('./paths');
var karma = require('karma').server;

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
    //this.emit('end');
}


function copyToSite(location, fileType){
    return gulp.src(paths[location][fileType] + '/**/*')
        .pipe(gulp.dest(paths.site[fileType]));
}

function setupHasErrors(){
    var errorText = '\nComponent %s Error:' +
        '\nPlease update `package.json` (without spaces): \n  i.e.' +
        '%s\n';
    var error = false;
    if (pkg.name.indexOf(' ') >0){
        console.error(errorText, 'Name',' `"name" : "responsive-images"`');
        error = true;
    }
    if (pkg.repository.url.indexOf(' ') >0){
        console.error(errorText, 'URL', '`"url": "git://github.com/username/component-name.git"`');
        error = true;
    }
    return error;
}

function initBower(cb){
    var configPath = findup('config/index.js');
    var config = require(configPath);
    if (config.bower && config.bower.release && config.bower.name){
        return plugins.run('bower register ' + config.bower.name + ' ' + pkg.repository.url).exec('', cb);
    } else {
        console.log('** Not intialising Bower ** ' +
            'Config is set to false in config/index.js');
        return cb();
    }
}

function initMaster(cb){
    return plugins.run(
            '\n' +'git add gulpfile.js;' +
            '\n' +'git add package.json;' +
            '\n' +'git commit -m "first commit";' +
            '\n' +'git push -u origin master;' +
            '\n').exec('', cb);
}


function initGHPages(cb){
    return plugins.run(
            '\n' +'git checkout --orphan gh-pages;' +
            '\n' +'git checkout gh-pages;' +
            '\n' +'git rm -rf .;' +
            '\n' +'touch gh-pages-initialised.md;' +
            '\n' +'git add gh-pages-initialised.md;' +
            '\n' +'git commit -m "Init gh-pages";' +
            '\n' +'git push --set-upstream origin gh-pages;' +
            '\n' +'git checkout master;' +
            '\n').exec('', cb);
}

function sass(location, destination) {
    browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
    return gulp.src(paths[location]['sass'] + '/**/*.scss')
        .pipe(plugins.sass({
            outputStyle: 'nested'
        }))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(paths[destination]['css']))
        .pipe(browserSync.reload({stream:true}));
}

function gulpTasks(globalGulp){
    gulp = globalGulp;
    var packageFilePath = findup('package.json');
    pkg = require(packageFilePath);
    var gitUser = pkg.repository.url.match(/.com\/(.*)\//)[1];
    var runSequence = require('run-sequence').use(gulp);
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        return b.bundle();
    });


    gulp.task('pre-build', function(cb){
        return cb();
    });

    gulp.task('sass', function() {
        return sass('source', 'dist');
    });

    gulp.task('js:dev', ['clean:js'], function() {
        return gulp.src(paths.source['js'] + '/*.js')
            .pipe(browserified)
            .pipe(gulp.dest(paths.dist['js']));
    });


    gulp.task('js', ['js:dev'], function() {
        return gulp.src(paths.dist['js'] + '/*.js')
            .pipe(plugins.rename({suffix:'.min'}))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(paths.dist['js']))
            .pipe(browserSync.reload({stream:true}));
    });

    gulp.task('browserSync', function() {
        browserSync({
            port: 3456,
            server: {
                baseDir: paths.site['root']
            }
        });
    });

    gulp.task('watch', function() {
        gulp.watch(paths.demo['root'] + '/**/*.html', ['create:site-html']);
        gulp.watch(paths.site['root'] + '/**/*.html', ['update-version-in-site']);
        gulp.watch([
            paths.source['sass'] + '/**/*',
            paths.demo['sass'] + '/**/*'], ['sass']);
        gulp.watch([
            paths.source['js'] + '/**/*',
            paths.demo['js'] + '/**/*'], ['js']);
    });

    gulp.task('create:site-html', function createSite() {
        return gulp.src([paths.demo['root'] + '/index.html',
                paths.demo['root'] +'/_includes/*.html'])
            .pipe(plugins.concat('index.html'))
            .pipe(gulp.dest(paths.site['root']))
            .pipe(browserSync.reload({stream:true}));
    });

    gulp.task('create:site-images', function createSite() {
        return gulp.src(paths.demo['images'] + '/**/*')
            .pipe(gulp.dest(paths.site['images']));
    });

    gulp.task('create:site-fonts', function createSite() {
        return gulp.src([
                paths.source['fonts'] + '/**/*',
                paths.bower['fonts'] + '/**/*.{eot,ttf,woff,svg}'
        ])
            .pipe(plugins.flatten())
            .pipe(gulp.dest(paths.site['fonts']));
    });

    gulp.task('create:site-sass', function() {
        copyToSite('dist', 'css')
        return sass('demo', 'site');
    });

    gulp.task('create:site-js', function createSite() {
        copyToSite('dist', 'js');
        return gulp.src(paths.demo['js'] + '/*.js')
            .pipe(browserified)
            .pipe(gulp.dest(paths.site['js']));
    });

    gulp.task('create:site', function createSite(cb) {
        return runSequence(['create:site-html', 'create:site-sass', 'create:site-js', 'create:site-images', 'create:site-fonts'], cb);
    });

    gulp.task('build', function(cb) {
        return runSequence('clean', 'pre-build', 'create:dist', 'create:site', 'update-version-in-site',
            cb
        );
    });

//remove temporary directors
    gulp.task('clean:js', function(cb) {
        return del([
            paths.site['js']
        ], cb);
    });
    gulp.task('clean:tmp', function(cb) {
        return del([
            '.tmp'
        ], cb);
    });
    gulp.task('clean', ['clean:tmp'], function(cb) {
        return del([
            paths.site['root'] + '/*',
            '!' + paths.site['root'] + '/v*',
            paths.dist['root']
        ], cb);
    });

//update the version number used within all documentation and html
    gulp.task('update-version-in-md', function(){
        return gulp.src(['README.md'], { base : './' })
            .pipe(plugins.replace(/[0-9]+\.[0-9]+\.[0-9]/g, pkg.version))
            .pipe(gulp.dest('./'));
    });
    gulp.task('update-version-in-html', function(){
        var now = Date().split(' ').splice(0,5).join(' ');
        return gulp.src([paths.site['root'] + '/**/*.html'], { base : './' })
            .pipe(plugins.replace(/{{ site.version }}/g, pkg.version))
            .pipe(plugins.replace(/{{ site.time }}/g, now))
            .pipe(gulp.dest('./'));
    });
    gulp.task('update-version-in-site', function(cb){
        return runSequence(['update-version-in-html', 'update-version-in-md'],cb);
    });
    gulp.task('bump-version', function(cb){
        pkg.version = semver.inc(pkg.version, args.version);
        return gulp.src('./*.json')
            .pipe(plugins.bump({type: args.version}))
            .pipe(gulp.dest('./'));
    });

    /*
     * Initialising the component
     */
    gulp.task('copy-structure', function(cb) {
        return gulp.src([__dirname + '/component-structure/**/*',
        '!' + __dirname+ '/component-structure/package.json',
        '!' + __dirname+ '/component-structure/gulpfile.js'])
            .pipe(plugins.replace(/{{ component }}/g, pkg.name))
            .pipe(plugins.replace(/{{ git.username }}/g, gitUser))
            .pipe(gulp.dest('./'));
    });
    gulp.task('rename:js', function(cb) {
        return gulp.src(['./src/js/*.js'], { base : './' })
            .pipe(plugins.rename(function(path){
                path.dirname = "";
                path.basename = path.basename.replace('main', pkg.name);
            }))
            .pipe(gulp.dest('./src/js/'));
    });
    gulp.task('rename:scss', function(cb) {
        return gulp.src(['./src/scss/main.scss'], { base : './' })
            .pipe(plugins.rename(pkg.name + '.scss'))
            .pipe(gulp.dest('./src/scss/'));
    });
    gulp.task('rename:gitignore', function(cb) {
        return gulp.src('./dot.gitignore', { base : './' })
            .pipe(plugins.rename('.gitignore'))
            .pipe(gulp.dest('./'));
    });
    gulp.task('remove-renamed-files', function(cb) {
        return del(
            ['./dot.gitignore', './src/js/main.*', './src/scss/main.scss' ],
            cb);
    });
    gulp.task('init:master', function(cb) {
        return initMaster(cb);
    });
    gulp.task('init:gh-pages', function(cb) {
        return initGHPages(cb);
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
    gulp.task('create:dist', function(cb) {
        return runSequence('bower', ['sass', 'js'], cb);
    });
    gulp.task('git:tag', function(cb) {
        console.log('** Tagging Git : v' +  pkg.version + ' **\n');
        return plugins.run(
                'git tag -a v'+ pkg.version +' -m "release v' + pkg.version +'"; ' +
                'git push origin master v'+ pkg.version
        ).exec('', cb);
    });
    gulp.task('bower', function() {
        return plugins.bower()
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


    /*
     * Common/public Gulp tasks
     */
    gulp.task('init:component', function(cb) {
        if (setupHasErrors()){
            return cb();
        }
        return runSequence(
            'copy-structure',
            ['init:master','rename:gitignore', 'rename:js', 'rename:scss'],
            ['init:gh-pages'],
            'remove-renamed-files',
            cb);
    });

    gulp.task('init:bower', function(cb) {
        return initBower(cb);
    });

    gulp.task('serve', function(callback) {
        return runSequence(
            'build',
            ['browserSync', 'watch'],
            callback
        );
    });

    gulp.task('release', function(cb) {
        return runSequence(
            'build',
            'test',
            'bump-version',
            'update-version-in-site',
            'git:commit-push',
            'git:tag',
            'release:gh-pages',
            'release:aws',
            'clean:tmp',
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

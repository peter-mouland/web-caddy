'use strict';
var gulp;
var pkg = require('../../package.json');
var browserSync = require('browser-sync');
var plugins = {
    autoprefixer: require('gulp-autoprefixer'),
    awsS3 : require('gulp-aws-s3'),
    bower : require('gulp-bower'),
    concat : require('gulp-concat'),
    ghPages : require('gulp-gh-pages'),
    replace : require('gulp-replace'),
    run : require('gulp-run'),
    sass : require('gulp-sass'),
    del : require('del'),
    minimist : require('minimist'),
    'if' : require('gulp-if'),
    bump : require('gulp-bump'),
    rename : require("gulp-rename"),
    uglify : require('gulp-uglify'),
    semver : require('semver'),
    flatten : require('gulp-flatten')
};
var paths = require('./paths');
var knownOptions = {
    string: 'version',
    default: { version: 'patch' }
};
var options = plugins.minimist(process.argv.slice(2), knownOptions);

function copyDir(location, fileType){
    var files = (fileType === 'css') ? '/' + pkg.name + '.css' : '/**/*';
    return gulp.src([paths[location][fileType] + files])
        .pipe(gulp.dest(paths.dist[fileType]));
}

function awsUpload(fileType, awsS3){
    var path = 'components/' + pkg.name + '/' + pkg.version + '/' + fileType + '/';
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

function setupHasErrors(){
    var errorText = '\nSky Component %s Error:' +
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
    var config = require('../../config');
    if (config.bower && config.bower.release && config.bower.name){
        return plugins.run('bower register ' + config.bower.name + ' ' + pkg.repository.url).exec('', cb);
    } else {
        console.log('** Not intialising Bower ** ' +
            'Config is set to false in config/index.js');
        return cb();
    }
}

function initMaster(cb){
    //lines commented out as not needed for a 'cloned' repo
    return plugins.run(
//            '\n' +'git init;' +
            '\n' +'git add gulpfile.js;' +
            '\n' +'git add package.json;' +
            '\n' +'git commit -m "first commit";' +
//            '\n' +'git remote add origin ' + pkg.repository.url.replace('git://github.com/','git@github.com:') + ';' +
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

function gulpTasks(globalGulp){
    gulp = globalGulp;
    var gitUser = pkg.repository.url.match(/.com\/(.*)\//)[1];
    console.log(gitUser)
    var runSequence = require('run-sequence').use(gulp);


    gulp.task('pre-build', function(cb){
        return cb();
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

    gulp.task('js-min', function() {
        return gulp.src(paths.source['js'] + '/**/*')
            .pipe(plugins.concat(pkg.name + '.min.js'))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(paths.site['js']));
    });

    gulp.task('js-dev', function() {
        return gulp.src(paths.source['js'] + '/**/*')
            .pipe(plugins.concat(pkg.name + '.js'))
            .pipe(gulp.dest(paths.site['js']));
    });

    gulp.task('js', function(cb) {
        return runSequence(['js-dev','js-min'],
            cb
        );
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
        gulp.watch([paths.site['root'], paths.demo['root']], ['create-site']);
        gulp.watch([paths.source['sass'] + '/**/*',paths.demo['sass']], ['sass']);
    });


//    create the _ste directories ready for demo
    gulp.task('create-site-html', function createSite() {
        return gulp.src([paths.demo['root'] + '/index.html',
                paths.demo['root'] +'/_includes/*.html'])
            .pipe(plugins.concat('index.html'))
            .pipe(gulp.dest(paths.site['root']));
    });

    gulp.task('create-site-images', function createSite() {
        return gulp.src(paths.demo['images'] + '/**/*')
            .pipe(gulp.dest(paths.site['images']));
    });

    gulp.task('create-site-fonts', function createSite() {
        return gulp.src([
                paths.source['fonts'] + '/**/*',
                paths.bower['fonts'] + '/**/*.{eot,ttf,woff,svg}'
        ])
            .pipe(plugins.flatten())
            .pipe(gulp.dest(paths.site['fonts']));
    });
    gulp.task('create-site', function createSite() {
        return runSequence(['create-site-html', 'create-site-images', 'create-site-fonts']);
    });

    gulp.task('build', function(cb) {
        return runSequence('clean', 'pre-build', ['create-site','bower'], ['update-docs-version', 'sass', 'js'],'create-bower-dist',
            cb
        );
    });

//remove temporary directors
    gulp.task('clean', function(cb) {
        return plugins.del([
            '.tmp',
            paths.site['root'],
            paths.dist['root']
        ], cb);
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
    gulp.task('bump-version', function(cb){
        pkg.version = plugins.semver.inc(pkg.version, options.version);
        return gulp.src('./*.json')
            .pipe(plugins.bump({type: options.version}))
            .pipe(gulp.dest('./'));
    });

    /*
     * Initialising the component
     */
    gulp.task('copy-structure', function(cb) {
        return gulp.src(__dirname + '/component-structure/**/*')
            .pipe(plugins.replace(/{{ component }}/g, pkg.name))
            .pipe(plugins.replace(/{{ git.user }}/g, gitUser))
            .pipe(gulp.dest('./'));
    });
    gulp.task('name-component', function(cb) {
        return gulp.src('./package.json', { base : './' })
            .pipe(plugins.replace(/{{ component }}/g, pkg.name))
            .pipe(plugins.replace(/{{ git.user }}/g, gitUser))
            .pipe(gulp.dest('./'));
    });
    gulp.task('rename-js', function(cb) {
        return gulp.src(['./src/js/main.js'], { base : './' })
            .pipe(plugins.rename(pkg.name + '.js'))
            .pipe(gulp.dest('./src/js/'));
    });
    gulp.task('rename-scss', function(cb) {
        return gulp.src(['./src/scss/main.scss'], { base : './' })
            .pipe(plugins.rename(pkg.name + '.scss'))
            .pipe(gulp.dest('./src/scss/'));
    });
    gulp.task('rename-dot-gitignore', function(cb) {
        return gulp.src('./dot.gitignore', { base : './' })
            .pipe(plugins.rename('.gitignore'))
            .pipe(gulp.dest('./'));
    });
    gulp.task('remove-renamed-files', function(cb) {
        return plugins.del(
            ['./dot.gitignore', './src/js/main.js', './src/scss/main.scss' ],
            cb);
    });
    gulp.task('initMaster', function(cb) {
        return initMaster(cb);
    });
    gulp.task('initGHPages', function(cb) {
        return initGHPages(cb);
    });

    gulp.task('git-commit-push', function(cb){
        return plugins.run(
                'git commit -am "Version bump for release";' +
                'git push origin master').exec('', cb);
    });

    /*
     * RELEASING
     */

//  RELEASING:  Bower tasks
    gulp.task('create-bower-dist', function() {
        copyDir('site', 'js');
        copyDir('site', 'css');
        copyDir('site', 'sass');
        copyDir('source', 'fonts');
        return copyDir('source', 'sass');
    });

    gulp.task('git-tag', function(cb) {
        return plugins.run(
                'git tag -a v'+ pkg.version +' -m "release v' + pkg.version +'"; ' +
                'git push origin master v'+ pkg.version
        ).exec('', cb);
    });
    gulp.task('bower', function() {
        return plugins.bower()
    });

//  RELEASING:  GH Pages
    gulp.task('release:gh-pages', function () {
        gulp.src(paths.site['root'] + "/**/*")
            .pipe(plugins.ghPages({
                cacheDir: '.tmp'
            })).pipe(gulp.dest('/tmp/gh-pages'));
    });

//  RELEASING:  Amazon Web Services
    gulp.task('release:aws', function(cb) {
        var config = require('../../config');
        if (config.aws && config.aws.bucket && config.aws.release) {
            var awsS3 = plugins.awsS3.setup(config.aws);
            awsUpload('css',awsS3);
            awsUpload('js', awsS3);
            awsUpload('fonts', awsS3);
            return awsUpload('icons', awsS3);
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
            return;
        }
        return runSequence(
            'copy-structure',
            ['initMaster','rename-dot-gitignore', 'rename-js', 'rename-scss'],
            ['initGHPages'],
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
            'bump-version',
            'build',
            'git-commit-push',
            'git-tag',
            'release:gh-pages',
            'release:aws',
            cb
        );
    });

    return {
        paths: paths
    }
}


module.exports = gulpTasks;
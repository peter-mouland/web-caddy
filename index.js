'use strict';
var findup = require('findup-sync');
var browserSync = require('browser-sync');
var minimist = require('minimist');
var chalk = require('chalk');
var paths = require('./paths');
var build = require('./tasks/build');
var test = require('./tasks/test');
var release = require('./tasks/release');
var file = require('./tasks/utils/file');

var knownArgs = {
    string: 'version',
    default: { version: 'patch' }
};
var args = minimist(process.argv.slice(2), knownArgs);

function onError(err) {
    console.log(chalk.red(err.message || err));
    process.exit(1);
}

function watch(gulp){
    var htmlPaths = [ paths.demo['root'] + '/**/*.html'];
    var sassPaths = [ paths.source['sass'] + '/**/*', paths.demo['sass'] + '/**/*'];
    var jsPaths =   [ paths.source['js'] + '/**/*',   paths.demo['js'] + '/**/*'];
    gulp.watch(htmlPaths, ['build:html']);
    gulp.watch(sassPaths, ['build:sass']);
    gulp.watch(jsPaths,   ['build:js']);
}

function loadBrowser(baseDir){
    browserSync({
        port: 3456,
        server: {
            baseDir: baseDir
        }
    });
}

function gulpTasks(gulp){
    var packageFilePath = findup('package.json');
    var configPath = findup('config/index.js');
    var config = require(configPath);
    var pkg = require(packageFilePath);

    /*
     * Building
     */
    gulp.task('build:css', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
        return build.css().then(browserSync.reload);
    });
    gulp.task('build:js', function() {
        browserSync.notify('<span style="color: grey">Running:</span> JS compiling');
        return build.js().then(browserSync.reload);
    });
    gulp.task('build:html', function() {
        browserSync.notify('<span style="color: grey">Running:</span> HTML compiling');
        return build.html(pkg.version).then(browserSync.reload);
    });
    gulp.task('build', function() {
        browserSync.notify('<span style="color: grey">Running:</span> Site compiling');
        return build.all(pkg.version).then(browserSync.reload)
    });

    /*
     * Serving
     */
    gulp.task('serve:quick', function() {
        loadBrowser(paths.site['root']);
        watch(gulp);
    });
    gulp.task('serve', ['build', 'serve:quick']);

    /*
     * Testing
     */
    gulp.task('test:single-run', function () {
        return test.singleRun().catch(onError);
    });
    gulp.task('test:tdd', function () {
        return test.tdd().catch(onError);
    });
    gulp.task('test:coverage', function () {
        return test.coverage().catch(onError);
    });
    gulp.task('test:quick', function(){
        return test.all().catch(onError);
    });
    gulp.task('test', ['build'], function(){
        return test.all().catch(onError);
    });

    /*
     * RELEASING
     */
    gulp.task('release:git', function(){
       return release.git(pkg.version);
    });
    gulp.task('release:aws', function(){
       return release.aws(pkg.version, pkg.name, config.aws);
    });
    gulp.task('release:gh-pages', function(){
       return release.ghPages();
    });
    gulp.task('release', ['build', 'test'], function(){
       return release.all(pkg.version, pkg.name, config.aws, args.version).catch(onError);;
    });

    /*
     * Transfer repo
     */
    gulp.task('transfer:user', function() {
      if (!gulp.env.oldUser || !gulp.env.newUser){
          onError('You must give `old-user` and `new-user` arguments i.e,\n'+
                      '`gulp rename-user --old-user=someone --new-user=someone-else`');
      }
      return file.replace('./*', {replace: gulp.env.oldUser, with : gulp.env.newUser})
    });

    return {
        paths: paths
    }
}

module.exports = gulpTasks;

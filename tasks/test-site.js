
var karma = require('karma').server;
var chalk = require('chalk');
var paths = require('../paths');

function onError(err, exitOnError) {
    console.log(chalk.red(err));
    if (exitOnError) process.exit(1);
}

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
                onError(file + ' : ' + threshold + ' Coverage is too low (<' + thresholds[threshold][0] + '%)');
                err = true;
            }
        }
    }
    if (err) process.exit(1);
    cb();
});
# Customisation Examples

This project does not use gulp, but because gulp can handle promises, it is very clean and easy to integrate.

Below is an example of how to serve a node project with one config, then also serve the app using different settings and and test on this server.

**gulpfile.js**

```
var gulp = require('gulp');
var component = require('component-helper');

gulp.task('build', function() {
    return helper.build.all().catch(onError)
});

gulp.task('serve', function() {
    return helper.serve.all({
        script : 'src/app/server.js',
        host: 'http://localhost:3000',
        port: 3001,
        env: { NODE_ENV: 'local'}
    }).catch(onError);
});

gulp.task('test', function(){
    return helper.serve.all({
        script : 'src/test/testserver.js',
        host: 'http://localhost:3001',
        port: 3002,
        env: { NODE_ENV: 'test', PORT: 3001}
    }).then(function(){
        return helper.test.quick();
    }).catch(onError);
});

```
# Gulp Example

This project does not use gulp, but because gulp can handle promises, it is very clean and easy to integrate with your new component.

[Simple gulp example](/examples/gulpfile.js)

Below is an example of how to serve a node project with one config, then also serve the app using different settings and and test on this server.

**gulpfile.js** : With 2 different serve configurations

```javascript
var gulp = require('gulp');
var caddy = require('web-caddy');

gulp.task('build', function() {
    return caddy.build.run().catch(onError)
});

gulp.task('serve', function() {
    return caddy.serve({
        script : 'src/app/server.js',
        host: 'http://localhost:3000',
        port: 3001,
        env: { NODE_ENV: 'local'}
    }).catch(onError);
});

gulp.task('test', function(){
    return caddy.serve({
        script : 'src/test/testserver.js',
        host: 'http://localhost:3001',
        port: 3002,
        env: { NODE_ENV: 'test', PORT: 3001}
    }).then(function(){
        return caddy.test.run();
    }).catch(onError);
});

```
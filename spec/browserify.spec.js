var Browserify = require('../tasks/wrappers/browserify');
var fs = require('../tasks/utils/fs');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}
describe('Browserify', function () {

    var broserifyTop = '(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n'
    var browserifyFile = './spec/fixtures/browserify/browserify.js';
    var browserifyName = 'browserify.js';
    var browserifyContents = ''

    beforeEach(function(done){
        fs.read(browserifyFile).then(function(files){
            browserifyContents =  files[0].contents.toString()
        }).then(done);
    })

    it('should browserify a file', function (done) {
        var fileObj = {path:browserifyFile, name: browserifyName}
        new Browserify('src','dest').file(fileObj).then(function(response){
            expect(response.contents.toString()).toContain(browserifyContents)
            expect(response.contents.toString()).toContain('typeof require=="function"')
            expect(response.contents.toString()).toContain('function(require,module,exports)')
            expect(response.contents.toString()).toContain('exports')
            expect(response.contents.toString()).toContain('module')
            expect(response.path).toContain('/dest/browserify.js')
            expect(response.dir).toContain('dest')
        }).then(done).catch(onError);
    });

    it('should minify a file', function (done) {
        var fileObj = {path:browserifyFile, name: browserifyName}
        new Browserify('src','dest').minify(fileObj).then(function(response){
            expect(response.contents.toString()).toBe('function sum(u){var n=0;return u.forEach(function(u){n+=u}),n}module.exports={sum:sum};');
            expect(response.name).toBe('browserify.min.js');
            expect(response.dir).toContain('dest');
            expect(response.path).toContain('dest/browserify.min.js');
        }).then(done).catch(onError);
    });

    it('writes the minified and browserified files', function (done) {
        spyOn(Browserify.prototype, 'file');
        spyOn(Browserify.prototype, 'minify');

        spyOn(fs, 'write').and.callFake(function (fileObj) {
            return fileObj;
        });

        new Browserify('./spec/fixtures/browserify/', 'dest').write().then(function () {
            expect(fs.write.calls.count()).toBe(2);
            expect(Browserify.prototype.file.calls.count()).toBe(1);
            expect(Browserify.prototype.minify.calls.count()).toBe(1);
        }).then(done).catch(onError);
    });
});
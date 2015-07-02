var Promise = require('es6-promise').Promise;
var build = require('../tasks/build');
var helper = require('../tasks/utils/config-helper');
var log = require('../tasks/utils/log');
var requirejs = require('../tasks/wrappers/requirejs');
var browserify = require('../tasks/wrappers/browserify');
var Jade = require('../tasks/wrappers/jade');
var Mustache = require('../tasks/wrappers/mustache');
var sass = require('../tasks/wrappers/sass');
var fs = require('../tasks/utils/fs');
var htmlMinify = require('html-minifier');

describe("Build task will compile", function() {

    var config;

    beforeEach(function(){
        spyOn(fs,'copy').and.callFake(function(){ return Promise.resolve();});
        spyOn(log, "info").and.callFake(function(msg) { return msg; });
        spyOn(log, "onError").and.callFake(function(msg) { return msg; });
        spyOn(requirejs.prototype, "write").and.callFake(function(msg) { return Promise.resolve([]); });
        spyOn(browserify.prototype, "write").and.callFake(function(msg) { return Promise.resolve([]); });
        spyOn(sass.prototype, "write").and.callFake(function(msg) { return Promise.resolve([]); });
        spyOn(Jade.prototype, "write").and.callFake(function(msg) { return Promise.resolve([]); });
        spyOn(Mustache.prototype, "write").and.callFake(function(msg) { return Promise.resolve([]); });
        spyOn(htmlMinify, "minify").and.callFake(function(msg) { return msg; });
        config = {
            pkg:{version:'11.11.11'},
            tasks:{build: ['sass', 'mustache', 'browserify']},
            buildGlobs:{html:'',styles:'',scripts:''},
            buildPaths: [{source:'./demo',targets:['./_site']}, {source:'./src',targets:['./_site']}]
        };
    });

    it("html", function (done) {
        spyOn(helper,'getConfig').and.callFake(function(){ return config; });
        return build.html().then(function(){
            expect(log.info).toHaveBeenCalledWith(' * HTML: demo');
            expect(Jade.prototype.write).not.toHaveBeenCalled();
            expect(Mustache.prototype.write).toHaveBeenCalled();
            done();
        }).catch(console.log);
    });

    it("scripts with browserify", function (done) {
        spyOn(helper,'getConfig').and.callFake(function(){ return config; });
        build.scripts().then(function(){
            expect(browserify.prototype.write.calls.count()).toEqual(2);
            expect(requirejs.prototype.write).not.toHaveBeenCalled();
            expect(log.info).toHaveBeenCalledWith(' * Scripts: demo');
            expect(log.info).toHaveBeenCalledWith(' * Scripts: src');
            done();
        }).catch(console.log);
    });

    it("scripts with requirejs", function (done) {
        config.tasks.build[2] = 'requirejs';
        spyOn(helper,'getConfig').and.callFake(function(){ return config; });
        build.scripts().then(function(){
            expect(browserify.prototype.write.calls.count()).toEqual(0);
            expect(requirejs.prototype.write).toHaveBeenCalled();
            expect(log.info).toHaveBeenCalledWith(' * Scripts: demo');
            expect(log.info).toHaveBeenCalledWith(' * Scripts: src');
            done();
        }).catch(console.log);
    });

    it("styles", function (done) {
        spyOn(helper,'getConfig').and.callFake(function(){ return config; });
        build.styles().then(function(){
            expect(sass.prototype.write.calls.count()).toEqual(2);
            expect(log.info).toHaveBeenCalledWith(' * Styles: demo');
            expect(log.info).toHaveBeenCalledWith(' * Styles: src');
            done();
        }).catch(console.log);
    });

});
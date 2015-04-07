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

describe("Build task", function() {

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
    });

    describe("will handle new style of build config for", function() {

        var config;
        beforeEach(function(){
            config = {
                build: ['fonts', 'images', 'sass', 'mustache', 'browserify']
                ,pkg:{version:'11.11.11'}, paths:{demo:{scripts:{}, styles:{}},source:{},site:{}}
            };
        });

        it("html", function (done) {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.html().then(function(){
                expect(Mustache.prototype.write).toHaveBeenCalled();
                expect(Jade.prototype.write).not.toHaveBeenCalled();
                expect(log.info).toHaveBeenCalledWith(' * HTML Complete');
                done();
            });
        });

        it("scripts with browserify", function (done) {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.scripts().then(function(){
                expect(browserify.prototype.write.calls.count()).toEqual(1);
                expect(requirejs.prototype.write).not.toHaveBeenCalled();
                expect(log.info).toHaveBeenCalledWith(' * Scripts Complete');
                done();
            });
        });

        it("scripts with requirejs", function (done) {
            config.build[4] = 'requirejs';
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.scripts().then(function(){
                expect(browserify.prototype.write.calls.count()).toEqual(0);
                expect(requirejs.prototype.write).toHaveBeenCalled();
                expect(log.info).toHaveBeenCalledWith(' * Scripts Complete');
                done();
            });
        });

        it("styles", function (done) {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.styles().then(function(){
                expect(sass.prototype.write.calls.count()).toEqual(1);
                expect(log.info).toHaveBeenCalledWith(' * Styles Complete');
                done();
            });
        });

        it("fonts", function (done) {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.fonts().then(function(){
                expect(fs.copy.calls.count()).toEqual(1);
                expect(log.info).not.toHaveBeenCalled();
                done();
            });
        });

        it("images", function (done) {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.images().then(function(){
                expect(fs.copy.calls.count()).toEqual(1);
                expect(log.info).not.toHaveBeenCalled();
                done();
            });
        });

        it("images turned off", function (done) {
            config.build[1] = false;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            build.images().then(function(){
                expect(fs.copy.calls.count()).toEqual(0);
                //expect(log.info).toHaveBeenCalled();
                done();
            });
        });


    });

});
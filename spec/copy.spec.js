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

describe("Copy task will copy", function() {

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
            copy: ['fonts', 'images', 'server-config'],
            build: ['sass', 'mustache', 'browserify'],
            globs:{demo:{},source:{},target:{}},
            paths:{demo:'./demo',source:'./src',target:'./_site'}
        };
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
        config.copy[1] = false;
        spyOn(helper,'getConfig').and.callFake(function(){ return config; });
        build.images().then(function(){
            expect(fs.copy.calls.count()).toEqual(0);
            //expect(log.info).toHaveBeenCalled();
            done();
        });
    });


});
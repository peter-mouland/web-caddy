var Promise = require('es6-promise').Promise;
var release = require('../tasks/release');
var helper = require('../tasks/utils/config-helper');
var log = require('../tasks/utils/log');
var fs = require('../tasks/utils/fs');
var bumper = require('../tasks/utils/bump');
var build = require('../tasks/build');

describe("Release ", function() {

    describe("bump", function() {

        beforeEach(function(){
            spyOn(fs,'replace').and.callFake(function(){ return Promise.resolve();});
            spyOn(bumper,'bump').and.callFake(function(){ return Promise.resolve();});
            spyOn(build,'html').and.callFake(function(){  return Promise.resolve(); });
            spyOn(helper,'getConfig').and.callFake(function(){ return {build:{},pkg:{version:'1.1.1'}}; });
            spyOn(log, "info").and.callFake(function(msg) { return msg; });
        });

        it("will patch the version number by default", function (done) {
            release.bump().then(function(version){
                expect(version).toBe('1.1.2');
                done()
            });
        });

        it("not update is current is passed", function (done) {
            release.bump('current').then(function(version){
                expect(version).toBe('1.1.1');
                done()
            });
        });

        it("will add beta by default for prerelease", function (done) {
            release.bump('prerelease').then(function(version){
                expect(version).toBe('1.1.2-beta.0');
                done()
            });
        });

        it("will keep any existing post-fix for prerelease", function (done) {
            helper.getConfig = function(){ return {build:{},pkg:{version:'1.1.1-rc.1'}}; };
            release.bump('prerelease').then(function(version){
                expect(version).toBe('1.1.1-rc.2');
                done()
            });
        });

        it("will obey patch releases", function (done) {
            release.bump('patch').then(function(version){
                expect(version).toBe('1.1.2');
                done()
            });
        });

        it("will obey minor releases", function (done) {
            release.bump('minor').then(function(version){
                expect(version).toBe('1.2.0');
                done()
            });
        });

        it("will obey major releases", function (done) {
            release.bump('major').then(function(version){
                expect(version).toBe('2.0.0');
                done()
            });
        });

    });

});
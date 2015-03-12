var Promise = require('es6-promise').Promise;
var release = require('../tasks/release');
var helper = require('../tasks/utils/config-helper');
var log = require('../tasks/utils/log');
var fs = require('../tasks/utils/fs');
var Bump = require('../tasks/utils/bump');
var build = require('../tasks/build');

describe("Release ", function() {

    describe("bump", function() {

        beforeEach(function(){
            spyOn(fs,'read').and.callFake(function(){ return Promise.resolve([{ext:'json',contents:'{"version":"11.11.11"}'}]);});
            spyOn(fs,'replace').and.callFake(function(){ return Promise.resolve();});
            spyOn(fs,'write').and.callFake(function(){ return Promise.resolve();});
            spyOn(build,'html').and.callFake(function(){  return Promise.resolve(); });
            spyOn(helper,'getConfig').and.callFake(function(){ return {build:{},pkg:{version:'11.11.11'}, paths:{source:{}}}; });
            spyOn(log, "info").and.callFake(function(msg) { return msg; });
            spyOn(log, "onError").and.callFake(function(msg) { return msg; });
        });

        it("will return the updated version", function (done) {
            return release.bump().then(function(version){
                expect(version).toBe('11.11.12');
            }).then(done);
        });

        it("accepts semVer arguments", function (done) {
            return release.bump('prerelease').then(function(version){
                expect(version).toBe('11.11.12-beta.0');
                return release.bump('patch');
            }).then(function(version){
                expect(version).toBe('11.11.12');
            }).then(done);
        });

        it("doesn't bump with current", function (done) {
            return release.bump('current').then(function(version){
                expect(version).toBe('11.11.11');
            }).then(done);
        });

        it("errors with invalid arg", function (done) {
            return release.bump('sdsdsdsd').then(function(version){
                expect(version).toBe(null);
                expect(log.onError).toHaveBeenCalledWith('Invalid semVer type: sdsdsdsd');
            }).then(done);
        });


    });

});
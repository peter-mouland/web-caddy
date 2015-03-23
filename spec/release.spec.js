var Promise = require('es6-promise').Promise;
var release = require('../tasks/release');
var Release = require('../tasks/wrappers/s3');
var git = require('../tasks/utils/git');
var helper = require('../tasks/utils/config-helper');
var ghPages = require('gh-pages');
var log = require('../tasks/utils/log');

describe("Release", function() {

    beforeEach(function(){
        spyOn(Release.prototype,'write').and.callFake(function(){ return this.destination; });
        spyOn(log, "info").and.callFake(function(msg) { return msg; });
        spyOn(ghPages, "publish").and.callFake(function(root, msg) { return msg; });
        spyOn(git, "release").and.callFake(function(root, msg) { return msg; });
        spyOn(log, "onError").and.callFake(function(msg) { return msg; });
    });

    describe("s3", function() {

        var config = {
            build:{},release:['s3'],pkg:{version:'11.11.11'}, paths:{source:{},site:{}},
            s3: { target: '/11.11.11/' }
        };

        it("will set the target with the correct version", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            expect(release.s3()).toBe('/11.11.11/');
        });

        it("will update the target if the version has changed", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            expect(release.s3('11.12.11')).toBe('/11.12.11/');
        });

        it("will not release to s3 if not in config", function () {
            delete config.release;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            release.s3('11.12.11');
            expect(log.info).toHaveBeenCalled();
        });

    });

    describe("gh-pages", function() {

        var config = {
            build:{},release:['gh-pages'],pkg:{version:'11.11.11'}, paths:{source:{},site:{}},
            s3: { target: '/11.11.11/' }
        };

        it("will publish to ghPages", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            release['gh-pages']()
            expect(ghPages.publish).toHaveBeenCalled();
        });

        it("will not release to gh-pages if not in config", function () {
            delete config.release;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            release['gh-pages']('v11.12.11');
            expect(log.info).toHaveBeenCalled();
            expect(ghPages.publish).not.toHaveBeenCalled();
        });

    });

    describe("git", function() {

        var config;
        beforeEach(function() {
            config = {
                build: {}, release: ['git', 'gh-pages'], pkg: {version: '11.11.11'}, paths: {source: {}, site: {}},
                s3: {target: '/11.11.11/'}
            };
        });

        it("will release to git", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            spyOn(git,'checkRemote').and.callFake(function(){ return true });
            release.git()
            expect(git.release).toHaveBeenCalled();
        });

        it("will not release to git if not in config", function () {
            delete config.release;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            spyOn(git,'checkRemote').and.callFake(function(){ return true });
            release.git('v11.12.11');
            expect(log.info).toHaveBeenCalled();
            expect(git.release).not.toHaveBeenCalled();
        });

        it("will not release to git if no remote", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            spyOn(git,'checkRemote').and.callFake(function(){ return false });
            release.git('v11.12.11');
            expect(log.onError).toHaveBeenCalled();
            expect(git.release).not.toHaveBeenCalled();
        });

    });
});
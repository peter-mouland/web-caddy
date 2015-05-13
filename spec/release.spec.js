var Promise = require('es6-promise').Promise;
var release = require('../tasks/release');
var S3 = require('../tasks/wrappers/s3');
var git = require('../tasks/utils/git');
var helper = require('../tasks/utils/config-helper');
var ghPages = require('gh-pages');
var log = require('../tasks/utils/log');

describe("Release", function() {

    beforeEach(function(){
        spyOn(S3.prototype,'write').and.callFake(function(){ return this.destination; });
        spyOn(log, "info").and.callFake(function(msg) { return msg; });
        spyOn(ghPages, "publish").and.callFake(function(root, msg, cb) { cb(); return msg; });
        spyOn(git, "release").and.callFake(function(root, msg) { return msg; });
        spyOn(log, "onError").and.callFake(function(msg) { return msg; });
    });

    describe("s3", function() {

        var config = {
            tasks:{build:[],release:['s3']},pkg:{version:'11.11.11'}, paths:{source:{},target:{}},
            s3: { target: '/11.11.11/' }
        };

        it("will set the target with the correct version", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            expect(release.s3()).toBe('/11.11.11/');
        });

        it("will update the target if the version has changed", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            expect(release.s3({ version : '11.12.11' })).toBe('/11.12.11/');
        });

        it("will not release to s3 if not in config", function (done) {
            delete config.tasks.release;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            release.s3({ version : '11.12.11' }).then(function(ret){
                expect(log.info).not.toHaveBeenCalled();
                expect(S3.prototype.write).not.toHaveBeenCalled();
                done();
            })
        });

    });

    describe("gh-pages", function() {

        var config = {
            tasks:{build:[],release:['gh-pages']},pkg:{version:'11.11.11'}, paths:{source:{},target:{}},
            s3: { target: '/11.11.11/' }
        };

        it("will publish to ghPages", function (done) {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            release['gh-pages']().then(function(){
                expect(ghPages.publish).toHaveBeenCalled();
                done();
            })
        });

        it("will not release to gh-pages if not in config", function (done) {
            delete config.tasks.release;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            release['gh-pages']('v11.12.11').then(function(){
                expect(log.info).not.toHaveBeenCalled();
                expect(ghPages.publish).not.toHaveBeenCalled();
                done();
            })
        });

    });

    describe("git", function() {

        var config;
        beforeEach(function() {
            config = {
                tasks:{build: [], release: ['git', 'gh-pages']}, pkg: {version: '11.11.11'}, paths: {source: {}, target: {}},
                s3: {target: '/11.11.11/'}
            };
        });

        it("will release to git", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            spyOn(git,'checkRemote').and.callFake(function(){ return true });
            release.git();
            expect(git.release).toHaveBeenCalled();

        });

        it("will not release to git if not in config", function (done) {
            delete config.tasks.release;
            spyOn(helper,'getConfig').and.callFake(function(){ return config; });
            spyOn(git,'checkRemote').and.callFake(function(){ return true });
            release.git('v11.12.11').then(function(){
                expect(log.info).not.toHaveBeenCalled();
                expect(git.release).not.toHaveBeenCalled();
                done();
            });
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
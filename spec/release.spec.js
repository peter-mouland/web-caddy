var Promise = require('es6-promise').Promise;
var release = require('../tasks/release');
var Release = require('../tasks/wrappers/s3');
var helper = require('../tasks/utils/config-helper');
var log = require('../tasks/utils/log');

describe("Release", function() {

    describe("s3", function() {

        beforeEach(function(){
            spyOn(Release.prototype,'write').and.callFake(function(){ return this.destination; });
            spyOn(helper,'getConfig').and.callFake(function(){
                return {
                    build:{},release:'s3',pkg:{version:'11.11.11'}, paths:{source:{},site:{}},
                    s3: { target: '/11.11.11/' }
                };
            });
            spyOn(log, "info").and.callFake(function(msg) { return msg; });
            spyOn(log, "onError").and.callFake(function(msg) { return msg; });
        });

        it("will set the target with the correct version", function () {
            expect(release.s3()).toBe('/11.11.11/');
        });

        it("will update the target if the version has changed", function () {
            expect(release.s3('11.12.11')).toBe('/11.12.11/');
        });

    });
});
var Bump = require('../../tasks/utils/bump');
var fs = require('../../tasks/utils/fs');

describe("Bump ", function() {

    describe("deals with and of files and", function() {

        it("will keep a spare line if it exists", function () {
            var bump = new Bump()
            expect(bump.possibleNewline(' ')).toBe('');
            expect(bump.possibleNewline(' \n')).toBe('\n');
        });

    })

    describe("updates files based on version", function() {

        it("can automatically patch the file", function () {
            var bump = new Bump()
            var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }'};
            fileObj = bump.updateJson(fileObj)
            expect(fileObj.err).toBe(undefined)
            expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"0.0.1"}')
            expect(bump.currentVersion).toBe('0.0.0');
        });

        it("returns an error with invalid json", function () {
            var fileObj = {"contents": '{ "json" : "j"son", "version":"0.0.0" }'};
            var bump = new Bump(fileObj, {type: 'patch'})
            fileObj = bump.updateJson(fileObj)
            expect(fileObj.err).toBe('Problem parsing JSON file')
            expect(fileObj.contents).toBe(undefined)
            expect(bump.currentVersion).toBe(undefined);
        });

    });

    describe("bumps version correctly based on options passed and", function() {

        it("can automatically patch the version number", function () {
            var bump = new Bump()
            var version = bump.bumpVersion("0.0.0")
            expect(version).toBe('0.0.1')
        });

        it("can add beta for prereleases the version number", function () {
            var bump = new Bump([], {type: 'prerelease'})
            var version = bump.bumpVersion("0.0.0")
            expect(version).toBe('0.0.1-beta.0')
        });

        it("will keep any existing post-fix for prerelease", function () {
            var bump = new Bump([], {type: 'prerelease'})
            var version = bump.bumpVersion("0.0.0-rc.1")
            expect(version).toBe('0.0.0-rc.2')
        });

        it("can patch the version number", function () {
            var bump = new Bump([], {type: 'patch'})
            var version = bump.bumpVersion("0.0.0")
            expect(version).toBe('0.0.1')
        });

        it("can minor bump the version number", function () {
            var bump = new Bump([], {type: 'minor'})
            var version = bump.bumpVersion("0.0.0")
            expect(version).toBe('0.1.0')
        });

        it("can major bump the version number", function () {
            var bump = new Bump([], {type: 'major'})
            var version = bump.bumpVersion("0.0.0")
            expect(version).toBe('1.0.0')
        });

        it("will return the exact version if valid semVer is supplied", function () {
            var bump = new Bump([], {type: '0.1.2'})
            var version = bump.bumpVersion("0.0.0")
            expect(version).toBe('0.1.2')
        });

    });

    describe("saves the bump", function() {

        beforeEach(function(){
            spyOn(fs, "write").and.callFake(function(file) {
                return file;
            });
        });

        it("updates file with correct version", function (done) {
            var files = './spec/fixtures/bump/*.json';
            var bump = new Bump(files, {version: '0.0.1'})
            bump.run().then(function(updatedVersion){
                expect(fs.write.calls.count()).toBe(2);
                expect(updatedVersion).toBe('0.0.1');
                done()
            });
        });

    });
});
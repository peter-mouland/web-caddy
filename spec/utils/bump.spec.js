var bump = require('../../tasks/utils/bump')

describe("Bump ", function() {
    it("will keep a spare line if it exists", function() {
        expect(bump._possibleNewline(' ')).toBe('');
        expect(bump._possibleNewline(' \n')).toBe('\n');
    });
    it("can automatically patch the version number of a fileObj", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj)
        expect(fileObj.err).toBe(undefined)
        expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"0.0.1"}')
    });
    it("can patch the version number of a fileObj when told", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj, {type:'patch'})
        expect(fileObj.err).toBe(undefined)
        expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"0.0.1"}')
    });
    it("can minor bump the version number of a fileObj when told", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj, {type:'minor'})
        expect(fileObj.err).toBe(undefined)
        expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"0.1.0"}')
    });
    it("can major bump the version number of a fileObj when told", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj, {type:'major'})
        expect(fileObj.err).toBe(undefined)
        expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"1.0.0"}')
    });
    it("will error when type is invalid", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj, {type:'0.1.2'})
        expect(fileObj.err).toBe('Detected invalid semver type: must be patch, minor or major. Found 0.1.2')
    });
    it("can do an exact bump when told", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj, {version:'0.1.2'})
        expect(fileObj.err).toBe(undefined)
        expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"0.1.2"}')
    });
    it("type will be ignored when version is supplied", function(){
        var fileObj = {"contents": '{ "json" : "json", "version":"0.0.0" }' };
        fileObj = bump._updateVersion(fileObj, {type:'minor',version:'0.1.2'})
        expect(fileObj.err).toBe(undefined)
        expect(fileObj.contents.toString('utf-8')).toBe('{"json":"json","version":"0.1.2"}')
    })
});
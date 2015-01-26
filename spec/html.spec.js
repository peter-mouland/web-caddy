var html = require('../tasks/utils/html');
var file = require('../tasks/utils/file');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("html", function() {

    it("will do a simple concat of 2 objs", function() {
        var objs = [
            {contents:'1'},
            {contents:'2'},
            {contents:'3'}
        ];
        expect(html._concatContent(objs)).toBe('1\n2\n3');
    });

    it("will do a simple concat of 2 files", function(done) {
        var files = './spec/fixtures/html/*.html';
        html._concatFiles(files).then(function(content){
            expect(content).toBe('a first line\nb first line');
            done()
        }, onError);
    });

    it("will save a concatinated file", function(done) {

        spyOn(file, "write").and.callFake(function(file) {
            return file;
        });

        var files = './spec/fixtures/html/*.html';
        var dest = './.tmp/tmp.html';
        html.create(files, dest).then(function(fileObj){
            expect(file.write.calls.count()).toBe(1);
            expect(fileObj.name).toBe('tmp.html');
            expect(fileObj.contents).toBe('a first line\nb first line');
            expect(fileObj.dir).toBe('./.tmp');
            expect(fileObj.ext).toBe('html');
            expect(fileObj.path).toBe(dest);
            done()
        }, onError);
    });

});
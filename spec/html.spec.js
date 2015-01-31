var HTML = require('../tasks/wrappers/html-concat');
var file = require('../tasks/utils/file');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("html", function() {

    it("will do a simple concat of 3 objs", function() {
        var html = new HTML()
        var objs = [
            {contents:'1'},
            {contents:'2'},
            {contents:'3'}
        ];
        expect(html.concatContent(objs)).toBe('1\n2\n3');
    });

    it("will do a simple concat of 2 files", function(done) {
        spyOn(file, "write").and.callFake(function(file) {
            return file;
        });

        var files = './spec/fixtures/html/*.html';
        var dest = './.tmp/tmp.html';
        var html = new HTML(files, dest);
        html.concatFiles().then(function(fileObj){
            expect(file.write.calls.count()).toBe(1);
            expect(fileObj.name).toBe('tmp.html');
            expect(fileObj.contents).toBe('a first line\nb first line');
            expect(fileObj.dir).toBe('./.tmp');
            expect(fileObj.ext).toBe('html');
            expect(fileObj.path).toBe(dest);
            done()
        }, onError);
    });

    it("will update a concatinated file", function(done) {
        spyOn(file, "write").and.callFake(function(fileObjs) {
            return fileObjs;
        });
        spyOn(file, "replace").and.callFake(function(fileSrc, replacements) {
            return replacements;
        });

        var files = './spec/fixtures/html/*.html';
        var dest = './spec/fixtures/html/*.txt';
        var html = new HTML(files, dest,{version:'1.0.0', now: 'now'});
        html.write().then(function(fileObj){
            expect(file.write.calls.count()).toBe(1);
            expect(file.replace.calls.count()).toBe(1);
            done()
        }, onError);
    });

});
var File = require('../tasks/utils/file');
var log = require('../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("File ", function(){

    it("can correctly separate file name from file path", function() {
        var fileObj = new File({ path:'spec/fixtures/file/File.txt'})
        expect(fileObj.path).toBe('spec/fixtures/file/File.txt');
        expect(fileObj.contents).toBe(undefined);
        expect(fileObj.name).toBe('File.txt');
        expect(fileObj.dir).toBe('spec/fixtures/file');
        expect(fileObj.cwd).toBe(undefined);
        expect(fileObj.base).toBe(undefined);
        expect(fileObj.ext).toBe('txt');
    });
    it("can save contents if passed", function() {
        var fileObj = new File({ path:'spec/fixtures/file/File.txt', contents:'awesome'})
        expect(fileObj.name).toBe('File.txt');
        expect(fileObj.dir).toBe('spec/fixtures/file');
        expect(fileObj.path).toBe('spec/fixtures/file/File.txt');
        expect(fileObj.contents).toBe('awesome');
        expect(fileObj.cwd).toBe(undefined);
        expect(fileObj.base).toBe(undefined);
        expect(fileObj.ext).toBe('txt');
    });
    it("requires path to be passed", function() {
        spyOn(log, "onError").and.callFake(function(msg) {
            return msg;
        });
        var fileObj = new File({contents:'awesome'})
        expect(log.onError.calls.count()).toBe(1);
        expect(fileObj.path).toBe(undefined);
        expect(fileObj.contents).toBe(undefined);
    });
    it('updates name, dir, and ext when path is updated', function () {
        var fileObj = new File({ path:'spec/fixtures/file/File.txt'});

        fileObj.path = 'spec/fixtures/newFile/newFile.md';
        expect(fileObj.path).toBe('spec/fixtures/newFile/newFile.md');
        expect(fileObj.name).toBe('newFile.md');
        expect(fileObj.dir).toBe('spec/fixtures/newFile');
        expect(fileObj.ext).toBe('md');
    });
    it('updates path, dir, and ext when name is updated', function () {
        var fileObj = new File({ path:'spec/fixtures/file/File.txt'});

        fileObj.name = 'newFile.md';
        expect(fileObj.path).toBe('spec/fixtures/file/newFile.md');
        expect(fileObj.name).toBe('newFile.md');
        expect(fileObj.dir).toBe('spec/fixtures/file');
        expect(fileObj.ext).toBe('md');
    });
    it('updates path, name, and ext when dir is updated', function () {
        var fileObj = new File({ path:'spec/fixtures/file/file.txt'});

        fileObj.dir = 'spec/fixtures/newFile';
        expect(fileObj.path).toBe('spec/fixtures/newFile/file.txt');
        expect(fileObj.name).toBe('file.txt');
        expect(fileObj.dir).toBe('spec/fixtures/newFile');
        expect(fileObj.ext).toBe('txt');
    });
    it('updates path, name, and dir when ext is updated', function () {
        var fileObj = new File({ path:'spec/fi.txtures/file/file.txt'});

        fileObj.ext = 'md';
        expect(fileObj.path).toBe('spec/fi.txtures/file/file.md');
        expect(fileObj.name).toBe('file.md');
        expect(fileObj.dir).toBe('spec/fi.txtures/file');
        expect(fileObj.ext).toBe('md');
    });
    it('throws an error when path contains a slash', function () {
        spyOn(log, "onError").and.callFake(function(msg) {
            return msg;
        });

        var fileObj = new File({ path:'spec/fi.txtures/file/file.txt'});
        fileObj.name = '/file.txt';
        expect(log.onError.calls.count()).toBe(1);
    });
});
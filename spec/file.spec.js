var file = require('../tasks/utils/file');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("file", function() {

    describe("detail", function(){

        it("can correctly separate file name from file path", function() {
            expect(file.detail('path/name.ext').name).toBe('name.ext');
            expect(file.detail('path/name.ext').dir).toBe('path');
            expect(file.detail('path/name.ext').ext).toBe('ext');
        });

    });

    describe("rename", function(){

        xit("", function() {
        });

    });

    describe("copy", function(){

        xit("", function() {
        });

    });

    describe("read, write and del", function(){
        beforeEach(function(done){
            var delFile = { path:'spec/fixtures/file/del.txt' , name:'del.txt', dir: 'spec/fixtures/file', contents:' '}
            file.write(delFile).then(function(){
                done();
            });
        });

        it("can read a files details back", function(done) {
            var filesGlob = './spec/fixtures/file/del.*';
            file.read(filesGlob).then(function (files) {
                expect(files.length).toBe(1);
                expect(files[0].dir).toContain('/spec/fixtures/file');
                expect(files[0].name).toBe('del.txt');
                expect(files[0].ext).toBe('txt');
                expect(files[0].stat.size).toBe(1);
                expect(Buffer.isBuffer(files[0].contents)).toBe(true);
                expect(files[0].contents.toString()).toBe(' ');
                done()
            }, onError);
        });

        it("can write a new file with updated details", function(done) {
            var filesGlob = './spec/fixtures/file/del.*';
            file.read(filesGlob).then(function (files) {
                files[0].name = 'del.js';
                files[0].contents = 'temp file';
                return file.write(files[0])
            }, onError).then(function(fileObj){
                return file.read(filesGlob);
            }, onError).then(function(files){
                expect(files.length).toBe(2);
                expect(files[0].dir).toContain('/spec/fixtures/file');
                expect(files[0].path).toContain('/spec/fixtures/file/del.js');
                expect(files[0].ext).toBe('js');
                expect(files[0].name).toBe('del.js');
                expect(files[0].stat.size).toBe(9);
                expect(Buffer.isBuffer(files[0].contents)).toBe(true);
                expect(files[0].contents.toString()).toBe('temp file');

                expect(files[1].dir).toContain('/spec/fixtures/file');
                expect(files[1].path).toContain('/spec/fixtures/file/del.txt');
                expect(files[1].ext).toBe('txt');
                expect(files[1].name).toBe('del.txt');
                expect(files[1].stat.size).toBe(1);
                expect(Buffer.isBuffer(files[1].contents)).toBe(true);
                expect(files[1].contents.toString()).toBe(' ');
                done()
            }, onError)
        });

        it("can delete the files", function(done){
            var filesGlob = './spec/fixtures/file/del.*';
            file.del([filesGlob]).then(function(files){
                expect(files.length).toBe(2);
                expect(files[0]).toContain('/spec/fixtures/file/del.js');
                return file.read(files)
            }, onError).then(function(files){
                expect(files.length).toBe(0);
                done();
            }, onError);
        })
    });

    describe("copyDirectory", function(){

        xit("", function() {
        });

    });

    describe("replace", function(){

        xit("", function() {
        });

    });

    describe("glob", function(){

        xit("", function() {
        });

    });

});
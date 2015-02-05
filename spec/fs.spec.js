var fs = require('../tasks/utils/fs');
var log = require('../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("fs", function() {

    describe("rename", function(){

        it("changes the file name", function(done) {
            var srcGlob = './spec/fixtures/file/*.js'
            fs.rename(srcGlob, '.js', '.min.js').then(function(files){
                expect(files.length).toBe(1);
                expect(files[0].name).toBe('rename.min.js');
            }).then(function () {
                return fs.rename(srcGlob, '.min.js', '.js')
            }).then(function (files) {
                expect(files.length).toBe(1);
                expect(files[0].name).toBe('rename.js');
            }).then(done).catch(onError)
        });

    });

    describe("copy", function(){

        it("can duplicate a file and place it in another directory", function(done) {
            var srcGlob = 'spec/fixtures/file/copy*.txt'
            var destDir = 'spec/fixtures/file/copy'

            fs.read(srcGlob).then(function(files){
                expect(files[1].stat.size).toBe(72433);
                expect(files[1].contents.toString()).toContain('@charset "UTF-8";');
                expect(files[0].stat.size).toBe(12);
                expect(files[0].contents.toString()).toContain('another copy');
                return fs.copy(srcGlob, destDir)
            }).then(function () {
                return fs.read(destDir + '/**/*')
            }).then(function (files) {
                expect(files.length).toBe(2);
                expect(files[1].contents.toString()).toContain('@charset "UTF-8";');
                expect(files[1].stat.size).toBe(72433);
                expect(files[0].stat.size).toBe(12);
                expect(files[0].contents.toString()).toContain('another copy');
            }).then(done).catch(onError)
        });

        it("can duplicate a file and place it in another directory, where a file of the same name exists", function(done) {
            var srcGlob = 'spec/fixtures/file/copy*.txt'
            var destDir = 'spec/fixtures/file/copy'

            fs.read(srcGlob).then(function(files){
                expect(files[1].stat.size).toBe(72433);
                expect(files[1].contents.toString()).toContain('@charset "UTF-8";');
                expect(files[0].stat.size).toBe(12);
                expect(files[0].contents.toString()).toContain('another copy');
                return fs.copy(srcGlob, destDir)
            }).then(function () {
                return fs.read(destDir + '/**/*')
            }).then(function (files) {
                expect(files.length).toBe(2);
                expect(files[1].contents.toString()).toContain('@charset "UTF-8";');
                expect(files[1].stat.size).toBe(72433);
                expect(files[0].stat.size).toBe(12);
                expect(files[0].contents.toString()).toContain('another copy');
            }).then(function(){
                return fs.del(destDir)
            }).then(done).catch(onError)
        });

    });

    describe("read, write and del", function(){
        beforeEach(function(done){
            var delFile = { path:'spec/fixtures/file/del.txt' , name:'del.txt', dir: 'spec/fixtures/file', contents:' '}
            fs.write(delFile).then(done);
        });

        it("can read a files details back", function(done) {
            var filesGlob = './spec/fixtures/file/del.*';
            fs.read(filesGlob).then(function (files) {
                expect(files.length).toBe(1);
                expect(files[0].dir).toContain('/spec/fixtures/file');
                expect(files[0].name).toBe('del.txt');
                expect(files[0].ext).toBe('txt');
                expect(files[0].stat.size).toBe(1);
                expect(Buffer.isBuffer(files[0].contents)).toBe(true);
                expect(files[0].contents.toString()).toBe(' ');
            }).then(done).catch(onError)
        });

        it("can write a new file with updated details", function(done) {
            var filesGlob = './spec/fixtures/file/del.*';
            fs.read(filesGlob).then(function (files) {
                files[0].name = 'del.js';
                files[0].contents = 'temp file';
                return fs.write(files[0])
            }, onError).then(function(fileObj){
                return fs.read(filesGlob);
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
            }).then(done).catch(onError)
        });

        it("can delete the files", function(done){
            var filesGlob = './spec/fixtures/file/del.*';
            fs.del(filesGlob).then(function(files){
                expect(files.length).toBe(2);
                expect(files[0]).toContain('/spec/fixtures/file/del.js');
                return fs.read(files)
            }, onError).then(function(files){
                expect(files.length).toBe(0);
            }).then(done).catch(onError)
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
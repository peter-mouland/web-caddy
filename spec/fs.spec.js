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
            }).then(function(fileObj){
                return fs.read(filesGlob);
            }).then(function(files){
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
            }).then(function(files){
                expect(files.length).toBe(0);
            }).then(done).catch(onError)
        })
    });

    describe("copyDirectory", function(){
        var dest = './spec/fixtures/fileCopy';

        afterEach(function (done) {
            fs.del(dest)
                .then(done)
                .catch(onError);
        });

        it("Can keep file structure", function(done) {

            fs.copyDirectory('./spec/fixtures/file', dest).then(function(){
                return fs.read(dest + '/**/*.*')
            }).then(function(files){
                expect(files.length).toBe(5);
            }).then(function(){
                return fs.read(dest + '/cDir/*.*')
            }).then(function(files){
                expect(files.length).toBe(1);
            }).then(done).catch(onError);
        });

        it('invokes a transform callback when passed', function (done) {
            var callback = {
                transform: function (read, write, file) {}
            };

            spyOn(callback, "transform").and.callFake(function(read, write, file) {
                read.pipe(write);
            });

            fs.copyDirectory('./spec/fixtures/file', dest, callback.transform)
                .then(function () {
                    expect(callback.transform.calls.count()).toBe(5);
                }).then(done).catch(onError);
        });
    });

    describe("replace", function(){
        var dest = './spec/fixtures/file/replace.txt';

        afterEach(function (done) {
            fs.replace(dest, [
                { replace: 'ewe', with: 'you' },
                { replace: /you/g, with: 'me' },
                { replace: 'not', with: 'And' }
            ]).then(done).catch(onError);
        });

        it("changes the contents of given files", function(done) {
            fs.replace(dest, [
                { replace: /me/g, with: 'you' },
                { replace: 'And', with: 'not' },
                { replace: 'you', with: 'ewe' }
            ]).then(function(){
                return fs.read(dest)
            }).then(function (files) {
                expect(files[0].contents.toString()).toBe('Replace ewe\nnot you too');
            }).then(done).catch(onError);

        });

    });

    describe("glob", function(){

        var srcGlob = './spec/fixtures/file/';
        it("returns an array of file objects", function(done) {
            fs.glob(srcGlob + '*.*')
                .then(function (files) {
                    expect(files.length).toBe(4);
                }).then(done).catch(onError);
        });
        it("does return directory names", function(done) {
            fs.glob(srcGlob + '*')
                .then(function (files) {
                    expect(files.length).toBe(5);
                    expect(files[0].name).toBe('cDir');
                    expect(files[1].name).toBe('copy-again.txt');
                    expect(files[2].name).toBe('copy.txt');
                    expect(files[3].name).toBe('rename.js');
                    expect(files[4].name).toBe('replace.txt');
                }).then(done).catch(onError);
        });
        it("does return files with sub directories", function(done) {
            fs.glob(srcGlob + '**/*')
                .then(function (files) {
                    expect(files.length).toBe(6);
                    expect(files[0].name).toBe('cDir');
                    expect(files[5].name).toBe('cDirFile.md');
                    expect(files[1].name).toBe('copy-again.txt');
                    expect(files[2].name).toBe('copy.txt');
                    expect(files[3].name).toBe('rename.js');
                    expect(files[4].name).toBe('replace.txt');
                }).then(done).catch(onError);
        });

    });

});
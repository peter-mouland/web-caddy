var file = require('../tasks/utils/file');
var window = {};
window.del = require('del');

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

    describe("write", function(){

        xit("", function() {
        });

    });

    describe("read", function(){

        xit("", function() {
        });

    });

    describe("del", function(){

        xit("is a promise", function(done) {
            spyOn(window, 'del').and.callFake(function(file) {
               return file
            });

            var files = './spec/fixtures/file/del.*';
            file.del(files).then(function(d){
                console.log(d)
                done();
            })

        });

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
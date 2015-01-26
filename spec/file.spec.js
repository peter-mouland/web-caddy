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

});
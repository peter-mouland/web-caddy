var jasmine = require("jasmine");
var html = require('../../tasks/utils/html')

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("html ", function() {
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
});
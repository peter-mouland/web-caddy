var Sass = require('../../tasks/wrappers/sass');
var fs = require('../../tasks/utils/fs');
var path = require('path');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}
describe('Sass', function () {

    var sassFile = path.join('.','spec','fixtures','sass','sass.scss');
    var sassName = 'sass.scss';
    var sassContents = '';
    var fileObj = {path:sassFile, name: sassName, relativeDir: '', dir:'dest'};

    beforeEach(function(done){
        fs.read(sassFile).then(function(files){
            sassContents =  files[0].contents.toString()
        }).then(done);
    });

    it('should css a file', function (done) {
        new Sass('src','dest').file(fileObj).then(function(response){
            expect(response.contents.toString()).toContain('\n  .demo-block .inner {\n')
            expect(response.name).toContain('sass.css')
            expect(response.ext).toContain('css')
            expect(response.path).toContain(path.join('dest','sass.css'))
            expect(response.dir).toContain('dest')
        }).then(done).catch(onError);
    });

    it('should minify a file', function (done) {
        new Sass('src','dest').minify([fileObj]).then(function(response){
            expect(response[0].contents.toString()).toBe('.demo-block{clear:both}.demo-block .inner{contents:\'yo\'}\n');
            expect(response[0].name).toBe('sass.min.css');
            expect(response[0].dir).toContain('dest');
            expect(response[0].ext).toContain('css')
            expect(response[0].path).toContain(path.join('dest','sass.min.css'));
        }).then(done).catch(onError);
    });

    it('writes the minified and CSS files', function (done) {
        spyOn(Sass.prototype, 'file');
        spyOn(Sass.prototype, 'minify');

        spyOn(fs, 'write').and.callFake(function (fileObj) {
            return fileObj;
        });

        new Sass('./spec/fixtures/sass/', 'dest').write().then(function () {
            expect(fs.write.calls.count()).toBe(2);
            expect(Sass.prototype.file.calls.count()).toBe(1);
            expect(Sass.prototype.minify.calls.count()).toBe(1);
        }).then(done).catch(onError);
    });
});
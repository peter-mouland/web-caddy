var parsePaths = require('../tasks/utils/config-helper').parsePaths;

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("Config-helper ", function() {

    var paths = {
        dist: {
            root:'./dist'
        },
        src: {
            root:'./src'
        }
    };

    it("parsePaths ensures the object always has scripts, styles, fonts, icons and images", function () {
        var newPaths = parsePaths(paths)
        expect(newPaths.dist.scripts).toBe('./dist/scripts');
        expect(newPaths.dist.styles).toBe('./dist/styles');
        expect(newPaths.dist.fonts).toBe('./dist/fonts');
        expect(newPaths.dist.icons).toBe('./dist/icons');
        expect(newPaths.dist.images).toBe('./dist/images');
        expect(newPaths.src.scripts).toBe('./src/scripts');
        expect(newPaths.src.styles).toBe('./src/styles');
        expect(newPaths.src.fonts).toBe('./src/fonts');
        expect(newPaths.src.icons).toBe('./src/icons');
        expect(newPaths.src.images).toBe('./src/images');
    });

    it("does not override given paths", function () {
        paths.dist.scripts = './mypath/js'
        paths.src.images = './mypath/images-mofo'
        var newPaths = parsePaths(paths)
        expect(newPaths.dist.scripts).toBe('./mypath/js');
        expect(newPaths.dist.styles).toBe('./dist/styles');
        expect(newPaths.dist.fonts).toBe('./dist/fonts');
        expect(newPaths.dist.icons).toBe('./dist/icons');
        expect(newPaths.dist.images).toBe('./dist/images');
        expect(newPaths.src.scripts).toBe('./src/scripts');
        expect(newPaths.src.styles).toBe('./src/styles');
        expect(newPaths.src.fonts).toBe('./src/fonts');
        expect(newPaths.src.icons).toBe('./src/icons');
        expect(newPaths.src.images).toBe('./mypath/images-mofo');
    });

});
var helper = require('../tasks/utils/config-helper');
var log = require('../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("Config-helper ", function() {

    describe('parsePaths', function(){

        var paths = {
            dist: {
                root:'./dist'
            },
            src: {
                root:'./src'
            }
        };

        it("parsePaths ensures the object always has scripts, styles, fonts, icons and images", function () {
            var newPaths = helper.parsePaths(paths)
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
            var newPaths = helper.parsePaths(paths)
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

    describe('configCheck', function(){

        var completeConfig = {};

        beforeEach(function(){
            spyOn(log,'onError').and.callFake(function(){ return true;});

            completeConfig = {
                build: {
                    scripts: 'browserify' // 'browserify' or 'requirejs'
                },
                test: 'karma',
                release: 's3',
                serve: 'staticApp',
                browserify: {  },
                requirejs: { },
                karma: {  },
                s3: { },
                staticApp: { },
                nodeApp: { }
            };
        });

        it("knows when config is fine", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).not.toHaveBeenCalled();
            expect(isCompatible).toBe(true);
        });

        it("knows if the config is incorrect: missing browserify config", function () {
            delete completeConfig.browserify;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be out of date');
            expect(isCompatible).toContain(completeConfig.build.scripts);
        });


        it("knows if the config is incorrect: missing karma config", function () {
            delete completeConfig.karma;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be out of date');
            expect(isCompatible).toContain(completeConfig.test);
        });

        it("knows if the config is incorrect: missing s3 config", function () {
            delete completeConfig.s3;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be out of date');
            expect(isCompatible).toContain(completeConfig.release);
        });

        it("knows if the config is incorrect: missing staticApp config", function () {
            delete completeConfig.staticApp;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be out of date');
            expect(isCompatible).toContain(completeConfig.serve);
        });
    })

});
var helper = require('../../tasks/utils/config-helper');
var log = require('../../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("Config-helper ", function() {

    describe('parsePaths', function(){

        var paths = {
            src: {
                root:'./src'
            }
        };

        it("parsePaths ensures the object always has scripts, styles, fonts, icons and images", function () {
            var newPaths = helper.parsePaths(paths)
            expect(newPaths.src.scripts).toBe('./src/scripts');
            expect(newPaths.src.styles).toBe('./src/styles');
            expect(newPaths.src.fonts).toBe('./src/fonts');
            expect(newPaths.src.icons).toBe('./src/icons');
            expect(newPaths.src.images).toBe('./src/images');
        });

        it("does not override given paths", function () {
            paths.src.images = './mypath/images-mofo'
            var newPaths = helper.parsePaths(paths)
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
            spyOn(log,'warn').and.callFake(function(){ return true;});

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
                nodeApp: { },
                pkg:{version:'0.0.0'}
            };
        });

        it("knows when config is out of date", function () {
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).not.toHaveBeenCalled();
            expect(log.warn).toHaveBeenCalled();
            expect(isCompatible).toContain('be out of date');
            expect(isCompatible).toContain('release');
            expect(isCompatible).toContain('build');
        });

        it("knows when config is as expected", function () {
            completeConfig.build = [];
            completeConfig.release = [];
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).not.toHaveBeenCalled();
            expect(log.warn).not.toHaveBeenCalled();
            expect(isCompatible).toBe(true);
        });

        it("errors if pkg.version is omitted", function () {
            delete completeConfig.pkg.version;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain('version');
        });

        it("knows if the config is incorrect: missing requirejs config", function () {
            completeConfig.build= ['requirejs'];
            delete completeConfig.requirejs;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.build[0]);
        });


        it("knows if the config is incorrect: missing karma config", function () {
            delete completeConfig.karma;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.test);
        });

        it("knows if the config is incorrect: missing s3 config", function () {
            delete completeConfig.s3;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.release);
        });

        it("knows if the config is incorrect: missing staticApp config", function () {
            delete completeConfig.staticApp;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.serve);
        });
    })

});
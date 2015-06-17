var helper = require('../../tasks/utils/config-helper');
var log = require('../../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("Config-helper ", function() {

    describe('configCheck', function(){

        var completeConfig = {};

        beforeEach(function(){
            spyOn(log,'onError').and.callFake(function(){ return true;});
            spyOn(log,'warn').and.callFake(function(){ return true;});

            completeConfig = {
                tasks: {
                    build: ['browserify'], // 'browserify' or 'requirejs'
                    test: 'karma',
                    release: ['s3'],
                    serve: 'staticApp'
                },
                buildPaths:  [ ],
                browserify: {  },
                requirejs: { },
                karma: [],
                s3: { },
                staticApp: { },
                nodeApp: { },
                pkg:{version:'0.0.0'}
            };
        });

        it("knows when config is incorrect", function () {
            delete completeConfig.tasks;
            completeConfig.build = {scripts:'d'};
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(log.warn).not.toHaveBeenCalled();
            expect(isCompatible).toContain('incorrect');
            expect(isCompatible).toContain('tasks');
        });

        it("knows when config is as expected", function () {
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
            completeConfig.tasks.build= ['requirejs'];
            delete completeConfig.requirejs;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.tasks.build[0]);
        });


        it("knows if the config is incorrect: missing karma config", function () {
            delete completeConfig.karma;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.tasks.test);
        });

        it("knows if the config is incorrect: missing s3 config", function () {
            delete completeConfig.s3;
            spyOn(helper,'getConfig').and.callFake(function(){ return completeConfig;});
            var isCompatible = helper.configCheck();
            expect(log.onError).toHaveBeenCalled();
            expect(isCompatible).toContain('be incorrect');
            expect(isCompatible).toContain(completeConfig.tasks.release);
        });

    })

});
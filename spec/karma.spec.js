var Karma = require('../tasks/wrappers/karma');
var karmaServer = require('karma').server;
var log = require('../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe('Karma', function () {
    it('reports test coverage to the user', function (done) {
        var karma = new Karma({
            summary: './spec/fixtures/karma/summary.json',
            config: './spec/fixtures/karma/karma.conf.js'
        });

        karma.coverage().then(function(err){
            expect(err).toBe(undefined);
        }).then(done).catch(onError);

    });

    it('fails when test coverage is insufficient', function (done) {
        spyOn(log, 'warn').and.callFake(function (message) {
            return message;
        });

        var karma = new Karma({
            summary: './spec/fixtures/karma/summary-failing.json',
            config: './spec/fixtures/karma/karma.conf.js'
        });

        karma.coverage().catch(function(err){
            expect(err).toBe('Coverage Failed');
            expect(log.warn.calls.count()).toBe(2);
            done();
        });

    });
});
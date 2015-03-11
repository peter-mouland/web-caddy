var exec = require('../../tasks/utils/exec').exec;
var child_process = require('child_process');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe("Exec ", function() {

    it("executes the given command with the specified arguments", function (done) {

        spyOn(child_process, "exec").and.callFake(function(cmd, cb) {
            cb(null);
        });

        exec('node', ['-v']).then(function(message){
            expect(child_process.exec.calls.count()).toBe(1);
            expect(message).toBe('node -v Complete')
        }).then(done).catch(onError);
    });

    it("rejects the promise if an error is passed", function (done) {
        var errorMessage = 'error :(';

        spyOn(child_process, "exec").and.callFake(function(cmd, cb) {
            cb(errorMessage);
        });

        exec('node', ['-v']).catch(function(message){
            expect(child_process.exec.calls.count()).toBe(1);
            expect(message).toBe('node -v Error: ' + errorMessage);
            done();
        });
    });

});
var Karma = require('../../tasks/wrappers/karma');
var log = require('../../tasks/utils/log');

function onError(e){
    console.log('** Test Error **')
    console.log(e)
    expect(false).toBe(true)
}

describe('Karma', function () {

});
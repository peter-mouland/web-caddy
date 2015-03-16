/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets();

/* Require file to test */
var local = {}; local['{{ component }}'] = require('../../src/scripts/{{ component }}');

/* Start Test */
describe('{{ component }} module can ', function () {

    it('print the sum to the dom', function () {
        new local['{{ component }}']().write([1,2,3]);

        expect(document.getElementById('demo-functional').innerHTML).toBe('6');

    });

});
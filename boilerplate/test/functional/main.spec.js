/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets();

/* Require file to test */
var local = {}; local['{{ project }}'] = require('../../src/scripts/{{ project }}');

/* Start Test */
describe('{{ project }} module can ', function () {

    it('print the sum to the dom', function () {
        new local['{{ project }}']().write([1,2,3]);

        expect(document.getElementById('demo-functional').innerHTML).toBe('6');

    });

});
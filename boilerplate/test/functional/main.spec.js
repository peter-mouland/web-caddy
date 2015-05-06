/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets();

/* Require file to test */
var {{ project.toCamelCase }} = require('../../src/scripts/{{ project }}');

/* Start Test */
describe('{{ project }} module can ', function () {

    it('print the sum to the dom', function () {
        new {{ project.toCamelCase }}().write([1,2,3]);

        expect(document.getElementById('demo-functional').innerHTML).toBe('6');

    });

});
/* Add HTML + CSS to setup page for functional testing */
require('../helper').loadAssets();

/* Require file to test */
var {{ project.toCamelCase }} = require('../../src/scripts/{{ project }}');

/* Start Test */
describe('{{ project }} module can ', function () {

    it('sum an array of numbers', function () {

        expect(new {{ project.toCamelCase }}().sum([1,2,3])).toBe(6);

    });

    it('version is attached', function () {

        expect(new {{ project.toCamelCase }}().version).toBe('0.0.0');

    });

});
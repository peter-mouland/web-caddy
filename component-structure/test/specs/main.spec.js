var {{ component }} = require('../../src/js/{{ component }}');

describe('{{ component }} module can ', function () {
    document.body.innerHTML = __html__['_site/index.html'];

    it('sum an array of numbers', function () {

        expect({{ component }}.sum([1,2,3])).toBe(6);

    });

});
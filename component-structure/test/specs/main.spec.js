document.body.innerHTML = __html__['_site/index.html'];

var {{ component }} = skyComponents['{{ component }}'];

describe('{{ component }} module can ', function () {

    it('sum an array of numbers', function () {

        expect({{ component }}.sum([1,2,3])).toBe(6);

    });

});
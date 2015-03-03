/* Add Assets: HTML + CSS to setup page for functional testing */
    document.body.innerHTML = __html__['_site/index.html'];
    function appendCSS(fileObj){
        var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
    }
    appendCSS({path: '_site/styles/demo.css'});
    appendCSS({path: '_site/styles/{{ component }}.css'});
/* End adding assets */

/* Require file to test */
var {{ component }} = require('../../src/scripts/{{ component }}');

/* Start Test */
describe('{{ component }} module can ', function () {

    it('sum an array of numbers', function () {

        expect(new {{ component }}().sum([1,2,3])).toBe(6);

    });

    it('version is attached', function () {

        expect(new {{ component }}().version).toBe('0.0.0');

    });

});
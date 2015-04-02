/*jshint -W069 */
var local = {}; local['{{ project }}'] = require('./{{ project }}');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/{{ project }}/dist/scripts/{{ project }}.requirejs', [], function() {
        'use strict';
        return local['{{ project }}'];
    });
}
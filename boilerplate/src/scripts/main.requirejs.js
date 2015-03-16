var local = {}; local['{{ component }}'] = require('./{{ component }}');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-{{ component }}/dist/scripts/{{ component }}.requirejs', [], function() {
        'use strict';
        return local['{{ component }}'];
    });
}
var {{ component }} = require('./{{ component }}');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-{{ component }}/dist/js/{{ component }}.requirejs', [], function() {
        'use strict';
        return {{ component }};
    });
}
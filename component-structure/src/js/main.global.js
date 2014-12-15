var {{ component }} = require('./{{ component }}');

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.{{ component }} = {{ component }};
var version  = require('./utils/version.js');

// By default JS dependency is handled using browserify
// please see 'GULP-TASKS.md#js' for more info
//
// You may need another component:
// run : $ bower install bskyb-event --save
// then add
// var event = require('../../bower_components/bskyb-event/src/js/event');

//example function and export
function sum(args){
    var total = 0;
    args.forEach(function(int){
        total += int;
    });
    return total;
}

module.exports = {
    sum: sum,
    version: version
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['{{ component }}'] = module.exports;
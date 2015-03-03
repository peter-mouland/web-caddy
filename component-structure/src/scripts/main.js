// By default JS dependency is handled using browserify
// please see 'GULP-TASKS.md#js' for more info
//
// You may need another component:
// run : $ bower install bskyb-core --save
// then add
// var core = require('../../bower_components/bskyb-core/src/scripts/core');
// var event = core.event;


//example function
function Test(){
    this.version = require('./utils/version.js');//keep this : each component exposes its version
}

Test.prototype.sum = function(args){
    var total = 0;
    args.forEach(function(int){
        total += int;
    });
    return total;
};


//example export
module.exports = Test;


//keep this : ensure components are also globally available
if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['{{ component }}'] = module.exports;
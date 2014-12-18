// By default JS dependency is handled using browserify
// please see 'GULP-TASKS.md#js' for more info

//example function and export
function sum(args){
    var total = 0;
    args.forEach(function(int){
        total += int;
    });
    return total;
}

module.exports = {
    sum: sum
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['{{ component }}'] = module.exports;
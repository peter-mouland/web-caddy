// By default JS dependency is handled using browserify
// i.e. module.exports = { ... } and require('./dir/file');
// please see 'GULP-TASKS.md#js' for more info


module.exports = {
    //
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.{{ component }} = module.exports;
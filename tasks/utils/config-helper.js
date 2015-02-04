module.exports = {
    parsePaths : function(paths) {
        var defaults = ['scripts', 'styles', 'fonts', 'icons', 'images'];
        for (var pathName in paths) {
            defaults.forEach(function (asset, i) {
                if (!paths[pathName][asset]) {
                    paths[pathName][asset] = paths[pathName].root + '/' + asset;
                }
            })
        }
        return paths;
    }
}
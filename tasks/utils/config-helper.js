module.exports = {
    parsePaths : function(paths) {
        ['scripts', 'styles', 'fonts', 'icons', 'images'].forEach(function (asset, i) {
            for (var pathName in paths) {
                if (!paths[pathName][asset]) {
                    paths[pathName][asset] = paths[pathName].root + '/' + asset;
                }
            }
        });
        return paths;
    }
};
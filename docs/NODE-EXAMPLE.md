# Node Example
> Run as a build script directly from node

This method allows much greater control over what build steps are happening when and with what settings.

**build.js** : With 2 different serve configurations

This example cleans the directories continaing compiled content, recompiles, then copies the compiled files to a dist directory and starts the app.

run : `node build`

```javascript
var caddy = require('web-caddy');

caddy.clean.all('./{_site,dist}').then(function(){
    return caddy.copy();
}).then(function(){
    return caddy.build.all();
}).then(function(){
    return caddy.copy('_site/**/{scripts,styles}', 'dist');
}).then(function(){
    return caddy.serve('_site');
}).catch(console.log);


```
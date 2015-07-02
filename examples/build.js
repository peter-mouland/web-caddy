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


function loadAssets(){
    document.body.innerHTML = __html__['_site/index.html'];
    function appendCSS(fileObj){
        var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
    }
    appendCSS({path: '_site/styles/demo.css'});
    appendCSS({path: '_site/styles/{{ component }}.css'});
}

module.exports = {
    loadAssets: loadAssets
};
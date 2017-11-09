
/*开发要求路径统一*/

;(function(){
    window.requireModule = {};
    window.module = {};
    var head = document.getElementsByTagName("head")[0];

    function parsePath(url) {
        var root =  window.location.pathname.replace(/\/[^/]+$/,"");
        return (root+"/"+url).toURI();
    }
    var debugcode = '$("#pageDsync").on("click",function(){if(window.setDebug){debugger;}}); \n'
    window.require = function(url,id){
        url = parsePath(url);
        $.ajax({
            url:url,
            dataType:"text",
            async: false,
            success:function(jsString){
                var script = document.createElement("script");
                //返回对象必须是module.exports
                jsString = jsString.replace(/module\.exports/g,"csModule[moduleId]")
                script.innerHTML = ";(function(csModule,moduleId,moduleParam){{4}{3}})({0},'{1}','{2}');".tpl("requireModule",url,id,jsString,debugcode);
                head.appendChild(script);
                if(!requireModule[url]){
                    requireModule[url]=1;
                }
            },
            error:function(){console.error("require error:",arguments,url)}
        });
        return requireModule[url];
    }

})()
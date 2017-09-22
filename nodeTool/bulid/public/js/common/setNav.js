;
(function () {
    var map ={
        "01home":"navhome",
        "02team":"navteam",
        "03commonList":"navmeadia",
        "04artList":"navmeadia",
        "05picList":"navproduct",
        "06product":"navproduct",
        "07business":"navbusiness",
        "08sigin":"navhome",
        "08signup":"navhome",
        "09vip1":"",
        "09vip2":"",
        "09vip3":"",
    }

    //提前初始化样式表
	function initStyle() {
		$("head").append("<style>{0}</style>".tpl(styleStr.join("")));
	}

    function getNavClass(href) {

        for(var i in map){
            if( ~href.indexOf(i) ){
                return map[i];
            }
        }
        return map["01home"]
    }

    function setNav(){
        var current  = getNavClass(window.location.href);
        $("html").addClass(current)
    }
    // initStyle();
})();




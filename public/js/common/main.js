;
(function () {

	function getNavClass(href) {
		var map ={
			"1home":"nav1",
			"2list":"nav2",
			"3article":"nav3",
			"4back":"nav4",
			"":"nav5",
			"":"nav6",
			"":"nav7",
			"":"nav8",
			"":"nav9",
			"":"",
			"":"",
			"":"",
		}
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
    setNav();


})();




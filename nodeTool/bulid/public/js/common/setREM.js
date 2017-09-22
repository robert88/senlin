;
(function () {

	//等比
	function getResize(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	}

	//获取范围
	function getRagen(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	}

    //提前初始化样式表
	function initStyle() {
		$("head").append("<style>{0}</style>".tpl(styleStr.join("")));
	}


	var preh;
	var maxH = 1080;
	var minH = 350;

	function changeRootrem() {

		var h = getRagen($(window).height(), maxH, minH);

		//水平移动时候不会触发改变html font-size;
        if (preh == h) {
            return remroot;
        }
        preh = h;

		var remroot = getResize(maxH, minH, h, 125, 75)

		/*  12-20  (12/16=0.75,20/16=1.25) */
		$("html").css("font-size", remroot + "%");
		return remroot;
	}

	$(window).on("resize",function () {
		changeRootrem();
    })
    changeRootrem();
})();




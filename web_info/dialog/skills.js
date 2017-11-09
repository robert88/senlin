;(function () {
	var $dialog = 	$(".skillsContent").parents(".dl-dialog");
	var $body = $dialog.find(".scrollBody");
	var $scrollBody = $dialog.find(".scrollContent");
	var $propsItem = $dialog.find(".propsInfo");
	var loaded = false;
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	//html模板
	function getHtmlTempl(obj) {
		return  ['<li class="mt10">',
			'<div class="title  bg-kuang"><img src="{0}">{1}</div>',
			'<p>{2}</p>',
			'</li>'].join("").tpl(obj.icon,obj.title,obj.introduce);
	}
	/*
	 * 将二维数组转一维数组
	 * */
	function toSampleArrary(ret){
		var newArr=[];
		for(var i=0;i<ret.length;i++){
			if($.type(ret[i])=="array"){
				newArr = newArr.concat(ret[i]);
			}else{
				newArr.push(ret[i]);
			}
		}
		return newArr
	}
	
	//加载数据
	$(".loading").show();
	PAGE.ajax({
		type: 'get',
		msg: {
			"1": "成功",
			"2": "没有数据！"
		},
		url: "/api/game/skill",
		success: function (ret) {
			if(ret&&ret.length){
				ret = toSampleArrary(ret);
				loaded = true;
				$propsItem.html("");
				for(var i=0;i<ret.length;i++){
					var data = ret[i];
					var html = getHtmlTempl(data);
					$propsItem.append(html);
				}

			}else{
				$propsItem.html("无数据！");
				$linshouItem.html("无数据！");
			}

		},error:function () {
			$propsItem.html("数据有误！");
			$linshouItem.html("数据有误！");
		},complete:function () {
			$(".loading").hide();
		}
	});
	
	//新手指引
	if(PAGE.guide.needGuide && PAGE.guide.step=="skills"){
		$dialog[0].destroy = function(){
			if(!loaded){
				$.tips("请稍等，正在为您加载！");
				return false
			}
			var totalHeight = $body.height();
			var top = $scrollBody.scrollTop() + 5;
			var height = $scrollBody.height();
			if (totalHeight - height < top) {
				PAGE.guide.next();
				return;
			}
			$.tips("您还没查看完");
			return false;
		};
	}

})();
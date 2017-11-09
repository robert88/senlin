;(function () {
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	var $dialog = 	$(".pocketContent").parents(".dl-dialog");
	var $tabBody = $dialog.find(".tab-body-item");
	var $propsItem = $tabBody.eq(0);
	var $linshouItem = $tabBody.eq(1);
	//html模板
	function getHtmlTempl(obj) {
		return  ['<div class="list-bg bg-kuang">',
			'<div class="list-img bg-props"><img src="{0}" /><span class="number">x{1}</span></div>',
			'<div class="list-content">',
			'<p class="list-text fs12">{2}</p>',
			'<p class="list-btn tr userBtn" data-pid="{3}" title="{4}"><a class="text-border" data-text="使用">使用</a></p>',
			'</div>',
			'</div>'].join("").tpl(obj.icon,obj.remain||0,obj.introduce,obj.id);

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
		function initHtml(arr,$content){
		for(var i=0;i<arr.length;i++){
			var data = arr[i];
			if(data.title=="屠龙刀"){
				data.className = "J-buy-tulongdao";
			}
			var html = getHtmlTempl(data);
			$content.append(html);
		}
	}
	//加载数据
	$(".loading").show();
	PAGE.ajax({
		type: 'get',
		msg: {
			"1": "成功",
			"2": "没有数据！"
		},
		dataType:"json",
		url: "/api/game/pocket?token="+token,
		success: function (ret) {
			$propsItem.html("");
			$linshouItem.html("");
			if(ret){
				if($.type(ret)=="array"){
					ret = toSampleArrary(ret);
					for(var i=0;i<ret.length;i++){
						var data = ret[i];
						var html = getHtmlTempl(data);
						if(data.type==0||data.type==1){
							$propsItem.append(html);
						}else{
							$linshouItem.append(html)
						}
					}
				}else{

					if(ret.property&&ret.property.length){
						initHtml(ret.property,$propsItem);
					}else{
						$propsItem.html("无数据！");
					}
					if(ret.food&&ret.food.length){
						initHtml(ret.food,$linshouItem);
					}else{
						$linshouItem.html("无数据！");
					}
				}
				

			}else{
				$propsItem.html("无数据！");
				$linshouItem.html("无数据！");
			}

		},error:function () {
			$propsItem.html("无数据！");
			$linshouItem.html("无数据！");
		},complete:function () {
			$(".loading").hide();
		}
	});



	$dialog.on("click",".userBtn",function () {
		var $this = $(this);
		PAGE.data.selectFertilizerId = $this.data("pid");
		PAGE.data.applyFertilizer($dialog);
	});
})();
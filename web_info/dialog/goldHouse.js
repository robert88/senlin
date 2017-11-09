;(function () {
	var $dialog = $(".goldHouse").parents(".dl-dialog");
	var $tabProps = $dialog.find(".tab-head-props");
	var token = $.cookie("login_token");
	var number = 1;
	var forest_gold = $.cookie("forest_gold");
	var $header = $("header");
	var $gold = $header.find(".gold-text");
	var $tabBody = $dialog.find(".tab-body-item");
	var $hotItem = $tabBody.eq(0);
	var $propsItem = $tabBody.eq(1);
	var $linshouItem = $tabBody.eq(2);
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	/*
	* 数据模型
	* */
	function getHtmlTempl(obj) {
		var btn = "";
		//1才能购买
		if(obj.buy==1){
			btn = '<p class="list-btn tr" data-pid="{0}" data-price="{1}"><a class="text-border" data-text="购买">购买</a></p>'.tpl(obj.id,obj.price||0);
		}
		return  ['<div class="list-bg bg-kuang {6}">',
			'<div class="list-img bg-props"><img src="{0}" /></div>',
			'<div class="list-content">',
			'<p class="list-title fs16"> <span class="text-gradient" data-text="{1}">{1}</span> <span class="ml20 text-gradient" data-text="{2}">{2}</span><span class="text-gradient" data-text="{3}">{3}</span></p>',
			'<p class="list-text fs12">{4}</p>',
			"{5}",
			'</div>',
			'</div>'].join("").tpl(obj.icon,obj.title,obj.price||0,obj.unit,obj.introduce,btn,obj.className||"");
	}
	/*
	*购买
	* */
	$dialog.on("click",".list-btn",function (e) {

		var $this = $(this);
		var pid = $this.data("pid");
		var price = $this.data("price");
		var number = 1;

		//新手指引必须先购买屠龙刀
		if(PAGE.guide.needGuide && PAGE.guide.step=="goldHouse" && $this.parents(".J-buy-tulongdao").length==0){
			$.tips("请先购买屠龙刀！");
			return;
		}
		if(price>forest_gold){
			$.tips("元宝不足，请充值");
			return;
		}
		PAGE.ajax({
			type: "get",
			msg: {
				"-2": "元宝不足，请充值",
				"0": "登录token验证失败",
				"1": "购买成功",
				"2": "道具不存在",
				"3": "购买数量需大于等于1"
			},
			url: "/api/pay?pid=" + pid + "&token=" + token + "&number=" + number||1,
			success: function () {
				$.tips("购买成功", "success");
				//新手指引必须购买成功
				if(PAGE.guide.needGuide && PAGE.guide.step=="goldHouse"){
					PAGE.guide.next();
				}
				$.dialog.close($dialog);
				forest_gold = forest_gold-number*price;
				$gold.html(forest_gold || 0);
				$.cookie("forest_gold",forest_gold);
			}
		});
	});
	/*
	* 将二维数组转一维数组
	* */
	// function toSampleArrary(ret){
	// 	var newArr=[];
	// 	for(var i=0;i<ret.length;i++){
	// 		if($.type(ret[i])=="array"){
	// 			newArr = newArr.concat(ret[i]);
	// 		}else{
	// 			newArr.push(ret[i]);
	// 		}
	// 	}
	// 	return newArr
	// }
	/*
	*加载数据
	* */
	$(".loading").show();
	PAGE.ajax({
		type: 'get',
		msg: {
			"1": "成功",
			"2": "没有数据！"
		},
		dataType:"json",
		url: "/api/game",
		success: function (ret) {
			$hotItem.html("");
			$propsItem.html("");
			$linshouItem.html("");
			if(ret){
				if(ret.hot&&ret.hot.length){
					initHtml(ret.hot,$hotItem);
				}else{
					$hotItem.html("无数据！");
				}
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

			}else{
				$hotItem.html("无数据！");
				$propsItem.html("无数据！");
				$linshouItem.html("无数据！");
			}

		},error:function () {
			$hotItem.html("无数据！");
			$propsItem.html("无数据！");
			$linshouItem.html("无数据！");
		},complete:function () {
			$(".loading").hide();
		}
	});

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

	/*
	 *新手指引
	 * */
	if(PAGE.guide.needGuide && PAGE.guide.step=="goldHouse"){
		$tabProps.addClass("popToPop");
		$tabProps.on("click.guide", function () {
			$tabProps.removeClass("popToPop");
			$tabProps.off("click.guide");
			$dialog.find(".J-buy-tulongdao .list-btn>a").addClass("popToPop");
		});
	}

})();
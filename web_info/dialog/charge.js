;(function () {
	var $dialog = 	$(".chargeContent").parents(".dl-dialog");
	var forest_gold = $.cookie("forest_gold");
	var $header = $("header");
	var $gold = $header.find(".gold-text");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	$dialog.on("click",".J-okBtn",function (e) {
		var value = $dialog.find("input").val();
		if (value < 100) {
			$.tips("100元起冲");
			return false;
		} else {
			PAGE.ajax({
				type: "get",
				msg: {
					"0":"登录token验证失败",
					"1": "充值成功",
					"2": "支付请求超时"
				},
				url: "/api/pay/gold?number=" + value+"&token="+token,
				success: function (ret) {

					if(ret&&ret.url){
						
						window.location.href = ret.url;
						// var img = new Image();
						// img.src = ret.qrcode;
						// $.dialog($("<div/>").append(img),{close: false, dialogStyle:"height: auto;background: none;"})
					}

					$.dialog.close($dialog,e);
					// forest_gold = forest_gold*1 + value*1;
					// $.cookie("forest_gold",forest_gold);
					// $gold.html(forest_gold);

					if(PAGE.guide.needGuide && PAGE.guide.step=="charge"){
						PAGE.guide.next();
					}
				}, complete: function () {
					$dialog.trigger("chargeComplete");
				}
			})
		}
	})

})();
;(function () {
	var $body = $(".J-body");
	var $userPic = $body.find(".user-pic");
	var $userName = $body.find(".userName");
	var $userID = $body.find(".userID");
	var $userInvite = $body.find(".userInvite");
	var $userGold = $body.find(".userGold");
	var $userCoin = $body.find(".userCoin");


	var token = $.cookie("login_token");

	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	function toFloat(val) {
		val = $.trim(val).replace(/,/g, "");
		val = parseInt(val, 10);
		return val || 0
	}

	function viewInfo(type) {
		PAGE.ajax({
			loading: true,
			type: 'get',
			msg: {
				"0": "登录token验证失败！",
				"1": "申请成功",
				"2": "未实名认证，未绑定银行卡",
				"3": "未实名认证",
				"4": "未绑定银行卡"
			},
			url: "/api/homeland/view?token=" + token+"&type="+type,
			success: function (ret) {
				if(type==1 && ret){
					$.dialog(("<div class='col'><div class='col4'>姓名：</div><div class='col8'>{0}</div></div>"+
					"<div class='col'><div class='col4'>开户银行：</div><div class='col8'>{1}</div></div>"+
					"<div class='col'><div class='col4'>银行卡号：</div><div class='col8'>{2}</div></div>").tpl(ret.account,ret.bank,ret.card),{width: 280, closeStyle: "background: rgba(255,255,255,0.9);"})
				}else if(ret){
					$.dialog(("<div class='col'><div class='col4'>姓名：</div><div class='col8'>{0}</div></div>"+
						"<div class='col'><div class='col4'>身份证号：</div><div class='col8'>{1}</div></div>"+
						"<div class='col'><div class='col4'>正面：</div><div class='col8'><img src='{2}' width='100' height='100'></div></div>"+
						"<div class='col'><div class='col4'>反面：</div><div class='col8'><img src='{3}' width='100' height='100'></div></div>").tpl(ret.truename,ret.cardid,ret.font,ret.back),{width: 280, closeStyle: "background: rgba(255,255,255,0.9);"})
				}
			}
		})
	}

	/*
	 *加载数据
	 * */
	$(".loading").show();
	PAGE.ajax({
		type: 'get',
		msg: {
			"0": "登录token验证失败！",
			"1": "获取成功"
		},
		url: "/api/homeland?token=" + token,
		success: function (ret) {
			if (ret) {
				//头像
				var forest_sex = ret.sex;
				if (forest_sex == 0) {
					$userPic.removeClass("bg-user-female").addClass("bg-user-male")
				} else {
					$userPic.removeClass("bg-user-male").addClass("bg-user-female")
				}
				$.cookie("forest_sex", forest_sex);

				//财富
				var forest_gold = toFloat(ret.gold);
				var forest_coin = toFloat(ret.coin);

				$userGold.html(ret.gold);
				$userCoin.html(ret.coin);
				$.cookie("forest_gold", forest_gold);
				$.cookie("forest_coin", forest_coin);

				//邀请码
				$userInvite.html(ret.referrer);
				$userName.html($.cookie("login_nickname"));
				$userID.html(ret.user_id);

				//认证信息
				if (ret.is_realname * 1) {
					$(".bg-props-realnameAuth").removeClass("bg-props-realnameAuth").addClass("bg-props-realnameAuth-active");
					$(".realNameAuth a").click(function () {
						viewInfo(0);
					})
				} else {
					$(".realNameAuth a").click(function () {
						PAGE.setUrl('#/web_info/realnameAuth.html')
					})
				}


				//bank信息
				if (ret.is_bank * 1) {
					$(".bg-props-withdrawal").removeClass("bg-props-withdrawal").addClass("bg-props-withdrawal-active");
					$(".withdrawal a").click(function () {
						viewInfo(1);
					})
				} else {
					$(".withdrawal a").click(function () {
						PAGE.setUrl('#/web_info/cardManager.html')
					})
				}


			}

		}, complete: function () {
			$(".loading").hide();
		}
	});


})();
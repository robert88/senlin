;(function () {
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	var $content = $(".main-home-body");
	var $gold = $content.find(".userGold");
	var $withdrawGold = $content.find(".userWithdrawalGold");
	var $log = $content.find(".logInfo");
	var result;
	PAGE.ajax({
		loading:true,
		type: 'get',
		msg: {
			"0": "登录token验证失败",
			"1": " 申请成功",
			"6":"体现密码错误"
		},
		url: "/api/homeland/gold?token=" + token,
		success: function (ret) {
			if (ret) {
				result =ret;
				//	"status": 0, //0代表已绑定银行卡，1代表未实名认证，需跳转到实名认证；2代表未绑定银行卡
				if (ret.status == 1) {
					PAGE.setUrl('#/web_info/realnameAuth.html');
					return;
				} else if (ret.status == 2) {
					PAGE.setUrl('#/web_info/cardManager.html')
					return;
				}
				// 		var bankmap={
				// 	"中国农业银行":1,
				// 	"中国银行":2,
				// 	"中国建设银行":3,
				// 	"中国工商银行":4,
				// 	"交通银行":5,
				// 	"中国邮政储蓄银行":6,
				// 	"招商银行":7,
				// 	"兴业银行":8,
				// 	"民生银行":9,
				// 	"平安银行":10
				// }
				$gold.html(ret.number);
				$withdrawGold.html(ret.deposit);
				var $dialogContent = $("#withdrawlDialog")
				$dialogContent.find(".userWithdrawalGold").html(ret.deposit);
				$dialogContent.find(".userName").html(ret.account);
				$dialogContent.find(".bank_id").html(ret.bank);
				$dialogContent.find(".card").html(ret.card);
				//
				$(".J-withdrawal-btn").click(function () {
					withDrawDialog();
				})
				if (ret.log) {
					for (var i = 0; i < ret.log.length; i++) {
						var loginfo = ret.log[i];
						var map = {"0": {name:"购买元宝",value:1}, "1":{name:"购买道具",value:-1} , 
						"2": {name:"收获摇钱树",value:1}, "3":{name:"元宝提现",value:-1} }
						var mapItem=map[$.trim(loginfo.type)]
						$log.append(('<li class="col4">{0}</li><li class="col4">{1}</li><li class="col4">{2}</li>').tpl(loginfo.time,mapItem&&mapItem.name, (mapItem&&mapItem.value||1)*loginfo.number));
					}
				}
			} else {
				$gold.html(0);
				$withdrawGold.html(0);
			}
		}
	})


	function withDrawDialog() {
		var $dialog = $.dialog($("#withdrawlDialog"), {width: 300, closeStyle: "background: rgba(255,255,255,0.9);"});
		var $form = $dialog.find("form");
		var validForm = PAGE.validForm({
			validSuccess: function ($form) {
				var sum = $form.find(".sum").val();

				if(sum>result.deposit){
					$.tips("当前可提现金额为:"+result.deposit+"，你已超额！","error");
					return;
				}
				PAGE.ajax({
					data: $form.serialize() + "&token=" + token+"&type=0",
					type: 'get',
					msg: {
						"0": "登录token验证失败",
						"1": " 申请成功",
						"2": "请先进行实名认证，并绑定银行卡",
						"3": "请绑定银行卡信息",
						"4": "最低限额为100",
						"5": "申请超过余额"
					},
					url: "/api/homeland/withdraw",
					success: function (ret) {
						$.tips("<div class='tc'>提现成功<br>预计1-3个工作日到账</div>", "success");
						$.dialog.close($dialog);
						if(result){
							result.number = result.number-sum;
							result.deposit = result.deposit -sum;

							$coin.html(result.number);
							$withdrawCoin.html(result.deposit);
							var $dialogContent = $("#withdrawlDialog")
							$dialogContent.find(".userWithdrawalCoin").html(result.deposit);

						}

					}
				})
			},
			validError: function ($target, msg) {
				$.tips(msg, "error");
				$target.focus();
			},
			form: $form
		});
	
		/*自定义校验方法*/
		var validRule = validForm("getRule");
		validRule["number100"] = {
			check: function (validNum, $obj) {
					return !(validNum&&(validNum % 100 == 0));
			},
			defaultMsg: "最低提现额100以上，且为100整数倍"

		}
	}


})();
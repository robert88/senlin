;(function () {
	var token = $.cookie("login_token");

	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	var $form = $("#withdrawalForm");
	PAGE.validForm({
		validSuccess:function ($form) {
			PAGE.ajax({
				data:$form.serialize()+"&token="+token,
				type:'post',
				msg:{
					"0":"登录token验证失败",
					"1":" 设置成功",
					"2": "银行不存在",
					"3" :"开户姓名不能为空",
					"4": "收款帐号不能为空"
				},
				url:"/api/homeland/bank",
				success:function (ret) {
					$.tips("设置成功！", "success");
					PAGE.setUrl('#/web_info/homeInfo.html')
				}
			})
		},
		validError:function($target,msg){
			$.tips(msg,"error");
			$target.focus();
		},
		form:$form
	});
})();
require("./public/js/common.js");
;(function () {

	var $form = $("#loginForm");

	//焦点聚集到表单
	$("body").find(".J-submitBtn").removeClass("J-submitFocus");
	$form.find(".J-submitBtn").addClass("J-submitFocus");

	//记住密码
	var cookiePassword = $.cookie("login_password");
	var cookieName = $.cookie("login_username");
	var $mobile = $form.find("input[name='mobile']");
	var $password = $form.find("input[name='password']");
	var $remenber = $form.find("input[name='remember']");
	var $rememberAccountCheckbox =  $form.find(".rememberAccount");
	var $rememberPassWordCheckbox =  $form.find(".r98ememberPassWord");
	var cookiePasswordTemp = "test12345678";//临时的值
	if(cookiePassword && cookieName){
		$mobile.val(cookieName);
		//设置test1234567可以跳过校验和加密
		$password.val(cookiePasswordTemp);
		$rememberAccountCheckbox.click();
		$rememberPassWordCheckbox.click();
	}else if(cookieName){
		$mobile.val(cookieName);
		$rememberAccountCheckbox.click();
	}


	//表单校验
	PAGE.validForm({
		validSuccess:function ($form) {
			//记住密码
			if(cookiePassword && $password.val() == cookiePasswordTemp){
				$remenber.val(1);
				$password.val(cookiePassword);
			}
			PAGE.ajax({
				data:$form.serialize(),
				type:'get',
				msg:{
					"1":"登录成功",
					"2":"请填写手机号",
					"3":"请填写密码",
					"4":"用户不存在",
					"5":"帐号被冻结，请联系客服解封",
					"6":"密码错误，忘记密码请点击下方找回密码，密码输入错误5次后帐号冻结",
					"7":"密码错误",
					"8":"密码已过期，请重新输入"
				},
				url:"/api/user/login",
				success:function (ret) {
					$.tips("登录成功","success");
					if(ret&&ret.data){
						ret = ret.data;
						//已经完成了引导
						if(ret&& ret.status==1){
							$.cookie("forest_guide",true);
						}
					}
					PAGE.setUrl("#/web_info/home.html");
				},complete:function () {
					if(cookiePassword){
						$password.val(cookiePasswordTemp);
					}
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

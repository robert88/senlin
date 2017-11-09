;(function () {
	require("./public/js/common.js");
	var $form = $("#registerForm");
	var $captcha = $form.find(".J-captcha");
	$captcha.click(changeImage);
	function changeImage(){
		$captcha[0].src = "http://shnmkj.net.cn/sf/api/captcha?type=register&ver="+ (new Date().getTime());
	}

	changeImage();
	var $win = $(window)
	$win.off("resize.register").on("resize.register",function(){
		if($win.height()<$(".main-body").height()){
			$(".main-body").css({"top":0,marginTop:0});
		}else{
			$(".main-body").css({"top":"50%",marginTop:"-15.4375rem"});
		}
	});
	PAGE.destroy.push(function () {
		$win.off("resize.register");
	})
	$form.find(".J-submitBtn").addClass("J-submitFocus");
	var validForm = PAGE.validForm({
		validSuccess:function ($form) {

			PAGE.ajax({
				data:$form.serialize(),
				type:'post',
				msg:{
				"1":" 注册成功",
				"2": "请填写手机号",
				"3" :"请填写昵称",
				"4": "请填写密码",
				"5": "两次密码不一致",
				"6": "验证码不正确",
				"7" :"推荐码错误",
				"8": "短信验证码校验失败",
				"9": "数据校验失败",
				"10": "注册失败"
				},
				url:"/api/user/register",
				success:function (ret) {
					$.tips("注册成功","success");
					$.cookie("guideStep",null);
					if(ret&&ret.data){
						ret = ret.data;
						//已经完成了引导
						if(ret&& ret.status==1){
							$.cookie("forest_guide",true);
						}else{
							$.cookie("forest_guide",null);
						}
					}
					PAGE.setUrl("#/web_info/home.html");
				}
			})
		},
		validError:function($target,msg){
			$.tips(msg,"error");
			$target.focus();
		},
		form:$form
	});

	$form.find(".J-getMobileCode").click(function () {
		var $this =$(this);
		if($this.data("lock") || $this.data("lock-text")){
			return ;
		}
		var mobile = $form.find("input[name='mobile']").val();
		if(!/^\d{5,}$/.test($.trim(mobile))){
			$.tips("请填写正确的手机号","error");
			return ;
		}
		$this.data("lock",true).data("lock-text",true);
		var $text =$this.find(".text-gradient");

		if(!$text.data("origin-text")){
			$text.data("origin-text",$text.html());
		}
		var originText = $text.data("origin-text");
		$text.data("text",60).html(60);

		PAGE.ajax({type:"post",
			msg:{
				"1" :"发送成功",
				"2": "手机号格式不正确",
				"3" :"用户不存在（即手机号未注册，用于找回密码）",
				"4": "用户已注册",
				"5": "发送失败"
			},
			data:{type:"register",mobile:mobile},
			url:"/api/user/sms",
			success:function () {
			timoutCount($text,60,function(){
				$.tips("发送成功","success")
				$text.data("text",originText).html(originText);
				$this.data("lock-text",false);
			});
		},complete:function () {
			$this.data("lock",false);
		},errorCallBack:function () {
				$this.data("lock-text",false);
				$text.data("text",originText).html(originText);
		}});
	})
	function timoutCount($text,time,callback) {
		time--;
		$text.data("text",time).html(time);
		if(time<=0){
			if(typeof callback=="function"){
				callback()
			}
		}else{
			setTimeout(timoutCount,1000,$text,time,callback)
		}
	}
	/*自定义校验方法*/
	var validRule = validForm("getRule");
	validRule["password"] = {
		check:function(value, $obj) {

			//传递了比较值
			var validLenth = /^(\d|[a-z]){6,12}$/i.test(value);
			var validNum = /[0-9]/.test(value);
			var validLetter = /[a-zA-Z]/.test(value);
			return ! (validNum&&validLetter && validLenth) ;
		},
		defaultMsg:"请填写6-12位同时包含字符和数字的密码"

	}
})();
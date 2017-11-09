require("./public/js/common.js");
;(function () {
	var $step01 = $("#step01");
	var $step02 = $("#step02");
	var $header = $("header");
	var token;
	var step01Title = $header.html();
	var step02Title = '<a class="gotoStep01"><i class="bg-props-arrow bg-props" ></i></a><span>新密码</span>'

	function gotoStep01(){
		$step01.find(".J-submitBtn").addClass("J-submitFocus");
		token =null;
		$step01.show();
		$step02.hide();
		$header.html(step01Title)
	}
	function gotoStep02() {
		$step02.find(".J-submitBtn").addClass("J-submitFocus");
		$step01.hide();
		$step02.show();
		$header.html(step02Title)
	}
	$header.on("click",".gotoStep01",function () {
		gotoStep01();
	});

	 PAGE.validForm({
		validSuccess:function ($step01) {
				PAGE.ajax({
					data:$step01.serialize(),
					type:'post',
					msg:{
						"1":" 验证通过",
						"2": "请填写手机号",
						"3" :"请填写验证码",
						"4": "验证码校验失败",
						"5": "用户不存在"
					},
					url:" /api/user/forget",
					success:function (ret) {
						if(ret){
							token = ret.token;
							gotoStep02();
						}
					}
				})
		},
		 validError:function($target,msg){
			 $.tips(msg,"error");
			 $target.focus();
		 },
		form:$step01
	});

	$step01.find(".J-getMobileCode").click(function () {
		var $this =$(this);
		if($this.data("lock") || $this.data("lock-text")){
			return ;
		}
		var mobile = $step01.find("input[name='mobile']").val();
		if(!/^\d{5,}$/.test($.trim(mobile))){
			$.tips("请填写正确的手机号","error");
			return ;
		}
		$this.data("lock",true).data("lock-text",true);
		var $text =$this;
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
			data:{type:"forget",mobile:mobile},
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
//找回密码-------------------------------------------------
	/*自定义校验方法*/

	var validForm = PAGE.validForm({
		validSuccess:function ($step02) {
			if(!token){
				$.tips("没有验证账号,请返回上一步！");
				return;
			}

			PAGE.ajax({
				data:$step02.serialize()+"&token="+token,
				type:'post',
				msg:{
					"1":" 验证通过",
					"2": "请填写密码",
					"3" :"两次密码不一致",
					"4": "校验码为空",
					"5": "校验失败",
					"6": "用户不存在"
				},
				url:"/api/user/reset",
				success:function (ret) {
					$.tips("<div class='pt10 pb10 pr20 lh30' style='line-height: 2rem'><h3 class='tc'>密码修改成功</h3>" +
						"<p class='fs14'>3秒后返回登陆页面</p></div>", {
						type: "success", time: 3000, closeAfter: function () {
							PAGE.setUrl("#/web_info/login.html");
						}})
				}
			})
		},
		validError:function($target,msg){
			$.tips(msg,"error");
			$target.focus();
		},
		form:$step02
	});
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
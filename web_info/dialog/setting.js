;(function () {

	var $dialog = 	$(".settingContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}

	PAGE.data.audio = $.cookie("audioVolum")||"open";

	if(PAGE.data.audio=="open"){
		$dialog.find(".videoSetting").removeClass("off").addClass("on")
	}else{
		$dialog.find(".videoSetting").removeClass("on").addClass("off")
	}
	$dialog.on('click',".videoSetting",function () {

		if(PAGE.data.audio=="open"){
			PAGE.data.audio = "close";
			$.cookie("audioVolum","close")
			$(this).removeClass("on").addClass("off")
		}else{
			PAGE.data.audio = "open";
			$.cookie("audioVolum","open")
			$(this).removeClass("off").addClass("on")
		}
	}).on('click',".loginout",function () {

		PAGE.ajax({
			type: 'post',
			msg: {
				"1": "成功",
				"2": "系统繁忙！"
			},
			url: "/api/user/logout",
			success:function () {
				PAGE.setUrl("#/web_info/login.html");
			}
		});

	})
})();
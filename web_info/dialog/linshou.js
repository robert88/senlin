;(function () {
	var $dialog = 	$(".noticeContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	function getAnimal() {
		PAGE.ajax({
			data: {token: token},
			type: 'get',
			msg: {
				"1": "更新成功",
				"2": "校验码为空",
				"3": "校验失败",
				"4": "用户不存在"
			},
			url: "/api/user/animal",
			success: function (ret) {
				$dialog.find(".animalName").html(ret.nickname)
			}
		})
	
	}
	getAnimal();
})();
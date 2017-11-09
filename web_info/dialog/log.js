;(function () {
	var $dialog = 	$(".noticeContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	$dialog.on("click",".backBtn",function () {
		$("header .hardword").click();
	});
	var params = $dialog.data("params");

})();
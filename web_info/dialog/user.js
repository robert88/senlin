;(function () {
	var $dialog = 	$(".userContent").parents(".dl-dialog");
	var $userPic = $dialog.find(".user-pic");
	var $userName = $dialog.find(".userName");
	var $userID = $dialog.find(".userID");
	var $userInvite = $dialog.find(".userInvite");
	var $userGold = $dialog.find(".userGold");
	var $userCoin = $dialog.find(".userCoin");


	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}

	var forest_sex = $.cookie("forest_sex")||0;
	var invite_code = $.cookie("invite_code")||"";
	//财富
	var forest_gold =$.cookie("forest_gold")||0;
	var forest_coin = $.cookie("forest_coin")||0;
	var uid = $.cookie("login_uid")||"";
	var username = $.cookie("login_nickname")||"";

	if (forest_sex == 0) {
		$userPic.removeClass("bg-user-female").addClass("bg-user-male")
	} else {
		$userPic.removeClass("bg-user-male").addClass("bg-user-female")
	}

	//邀请码
	$userGold.html(forest_gold);
	$userCoin.html(forest_coin);
	$userInvite.html(invite_code);
	$userName.html(username);
	$userID.html(uid);

})();
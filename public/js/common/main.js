;
(function () {

	/**
	 * 自定义
	 * radio:.J-label-radio-group->.J-label-box->input
	 * 带动画效果
	 * */

	function checkRadio($parent,$input,$this){
		$parent.find(".J-label-box").removeClass("checked");
		$parent.find("input").prop("checked",false).trigger("change");
		$parent.find(".anim").removeClass("anim-scaleSpring");
		$parent.find(".icon-radiochecked").removeClass("icon-radiochecked").addClass("icon-radio");
		if(!$input.prop("checked")){
			$this.addClass("checked");
			$this.find(".anim").addClass("anim-scaleSpring ").removeClass("icon-radio").addClass(" icon-radiochecked");
			$input.prop("checked",true).trigger("change");
		}
	}
	
	/**
	 * 自定义input
	 * */

	$(document).on("focus","input,select,textarea,.J-input-focus-trigger",function(){

		$(this).parents(".J-input-focus").addClass("focus");

	}).on("blur","input,select,textarea,.J-input-focus-trigger",function(){

		$(this).parents(".J-input-focus").removeClass("focus");
	});


	/**
	 * 自定义
	 * checkbox:.J-label-box->input
	 *
	 * radio:.J-label-radio-group->.J-label-box->input
	 * */

	$(document).on("click",".J-label-box",function(){

		var $this  = $(this);

		var $checkbox = $this.find("input");

		var $radioGroup = $this.parents(".J-label-radio-group");

		//radio
		if($radioGroup.length){
			checkRadio($radioGroup,$checkbox,$this);

		//checkbox
		}else{
			if($checkbox.prop("checked")){
				$checkbox.prop("checked",false).val(0).trigger("change");
				$this.removeClass("checked")
			}else{
				$checkbox.prop("checked",true).val(1).trigger("change");
				$this.addClass("checked")
			}
		}
	});

	/**
	 * 自定义a标签,假刷新
	 * */
	$(document).on("click","a",function(){
		var $this = $(this);
		var href = ($this.attr("href")||"").split("#")[1];
		if(href&&href==window.location.hash.split("#")[1]){
			PAGE.loading();
			setTimeout(function () {
				PAGE.closeLoading();
			},10);
		}
	});

	$(document).on("click",".tab-wrap>.tab-head>.tab-head-item",function(){

		var $this = $(this);
		var handle = $this.data("handle");

		//取消切换
		if($this.hasClass("disabled") && $this.hasClass("active") ){
			return false;
		}

		var $parent = $this.parents(".tab-wrap");
		var curIndex = $this.index();
		var $allHeadItem  = $parent.find(".tab-head-item");
		var $allBodyItem = $parent.find(".tab-body-item");
		var $body =  $parent.find(".tab-body");
		var bodyItemStr = $body[0].nodeName == "UL"?("<li class='tab-body-item'></li>"):("<div class='tab-body-item'></div>");


		//不存在目标
		if( $allBodyItem.eq(curIndex).length == 0 ){
			var time = $allHeadItem.length -  $allBodyItem.length;
			if(time>0){
				for(var i=0;i<time;i++){
					$body.append(bodyItemStr);
				}
				$allBodyItem = $parent.find(".tab-body-item");
			}
		}
		//隐式函数
		if(typeof $this[0][handle] =="function"){
			//利用函数的返回值添加功能
			if($this[0][handle]($allBodyItem.eq(curIndex),$this) === false){
				return
			}
		}

		$allHeadItem.removeClass("active");
		$allBodyItem.removeClass("active");
		$this.addClass("active");
		$allBodyItem.eq(curIndex).addClass("active");
		return false;
	});
	function initWeiXin(){
		PAGE.ajax({
			type: 'get',
			url: "/api/jssdk?url="+encodeURIComponent(window.location.href),
			success: function (ret) {
				if(ret.length){
					ret =ret[0]
				}
				if(ret&&window.wx){
					wx.config({
						appId: ret.appId, // 必填，公众号的唯一标识
						timestamp:ret.timestamp , // 必填，生成签名的时间戳
						nonceStr: ret.nonceStr, // 必填，生成签名的随机串
						signature: ret.signature,// 必填，签名，见附录1
						jsApiList: [$.getParam(ret.rawString).jsapi_ticket] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function(){
						// PAGE.wxShare = function () {
						//
						// 	wx.onMenuShareTimeline({
						// 		title: '新用户免费领50元，躺着也能赚钱，内测期间每消费100元每周可赚150元，另有2亿分享奖励等你来拿！', // 分享标题
						// 		link: ret.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						// 		imgUrl: "http://shnmkj.net.cn/public/images/tree.jpg", // 分享图标
						// 		success: function () {
						// 			// 用户确认分享后执行的回调函数
						// 			$.tips("分享成功！","success");
						// 		},
						// 		cancel: function (ret) {
						// 			$.tips(ret+"分享失败！","success");
						// 			// 用户取消分享后执行的回调函数
						// 		}
						// 	});
						// }
					});
				}

			},
			error:function () {

			}
		})
	}
	initWeiXin()
})();




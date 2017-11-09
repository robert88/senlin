$(document).on("imageReady",function () {
	require("/public/js/module/nativeShare.js");
	PAGE.data = PAGE.data || {};
	PAGE.data.audio = $.cookie("audioVolum") || "open";
	var globalTimer = {};
	var $body = $("#J-body");
	var dflag, ex, ey,downMatrix;
	/*缩小*/
	var audios = {};
	var currZoom = 100;//最小的状态显示
	var zoomCenter = {x:0,y:0};
	var zoomtouch={}
	var perDr;
	var token = $.cookie("login_token");
	var $header = $("header");
	var $userPic = $header.find(".user-pic");
	var $coin = $header.find(".coin-text");
	var $gold = $header.find(".gold-text");
	var $charge = $header.find(".charge");
	var $footer = $("footer");
	var $pocket = $footer.find(".pocket");
	var $goldHouse = $footer.find(".goldHouse");
	var $skills = $footer.find(".skills").parents(".J-dialog");

	if (!token) {
		hash="#web_info/login";
	}

	function initDrag() {
		//居中
		var pcenter = {x:($(window).width()-$body.width())/2,y:($(window).height()-$body.height())/2};
		$body.css("transform","translate("+pcenter.x+"px,"+pcenter.y+"px)");

		$body.off("mousedown.dragbg touchstart.dragbg").on("mousedown.dragbg touchstart.dragbg", function (e) {
			if (e.type === "touchstart") {
				var touches = e.originalEvent.touches;
				e = e.originalEvent.touches[0];
				if (touches.length > 1) {
					$body.data("movelock",true);
				}
			}
			if ($(e.target).hasClass("dl-dialog")||$(e.target).parents(".dl-dialog").length) {
				return;
			}
			var $treeItem;
			if ($(e.target).hasClass("treeItem")) {
				$treeItem = $(e.target);
			} else {
				$treeItem = $(e.target).parents(".treeItem")
			}
			if ($treeItem.length && ($.cookie("forest_guide") || (!$.cookie("forest_guide") && $treeItem.data("guide")) )) {
				return;
			}

			dflag = true;

			downMatrix = getTransform($body);
			ex = e.pageX;
			ey = e.pageY;

			$(document).on("selectstart",function () {return false;});
			zoomtouch.start=null;
			return false;
		}).off("mousemove.dragbg touchmove.dragbg").on("mousemove.dragbg touchmove.dragbg", function (e) {

			if (dflag) {
				if (e.type === "touchmove") {
					var touches = e.originalEvent.touches;
					e = e.originalEvent.touches[0];
					if (touches.length > 1) {
						if(!zoomtouch.start){
							perDr=null;
							zoomtouch.start = [{x:touches[0].pageX,y:touches[0].pageY},{x:touches[1].pageX,y:touches[1].pageY}];
						}else{
							zoomtouch.move = [{x:touches[0].pageX,y:touches[0].pageY},{x:touches[1].pageX,y:touches[1].pageY}];
							scaleZoom(zoomtouch);
						}
						return false;
					}
				}
				var dx = downMatrix.translateX;
				var dy = downMatrix.translateY;
				var tx = e.pageX - ex + dx;
				var ty = e.pageY - ey + dy;
				var translate = limitTranslate(tx,ty);
				var matrix = "translate("+translate.x + "px,"+translate.y+"px) scale("+downMatrix.scaleX+","+downMatrix.scaleY+")"
				$body.css("transform",matrix);

			}
			return false;
		});

		$(document).off("touchend.dragbg mouseup.dragbg ").on("touchend.dragbg mouseup.dragbg ", function (e) {
			perDr = null;
			dflag = false;
			$(document).off("selectstart")
			zoomtouch.start=null;
			// $("#tips").html(" up");
			$body.data("movelock",false);
			//电脑端滚轮缩放
		}).off("mousewheel.dragbg").on("mousewheel.dragbg", function (evt) {
			if ($(evt.target).parents(".dl-dialog").length) {
				return;
			}
			var wheelDelta = evt.wheelDelta || evt.detail;
			//jquery bug； zepto没这个问题
			if (!wheelDelta && evt.originalEvent) {
				evt = evt.originalEvent;
				wheelDelta = evt.wheelDelta || evt.detail;
			}
			//没有滚动条
			if (wheelDelta < 0 || wheelDelta == 3) {
				reduceImage(evt);
			} else if (wheelDelta > 0 || wheelDelta == -3) {
				zoomImage(evt);
			}
			return false;

		}).off("click.dragbg touchstart.dragbg", ".J-dialog").on("click.dragbg touchstart.dragbg", ".J-dialog", function (evt) {
			var $this = $(this);
			//用户指引,且没有指引过
			// if (!$.cookie("forest_guide") && !$this.data("guide") || $this.data("lock")) {
			// 	return;
			// }
			//防止重复弹出
			if($body.data("dialog") || $body.data("movelock")){
				return;
			}
			$.dialog.closeAll();
			$body.data("dialog",true);
			var url = $this.data("url");
			var dialogId = $this.data("id");
			var dialogClass = $this.data("class");
			if (url) {
				$(".loading").show();
				$.dialog("url:" + url, {
					width: 330,
					dialogClass: dialogClass,
					id: (dialogId ? dialogId : ""),
					maskClose: false,
					closeAfter: function () {
						$body.data("dialog",false);
					},
					close: false, button: [{text: "", className: "backBtn"}],
					ready: function ($dialog) {
						$(".loading").hide();
						if (typeof $this[0].dialogReady == "function") {
							$this[0].dialogReady($dialog);
						}
					}
				});
			}
		});

		$(window).off("resize.dragbg").on("resize.dragbg", function (evt) {
			scaleBody({x:$(window).width()/2,y:$(window).height()/2},currZoom)
		});

		/*spa方式切页面时候需要清除全局事件和变量*/
		PAGE.destroy.push(function () {
			//先锁死计算器
			globalTimer.lock = true;
			$(document).off("mousedown.dragbg touchstart.dragbg")
				.off("mousemove.dragbg touchmove.dragbg")
				.off("mouseup.dragbg touchup.dragbg")
				.off("mousewheel.dragbg")
				.off("WeixinJSBridgeReady")
				.off("click.dragbg touchstart.dragbg", ".J-dialog");
			$(window).off("resize.dragbg");
		});
	}



	//缩放---------------------------------------------------------------------------
	/*手机端缩放*/
	function limitTranslate(tx,ty){

		var dw = $(window).width() - $body.width() * currZoom / 100;
		var dh = $(window).height() - $body.height() * currZoom / 100;
		tx = tx < dw ? dw : tx;
		ty = ty < dh ? dh : ty;
		tx = tx > 0 ? 0 : tx;
		ty = ty > 0 ? 0 : ty;
		return {x:tx,y:ty}
	}
	function getDistance(pos1, pos2) {
		var x = pos2.x - pos1.x,
			y = pos2.y - pos1.y;
		return Math.sqrt((x * x) + (y * y));
	}

	function converIn(s){
		var matrix =getTransform($body);
		var p0 ={
			x:matrix.translateX,
			y:matrix.translateY
		}
		return {
			x:(s.x-p0.x)/matrix.scaleX,
			y:(s.y-p0.y)/matrix.scaleX
		}
	}
	function scaleBody(s,scale){
		scale = getZoom(scale);

		if(scale==currZoom){
			return;
		}
		var p = converIn(s);
		// alert(p.x+" " +scale)
		var translate = {x:s.x - p.x*scale/100,y:s.y - p.y*scale/100}
		//以中心点缩放
		translate = limitTranslate(translate.x,translate.y);
		var matrixStr = "translate("+(translate.x) + "px,"+(translate.y)+"px) scale("+scale/100+","+scale/100+")";
		$body.css("transform",matrixStr);
		currZoom = scale;
	}

	function getZoom(zoom){
		var zoomx = $(window).width() / $body.width()* 100;
		var zoomy = $(window).height() / $body.height() * 100;

		var minZoom = Math.max(zoomx, zoomy);
		var maxZoom = Math.max(minZoom, 100);
		// alert($(window).width()+"  "+$body.width()+" "+minZoom+" " +maxZoom )
		if (zoom < minZoom) {
			zoom = minZoom;
		}
		if (zoom > maxZoom) {
			zoom = maxZoom;
		}
		return zoom;
	}

	function scaleZoom(zoomtouch) {
		var perPoint = getDistance(zoomtouch.start[0],zoomtouch.start[1]);
		var curPoint = getDistance(zoomtouch.move[0],zoomtouch.move[1]);
		var dr = Math.floor(curPoint/perPoint*100);
		if(perDr&&perDr!=dr){
			var e = zoomtouch.start[0];
			var e2 = zoomtouch.start[1];
			var s = {x:e.x+(e2.x-e.x)/2,y:e.y+(e2.y-e.y)/2};
			var zoom = currZoom;
			$("#tips").html(s.x+" "+s.y+" "+zoom+" "+dr+"perdr"+perDr);
			if(dr>perDr){
				zoom+=3
			}else{
				zoom-=3
			}
			scaleBody(s,zoom);

		}
		perDr =dr;
	}

	/*放大*/
	function zoomImage(e) {
		var zoom = currZoom;
		var s = {x:e.pageX,y:e.pageY};
		zoom++;
		scaleBody(s,zoom)
	}

	/*缩小*/
	function reduceImage(e) {
		var zoom = currZoom;
		var s = {x:e.pageX,y:e.pageY};
		zoom--;
		scaleBody(s,zoom)
	}


	// var c = $("#test")[0];
	// var cxt = c.getContext("2d");
	// c.width=$body.width();
	// c.height= $body.height();
	// function drawDot(x,y,text) {
	//
	// 	cxt.fillStyle="#FF0000";
	// 	cxt.beginPath();
	// 	cxt.font="30px Verdana";
	// 	// cxt.arc(x,y,15,0,Math.PI*2,true);
	// 	cxt.fillText(text,x,y);
	// 	cxt.closePath();
	// 	cxt.fill();
	// }

	//播放声音---------------------------------------------------------------------------
	/*倒计时*/
	function counter(targetEle, count, callback) {

		//配合targetEle.timer
		if($("body").find(targetEle).length==0){
			return;
		}
		$(targetEle).data("counter", count--);

		if (typeof callback == "function") {
			callback(targetEle, count);
		}
		if (count == 0) {
			return;
		}
		PAGE.clearTimeout(targetEle.timer);
		targetEle.timer = PAGE.setTimeout(counter, 1000, targetEle, count, callback);
	}
	/*
	 * 永久循环播放
	 * */
	function loop(type,i,volume){
		var audio =getAudio(type,i);
		//设置音效是打开的。
		if (PAGE.data.audio == "open") {
			if (audio.paused) {
				audio.play();
				audio.volume = (volume==null?1:volume);
				audio.loop = true;
			}
		} else {
			if (audio.pause) {
				audio.pause();
			}
		}
		if(globalTimer.lock){
			if (audio.pause) {
				audio.pause();
			}
			return;
		}
		PAGE.setTimeout(loop,1000,type,i,volume);
	}
	/*
	 * 循环播放
	 * */
	function cricle(count,timeObj,audio,callback){


		if (timeObj.lock) {
			return;
		}
		//播放停止，不能用onend因为可能播放同一个audio在处理不同的事务,必须放在play之前，防止死循环
		if (audio.paused) {
			count--;
		}
		//设置音效是打开的。
		if (PAGE.data.audio == "open") {
			if (audio.paused) {
				audio.play();
			}
		} else {
			if (audio.pause) {
				audio.pause();
			}
		}

		if (count <= 0 || !count) {
			if (typeof callback == "function") {
				callback();
			}
			return;
		}

		PAGE.setTimeout(cricle,timeObj.time,count,timeObj,audio,callback);
	}
	function getAudio(type,i) {
		if(!PAGE.globalAudios[type]){
			console.log("音频文件不存在");
			return
		}
		var audioItem = PAGE.globalAudios[type];

		if (!audioItem.audios[i]) {
			audioItem.audios[i] = new Audio();
		}
		var audio = audioItem.audios[i];

		if (!audio.init) {
			audio.src = audioItem.buffer;
			audio.init = true;
		}
		return audio;
	}
	/*
	 * type播放的声音类型，i表示全局存储的audio索引，count播放的次数，callback播放完毕
	 * */
	function playAudio(type, i, count, timeObj, callback) {
		var audio =getAudio(type,i);
		PAGE.setTimeout(cricle,timeObj.time,count,timeObj,audio,callback);
	}

	/*
	 * 弹出窗confirm
	 * */
	PAGE.data.confirm = function (msg,confirm,cancel) {
		return $.dialog("<div class='bg-title bg-title-confirm'></div><div style='text-align: center;margin-top:2.8125rem;'>"+msg+"</div>",
			{
				width: 330,
				dialogClass: "smallDialog",
				maskClose: false,
				close: false,
				closeAfter:function () {
					$body.data("dialog",false);
				},
				footerStyle: "bottom: 15px;",
				button: [
					{
						text: '<span class="btn-tab"><span class="text-gradient" data-text="确认">确认</span></span>',
						click: confirm
					},
					{
						text: '<span class="btn-tab-active ml10"><span class="text-gradient" data-text="取消">取消</span></span>',
						className: "cancelBtn",
						click: cancel
					}
				]
			});
	}
	/*
	 * 显示金币和头像
	 * */
	function showUserInfo() {
		if (!token) {
			PAGE.setUrl("#/web_info/login.html");
			return;
		}

		var forest_sex = $.cookie("forest_sex");
		var forest_gold = $.cookie("forest_gold");
		var forest_coin = $.cookie("forest_coin");

		$coin.html(forest_coin || 0);
		$gold.html(forest_gold || 0);
		if (forest_sex == 0) {
			$userPic.removeClass("bg-user-female").addClass("bg-user-male")
		} else {
			$userPic.removeClass("bg-user-male").addClass("bg-user-female")
		}
	}
	/*
	 * 显示摇钱树全部没有破产封印
	 * */
	function initAllTree() {
		var $tree;
		for (var i = 1; i < 11; i++) {
			$tree = $("#tree" + i.toString().fill("000"));
			$tree.html('<div class="bg-renwu-trunk bg-renwu"></div><div class="bg-renwu-seal bg-renwu"></div>');
		}
	}
	/*
	 * 显示施了对于化肥之后的成熟的摇钱树
	 * */
	function updateTreeStatus($tree, treeInfo) {
		if (treeInfo.apply_type == 1) {
			$tree.html('<div class="bg-renwu-fertilizer4 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 2) {
			$tree.html('<div class="bg-renwu-fertilizer3 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 3) {
			$tree.html('<div class="bg-renwu-fertilizer2 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 4) {
			$tree.html('<div class="bg-renwu-fertilizer1 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		}else{
			$tree.html('<div class="bg-renwu-trunk bg-renwu"></div></div>');
		}
	}
	/*
	 * 显示摇钱树
	 * */
	function initTree() {
		PAGE.ajax({
			type: "get",
			url: "/api/trees?token=" + token,
			success: function (data) {
				if (data&&data.length) {
					for (var i = 0; i < data.length; i++) {
						var treeInfo = data[i];
						//灵兽信息
						if(treeInfo.serial==0){
							if(treeInfo.status!=0){
								$(".animalItem").removeClass("disabled");
								counter($(".animalItem")[0], treeInfo.hanger*1, function (targetEle, count) {
										if (count <= 0) {
											$(".animalItem").find(".tips").html('主人~~我饿得口吐白沫了，快邀请好友获取食物吧!');
										}
									});
							}
							$(".animalItem").data("info",treeInfo);
							continue;
						}

						var $tree = $("#tree" + treeInfo.serial.toString().fill("000")).data("treeinfo", treeInfo);

						// 0未破除封印，1已破除，2未shifei,3已收获，4 需浇生命液进行激活
						switch (treeInfo.status) {
							case "0":
								$tree.html('<div class="bg-renwu-trunk bg-renwu"></div><div class="bg-renwu-seal bg-renwu"></div>');
								break;
							case "2":
								//已经成熟了
								if (treeInfo.countdown <= 0) {
									updateTreeStatus($tree, treeInfo);
								} else {
									$tree.html('<div class="bg-renwu-trunk bg-renwu"></div>');
									counter($tree[0], treeInfo.countdown, function (targetEle, count) {
										if (count <= 0) {
											updateTreeStatus($(targetEle), $(targetEle).data("treeinfo"));
										}
									});
								}
								break;
							case "1":
							case "3":
							case "4":
								$tree.html('<div class="bg-renwu-trunk bg-renwu"></div>');
								break;
						}
					}
				}else{
					initAllTree();
				}
			},
			error: function () {
				initAllTree();
			}
		})
	}
	/*
	 * 处理封印,不能用data("treeinfo")
	 * */
	function handleBreakseal($treeItem,$seal) {

		var treeId = $treeItem.attr("id");
		var serial = parseInt(treeId.replace("tree",""),10);
		PAGE.data.confirm("是否破除封印？",function (e, $dialog) {
			PAGE.ajax({
				type: "get",
				msg: {
					"-1": "暂无破除封印道具,请到藏金阁购买！",
					"0": "登录token验证失败",
					"1": "破除成功",
					"2": "摇钱树编号错误！",
					"3": "摇钱树不存在！",
					"4": "摇钱树已破除封印！"
				},
				url: "/api/trees/relieve?serial=" + serial +"&token=" + token,
				success: function () {
					$.tips("成功破除", "success");
					$seal.remove();
					if(PAGE.guide.needGuide && PAGE.guide.step=="breakSeal"){
						PAGE.guide.next();
					}
				},complete:function () {
					$body.data("dialog",false);
					$.dialog.close($dialog);
				}
			});
			//阻止关闭窗口
			return false;
		});
	}
	/*
	 * 施肥
	 * */
	PAGE.data.applyFertilizer = function ($dialog) {


		var serial = PAGE.data.selectSerial;
		var pid = PAGE.data.selectFertilizerId;

		var $treeItem = $("#tree" + serial.toString().fill("000"));
		var treeInfo = $treeItem.data("treeinfo");

		if(treeInfo.status==3 ){
			$.tips("该摇钱树需要浇灌生命药水！");
			return;
		}

		if(serial==null){
			$.dialog.close($dialog);
			$.tips("请选择要施肥的摇钱树！");
			return;
		}
		if (pid==null) {
			$.dialog.close($dialog);
			$pocket.data("guide", true);
			$pocket.click();
			//需要施加生命药水
			$.tips("请选择化肥类型！");
			return;
		}
		PAGE.ajax({
			type: "post",
			msg: {
				"-1": "暂无该类型化肥,请到藏金阁购买！",
				"0": "登录token验证失败",
				"1": "施肥成功",
				"2": "摇钱树编号错误",
				"3": "摇钱树不存在",
				"4": "摇钱树未破除封印",
				"5": "摇钱树已施肥！",
				"6": "摇钱树需浇生命液进行激活"
			},
			url: "/api/trees/apply?serial=" + treeInfo.serial+ "&token=" + token + "&property_id=" + pid,
			success: function (ret) {
				$.tips("施肥成功", "success");
				PAGE.data.selectSerial = null;
				PAGE.data.selectFertilizerId = null;
				//新手指引
				if(PAGE.guide.needGuide && PAGE.guide.step=="fertilizer"){
					PAGE.guide.next();
				}
				$.dialog.close($dialog);
				if(ret){
					$treeItem.data("treeinfo",ret);
					counter($treeItem, ret.countdown);
				}
			},
			complete:function () {
				$body.data("dialog",false);
			}
		});
	};
	/*
	 * 浇灌生命药水
	 * */
	function applyLife() {
		PAGE.ajax({
			type: "post",
			msg: {
				"-1": "暂无生命液,请到藏金阁购买！",
				"0": "登录token验证失败",
				"1": "成功浇生命液",
				"2": "摇钱树编号错误",
				"3": "摇钱树不存在",
				"4": "摇钱树不需要生命液"
			},
			url: "/api/trees/life?serial=" + treeInfo.serial+ "&token=" + token + "&property_id=" + pid,
			success: function () {
				$.tips("成功浇生命液", "success");
			},
			errorCallBack:function (text, type, tipsType, ret) {
				if(ret.code==-1){
					PAGE.data.confirm("您的包裹里没有生命液，为您跳转到藏经阁。",function (e, $dialog) {
						$goldHouse.data("guide",true).click();
					});
				}
			},complete:function () {
				$body.data("dialog",false);
			}
		});
	}
	/*
	 * 点击摇钱树树干,施肥，查看状态,serial只能用id中值
	 * */
	function handletrunk( $treeItem) {

		var treeInfo = $treeItem.data("treeinfo");
		var treeId = $treeItem.attr("id");
		var serial = parseInt(treeId.replace("tree",""),10);

		//提示倒计时
		if ($treeItem.data("counter")) {
			var $dilaog = $.tips("摇钱树距离下一个阶段的成长还有<span class='counter'>" + $treeItem.data("counter") + "</span>", "warn", 5000);
			counter($dilaog.find(".counter"), $treeItem.data("counter"), function (ele, count) {

				var day = Math.floor(count/24/60/60);
				var hours = Math.floor((count - day*24*60*60)/60/60);
				var minute = Math.floor((count - day*24*60*60-hours*60*60)/60);
				if(count<60){
					count = count + "秒";
				}else{
					count =(day>0&&(day+" 天 ")||" ") +  (hours>0&&(hours+" 时 ")||" ")  + (minute>0&&(minute+" 分 ")||" ");
				}
				$(ele).html(count);
				playAudio("clock", 0, 1, {time: 50});
			});
			$body.data("dialog",false);
			return
		}

		if(treeInfo&&treeInfo.status==3 ){
			msg =  "摇钱树编号："+treeId.replace("tree","") + "需要浇灌生命药水！"
		}else if(treeInfo&&treeInfo.status==2){
			msg = "是否继续为编号：" + treeId.replace("tree","") + "的摇钱树施肥？"
		}else{
			msg = "是否为编号：" + treeId.replace("tree","") + "的摇钱树施肥？"
		}
		PAGE.data.confirm(msg,function (e, $dialog) {
			PAGE.data.selectSerial = serial;
			if(treeInfo&&treeInfo.status==3 ){
				applyLife($dialog)
			}else{
				PAGE.data.applyFertilizer($dialog);
			}
			//阻止关闭窗口
			return false;
		});
	}
	/*
	 *收获动画
	 **/
	function playRewardAnimate($ani, count) {
		var arr = ["0", "-130px 0px", "-260px 0px", " -390px 0px", "-520px 0px", "0px -280px", "-130px -280px", "-260px -280px", "-390px -280px", "-520px -280px", "-1000px -1000px"]
		if (!$ani) {
			$ani = $("<div class='bg-banquetfiy'></div>").appendTo("body");
		}
		if (typeof count == "undefined") {
			count = 0;
			$ani.css("left", (10 * Math.random() + 45) + "%")
		}
		count++;

		$ani.css("background-position", arr[count]);

		if (count >= arr.length - 1) {
			count = 0;
			if (playRewardAnimate.audioEnd) {
				$ani.remove();
				return
			}
		}

		PAGE.setTimeout(playRewardAnimate, 200, $ani, count);
	}
	function getTransform($target){
		var matrix = $target.css("transform");
		if(matrix && typeof matrix=="string" && matrix!="none"){
			matrix=matrix.split(/[^0-9\.\-]/g);
			var newArr=[]
			$.each(matrix,function (idx,val) {
				if(val){newArr.push(val);}
			})
			matrix = newArr;
		}else if(typeof matrix!="object"){
			matrix=[0,0,0,0,0,0];
		}
		return {
			scaleX: matrix[0]*1,
			scaleY: matrix[3]*1,
			translateX:matrix[4]*1,
			translateY: matrix[5]*1,
			rotateX: matrix[1]*1,
			rotateY: matrix[2]*1
		}
	}
	/*
	 * 收获语音及触发动画
	 * */
	function playRewardCoin(len, count, callback) {
		len = len > 4 ? 4 : len;
		len = len < 1 ? 1 : len;
		var lenCount = len;
		playRewardAnimate.audioEnd = false;
		for (var i = 0; i < len; i++) {

			playAudio("coin", i, count, {time: i * 200}, function () {
				lenCount--;
				if (lenCount <= 0) {
					playRewardAnimate.audioEnd = true;
					if (typeof callback == "function") {
						callback();
					}
				}
			});
			playRewardAnimate();
		}
	}
	/*
	 * 收获
	 * */
	function handleReward($tree) {
		if($tree.data("lock")){
			$body.data("dialog",false);
			return;
		}
		if ($tree.find(".bg-props-hand")) {
			$tree.data("lock", true);
			var treeInfo = $tree.data("treeinfo");
			PAGE.ajax({
				type: "get",
				msg: {
					"0" :"登录token验证失败",
					"1" :"收获成功",
					"2": "摇钱树编号错误",
					"3": "摇钱树不存在",
					"4" :"摇钱树还未成熟",
					"5": "摇钱树非收获时期"
				},
				url: "/api/trees/collect?serial=" + treeInfo.serial+"&token="+token,
				success: function (ret) {
					var forest_gold = $.cookie("forest_gold");
					var forest_coin = $.cookie("forest_coin");
					var coin = ret.coin||0;
					var gold = ret.gold ||0;
					$coin.html((forest_coin*1+coin*1) || 0);
					$gold.html((forest_gold*1 + gold*1) || 0);
					PAGE.data.confirm("点击屏幕右上角“...”按钮，收藏本页面。并分享给好友，将会获得好友消费金额的5%奖励哟!",function (e, $dialog) {
						shareFriend();
					});
					playRewardCoin(treeInfo.apply_type, 10, function () {
						$tree.data("lock", false);
						$tree.html('<div class="bg-renwu-trunk bg-renwu"></div>');
					});
				},errorCallBack:function () {
					$tree.data("lock", false);
				},complete:function () {
					$body.data("dialog",false);
				}
			});
		}else{
			$body.data("dialog",false);
		}
	}

	function initShare(){
		$(".J-share-btn").click(function () {
			$(".ls-container").css("overflow","hidden");
			$(".J-share-contain").addClass("slideShow")
			$(".mask").show()
		});
		// $("#copy").attr("data-clipboard-text",window.location.href);
		// var clipboard = new Clipboard($("#copy")[0]);
		// clipboard.on('success', function(e) {
		// 	e.clearSelection();
		// 	$.tips("地址复制成功！","success");
		// });
		// clipboard.on('error', function(e) {
		// 	$.tips("不支持本地复制，请点击屏幕右上角“...”按钮，收藏本页面。并分享给好友及朋友圈！")
		// });
		$(".J-share-cancel").on("click",function () {
			$(".mask").hide()
			$(".ls-container").css("overflow","visible");
			$(".J-share-contain").removeClass("slideShow")
		})
		// new nativeShare("shareNode");
	}
	/*
	* 分享到朋友圈
	* */
	function shareFriend(){
		if(PAGE.wxShare ){
			PAGE.wxShare();
		}else{
			$(".J-share-btn").click();
		}
	}
	
	/*
	 * 点击摇钱树
	 * */
	function initTreeEvent() {
		var animateTimer;

		$body.on("click touchstart", ".animalItem", function () {
			var $this = $(this);
			var count = $this.data("click-num")||0;
			PAGE.setTimeout(function () {
				$this.data("click-num",0);
			},500);
			count++;
			$this.data("click-num",count);
			if(count<2){
				return;
			}
			$this.data("click-num",0);

			if($body.data("dialog")|| $body.data("movelock")){
				return
			}
			if($this.hasClass("disabled")){
				PAGE.data.confirm("点击屏幕右上角“...”按钮，收藏本页面。并分享给好友，将会获得好友消费金额的5%奖励哟!",function (e, $dialog) {
						shareFriend();
					});
				return;
			}
			if($this.data('info')&&$this.data('info').hanger<=0){
				PAGE.data.confirm("主人~~我饿得口吐白沫了，快邀请好友获取食物吧!",function (e, $dialog) {
					shareFriend();
				});
			}
			
		});
		$body.on("click touchstart", ".treeItem", function () {
			var $this = $(this);
			var count = $this.data("click-num")||0;
			PAGE.setTimeout(function () {
				$this.data("click-num",0);
			},500);
			count++;
			$this.data("click-num",count);
			if(count<2){
				return;
			}
			$this.data("click-num",0);

			// if (PAGE.guide.needGuide && !$this.data("guide") || $this.data("lock")) {
			// 	return;
			// }

			if($body.data("dialog")|| $body.data("movelock")){
				return
			}
			$body.data("dialog",true)
			$.dialog.closeAll();
			var $seal = $this.find(".bg-renwu-seal");
			var $trunk = $this.find(".bg-renwu-trunk");
			if ($seal.length) {
				handleBreakseal($this,$seal);
			} else if ($trunk.length) {
				handletrunk( $this,$trunk);
			} else {
				handleReward($this)
			}

		});
	}

	//新用户指导----------------------------------------------------------------------------------
	/*
	 * 新用户指导
	 * */
	function initGuide() {
		var step = $.cookie("guideStep");
		PAGE.guide = {};
		PAGE.guide.handler = [];
		//触发下一个步骤
		PAGE.guide.next=function () {
			$(".popToPop").removeClass("popToPop");
			var handler = PAGE.guide.handler.shift();
			if(handler){
				PAGE.guide.step = handler.name;
				$.cookie("guideStep",handler.name);
				handler.func();
			}
		};
		if (!$.cookie("forest_guide")) {

			PAGE.guide.needGuide = true;
			var stepArr = [{func:guideSkills,name:"skills"},
				{func:guideCharge,name:"charge"},
				{func:guideGoldHouse,name:"goldHouse"},
				{func:guideTree,name:"breakSeal"},
				{func:guideTree,name:"fertilizer"},
				{func:guideEnd,name:"guideEnd"}
			]
			//step1
			var finded = false;
			for(var i=0;i<stepArr.length;i++){
				if(step){
					if(step==stepArr[i].name){
						finded = true;
					}
				}

				if(finded || !step){
					PAGE.guide.handler.push(stepArr[i]);
				}
			}

			//执行step1
			PAGE.guide.next();
		}

	}

	/*
	 *阅读游戏说明
	 * */
	function guideSkills() {
		$skills.click().addClass("popToPop").data("guide", true);
	}

	/*
	 *充值
	 * */
	function guideCharge() {
		$charge.addClass("popToPop").data("guide", true);
	}
	/*
	 *藏经阁
	 * */
	function guideGoldHouse() {
		$goldHouse.addClass("popToPop").data("guide", true);
	}
	/*破除封印->施肥*/
	function guideTree() {
		$body.find("#tree001").addClass("popToPop").data("guide", true);
	}
	/*记录新手指南*/
	function guideEnd() {
		PAGE.ajax({
			data: {token: token},
			type: 'post',
			msg: {
				"1": "更新成功",
				"2": "校验码为空",
				"3": "校验失败",
				"4": "用户不存在"
			},
			url: "/api/user/guide",
			success: function () {
				$.tips("向导指南结束，祝您玩的愉快！")
				$.cookie("forest_guide", true);
				PAGE.guide.needGuide = false;
			}
		})
	}
	function updateUserStatus() {
		PAGE.ajax({
			data: {token: token},
			type: 'get',
			msg: {
				"1": "更新成功",
				"2": "校验码为空",
				"3": "校验失败",
				"4": "用户不存在"
			},
			url: "/api/user/treasure",
			success: function (ret) {
				if(ret){
					$.cookie("forest_gold",$.trim(ret.gold)*1);
					$.cookie("forest_coin",$.trim(ret.coin)*1);
				}
			},error:function (e) {
				console.error(e);
			},complete:function () {
				showUserInfo();
			}
		});
		$("header").on("updateUserInfo",showUserInfo);

	}


	//初始化----------------------------------------------------------------------------------


	initTree();
	initTreeEvent();
	initDrag();
	scaleBody({x:$(window).width()/2,y:$(window).height()/2},10);
	initGuide();
	loop("bg",0,0.5);
	updateUserStatus();
	initShare();

});

if(PAGE.imageLoaded){
	$(document).trigger("imageReady")
}
;(function () {
	var $dialog = 	$(".worldSortContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	//html模板
	function getHtmlTempl(obj,sort) {
		return  ['<div class="col3">{0}</div>',
			'<div class="col3">{1}</div>',
			'<div class="col3">{2}</div>',
			'<div class="col3" data-id="{3}">{4}</div>'].join("").tpl(sort,obj.name,obj.treasure,obj.uid,obj.steal>=1?'<div class=" bg-props bg-props-hand animate-flow" ></div>':"");

	}
	//灵兽html模板
	function getHtmlTempl2(obj,sort) {
		return  ['<div class="col3">{0}</div>',
			'<div class="col3">{1}</div>',
			'<div class="col3">{2}</div>',
			'<div class="col3">{3}</div>'].join("").tpl(sort,obj.nickname,obj.username,obj.rank);

	}
	function initSort($content,url,htmlTempl) {
		var page = 1;
		var pagesize=9;
		var totalpage;
		var perPage;
		function getData(){
			if(perPage==page){
				return;
			}
			perPage = page;
			$(".loading").show();
			$content.find(".sortInfo li").html("");
			PAGE.ajax({
				type: "get",
				msg: {
					"0":"登录token验证失败",
					"1": "请求成功"
				},
				url: url+"?page=" + page+"&pagesize="+pagesize+"&token="+token,
				success: function (ret) {
					if(ret&&ret.list&&ret.list.length){
						for(var i=0;i<ret.list.length;i++){
							var sort = (i+(page-1)*pagesize)+1;
							$content.find(".sortInfo li").eq(i).html(htmlTempl(ret.list[i],sort));
						}
						//上榜
						if(ret.ranking&&ret.ranking!=-1){
							$content.find(".sortInfoControl .ranking").html(ret.ranking);
						}else{
							$content.find(".sortInfoControl .ranking").html("未上榜");
						}
						totalpage = ret.pages;
						$content.find(".sortInfoControl .page").html(page);
						$content.find(".sortInfoControl .totalpage").html(totalpage);
					}

				},complete:function () {
					$(".loading").hide();
				}
			})
		}
		$content.on("click",".sortInfoControl .next",function () {
			page++;
			if(totalpage&& page>totalpage){
				page = totalpage;
			}
			getData();
		}).on("click",".sortInfoControl .prev",function () {
			page--;
			if(page<1){
				page = 1;
			}
			getData();
		});

		getData();

	}
	$dialog.on("click",".bg-props-hand",function () {
		var id = $(this).parent().data("id");
		$(".loading").show();
		PAGE.ajax({
			type: "get",
			msg: {
				"0":"登录token验证失败",
				"1": "请求成功",
				"2":"每天只能偷取一次"
			},
			url: "/api/trees/steal"+"?token="+token+"&uid="+id,
			success: function (ret) {
				if(ret){
					var number = ret.number*1;
					var forest_coin =( $.cookie("forest_coin")*1)||0;
					$.cookie("forest_coin",forest_coin+number);
					$("header").trigger("updateUserInfo")
				}

			},complete:function () {
				$(".loading").hide();
			}
		})
	}).on("click",".tab-head-item",function () {
		var $this = $(this);
		if(!$this.data("init")){
			$this.data("init",true);
			if($this.data("type")=="friend"){
				initSort($dialog.find(".J-wordPersonSort"),"/api/game/fighter",getHtmlTempl,1);
			}else{
				initSort($dialog.find(".J-wordAnimalSort"),"/api/game/animal",getHtmlTempl2);
			}
		}
	});


	$dialog.find(".tab-head-item").eq(0).click();
	
	
	

})();
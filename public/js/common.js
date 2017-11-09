/**
 * Created by 84135 on 2017/9/27.
 */
$(function () {

	var $win = $(window);
	var $body = $("body");

	/*横竖屏的功能*/
	function changeBodyBackground(){
		var radio = $win.width()/$win.height();
		if(radio>1){
			$body.css("background-size","100% auto");
		}else{
			$body.css("background-size","auto 100%");
		}
	}

	
	$win.off("resize.bodybackgroundsize").on("resize.bodybackgroundsize",function(){
		changeBodyBackground()
	});
	changeBodyBackground();

	PAGE.destroy.push(function () {
		$win.off("resize.bodybackgroundsize");
	})
});
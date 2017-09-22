$(function () {
	var x,y,flag
	$("body").append("<canvas id='size' style='position:absolute;left:0;top:0px;display:none;' ></canvas>")
	$("body").append("<div id='color' style='position:fixed;left:0;top:0px;z-index:1;color:red;padding:20px;'><i class='tip' style='display: inline-block;width: 10px;height: 10px;margin-right: 10px;'></i><span class='text'></span></div>")
	$("body").append("<canvas id='color2' style='position:absolute;left:0;top:0px;border:1px solid red;display: none' width=100 height=100></canvas>")
	var c = $("#size")[0];
	var ctx = c.getContext("2d");
    c.height=$("body").height()
    c.width=$("body").width()
	$(document).on("mousedown",function (e) {
		 x = e.pageX;
			y = e.pageY;
		flag = true;

        c.height=$("body").height()
        c.width=$("body").width()
        if(e.target.nodeName=="IMG"){
            selectcolore(e.target,e.pageX,e.pageY);
        }
        $("#size").show();
    }).on("mousemove",function (e) {
    	if(flag){
            c.width = c.width;

            drawline(x,y,e.pageX,e.pageY)
            console.log(x,y,e.pageX,e.pageY)
		}

    }).on("mouseup",function () {
		flag = false;
        $("#size").hide();
    })
	function drawline(x0,y0,x1,y1){

        ctx.beginPath();
        ctx.strokeStyle="#ff00ff";
        ctx.moveTo(x0,y0);
        ctx.lineTo(x0,y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.lineTo(x1,y0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.lineTo(x1,y1);
        ctx.stroke();


        ctx.beginPath();
        ctx.font="40px Arial";
        ctx.fillText((x1-x0)+"px "+(y0-y1)+"px",x1+10,y1+10);
	}

    var c2 = $("#color2")[0];
    var ctx2 = c2.getContext("2d");

	function selectcolore(img,x0,y0) {
        var x1 = x0-$(img).offset().left;
        var y1 = y0- $(img).offset().top;
        c2.width = c2.width;
        ctx2.drawImage(img, x1, y1,100,100,0,0,100,100);
        var imageData = ctx2.getImageData(0, 0, 1, 1);
        var pixel = imageData.data;
        var colorstr = "#{0}{1}{2}".tpl(pixel[0].toString(16).fill("00"),pixel[1].toString(16).fill("00"),pixel[2].toString(16).fill("00"));

        $("#color").css("color",colorstr).find(".tip").css("background",colorstr)
        $("#color").find(".text").html("#{0}{1}{2}   rgb({3},{4},{5})".tpl(pixel[0].toString(16).fill("00"),pixel[1].toString(16).fill("00"),pixel[2].toString(16).fill("00"),pixel[0],pixel[1],pixel[2]))
    }
})
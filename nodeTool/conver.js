var fs = require('fs');
var path = require('path');
require("../../toolLib/prototype.js")
var wake = require("../../toolLib/fileWake.js")

var htm = wake.findFile('../jpg', 'jpg',true);
var htmMap =  wake.toMap(htm,"jpg");
var str = [];
for(var i in htmMap){
	var htmPath = "../web/{0}.html".tpl(htmMap[i].replace("../jpg/",""))
	var cssPath = "../web/{0}.css".tpl(htmMap[i].replace("../jpg/",""))
	var jsPath = "../web/{0}.js".tpl(htmMap[i].replace("../jpg/",""))
	var imgPath = "./jpg/{0}.jpg".tpl(htmMap[i].replace("../jpg/",""))
	str.push("<p>{1}</p><div><img src='{0}'</div>".tpl(imgPath,htmMap[i]));
	wake.writeData(htmPath,"<div class='ls-container'></div>")
	wake.writeData(cssPath,"")
	wake.writeData(jsPath,"")
	console.log(htmPath)
}

wake.writeData("../mapjpg.html","<html><head><meta charset='utf-8'>{1}</head><body>{0}</body></html>".tpl(
	str.join(""),
    '<link rel="stylesheet" type="text/css" href="./public/css/common/base.css">' +
    '<link rel="stylesheet" type="text/css" href="./public/css/common/main.css">' +
    '<link rel="stylesheet" type="text/css" href="./public/css/common/swiper.css">' +
    '<link rel="stylesheet" type="text/css" href="./public/css/skin/main_color.css">'+
   ' <script src="./public/js/common/prototype.js"></script>'+
    '<script src="./public/js/lib/jquery-1.12.4.js"></script>' +
   '<script src="./nodeTool/getsize.js"></script>'

));
var fs = require('fs');
var path = require('path');
var wake = require("../../toolLib/fileWake.js")
var htm = wake.findFile('../web', 'html',true);
var htmMap =  wake.toMap(htm,"html");
var str = [];
str.push("<a href='/index.html#map'>go map-------------------</a><br><br><br>")
for(var i in htmMap){
	// if(wake.isExist(htmMap[i]+".js")){
		
	// 	var js = wake.readData(htmMap[i]+".js");
		
	// }
	
	// if(js){
	// 	var title = js.match(/vuePage.header.title\s*=\s*"([^"]+)"/gm);
	// 	console.log(htmMap[i]+".title".red,title)
	// 	title = title[0]&&title[0].replace("vuePage.header.title","")
	// }
	str.push("<a href='#"+htmMap[i].replace(/^\.\.\//g,"")+"?css=1&js=1'>"+"title"+":"+i+"</a><br>");
	
}
console.log(str.join(""))
wake.writeData("../map.html","<div style='background: #fff;color:#000;'>"+str.join("")+"</div>");
var fs = require('fs');
var path = require('path');
require("../../toolLib/prototype.js")
var wake = require("../../toolLib/fileWake.js")

//合并js代码的预编译
// var isMergeJsTag =  /^<!--\s*start\s+mergeJs:/.test(inject[item])||/^<!--\s*end\s+mergeJs/.test(inject[item]);

function createNav(op){
    console.log("sss".red,wake.isExist(op.htmlPath))
    var htmlfile = wake.findFile(op.htmlPath,"html");
    var temphtml = wake.readData(op.temp);
    // console.log(temphtml)
    for(var i=0;i<htmlfile.length;i++){
    // for(var i=0;i<3;i++){

        var file = htmlfile[i];
        var filedata = wake.readData(file);

        var regstart= /<!--=S\s+左侧导航\s+-->/gm;
        var regend = /<!--=E\s+左侧导航\s+-->/gm;

        filedata=filedata.replace(/(<!--=S\s+左侧导航\s+-->).*/gm,"\n$1\n")
        filedata=filedata.replace(/(<!--=E\s+左侧导航\s+-->).*/gm,"\n$1\n")


        var matchstart  = filedata.match(regstart);
        var matchend  = filedata.match(regend);

        var startindex;
        var endindex;
        if(matchstart){

            var filedatalist = filedata.split(/\n|\r/);
            /*过滤掉空格*/
            filedatalist = filedatalist.filter(function(list) {
                return list!="";
            });
            /*去掉中间内容*/
            filedatalist.forEach(function (str,index) {
                regstart.lastIndex = 0;
                regend.lastIndex = 0;
                if(regstart.test(str)){
                    startindex = index;
                }
                if(regend.test(str)){
                    endindex = index;
                }
            })
            var startdata = filedatalist.slice(0,startindex);
            var enddata = filedatalist.slice(endindex+1)
            var middle = setlicurrentopen(getfilename(file),temphtml);
            // console.log()
            console.log(getBuildPath(file,"./build2"))
            wake.writeData(getBuildPath(file,"./build2"),startdata.concat(middle).concat(enddata).join("\n"))
        }else{
            console.log(file.red)
        }
    }
}
//nodeep防止死循环
function setlicurrentopen(filename,data,nodeep){

    var dataarr = data.split(/\n|\r/);

    /*过滤掉空格*/
    dataarr = dataarr.filter(function(list) {
        return list!="";
    });

    var startindex;
    /*去掉中间内容*/
    dataarr.forEach(function (str,index) {
        if(~str.indexOf(filename)&&startindex==null){
            startindex = index;
        }
    })

    var issubList = false
    for(var i=startindex;i>=0;i--){

            var tempstr,tempstrclass

            //listTitle的父类
            if(/<li[^>]*>/.test(dataarr[i])&&issubList){

                 tempstr = delAttr(dataarr[i])[0]
                 tempstrclass = (delAttr(dataarr[i])[1]||"").replace(/\bcurrent\b/g,"").replace(/\bopen\b/g,"")

                dataarr[i] = tempstr.replace(/(<li[^>]*)>/,"$1 class='current open "+tempstrclass+"'>")
                break;

            }

            //当前的li
        if(/<li[^>]*>/.test(dataarr[i])&&startindex==i){

             tempstr = delAttr(dataarr[i])[0]
             tempstrclass = (delAttr(dataarr[i])[1]||"").replace(/\bcurrent\b/g,"")

            var mapname = /data-map="([^"]+)"/g.exec(dataarr[i])
            //映射文件名
            if(mapname&&mapname[1]&&nodeep==null){
                 console.log("map".red,filename,"to".green,mapname[1])
                 return setlicurrentopen(mapname[1],data,true)
            }
            dataarr[i] = tempstr.replace(/(<li[^>]*)>/,"$1 class='current "+tempstrclass+"'>")
        }
            //subList
            if(/\bsubList\b/.test(dataarr[i])){

                dataarr[i] = dataarr[i].replace(/(<ul[^>]*)>/,"$1 style=\"display:block;\">")

            }
            if(/\blistTitle\b/.test(dataarr[i])){
                issubList =true;
            }
    }

    return dataarr

}
function getfilename(file){
    return file.slice(file.lastIndexOf("/")+1)
}
//去掉class
function delAttr(str){
    var name="";
    return [str.replace(/<li([^>]*)>/,function(m,m1){

        var m2 = m1.replace(/class\s*=\s*'([^']*)'/,function(mm1,mm2){
            name = mm2;
            return ""
        });
        m2 = m2.replace(/class\s*=\s*"[^"]*"/,function(mm1,mm2){
            name = mm2;
            return ""
        });
        return m.replace(m1,m2)
    }),name]
}
/*根据文件所在的位置 换成 打包之后的文件所在位置*/
function getBuildPath(from,to){
    /*去掉..保留实际的路径*/
    return (to+"/"+from.replace(/\.\.\//g,"").replace(/\.\//g,"") ).toURI();
}


createNav({
    temp:"./navtemp.html",
    htmlPath:"../../../../work/gitlearning/deeplearning",
})
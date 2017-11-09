;(function(){
	
	/*转化为数组*/
	if(!$.toArray){
		$.toArray=function(arr){
			return Object.prototype.toString.call(arr)=="[object Array]"?arr:[arr];
		}
	}

	
/*更新了ui 触发update事件*/
	if(!$.fn.updateUI){
		$.fn.updateUI=function(){
			this.triggerHandler("updateUI");
		}
	}
	
	/*开启选择*/
	if(!$.enableSelection){
		var selection = document.onselectstart;
		$.enableSelection=function(){
			document.onselectstart = selection;
		}
	}
	
	/*取消选择*/
	if(!$.disableSelection){
		$.disableSelection=function(){
			document.onselectstart = function(){return false;}
		}
	}

	/*国际化可以待参数*/
    if(!$.i18n){
        $.i18n=function(code){
            return code;
        }
    }

    /*延时*/
    if(!$.delay){
    	$.delay = (function(){
    			var timer;
    			return function(time,callBack){
    				clearTimeout(timer);
                    timer = setTimeout(function(){
    					if(typeof callBack == "function"){
    						callBack()
    					}
    				},time)
    			}
    		})();
    }
    if(!$.fn.innerHeight){
		$.fn.innerHeight = function(){
			return this.height()+(this.css("padding-top")||"").toFloat()+(this.css("padding-bottom")||"").toFloat()
		}
	}
	if(!$.fn.innerWidth){
		$.fn.innerWidth = function(){
			return this.width()+(this.css("padding-left")||"").toFloat()+(this.css("padding-right")||"").toFloat()
		}
	}
	

})();
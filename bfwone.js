//bfwone v1.0
(function () {
	//var err_txt="";
	var err_show=false;
	var funcs = [];
    var ready = false;
    var _base_url="";
    var _bfw_loadedfile=[];
    var _bfw_config_loaded=false;
    var _bfw_callback={};
    var _loc_bfw_config = {
    		dependency:[],
    		jsbaseurl : "http://repo.bfw.wiki/bfwrepo/js/",
    		cssbaseurl : "http://repo.bfw.wiki/bfwrepo/css/",
    		usercssbaseurl : "/",
    		userjsbaseurl : "/",
    		userloadjs:"",
    		userloadcss:""
    };
    var check_t=null;
    var depencencyload=false;


     //添加数组IndexOf方法
    if (!Array.prototype.indexOf){
      Array.prototype.indexOf = function(elt /*, from*/){
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;

        for (; from < len; from++){
          if (from in this && this[from] === elt)
            return from;
        }
        return -1;
      };
    }
    var bfwoneid=document.getElementById('bfwone');
    if(bfwoneid!=null){
    	var bfwfiledata = bfwoneid.getAttribute('data');
    	if(bfwfiledata!=null){
        	var bfw_arr=bfwfiledata.split("&");
            for(var i=0;i < bfw_arr.length;i++){
               var  find_num=bfw_arr[i].indexOf("=");
                if(find_num>0){
                    var  key_name=bfw_arr[i].substring(0,find_num);
                    var  key_value=bfw_arr[i].substr(find_num+1);
                    //alert(key_name+key_value);
                     if(key_name=="dep"){
                    	 _loc_bfw_config.dependency=key_value.split("|");
                     }
                     if(key_name=="jb"){
                     	 _loc_bfw_config.jsbaseurl=key_value;
                     }
                     if(key_name=="cb"){
                     	 _loc_bfw_config.cssbaseurl=key_value;
                     }
                     if(key_name=="ucb"){
                     	 _loc_bfw_config.usercssbaseurl=key_value;
                     }
                     if(key_name=="ujb"){
                     	 _loc_bfw_config.userjsbaseurl=key_value;
                     }
                     if(key_name=="err"){

                     	 _loc_bfw_config.err_show=key_value==1?true:false;
                     }
                     if(key_name=="loadjs"){
                     	 _loc_bfw_config.userloadjs=key_value;
                     }
                     if(key_name=="loadcss"){
                     	 _loc_bfw_config.userloadcss=key_value;
                     }
                     if(key_name=="loadpara"){
                     	 window.bfwonepara=key_value;
                     }
                }
            }
    	}


    }

    //alert(_loc_bfw_config.err_show);
    onerror=handleErr;


    function handleErr(msg,url,l)
	{
    	if(_loc_bfw_config.err_show){
    		var err_txt="出现错误:";
    		err_txt+="Error: " + msg ;
    		err_txt+="Line: " + l +"\n";
    		debugShow(err_txt);
    	}
		return true
	};
	function debugShow(str){
		//alert(str);
		var debug_pannel=document.getElementById('bfwone_debug_pannel');
		if(debug_pannel==null){
			debug_pannel = document.createElement('div');
			debug_pannel.id="bfwone_debug_pannel";
			//debug_pannel.style="position:absulte;z-index:1111;right:0;bottom:0;width:30%;height:30%;background:white;";
			debug_pannel.style.position = "absolute";
			debug_pannel.style.right =  '20px';
			debug_pannel.style.bottom =  '20px';
			debug_pannel.style.overflow = "scroll";
			debug_pannel.style.zIndex = "9999";
			debug_pannel.style.width = "40%";
			debug_pannel.style.height = "40%";
			debug_pannel.style.background = "black";
			debug_pannel.style.color = "grey";
			debug_pannel.style.padding = "6px";
			var lines=document.createElement("p");
			debug_pannel.appendChild(document.createTextNode("bfwone调试信息"));
			lines.appendChild(document.createTextNode(getLocalTime()+":"+str));
			debug_pannel.appendChild(lines);
			bfwoneready(function(){document.body.appendChild(debug_pannel)});

		}else{
			var lines=document.createElement("p");
			lines.appendChild(document.createTextNode(getLocalTime()+":"+str));
			debug_pannel.appendChild(lines);
		}
		//alert(str);
	};
    var  initconf=function(){
    	if(!_bfw_config_loaded){
    	    if(_loc_bfw_config.dependency.length==0){
    	    	depencencyload=true;
    	    }else{
        	    for(j = 0,len=_loc_bfw_config.dependency.length; j < len; j++) {
        	    	if(j==len-1){
        	    		loadjs(_loc_bfw_config.dependency[j],"","",function(){depencencyload=true;});
        	    	}else{
        	    		loadjs(_loc_bfw_config.dependency[j],"","",function(){});
        	    	}

        	    }
    	    }
    	    _bfw_config_loaded=true;
    	}
    };
    var getLocalTime=function () {

        var date = new Date();
        this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return  this.minute + "分" + this.second + "秒 "+ date.getMilliseconds()+"微秒";

    	  // return new Date(parseInt(Date.parse(new Date())) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    };
    var bfwone= function(modulepara,callback){
    	loadjs(modulepara[0]== undefined?"":modulepara[0],modulepara[1]== undefined?"":modulepara[1],modulepara[2]== undefined?"":modulepara[2],callback);
    };
   	var loadjs=function(modulename,relatedcssmodulename,islocal,callback){
   		//alert(modulename+relatedcssmodulename+islocal);
   		//console.log(modulename);
    	if(modulename==""){
    		callback();
    	}else{
    		if(relatedcssmodulename!=""){
    			loadcss(relatedcssmodulename,islocal);
    		}
    		if(_bfw_loadedfile.indexOf(islocal+"js."+modulename)==-1){
    			_bfw_loadedfile.push(islocal+"js."+modulename);

    		}else{
    			callback();
    			return;
    		}
    		var script = document.createElement("script");
    		script.setAttribute("type","text/javascript");
    		if(islocal=="local"){
    			script.src=_loc_bfw_config.userjsbaseurl+modulename+'.js';
    		}else{
    			script.src=_loc_bfw_config.jsbaseurl+modulename+'.js';
    		}

    		document.getElementsByTagName("head")[0].appendChild(script);

    		if ( window.ActiveXObject || "ActiveXObject" in window){ //判断是否是ie
    			    if(script.readyState){
    			        script.onreadystatechange = function() {
    			            if(this.readyState == "loaded" || this.readyState == "complete"){
    			             //	console.log("ie10及以下加载完成");
    			//alert("ie10及以下加载完成"+modulename);

    			if(_loc_bfw_config.err_show){
    				debugShow("ie10及以下加载完成"+modulename);
    			}
    			//setTimeout(function(){callback();},1000);
    			callback();

    		   				// Handle memory leak in IE
    	    				script.onload = script.onreadystatechange = null;
    			            }
    			        }
    			  }else{
    			        script.onload = function() {
    				if(_loc_bfw_config.err_show){
        				debugShow("ie11及Edge"+modulename);
        			}
    						//alert("ie11及Edge");
    						// console.log("ie11及Edge");
    						callback();
    		   				// Handle memory leak in IE
    	    				script.onload = script.onreadystatechange = null;
    			           
    			        }
    			  }
    		}else{
    			    script.onload = function() {
    				if(_loc_bfw_config.err_show){
        				debugShow("非ie浏览器"+modulename);
        			}
    			       //  console.log('非ie浏览器');
    						callback();
    			    }
    		}

    	}
    };
    var formatetpl = function(dta, tmpl) {
        var format = {
            name: function(x) {
                return x
            }
        };
        return tmpl.replace(/{(\w+)}/g, function(m1, m2) {
            if (!m2)
                return "";
            return (format && format[m2]) ? format[m2](dta[m2]) : dta[m2];
        });
	};
    var loadcss=function(modulename,islocal){
 		if(_bfw_loadedfile.indexOf(islocal+"css."+modulename)==-1){
			_bfw_loadedfile.push(islocal+"css."+modulename);
		}else{
			return;
		}
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        if(islocal=="local"){
        	 link.href = _loc_bfw_config.usercssbaseurl+modulename+'.css';
        }else{
        	link.href = _loc_bfw_config.cssbaseurl+modulename+'.css';
        }

        document.getElementsByTagName("head")[0].appendChild(link);
    };
    var checkdependloaded=function(){
    	if(depencencyload){
    		clearInterval(check_t);
    		for(var i=0; i<funcs.length; i++) {
                funcs[i].call(document);
            }
    		funcs = null;
    	}
    };
    var handler=function(e) {
        if(ready) return;
        if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
            return;
        }
        if(depencencyload){
        	for(var i=0; i<funcs.length; i++) {
                funcs[i].call(document);
            }
        	funcs = null;
        }else{
        	check_t=setInterval(function(){checkdependloaded();},500);
        }

        ready = true;

    };
    var bfwoneready=function(fn) {
        if(ready) { fn.call(document); }
        else { funcs.push(fn); }
    };
    if ( typeof window === "object" && typeof window.document === "object" ) {
        window.bfwone = window.bone = window.use= bfwone;
        window.bfw = window.bready = bfwoneready;
       // window.bfwconf = bfwconf;
    }
    initconf();
    if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', handler, false);
        document.addEventListener('readystatechange', handler, false);            //IE9+
        window.addEventListener('load', handler, false);
    }else if(document.attachEvent) {
        document.attachEvent('onreadystatechange', handler);
        window.attachEvent('onload', handler);
    }
    if(_loc_bfw_config.userloadcss!=""){
    	loadcss(_loc_bfw_config.userloadcss,"local");
    }
    if(_loc_bfw_config.userloadjs!=""){
    	bfwoneready(function(){loadjs(_loc_bfw_config.userloadjs,"","local",function(){})});
    }

})();

//主页面index加载后，调用init()初始化数学公式编辑界面,
//在数学公式编辑面板中，点击图标的动作
function init(){
		
		$(".tabContent div.mathBox").hide();               //隐藏内容div
		   
		$(".tabTitle li").click(function(){                //菜单点击事件
			$(".tabContent div.mathBox").hide();
			var n = 0;
			var obj = this;
			$(".tabTitle li").each(function(i,o){
				if(obj == o){
					n = i;
				}
			});
			$(".tabTitle li").removeClass("current");
			$(obj).addClass("current");
			$(".tabContent div.mathBox:eq(" + n + ")").show();
		});
		//缺省显示第一个
		$(".tabTitle li:eq(0)").click();

        //选择常用公式标签项
		$(".tabContent div.mathBox:eq(0)").html(mathHtml({
				groupid:0,
				x:0,                                //第9行，第一个常用公式的横坐标
				y:272,                             //第9行，第一个常用公式的纵坐标
				count:14                           //查看图片math.png，从第9行到第10行，共有14个常用公式     
			}));
        //特殊字母标签项
		$(".tabContent div.mathBox:eq(1)").html(mathHtml({
				groupid:1,
				x:0,                               //第6行，第一个特殊字母的横坐标
				y:170,                             //第6行，第一个特殊字母的纵坐标
				count:22                           //查看图片math.png，从第6行到第8行，共有22个特殊字母，
		}));
        //运算符号标签项
		$(".tabContent div.mathBox:eq(2)").html(mathHtml({
				groupid:2,
				x:0,
				y:0,
				count:36                           //查看图片math.png，从第1行到第5行，共有36个运算符号，
			}));
      //常用公式,更多按钮绑定的事件
    $(".tabContent div.mathBox div.more").click(function(){
        var rowHei = 20;
        var mi = $(this).parent().find(".mathIcon");
        if($(this).attr("isOpen") == '0'){
          mi.animate({"height":(rowHei * Number($(this).attr("mrows")))+"px"});
          $(this).html("↑ <b>收起</b>");
          $(this).attr("isOpen",'1');
        }else{
          mi.animate({"height":(rowHei * 2)+"px"});
          $(this).html("<b>更多</b>");
          $(this).attr("isOpen",'0');
        }
        
      });			
		 //公式编辑框，获取其中的内容，没有此句，结果框不显示,设置公式字体
		$("#jme-math").html("").css("font-size","20px").mathquill('editable').mathquill('write', "");
	
}
//二维数组，存储每个数学公式,符号,字母图标icon，所对应的Latex数学公式
//由于\是转义字符，将\frac{}{}中的\转化成{/}，并在结果中进行替换。
	var jmeMath = [
		//常用公式Tab项
		[
			"{/}frac{}{}","^{}/_{}","x^{}","x_{}","x^{}_{}","{/}bar{}","{/}sqrt{}","{/}nthroot{}{}",
			"{/}sum^{}_{n=}","{/}sum","{/}log_{}","{/}ln","{/}int_{}^{}","{/}oint_{}^{}"
		],
        //特殊字母Tab项
		[
			"{/}alpha","{/}beta","{/}gamma","{/}delta","{/}varepsilon","{/}varphi","{/}lambda","{/}mu",
			"{/}rho","{/}sigma","{/}omega","{/}Gamma","{/}Delta","{/}Theta","{/}Lambda","{/}Xi",
			"{/}Pi","{/}Sigma","{/}Upsilon","{/}Phi","{/}Psi","{/}Omega"
		],
	    //运算符号Tab项	
		[
			"+","-","{/}pm","{/}times","{/}ast","{/}div","/","{/}bigtriangleup",
			"=","{/}ne","{/}approx",">","<","{/}ge","{/}le","{/}infty",
			"{/}cap","{/}cup","{/}because","{/}therefore","{/}subset","{/}supset","{/}subseteq","{/}supseteq",
			"{/}nsubseteq","{/}nsupseteq","{/}in","{/}ni","{/}notin","{/}mapsto","{/}leftarrow","{/}rightarrow",
			"{/}Leftarrow","{/}Rightarrow","{/}leftrightarrow","{/}Leftrightarrow"
		]
	];
//点击图标时，插入相应的Latex公式，字母，符号	
function mathHtml(obj){
		var cols = 7;                                                  //一行放7个图标icon，
		var slidLen = 34;                                              //每个图标icon的宽或高，
		var html="<div class='mathIcon'>";
		for(var i = 0 ; i < obj.count ; i ++){

			         //点击图标时，插入相应的Latex公式，字母，符号  
			html += "<li onclick=\"insert('" + jmeMath[obj.groupid][i]   //对应图标与Latex命令
				   + "')\" style=\"background-position:-"
			       + (obj.x + Math.floor(i%8)*slidLen) + "px -"          //此行的8，是指图片math.png一行有8个图标
			       + (obj.y + Math.floor(i/8)*slidLen) + "px;\"></li>";
		}
		html += "</div>";
    if(obj.count > cols * 2){
      html += "<div class='more' mrows='" + Math.floor((obj.count + cols - 1) / cols) + "' isOpen='0'><b>更多</b></div>"
    }
		return html;
	}
//当鼠标在数学公式编辑框中时，完成替换
function insert(q){
		$("#jme-math").focus().mathquill("write", q.replace("{/}","\\"));
	}

/////////////////////显示数学公式编辑框，动态监听输出公式（刘东明）2015年1月19日/////////////////////////////////////////
//定时器
var Time=0;

  Time=setInterval(function() {           //设置定时器，动态监听
       outputMath();
    }, 500);



   //输出公式  
function outputMath(){
        var root=document.getElementById("jme-math");       //MathQuill渲染数学公式的根节点 
                                
         //Latex格式
        var mathStr=processing(root);                       //递归处理 
        var resultLatex=document.getElementById("resultLatex");
           //resultLatex.innerHTML=result;                  //使用p或者div显示结果
        var result=charReplace(mathStr);                    //将结果中的所有特殊字符进行替换 
        while(result.indexOf("{/}")>-1)                     //替换掉结果中的所有{/}
             result=result.replace("{/}","\\");
           resultLatex.value=result;                        //使用input显示结果

        //数学解析式
        var jxStr=processed(root);                          //递归处理 
        var jiexiform=document.getElementById("jiexiform");  
        jiexiform.value=jxStr;                              //使用input显示结果


}//outputMath()

////////////////////////////////////递归处理Latex格式（刘东明）2015年1月19日///////////////////////////////////////////////
 var nthRoot="";        //全局变量，缓存n次根式次数，处理完一个将其重置为空，
function processing(elem){                                //elem为处理的根节点
   var t="";
   
   for(var i=0;i<elem.childNodes.length;i++){
       var e=elem.childNodes[i];                         //遍历根节点的所有子元素      
      
      switch(e.nodeName){                               //子元素的标签名
        
        case 'VAR':                               //Latex字符串变量，一定是一个标签一个字符，没有子元素。 
            t+=e.innerHTML.toString();            //直接获取其内容，输出即可。
        break;

        case 'BIG':
                                                   //符号 ∫ ，∑ ，等，最后需要在结果字符串中进行替换。
            t+=e.innerHTML.toString();             //现在直接获取其内容，输出即可。
        break;

        case 'SUP':                               
            if(e.className=="non-leaf"){                 //处理简单上标, 或积分 ∮ 中的上标
                t+='^{'+processing(e)+'}';               //递归调用processing(e)函数。
            }else
            if(e.className=="nthroot non-leaf"){         //处理n次根号中的上标  
                
                nthRoot="1/"+processing(e);      //递归调用processing(e)函数。获取根号的次数，存入全局变量nthRoot中
            }else
            if(e.className=="non-leaf limit"){           //处理积分 ∫ 中的上标  
                 t+='^{'+processing(e)+'}';              //递归调用processing(e)函数。获取上标内容
            }
        break;

        case 'SUB':
            if(e.className=="non-leaf"){                 //处理简单下标, 或积分 ∮ 中的下标
                t+='_{'+processing(e)+'}';               //递归调用processing(e)函数。
            }else
            if(e.className=="non-leaf limit"){           //处理积分 ∫ 中的下标  
                 t+='_{'+processing(e)+'}';              //递归调用processing(e)函数。获取上标内容
            }         
        break;

        case 'SPAN':
             t+=spanProc(e);                             //span部分比较多，单独作为一个函数    
        break;
      }

    }//for

    return t;
}//processing(elem)

//span元素处理函数
function  spanProc(spn){
   var m="";
   switch(spn.className){ 
               
               case "scaled paren":                            //处理括号，()，{}
                     m+=spn.innerHTML.toString();  
               break;
               case "non-leaf":    
                    if(spn.firstChild.className=="scaled sqrt-prefix"&&spn.firstChild.nodeName=="SPAN"){  //处理2次根式下面的内容 ，
                     m+='Math.sqrt('+processing(spn)+')';        //递归调用processing(e)函数。获取2次根式根号下的内容
                    }else
                    if(spn.firstChild.className=="scaled paren"&&spn.firstChild.nodeName=="SPAN"){    //处理圆括号()，{}里面的内容 ，
                       m+=processing(spn); 
                    }else
                    if(spn.firstChild.className==""){          //处理含有的变量
                       m+=processing(spn); 
                    }
 
               break;
               case "scaled":                                  //处理n次根式下面的内容 
                     m+="Math.pow("+processing(spn)+","+nthRoot+")";                       //递归调用processing(e)函数。获取n次根式根号下的内容
                      nthRoot="";                              //处理完一个n次根式，将缓存的n次数清空
               break;
               case "scaled sqrt-prefix":
               case "sqrt-prefix scaled":                      //2次根式，n次根式的 √
                     m+="";                                    //不做任何操作
  
               break;
               case "non-leaf sqrt-stem":                       //2次根式下面的内容 ，
                     m+=processing(spn);                //递归调用processing(e)函数。获取2次根式，n次根式根号下的内容
 
               break;
               case "sqrt-stem non-leaf":                       //n次根式下面的内容 ，
                     m+=processing(spn);                //递归调用processing(e)函数。获取n次根式根号下的内容

               break;
               case "non-leaf overline":                        //字符上线，
                     m+='{/}bar{'+processing(spn)+'}';          //递归调用processing(e)函数。获取字符上线下的内容
               break;


               case "fraction non-leaf":                         //处理分数部分
                     m+="{/}frac"+processing(spn);               //获取分数内部的部分，分子，分母
  
               break;
               case "numerator":                                //处理分数的分子
                    m+='{'+processing(spn)+'}';                 //递归调用processing(e)函数。获取分子内容
               break;
               case "denominator":                              //处理分数的分母
                    m+='{'+processing(spn)+'}';                 //递归调用processing(e)函数。获取分母内容       
               break;
              
               case "binary-operator":                          //二元操作符 
                                                                //符号 +，-，X等，最后需要在结果字符串中进行替换。
                     m+=spn.innerHTML.toString();               //现在直接获取其内容，输出即可。

               break;
               case "textarea":                                 //root根节点插入的编辑区
                     m+="";                                     //不做任何操作
               break;
               case "":
                                                                 //没有任何class，  数字，从键盘输入的字母，或者log
                    if(spn.innerHTML.toString()!="&nbsp;")
                     m+=spn.innerHTML.toString();                 //直接获取其内容，输出即可。除掉空格
               break;
               case "non-italicized-function":                    //ln
                     m+="{/}ln";                                  //直接输出ln。
               break;
               case "nonSymbola":                                 //处理特殊字符 λ
                     m+=spn.innerHTML.toString();                 //直接获取其内容，输出即可。
               break;

            }//switch
            return m;                                            //返回span的内容
}//spanProc(spn)

////////////////////////////////////递归处理数学解析式（刘东明）2015年1月24日///////////////////////////////////////////////

//使用递归处理Latex格式所用的函数，只是处理标签添加的符号不同，因此下面的代码可以不用研究
//比如对于分数，1/sinA，Latex格式为{/}frac{1}{sinA}，数学解析式为1/(sinA)，但是分子分母的获取方式是一样的，
//例如处理class为numerator的span标签，获取分子时,Latex格式添加{}，数学解析式添加()

function processed(elem){                                        //elem为处理的根节点
   var t="";
   for(var i=0;i<elem.childNodes.length;i++){
       var e=elem.childNodes[i];                                 //遍历根节点的所有子元素      
      
      switch(e.nodeName){                                        //子元素的标签名
        
        case 'VAR':                                              //Latex字符串变量，一定是一个标签一个字符，没有子元素。
            t+=e.innerHTML.toString();                           //直接获取其内容，输出即可。
        break;

        case 'BIG':
            t+=e.innerHTML.toString();                          //符号 ∫ ，∑ ，等,直接获取其内容，输出即可。
        break;

        case 'SUP':                               
            if(e.className=="non-leaf"){                        //处理简单上标, 或积分 ∮ 中的上标
              if(e.childNodes.length==1)                        //只有一个变量，去掉括号
                   t+='^'+processed(e);                         //递归调用processed(e)函数。
              else
                t+='^('+processed(e)+')';                       //递归调用processed(e)函数。
            }else
            if(e.className=="nthroot non-leaf"){                 //处理n次根号中的上标    
                t+='['+processed(e)+']';                        //递归调用processed(e)函数。获取根号的次数
            }else
            if(e.className=="non-leaf limit"){                  //处理积分 ∫ 中的上标 
            if(e.childNodes.length==1)                           //只有一个变量，去掉括号
                 t+='^'+processed(e);     
              else 
                 t+='^('+processed(e)+')';                      //递归调用processed(e)函数。获取上标内容
            }
        break;

        case 'SUB':
            if(e.className=="non-leaf"){                        //处理简单下标, 或积分 ∮ 中的下标
              if(e.childNodes.length==1)                        //只有一个变量，去掉括号
                t+='_'+processed(e);   
                else
                t+='_('+processed(e)+')';                        //递归调用processed(e)函数。
            }else
            if(e.className=="non-leaf limit"){                   //处理积分 ∫ 中的下标
              if(e.childNodes.length==1)                         //只有一个变量，去掉括号
                t+='_'+processed(e);   
                else       
                 t+='_('+processed(e)+')';                       //递归调用processed(e)函数。获取上标内容
            }         
        break;

        case 'SPAN':
             t+=spanProc2(e);                                    //span部分比较多，单独作为一个函数    
        break;
      }

    }//for

    return t;
}//function

//span元素处理函数
//当只有一个变量时，为了简洁美观，要去掉()，现在只考虑一个变量的情况
//未将sin,cos,tan,cot,sec,csc,arctan,arcsin,log,ln等看成一个整体。以及f(x),f(tan(A+3B)),60°,x^2等。
function  spanProc2(spn){
   var m="";
   switch(spn.className){ 
               
               case "scaled paren":                                 //处理括号，()，{}
                     m+=spn.innerHTML.toString();  
               break;
               case "non-leaf":                                     //处理2次根式下面的内容 ，
                    if(spn.firstChild.className=="scaled sqrt-prefix"&&spn.firstChild.nodeName=="SPAN"){
                        if(spn.childNodes.length==1)                //只有一个变量，去掉括号
                             m+=processed(spn);    
                         else
                            m+=processed(spn);              //递归调用processed(e)函数。获取2次根式根号下的内容
                    }else
                    if(spn.firstChild.className=="scaled paren"&&spn.firstChild.nodeName=="SPAN"){    //处理圆括号()，{}里面的内容 ，
                       m+=processed(spn); 
                    }else
                    if(spn.firstChild.className==""){               //处理含有的变量
                       m+=processed(spn); 
                    }
 
               break;
               case "scaled":                                       //处理n次根式下面的内容 
                     m+=processed(spn);                             //递归调用processed(e)函数。获取n次根式根号下的内容
 
               break;
               case "scaled sqrt-prefix":
               case "sqrt-prefix scaled":                           //2次根式，n次根式的 √
                     m+=spn.innerHTML.toString();                   //不做任何操作
  
               break;
               case "non-leaf sqrt-stem":                           //2次根式下面的内容 ，
                       if(spn.childNodes.length==1)                 //只有一个变量，去掉括号
                             m+=processed(spn);    
                         else               
                     m+='('+processed(spn)+')';                      //递归调用processed(e)函数。获取2次根式，n次根式根号下的内容
 
               break;
               case "sqrt-stem non-leaf":                            //n次根式下面的内容 ，
                       if(spn.childNodes.length==1)                  //只有一个变量，去掉括号
                             m+=processed(spn);    
                         else               
                         m+='('+processed(spn)+')';                  //递归调用processed(e)函数。获取2次根式，n次根式根号下的内容

               break;
               case "non-leaf overline":                             //字符上线，
                        if(spn.childNodes.length==1)                 //只有一个变量，去掉括号
                             m+='~'+processed(spn);                  //字符上线的解析式格式不知怎样输出，暂时将其定义为'~'
                         else              
                     m+='~('+processed(spn)+')';                     //递归调用processed(e)函数。获取字符上线下的内容
               break;

               case "fraction non-leaf":                             //处理分数部分
                     m+=processed(spn);                              //获取分数内部的部分，分子，分母
  
               break;
               case "numerator":                                     //处理分数的分子
                       if(spn.childNodes.length==1)                  //只有一个变量，去掉括号
                             m+=processed(spn)+'/';    
                         else                     
                    m+='('+processed(spn)+')'+'/';                   //递归调用processed(e)函数。获取分子内容
               break;
               case "denominator":                                   //处理分数的分母
                       if(spn.childNodes.length==1)                  //只有一个变量，去掉括号
                             m+=processed(spn);    
                         else                 
                         m+='('+processed(spn)+')';                  //递归调用processed(e)函数。获取分母内容       
               break;
              
               case "binary-operator":    
                                                                     //二元操作符 +，-，X等，最后需要在结果字符串中进行替换。
                     m+=spn.innerHTML.toString();                     //现在直接获取其内容，输出即可。
               break;
               case "textarea":                                      //root根节点插入的编辑区
                     m+="";                                          //不做任何操作
               break;
               case "":    
                    if(spn.innerHTML.toString()!="&nbsp;")           //没有任何class，  数字，从键盘输入的字母，或者log
                     m+=spn.innerHTML.toString();                    //直接获取其内容，输出即可。除掉空格
               break;
               case "non-italicized-function":                        //ln
                     m+="ln";                                         //直接输出ln。
               break;
               case "nonSymbola":                                      //处理特殊字符 λ
                     m+=spn.innerHTML.toString();                      //直接获取其内容，输出即可。
               break;

            }//switch
            return m;                                                  //返回span的内容
}//function


/////////////////////////////////////字符替换部分（刘东明）2015年1月17日///////////////////////////////
//如果，最终的元素不是数字，a-z或A-Z，则考虑特殊字母，α对应于/alpha，
//建立一个对应数组，进行匹配查找
// 替换特殊的希腊字母，将其转换成Latex格式
function  charReplace(mstr){
   var words=[];
   for(var i=0;i<mstr.length;i++){
      words[i]=hasChar(mstr.charAt(i));
   }
   var str="";
   for(var j=0;j<mstr.length;j++){
       str=str+words[j].toString();
   }
   if(str.indexOf("log")>-1){
      str=str.replace("log","{/}log");
   }
   return str;

}//function

function hasChar(ch){
  var Array1 = [
      "{/}alpha","{/}beta","{/}gamma","{/}delta","{/}varepsilon","{/}varphi",
      "{/}lambda","{/}mu","{/}rho","{/}sigma","{/}omega","{/}Gamma","{/}Delta",
      "{/}Theta","{/}Lambda","{/}Xi","{/}Pi","{/}Sigma","{/}Upsilon","{/}Phi",
      "{/}Psi","{/}Omega","+","-","{/}pm","{/}times","{/}div","/","{/}bigtriangleup",
      "=","{/}ne","{/}approx",">","<","{/}ge","{/}le","{/}infty","{/}cap",
      "{/}cup","{/}because","{/}therefore","{/}in","{/}leftarrow","{/}rightarrow",
      "{/}leftrightarrow","{/}sum","{/}int","{/}oint",
      "{/}ast","{/}subset","{/}supset","{/}subseteq","{/}supseteq","{/}nsubseteq","{/}nsupseteq",
      "{/}ni","{/}notin","{/}mapsto","{/}Leftarrow","{/}Leftrightarrow"

  ];//61
//下面不显示的字符，是由于此js文件的编码问题，在index页面中，设置charset = "utf-8"
//在此js文件中显示为问号，不影响程序功能
  var Array2 = [
      "α","β","γ","δ","ε","φ","λ","μ",
      "ρ","σ","ω","Γ","Δ","Θ","Λ","Ξ",
      "Π","Σ","ϒ","Φ","Ψ","Ω","+","-",
      "±","×","÷","/","△","=","≠","≈",
      ">","<","≥","≤","∞","∩","∪","∵",
      "∴","∈","←","→","↔","∑","∫","∮",
      "∗","⊂","⊃","⊆","⊇","⊈","⊉",
      "∋","∉","↦","⇐","⇔"
  ];//61   
   var num=Array2.length;
   for(var k=0;k<num;k++){
       if(Array2[k]==ch)
          return Array1[k];
    }
return ch;
}//hasChar(ch)
var  mathmun = 0 ;//全局变量，判断是否在数学输入框上
var  mathid = "id_thinkemath" ;//数学全局id
$(function (){
	init();
$("#mathli li").mouseover(function(){                //数学公式点击事件
			$(".tabContent div.mathBox").hide();
              var  n  = $(this).index() ;
			 $(".tabContent div.mathBox:eq("+n+")").show();
		});
	})
$(document).on("click",".mathquill-rendered-math",function(){
		mathmun = $(".hasCursor").length ;
		mathid = $(this).attr("id")  ;
		return false;
		})

$(document).on("click","#editor",function(){
	 mathmun = $(".hasCursor").length ;
})
var  shuzi = 0 ;
var  mathfh = [] ;
function insert(q){
   //  var b = '<span class="mathquill-rendered-math" id="thinkemath'+shuzi +'"></span><span class="thinkemath'+shuzi +'">&nbsp;</span>' ;
	  var b ='<span>&nbsp;</span><span class="mathquill-rendered-math" id="id_thinkemath'+shuzi +'"></span><span class="id_thinkemath'+shuzi +'">&nbsp;</span>' ;
	 $("img[src='aa']").replaceWith(b);
	 $("#id_thinkemath"+shuzi).mathquill('editable').mathquill("write", q.replace("{/}","\\"));
	 $("#editor").blur();
	 shuzi++;
	 mathmun = 0 ;
	 mathid = "id_thinkemath" ;
	 }
	 
	
//init()初始化数学公式编辑界面,
//在数学公式编辑面板中，点击图标的动作
function init(){
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
			html += "<li name=\"" + jmeMath[obj.groupid][i]   //对应图标与Latex命令
				   + "\" style=\"background-position:-"
			       + (obj.x + Math.floor(i%8)*slidLen) + "px -"          //此行的8，是指图片math.png一行有8个图标
			       + (obj.y + Math.floor(i/8)*slidLen) + "px;\"></li>";
		}
		html += "</div>";
		return html;
	}
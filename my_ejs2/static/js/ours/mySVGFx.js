/* 本代码根据Peter Jipsen等的代码做修改和完善。
==============

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License (at http://www.gnu.org/copyleft/gpl.html) 
for more details.
*/


var xmin, xmax, ymin, ymax, xscl, yscl, 
    xgrid, ygrid, xtick, ytick, initialized;

var picture, svgpicture, doc, width, height, a, b, c, d, i, n, p, t, x, y;



//数学函数参数
var cpi = "\u03C0", ctheta = "\u03B8";
var pi = Math.PI, ln = Math.log, e = Math.E;
var arcsin = Math.asin, arccos = Math.acos, arctan = Math.atan;
var sec = function(x) { return 1/Math.cos(x) };
var csc = function(x) { return 1/Math.sin(x) };
var cot = function(x) { return 1/Math.tan(x) };
var arcsec = function(x) { return arccos(1/x) };
var arccsc = function(x) { return arcsin(1/x) };
var arccot = function(x) { return arctan(1/x) };
var sinh = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
var cosh = function(x) { return (Math.exp(x)+Math.exp(-x))/2 };
var tanh = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)) };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsinh = function(x) { return ln(x+Math.sqrt(x*x+1)) };
var arccosh = function(x) { return ln(x+Math.sqrt(x*x-1)) };
var arctanh = function(x) { return ln((1+x)/(1-x))/2 };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsech = function(x) { return arccosh(1/x) };
var arccsch = function(x) { return arcsinh(1/x) };
var arccoth = function(x) { return arctanh(1/x) };
var sign = function(x) { return (x==0?0:(x<0?-1:1)) };

//added min/max type:  0:nothing, 1:arrow, 2:open dot, 3:closed dot


var defaultwidth = 200; defaultheight = 200; defaultborder = 0;
var border = defaultborder;
var strokewidth=1;
var strokedasharray, stroke, fill;
var fontstyle, fontfamily, fontsize, fontweight, fontstroke, fontfill;
var markerstrokewidth = "1";
var markerstroke = "black";
var markerfill = "yellow";
var marker = "none";
var arrowfill = stroke;
var dotradius = 4;
var ticklength = 4;
var axesstroke = "black";
var gridstroke = "grey";
var pointerpos = null;
var coordinates = null;
var above = "above";
var below = "below";
var left = "left";
var right = "right";
var aboveleft = "aboveleft";
var aboveright = "aboveright";
var belowleft = "belowleft";
var belowright = "belowright";
var len=0;
var tag=new Array();//暂存函数类型
  strokewidth = "1" // pixel
  stroke = "black"; // default line color
  fill = "none";    // default fill color
  marker = "none";

  var xunitlength = 60;  // pixels 多少像素表示1
  var yunitlength = 60;  // pixels

//alert("svgObj:"+svgObj.width);

height=800;
width=800;
var origin =[400,400];   // in pixels (default is bottom left corner)

//2010.2.18 Modified by chenlian
//增加type y=f(x)|r=f(t)|x=f(t)
//fun修改为函数的输入格式
var tstroke,tstrokewidth,tstrokedasharray;  //绘图前保存原来的颜色

SVG.prototype.plot=function(id,type,fun,x_min,x_max,points,min_type,max_type,stroke1,strokewidth1,strokedash1,pg,t) {
  //plot("y=f(x)",result[1],-5,5,null,"fx"+id,null,null,"black",2,null,1);
  //this.myAlert("id,type,pg:"+id+";"+type+";"+pg);
  //var A=this.varA;
  //alert("plot:"+fun);
  
  var A=new Array();
  for (var key in this.varA)
  {
	  A[key]=this.varA[key].val;
  }
 
  //tag[id]=[type,fun];	//暂存函数类型
  //tstroke=stroke;
  //tstrokewidth=strokewidth;
 //tstrokedasharray=strokedasharray;
  var funSrc=type+","+fun+","+x_min+","+x_max+","+points+","+min_type+","+max_type+","+stroke1+","+strokewidth1+","+strokedash1;
  //this.myAlert("plot:"+funSrc);
  //stroke=stroke1;
  //strokewidth=strokewidth1;
  //strokedasharray=strokedash1;
  var name = null;
  if (id==null||id=="null")
  {
	  name="fx"+this.newChildID();	  
  }
  else{
	 
	  name=id;	  
  }
  
  if (typeof t == "undefined")
  {
	 this.action("NF~"+name+","+funSrc);
	 //alert("action:"+"NF~"+name+","+funSrc);
  }

  var funName="y(x)="+fun;  //函数名称描述
  var tpara=fun;
  if (type == "r=f(t)") {
     fun=new Array("("+tpara+")*cos(t)","("+tpara+")*sin(t)");
	 funName="r(t)="+tpara;
  } else if (type == "x=f(t)") {
     fun=tpara.split(",");
     funName="x(t)="+fun[0]+",y(t)="+fun[1];
  } 
  
  var pth = [];
  var f = function(x) { return x };
  var g = fun;

  //this.myAlert("g:"+fun+"::"+(fun=="-x-a")+"||"+("−"=="-"));
  
  
  //fun="x-5";
  if (typeof fun=="string"){
	if(type == "x=f(y)")
	  {
//		alert(1)
		eval("g = function(y){ with(Math) return "+this.mathjs(fun)+" }");
	  }
	else{
		eval("g = function(x){ with(Math) return "+this.mathjs(fun)+" }");
	}
  }
  else if (typeof fun=="object") {
    eval("f = function(t){ with(Math) return "+this.mathjs(fun[0])+" }");
    eval("g = function(t){ with(Math) return "+this.mathjs(fun[1])+" }");
  }
//this.myAlert("g:"+g+":A[a]:"+A['a']+":g(a):"+g(A['a']));

//  gt=this.mathjs("y")
//  alert(gt);
//  alert()
//  alert("mathjs(x)"+this.mathjs(x));
//  alert("mathjs(x)"+this.mathjs(y))
  /* if (typeof x_min=="string") { name = x_min; x_min = xmin }
  else name = id; */
  //这个得重新计算，根据网格的大小算吧
  //var min = ((x_min==null||x_min=="null")?this.xMin:x_min);
  //var max = ((x_max==null||x_max=="null")?this.xMax:x_max);

  //alert("this.xyUnit:"+this.xyUnit+""+this.decimal);

  var tp_min=(-this.origin[0]/this.xyUnit);
  var tp_max=((this.width-this.origin[0])/this.xyUnit);
  
  var min = ((x_min==null||x_min=="null")?tp_min:x_min);
  var max = ((x_max==null||x_max=="null")?tp_max:x_max);
  
  //alert("max,min:"+min+","+max); //.toFixed(this.decimal)
  if (max <= min) { return null;}
  //else {
	  //alert("plot:"+min+"::"+max);
  var inc = max-min-0.000001*(max-min);  //??????????
  inc = ((points==null||points=="null")?inc/200:inc/points);
  //alert("plot:"+inc);
  //inc=1;
  var gt;
  //alert("plot:"+typeof g(min))
	//alert("plot:"+g(min));
  //alert("plot:"+min+"::"+max);
  //len=0;
  //this.myAlert("plot:"+f(1)+"::"+g(1));
  for (var t = min; t <= max; t += inc) {
    gt = g(t);
    //this.myAlert("plot:"+f(t)+"::"+gt);
    if (!(isNaN(gt)||Math.abs(gt)=="Infinity")){
	  if (typeof fun=="string"){
		if(type=="x=f(y)")
		{
			pth[pth.length] = [gt, f(t)];
			//this.cord[pth.length-1][name]=[gt, f(t)]
		}
		else{
			pth[pth.length] = [f(t), gt];
			//this.cord[pth.length-1][name]=[f(t), gt]
			//this.myAlert("t,gt:"+t+":"+);
		}
	  }
	  else if(typeof fun=="object") {
			pth[pth.length] = [f(t), gt];//alert(pth[pth.length-1])
			//this.cord[pth.length-1][name]=[f(t), gt]
	  }/**/
	}
  }
//	  alert( pth[100]+" "+pth[101])
//		this.cord[pth.length-1][name]=[f(t), gt]
//	  alert(this.cord[pth.length]["fxfirstFX"])
		//len=pth.length;

  //this.myAlert("pth"+pth);
  //SVG.prototype.path=function(plist,id,c,funSrc,pg) {
  //this.myAlert("funSrc,pth:"+funSrc+"||"+pth);
  this.path(pth,name,"",funSrc,pg);

  

  //* 头、尾的设置
  /*
  if (min_type == "arrow") {
	arrowhead("S"+name,pth[1],pth[0],pg);
  } else if (min_type == "opendot") {
	//dot(center, typ, label, pos, id)
	//alert("调用dots："+pg);
	dot("S"+name,pth[0], "open",null,"",pg);
  } else if (min_type == "dot") {
	dot("S"+name,pth[0], "closed",null,"",pg);
  }
  if (max_type == "arrow") {
	arrowhead("E"+name,pth[pth.length-2],pth[pth.length-1],pg);
  } else if (max_type == "opendot") {
	dot("E"+name,pth[pth.length-1], "open",null,"",pg);
  } else if (max_type == "dot") {
	dot("E"+name,pth[pth.length-1], "closed",null,"",pg);
  }
  */
  stroke=tstroke;
  strokewidth=tstrokewidth;
  strokedasharray=tstrokedasharray;
  //return p;
  //}
}


function arrowhead(id,pi,qi,pg) { // draw arrowhead at q (in units)
  //alert("arrowhead:"+p+"::"+q);
  var up;
  var v = [pi[0]*xunitlength+origin[0],height-pi[1]*yunitlength-origin[1]];
  var w = [qi[0]*xunitlength+origin[0],height-qi[1]*yunitlength-origin[1]];
  //alert("arrowhead:"+v+"::"+w);
  var u = [w[0]-v[0],w[1]-v[1]];
  var d = Math.sqrt(u[0]*u[0]+u[1]*u[1]);
  if (d > 0.00000001) {
    u = [u[0]/d, u[1]/d];
    up = [-u[1],u[0]];
    var node = svgDocument.createElementNS(null,"path");
	node.setAttribute("id",id);
    node.setAttribute("d","M "+(w[0]-15*u[0]-4*up[0])+" "+
      (w[1]-15*u[1]-4*up[1])+" L "+(w[0]-3*u[0])+" "+(w[1]-3*u[1])+" L "+
      (w[0]-15*u[0]+4*up[0])+" "+(w[1]-15*u[1]+4*up[1])+" z");
    node.setAttribute("stroke-width", markerstrokewidth);
    node.setAttribute("stroke", stroke); /*was markerstroke*/
    node.setAttribute("fill", stroke); /*was arrowfill*/
    svgDocument.getElementById("fxs"+pg).appendChild(node);    
  }
}



function dot(id,center, typ, label, pos,pg) {
	 //alert("id,center,typ,lable,pos,pg:"+id+"::"+center+"::"+typ+"::"+label+"::"+pos+"::"+pg);
  var node;
  var cx = center[0]*xunitlength+origin[0];
  var cy = height-center[1]*yunitlength-origin[1];
  if (id!=null) node = svgDocument.getElementById(id);
  if (typ=="+" || typ=="-" || typ=="|") {
    if (node==null) {
      node = svgDocument.createElementNS(null,"path");
      node.setAttribute("id", id);
      svgDocument.getElementById("fxs"+pg).appendChild(node);
    }
    if (typ=="+") {
      node.setAttribute("d",
        " M "+(cx-ticklength)+" "+cy+" L "+(cx+ticklength)+" "+cy+
        " M "+cx+" "+(cy-ticklength)+" L "+cx+" "+(cy+ticklength));
      node.setAttribute("stroke-width", .5);
      node.setAttribute("stroke", axesstroke);
    } else {
      if (typ=="-") node.setAttribute("d",
        " M "+(cx-ticklength)+" "+cy+" L "+(cx+ticklength)+" "+cy);
      else node.setAttribute("d",
        " M "+cx+" "+(cy-ticklength)+" L "+cx+" "+(cy+ticklength));
      node.setAttribute("stroke-width", strokewidth);
      node.setAttribute("stroke", stroke);
    }
  } else {
    if (node==null) {
      node = svgDocument.createElementNS(null,"circle");
      node.setAttribute("id", id);
	  svgDocument.getElementById("fxs"+pg).appendChild(node);
    }
    node.setAttribute("cx",cx);
    node.setAttribute("cy",cy);
    node.setAttribute("r",dotradius);
    node.setAttribute("stroke-width", strokewidth);
    node.setAttribute("stroke", stroke);
    node.setAttribute("fill", (typ=="open"?"white":stroke));
  }
  if (label!=null) 
    text(center,label,(pos==null?"below":pos),(id==null?id:id+"label"))
}




SVG.prototype.path=function(plist,id,c,funSrc,pg) {
  
  //this.myAlert("path:"+plist[0]+"|"+plist[1]);
  //
  if (plist[0]==undefined)
  {
	  return;
  }
  if (c==null) c="";
  var para=funSrc.split(",");
  var node, st, i;
  node=null;
  //if (id!=null) node = doc.getElementById(id);
  //2010.2.15 chenlian修改
  
  //if (node==null) {
    //node = myCreateElementSVG("path");
	 //删除此ID原来的图形
	delFun(id);
	node=document.createElementNS(svgNS,"path");
	
	//alert("node:"+node);
    node.setAttribute("id", id);
	//svgpicture.appendChild(node);
	//document.getElementById("fxs"+pg).appendChild(node);
	//alert("$:"+$("#"+this.ID+"fx"));
	$("#"+this.ID+"fx").append(node);
	//alert("wait:"+svgDocument.getElementById(id));
	//alert(printNode(svgDocument.getElementById("fxs")));
  //}
  //alert("path para:"+height+"::"+origin+"::"+xunitlength);
  //alert("path:"+typeof plist);
  if (typeof plist == "string") st = plist;
  else {
    st = "M";
	
    /*st += (plist[0][0]*this.xyUnit+this.origin[0])+","+
          (this.height-plist[0][1]*this.xyUnit-this.origin[1])+" "+c;
	
    for (i=1; i<plist.length; i++)
      st += (plist[i][0]*this.xyUnit+this.origin[0])+","+
            (this.height-plist[i][1]*this.xyUnit-this.origin[1])+" ";
	*/
	var m=this.u2s(plist[0]);
	st += m[0]+","+m[1]+" "+c;
	//st += m[0]+" "+m[1]+" ";
	//this.myAlert("st,plist[0]:"+st+":"+plist[0]);
	
    for (i=1; i<plist.length; i++){
	  m=this.u2s(plist[i]);
      st += m[0]+","+m[1]+" ";
	  //st += m[0]+" "+m[1]+" ";
	}
  }
  //alert("node:"+node+"::"+st);
  node.setAttribute("d", st);
  /*//node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke-width", "2");
  //if (strokedasharray!=null) 
    //node.setAttribute("stroke-dasharray", "");
  //node.setAttribute("stroke", stroke);
  node.setAttribute("stroke", "black");
  node.setAttribute("fill", "none");
  */
  //var funSrc=type+","+fun+","+x_min+","+x_max+","+points+","+min_type+","+max_type+","+stroke1+","+strokewidth1+","+strokedash1;
  //            0        1       2          3         4          5            6            7            8                 9
  
  node.setAttribute("stroke",para[7]);
  node.setAttribute("stroke-width",para[8]);
  node.setAttribute("fill", "none");

  
  
  node.setAttribute("funSrc",funSrc);
  //node.setAttribute("title",funSrc);
  /*if (marker=="dot" || marker=="arrowdot")
    for (i=0; i<plist.length; i++)
      if (c!="C" && c!="T" || i!=1 && i!=2)
        ASdot(plist[i],4,markerstroke,markerfill,pg);
  */

  
}

//画点
function ASdot(center,radius,s,f,pg) { // coordinates in units, radius in pixel
  if (s==null) s = stroke; if (f==null) f = fill;
  /*
  var node = myCreateElementSVG("circle");
  node.setAttribute("cx",center[0]*xunitlength+origin[0]);
  node.setAttribute("cy",height-center[1]*yunitlength-origin[1]);
  node.setAttribute("r",radius);
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", s);
  node.setAttribute("fill", f);
  svgpicture.appendChild(node);
  */
  
  var node=svgDocument.createElementNS(null,"circle")
  node.setAttribute("cx",width+center[0]*xunitlength+origin[0]);
  node.setAttribute("cy",height-center[1]*yunitlength-origin[1]);
  node.setAttribute("r",radius);
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", s);
  node.setAttribute("fill", f);
  svgDocument.getElementById("fxs"+pg).appendChild(node);     

}



//数学计算的主要函数
SVG.prototype.mathjs=function(st) {
  //translate a math formula to js function notation
  // a^b --> pow(a,b)
  // na --> n*a
  // (...)d --> (...)*d
  // n! --> factorial(n)
  // sin^-1 --> arcsin etc.
  //while ^ in string, find term on left and right
  //slice and concat new formula string
  var st = st.replace(/\s/g,"");
  if (st.indexOf("^-1")!=-1) {
    st = st.replace(/sin\^-1/g,"arcsin");
    st = st.replace(/cos\^-1/g,"arccos");
    st = st.replace(/tan\^-1/g,"arctan");
    st = st.replace(/sec\^-1/g,"arcsec");
    st = st.replace(/csc\^-1/g,"arccsc");
    st = st.replace(/cot\^-1/g,"arccot");
    st = st.replace(/sinh\^-1/g,"arcsinh");
    st = st.replace(/cosh\^-1/g,"arccosh");
    st = st.replace(/tanh\^-1/g,"arctanh");
    st = st.replace(/sech\^-1/g,"arcsech");
    st = st.replace(/csch\^-1/g,"arccsch");
    st = st.replace(/coth\^-1/g,"arccoth");
  }
  st = st.replace(/^e$/g,"(E)");
  st = st.replace(/pi/g,"(pi)");
  st = st.replace(/^e([^a-zA-Z])/g,"(E)$1");
  st = st.replace(/([^a-zA-Z])e([^a-zA-Z])/g,"$1(E)$2");
  st = st.replace(/([0-9])([\(a-zA-Z])/g,"$1*$2");
  st = st.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");
  var i,j,k, ch, nested;
  while ((i=st.indexOf("^"))!=-1) {
    //find left argument
    if (i==0) return "Error: missing argument";
    j = i-1;
    ch = st.charAt(j);
    if (ch>="0" && ch<="9") {// look for (decimal) number
      j--;
      while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      if (ch==".") {
        j--;
        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      }
    } else if (ch==")") {// look for matching opening bracket and function name
      nested = 1;
      j--;
      while (j>=0 && nested>0) {
        ch = st.charAt(j);
        if (ch=="(") nested--;
        else if (ch==")") nested++;
        j--;
      }
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      j--;
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else { 
      return "Error: incorrect syntax in "+st+" at position "+j;
    }
    //find right argument
    if (i==st.length-1) return "Error: missing argument";
    k = i+1;
    ch = st.charAt(k);
    if (ch>="0" && ch<="9" || ch=="-") {// look for signed (decimal) number
      k++;
      while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
      if (ch==".") {
        k++;
        while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
      }
    } else if (ch=="(") {// look for matching closing bracket and function name
      nested = 1;
      k++;
      while (k<st.length && nested>0) {
        ch = st.charAt(k);
        if (ch=="(") nested++;
        else if (ch==")") nested--;
        k++;
      }
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      k++;
      while (k<st.length && (ch=st.charAt(k))>="a" && ch<="z" ||
               ch>="A" && ch<="Z") k++;
    } else { 
      return "Error: incorrect syntax in "+st+" at position "+k;
    }
    st = st.slice(0,j+1)+"pow("+st.slice(j+1,i)+","+st.slice(i+1,k)+")"+
           st.slice(k);
  }
  while ((i=st.indexOf("!"))!=-1) {
    //find left argument
    if (i==0) return "Error: missing argument";
    j = i-1;
    ch = st.charAt(j);
    if (ch>="0" && ch<="9") {// look for (decimal) number
      j--;
      while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      if (ch==".") {
        j--;
        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      }
    } else if (ch==")") {// look for matching opening bracket and function name
      nested = 1;
      j--;
      while (j>=0 && nested>0) {
        ch = st.charAt(j);
        if (ch=="(") nested--;
        else if (ch==")") nested++;
        j--;
      }
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      j--;
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else { 
      return "Error: incorrect syntax in "+st+" at position "+j;
    }
    st = st.slice(0,j+1)+"factorial("+st.slice(j+1,i)+")"+st.slice(i+1);
  }
  //alert("数学表达式："+st);
  return st;
}


//新增和修改函数图形
function openFxPanel(type,id)
{
  //function plot(fun,x_min,x_max,points,id,min_type,max_type)
  if (id==null)  //新建
  {
    var para = new Array(type,"","","","","","","","");
    win=showModalDialog("svgfx.html",para, "dialogWidth:430px; dialogHeight:325px; center:yes; status:no;edge:raised ");
    //var tpara;
	if (win)
    {
	   //0type,1fun,2"xstar",3"xend",4"gcolor",5"strokewidth",6"strokedash",7"gstart",8"gend" 
      //plot(para[0],para[1],parseFloat(para[2]),parseFloat(para[3]),null,null,para[7],para[8],para[4],para[5],para[6]);
	  try {
		 plot(para[0],para[1],parseFloat(para[2]),parseFloat(para[3]),null,null,para[7],para[8],para[4],para[5],para[6],p);
         var me=para[0]+"~"+para[1]+"~"+para[2]+"~"+para[3]+"~"+null+"~"+null+"~"+para[7]+"~"+para[8]+"~"+para[4]+"~"+para[5]+"~"+para[6];
		 sendmessage("fun~"+me,"graphics");
	  } catch (err) {
         alert("请检查你的函数设置，我不能画出你要求的："+para[1]+"的图形。");         
      }
	  
    }
  }
  else{  //修改
	var fnode=svgDocument.getElementById(id);
    var funSrc=fnode.getAttribute("funSrc");
    var para=funSrc.split(",");
 
    //var format = new Array(posx,posy,"文本内容","20","SimSun","black","normal","normal","none");
    win=showModalDialog("svgfx.html",para, "dialogWidth:430px; dialogHeight:325px; center:yes; status:no;edge:raised ");
    if (win)
    {
	  //try {
		 plot(para[0],para[1],parseFloat(para[2]),parseFloat(para[3]),null,id,para[7],para[8],para[4],para[5],para[6],p);
		 var me=para[0]+"~"+para[1]+"~"+para[2]+"~"+para[3]+"~"+null+"~"+id+"~"+para[7]+"~"+para[8]+"~"+para[4]+"~"+para[5]+"~"+para[6];
		 sendmessage("fun~"+me,"graphics");
	  //} catch (err) {
      //   alert("请检查你的函数设置，我不能画出你要求的："+para[1]+"的图形。");         
      //}
	  
    }	
  }  
}

//删除函数图形
function delFun(id){
  //var pnode=svgDocument.getElementById("fxs"+p);
  var fnode=document.getElementById(id);
  if (fnode!=null)
  {
     pnode=fnode.parentNode;
	 pnode.removeChild(fnode);
	 var snode=document.getElementById("S"+id); //开始标记
     if (snode!=null) pnode.removeChild(snode);
	 var enode=document.getElementById("E"+id);  //结束标记
     if (enode!=null) pnode.removeChild(enode);  
  }
}

function delFunF(id){
	delFun(id);
    sendmessage("delFun~"+id,"graphics");
}

//坐标设置
function openXYPanel()
{
    var v=getXY();
	var para = v.split(",");
    win=showModalDialog("svgxy.html",para, "dialogWidth:450px; dialogHeight:250px; center:yes; status:no;edge:raised ");
    if (win)
    {
	  //setXY(para);
	  try {
		 setXY(para);
		 var me=para[0]+"~"+para[1]+"~"+para[2]+"~"+para[3]+"~"+para[4]+"~"+para[5]+"~"+para[6];
		 sendmessage("setXY~"+me,"graphics");
	  } catch (err) {
         alert("设置坐标出现意外错误。");         
      }
	  
	}
  
}

//获取坐标设置的一些变量
function getXY(){
	//width,height,xmin,xmax,ymin,ymax,originx,originy
	//var para=""+width+","+height+","+xmin+","+xmax+","+ymin+","+ymax+","+origin[0]+","+origin[1];
	var label=((svgDocument.getElementById("mylabel"+p)).getAttribute("visibility")=="hidden"?"0":"1");
	var para=""+xmin+","+xmax+","+ymin+","+ymax+","+origin[0]+","+origin[1]+","+label;
	return para;
}
//坐标设置
function setXY(v){
	//alert("setXY:"+typeof v);
	var label;
	if (typeof v=="string")
	{
		var para=v.split(",");
		origin=[parseInt(para[4]),parseInt(para[5])];
		xmin=parseFloat(para[0]);
	    xmax=parseFloat(para[1]);
	    ymin=parseFloat(para[2]);
	    ymax=parseFloat(para[3]);
		label=para[6];
	}
	else{
		var para=v;
		//alert("type of:"+typeof(para[4])+"::"+parseInt(para[4])+"::"+para[5]);
		origin=[parseInt(para[4]),parseInt(para[5])];
		xmin=para[0];
	    xmax=para[1];
	    ymin=para[2];
	    ymax=para[3];
		label=para[6];
	}	
	
	xunitlength=width/(xmax-xmin); //改变xunitlength，yunitlength
	yunitlength=height/(ymax-ymin);
     if (xunitlength>yunitlength)
         {
             xunitlength=yunitlength;
         }
		 else{
             yunitlength=xunitlength;
		 }
	
	drawxy("1");drawxy("2");//改变坐标轴
	//alert("xunit,yunit:"+xunitlength+"::"+yunitlength);
	drawLabel("1");drawLabel("2");  //改变坐标轴标签
	drawGrid();	
	reDrawAllFx("1"); reDrawAllFx("2");//重绘所有的函数图形
    showHideLabel(label);  //隐藏或显示坐标标签
	
 }

//显示与隐藏坐标标签
function showHideLabel(label){
   if (label=="1")
   {
	   (svgDocument.getElementById("mylabel"+p)).setAttribute("visibility","");
   }
   else{
	   (svgDocument.getElementById("mylabel"+p)).setAttribute("visibility","hidden");
   }
}
//画板的放大缩小
 function setSize(large){
	 //alert("setSize fun");
	 var v=svgDocument.getElementById("mygraphics");
	 var u=svgDocument.getElementById("drawing");
	 //if (v.getAttribute("width")=="200")
     if (large=="L")
	 {
		// alert("放大");
		 v.setAttribute("width",740);
		 v.setAttribute("height",560);
		 v.setAttribute("viewBox","0 0 740 560");
		 u.setAttribute("width",740);
		 u.setAttribute("height",560);
		 //2011.1.12 未解决坐标同步偶尔出现不同步
		 origin=[origin[0]*(720/400)+5,origin[1]*(560/400)];
		 //origin=[365,280];
		 width=740;
		 height=560;
		 //setSVGSize("L");  //在index.asp中
		 moveMainMenu("L");
		 xunitlength=width/(xmax-xmin);
		 yunitlength=height/(ymax-ymin);

         if (xunitlength>yunitlength)
         {
             xunitlength=yunitlength;
         }
		 else{
             yunitlength=xunitlength;
		 }


		 //alert("setSize:"+xunitlength);
		 
		 //
	 }
	 else{
         //alert("缩小");		 
		 v.setAttribute("width",400);
		 v.setAttribute("height",400);
		 v.setAttribute("viewBox","0 0 400 400");
		 u.setAttribute("width",400);
		 u.setAttribute("height",400);
		 origin=[(origin[0]-5)*400/720,origin[1]*400/560];
		 //origin=[200,200];
		 width=400;
		 height=400;
		 //setSVGSize("S");  //在index.asp中
		 moveMainMenu("S");
		 xunitlength=width/(xmax-xmin);
		 yunitlength=height/(ymax-ymin);
		 if (xunitlength>yunitlength)
         {
             xunitlength=yunitlength;
         }
		 else{
             yunitlength=xunitlength;
		 }
		 
	 }
	 drawxy("1"); drawxy("2");   //重绘XY轴	 
	 drawLabel("1");  drawLabel("2");//改变坐标轴标签
	 drawGrid();  //重绘网格
     reDrawAllFx("1"); reDrawAllFx("2");//重绘所有函数图形
    //alert("xunit,yunit:"+xunitlength+"::"+yunitlength);
}
//菜单的移动
function moveMainMenu(v){
	var mainMenu=svgDocument.getElementById("mainMenu");
    if (v=="L")
    {
		mainMenu.setAttribute("transform","translate(0,570)");
    }
	else{
        mainMenu.setAttribute("transform","translate(0,410)");
	}
}

//重绘所有函数图形
function reDrawAllFx(pg){
   var allFx=new Array();
   var arrI=0;  //数组计数器
   var fxs=svgDocument.getElementById("fxs"+pg);
   var childs1=fxs.childNodes;
   var ch=childs1.length;
   //alert("reDrawAllFx():"+ch);
   
   for (var i=ch-1;i>-1;i--){  
	 childNode=childs1.item(i);
	 childID=childNode.getAttribute("id");
	 //alert("reDrawAll:"+i+"::"+child1.getAttribute("id"));
     if (childID.substring(0,2)=="FX")  //
     {
         //allFx[arrI++]=childID;
		 //allFx[arrI++]=childNode.getAttribute("funSrc");
		 allFx[arrI++]=[childID,childNode.getAttribute("funSrc")];
     }
    }
    
	//先删除原来的函数图形,没有必要了，在plot中，如果id不为空，就先自动删除
	/* for (var i=0;i<allFx.length;i++)
	{
		//alert("id+funSrc:"+allFx[i][0]+"::"+allFx[i][1]);
		delFun(allFx[i][0]);  
	}
	*/
    //重新绘制原来的函数图形
    for (var i=0;i<allFx.length;i++)
	{
		//alert("id+funSrc:"+allFx[i][0]+"::"+allFx[i][1]);
		var para=allFx[i][1].split(",");
		//function plot(type,fun,x_min,x_max,points,id,min_type,max_type,stroke1,strokewidth1,strokedash1) 
        //   var funSrc=type+","+fun+","+x_min+","+x_max+","+points+","+min_type+","+max_type+","+stroke1+","+strokewidth1+","+strokedash1;

		plot(para[0],para[1],parseFloat(para[2]),parseFloat(para[3]),para[4],allFx[i][0],para[5],para[6],para[7],para[8],para[9],pg); 
	}
      
}
 



 //******************************************表达式检测，雷捷提供初始版

 

/*
JavaScript去除前后空格 
分类： web前端 2012-03-24 23:32 422人阅读 评论(0) 收藏 举报 
javascriptfunctionjquery[javascript] view plaincopyprint?function trim(str){  //删除左右两端的空格   
         return str.replace(/(^\s*)|(\s*$)/g, "");  
    }  
    function ltrim(str){  //删除左边的空格   
         return str.replace(/(^\s*)/g,"");  
    }  
    function rtrim(str){  //删除右边的空格   
         return str.replace(/(\s*$)/g,"");  
    }  

function trim(str){  //删除左右两端的空格
		 return str.replace(/(^\s*)|(\s*$)/g, "");
	}
    function ltrim(str){  //删除左边的空格
    	 return str.replace(/(^\s*)/g,"");
    }
    function rtrim(str){  //删除右边的空格
    	 return str.replace(/(\s*$)/g,"");
    }
jQuery提供了一个trim()这样的功能函数，可以轻松的帮我们实现这样的效果

[java] view plaincopyprint?var s = " abc ";  
            var str = $.trim(s);   //jQuery中的trim   

*/
/*
var constent=new Array()  		//已定义的变量
constent["a"]=1;
constent["b"]=2;  
constent["c"]=3;*/  
var s;
SVG.prototype.convert=function(input)			//除去空格，并转为小写
{
var str=new Array();
	str[1]="";
	input = input.toLowerCase();        //把字符转换成小写   
	var tempstr="";	
  Expression_Len = input.length;          //计算字符串的长度
	
  for(i=0;i<Expression_Len;i++)
		if(input.charAt(i)!=" ")
			{
				tempstr+=input.charAt(i);
			}
//	alert(tempstr.indexOf("y=")+" "+tempstr.indexOf(","))
	if(tempstr.indexOf("y=")>=0)		//去掉y=
		tempstr=tempstr.replace(/y=/,"");
	if(tempstr.indexOf("x=")>=0)		//去掉x=
		tempstr=tempstr.replace(/x=/,"");
	if(tempstr.indexOf("r=")>=0)		//去掉r=
		tempstr=tempstr.replace(/r=/,"");
	len=tempstr.length;
	start=tempstr.indexOf("{");
	end=tempstr.indexOf("}")
	while(start>=0&&end>start)
	{
		temp=tempstr.substring(start,end+1);
		if(temp.indexOf("<")>=0||temp.indexOf(">")>=0)
		{
			str[1]+=temp;
			tempstr=tempstr.replace(temp,"");
		}
		start=tempstr.indexOf("{",end+1);
		end=tempstr.indexOf("}",end+1);
	}
	Expression_Len=tempstr.length;
 	tempstr1="";	

  for(i=0;i<Expression_Len;i++)					//添加*
  {
  	temp=tempstr.charAt(i);
  	next=tempstr.charAt(i+1);
		if((temp==")"||/\w/.test(temp)||/\d/.test(temp))&&(next=="("||/\w/.test(next)||/\d/.test(next)))
		{
			if(/\d/.test(temp)&&/\d/.test(next))			//前后同时为数字
			{
				tempstr1+=temp;
				continue;
			}
			subexp1=tempstr.substr(i, 4);
			subexp=tempstr.substr(i, 5);
//			alert(subexp);
			switch(subexp)
			{
	          case "atan(":
			  case "sqrt(":
			  case "acos(":
			  case "asin(":
			    	tempstr1+=subexp;
			    	i+=4;break;
	      default:
	      switch(subexp1)
	      {
				  case "sin(":
				  case "cos(":
		      case "tan(":
		      case "abs(":
		      case "exp(":
		      case "log(":
		      case "sgn(":
		      case "rnd(":
		      case "pow(":
		      	tempstr1+=subexp1;
		      	i=i+3;break;
			    default:
		      	tempstr1+=temp+'*'
		      break;
	    	}
			}
		} 	
		else
			tempstr1+=temp;
	}
	str[0]=tempstr1;
	//alert("convert:"+str);
	return str;
}

SVG.prototype.myLeft=function(mainStr,lngLen) { 
	 if (lngLen>0) {
		 return mainStr.substring(0,lngLen);
	 } 
	 else{
		 return null;
	 } 
} 

SVG.prototype.myRight=function(mainStr,lngLen) { 
// alert(mainStr.length) 
	 if (mainStr.length-lngLen>=0 && mainStr.length>=0 && mainStr.length-lngLen<=mainStr.length) { 
		 return mainStr.substring(mainStr.length-lngLen,mainStr.length);
	 } 
	 else{
		 return null;
	} 
}

SVG.prototype.filterRepeatStr=function(str){ 
	var ar2 =""; 
	var len=0;
	if(str!=null)
		len=str.length;
	for(var i=0;i<len;i++){ 
		temp=str.charAt(i);
		if(ar2.indexOf(temp)<0){ 
		ar2+=temp; 
		} 
	} 
	return ar2; 
}

SVG.prototype.paraNum=function(str){ 							//计算以','分隔的参数个数
	var Char,Brackets=0,num=1;
	if(str=="")
	return 0;
	for(i=0;i<str.length;i++)
	{
		Char=str.charAt(i);
		if(Char == '(') {
            Brackets = Brackets + 1;                 //增加括号的个数
		}
		if(Char == ')')
            Brackets = Brackets - 1;                 //增加括号的个数
  	if(Brackets==0&&Char==',')
  		num++;
  }
  return num;
}
//	var undef=new Array();
SVG.prototype.checkExp=function(Expression,def,undef)	//判断是否是有效数学表达式
{
		PREC_NONE = 11
		PREC_UNARY = 10       
		PREC_POWER = 9        
		PREC_TIMES = 8        
		PREC_DIV = 7          
		PREC_INT_DIV = 6      
		PREC_MOD = 5          
		PREC_PLUS = 4 
		PREC_EQUAL = 3 	
		PREC_COMMA=2
		var result=new Array();
    var Is_Unary;        
    var Next_Unary;      
    var Brackets=0;     //小括号 
    var BigBrac=0;  		//大括号
    var Pos;            
    var Expression_Len;  
    var Char;            
    var LeftExpression;  
    var RightExpression; 
    var Best_Pos=1;     
    var Best_Prec;     
    var Temp1;  
    var Temp2;       
    var flag=1; 
		if(Expression==null)
		{
			result[0]=0;
			return result;
		}
		else{
	    Expression_Len = Expression.length;          //计算字符串的长度，一定要放在上面代码的下部
	    if(Expression_Len ==0) 
	    {
				result[0]=0;
				result[1]="缺少参数";
				result[2]=def;
				result[3]=undef;
				return result;
			}
		}
    if( Expression.charAt(0)=='{'&&Expression.charAt(Expression_Len-1)=='}') 	//去掉最外面的大括号
        return this.checkExp(Expression.substring(1,Expression_Len-1),def,undef);

    Is_Unary = true;                                 //如果有+或-,则是单元运算符
    Best_Prec = PREC_NONE                           //到目前为止我们什么也没得到
	
    for(Pos = 1;Pos<=Expression_Len;Pos++){
        Char = Expression.substr(Pos-1, 1);              //检查下一个字符
	      Next_Unary = false;
//        if(Char == " ")                           //跳过空格
//            Next_Unary = Is_Unary;
        if(Char == "(") {
            Brackets = Brackets + 1;                 //增加括号的个数
            Next_Unary = true;
				}
        else if(Char == ")") {
            Brackets = Brackets - 1;                 //减少括号的个数
            Next_Unary = false;
            if(Brackets < 0) {                    //左右括号的个数不配套
            		result[0]=0;
                result[1]=("表达式中左右小括号的个数不配套;");
								return result;
            }
        }
        else if(Char == "{") {
            BigBrac ++;                 //增加括号的个数
            Next_Unary = true;
				}
        else if(Char == "}") {
            BigBrac --;                 //减少括号的个数
            Next_Unary = false;
            if(BigBrac < 0) {                    //左右括号的个数不配套
            	result[0]=0;
              result[1]=("表达式中左右大括号的个数不配套;");
							return result;
            }
        }
        else if(Brackets == 0&&BigBrac==0){
            if(Char == "^"||Char == "*"||Char == "/"||Char == "%"||Char == "+"||Char == "-"||Char == ","||Char == "=") {
                Next_Unary = true;
                switch(Char)
								{
	                case '^':
	                    if(Best_Prec >= PREC_POWER) {
	                        Best_Prec = PREC_POWER;
	                        Best_Pos = Pos;
	                        //alert(Best_Pos+";"+Best_Prec);
	                    }
	                    break;
	                case '*':
	                case '/':
	                    if(Best_Prec >= PREC_TIMES) {
	                        Best_Prec = PREC_TIMES;
	                        Best_Pos = Pos;
	                    }
	                    break;                 
	                case '%':
	                    if(Best_Prec >= PREC_MOD) {
	                        Best_Prec = PREC_MOD;
	                        Best_Pos = Pos;
	                    }
	                    break;
	                case '+':
	                case '-':
	                    if(Best_Prec >= PREC_PLUS) {
	                        Best_Prec = PREC_PLUS;
	                        Best_Pos = Pos;
	                    }
                    	break;
	                case '=':
	                    if(Best_Prec >= PREC_EQUAL) {
	                        Best_Prec = PREC_EQUAL;
	                        Best_Pos = Pos;
	                    }
                    	break;
	                case ',':
	                    if(Best_Prec >= PREC_COMMA) {
	                        Best_Prec = PREC_COMMA;
	                        Best_Pos = Pos;
	                    }
                    	break;
                }
            }

	    	}

        Is_Unary = Next_Unary;
    }
	
    if(Brackets!=0) {
    		result[0]=0;
        result[1]=("表达式中丢失一个 ')';");
        return result;
    }
    if(BigBrac!=0) {
    		result[0]=0;
        result[1]=("表达式中丢失一个 '}';");
        return result;
    }
//    alert(Best_Prec+";"+PREC_NONE+";"+Best_Pos);

    if(Best_Prec <PREC_NONE) {
        LeftExpression = this.myLeft(Expression, Best_Pos - 1);
	//	LeftExpression = Expression.substring(0,Best_Pos - 1);
        RightExpression = this.myRight(Expression, Expression_Len - Best_Pos);
	//	RightExpression = Expression.substring(Expression_Len - Best_Pos);
      //  alert(LeftExpression.length+" "+RightExpression.length);
      //  alert("l:"+LeftExpression+'\n'+"r:"+RightExpression+"  "+Best_Pos);
        switch (Expression.substr(Best_Pos-1, 1))
        {
	        case "^":
	        case "*":
	        case "/":
	        case "%":
	        case ',':	
	        case '=':
						if(LeftExpression==null||RightExpression=="")
						{
							result[0]=0;
              result[1]="运算符号'"+Expression.substr(Best_Pos-1, 1)+"'左边或右边缺少表达式;";
              return result;
						}
            Temp1 = this.checkExp(LeftExpression,def,undef);
            Temp2 = this.checkExp(RightExpression,def,undef);
            flag = Temp1[0]&Temp2[0];
 	          result[0]=flag;
           	if(!Temp1[0])
            	result[1]=Temp1[1];
            else if(!Temp2[0])
            	result[1]=Temp2[1];
            else
            {
	            result[1]=Temp1[1]+Expression.substr(Best_Pos-1, 1)+Temp2[1];
	            result[2]=Temp1[2]+Temp2[2];
	            result[3]=Temp1[3]+Temp2[3];
          	}
          	break;
//						alert(LeftExpression+" "+RightExpression)
	        case "+":
	        case "-":
						if(RightExpression=="")
						{
							result[0]=0;
              result[1]="运算符号'"+Expression.substr(Best_Pos-1, 1)+"'右边缺少表达式;";
              return result;
						}
						else if(LeftExpression==null){
							result=this.checkExp(RightExpression,def,undef);
							result[1]="-"+result[1];
						}
						else{
							Temp1 = this.checkExp(LeftExpression,def,undef);
	            Temp2 = this.checkExp(RightExpression,def,undef);
	            flag = Temp1[0]&Temp2[0];
	 	          result[0]=flag;
	           	if(!Temp1[0])
	            	result[1]=Temp1[1];
	            else if(!Temp2[0])
	            	result[1]=Temp2[1];
	            else
	            {
		            result[1]=Temp1[1]+Expression.substr(Best_Pos-1, 1)+Temp2[1];
		            result[2]=Temp1[2]+Temp2[2];
		            result[3]=Temp1[3]+Temp2[3];
	          	}
          	}
            break;
        }
        
        
				return result;
    }
	
    if( Expression.charAt(0)=='('&&Expression.charAt(Expression_Len-1)==')') {
        result= this.checkExp(Expression.substring(1,Expression_Len-1),def,undef);
        if(result[0])
	        result[1]="("+result[1]+")";
        return result;
//        if(flag==0)
//        	alert(Expression.substring(1,Expression_Len-1)+" flag="+flag);
				
    }
	
    if(Expression.charAt(0) == '-') {
		result=this.checkExp(Expression.substring(1,Expression_Len),def,undef);
		result[1]="-"+result[1];
		//alert(result[1]);
        return result;
//        if(flag==0)
 //       	alert(Expression.substring(1,Expression_Len)+" flag="+flag);

    }
    if(Expression.charAt(0)== '+') {
        return this.checkExp(Expression.substring(1,Expression_Len),def,undef);
//        if(flag==0)
//        	alert(Expression.substring(1,Expression_Len)+" flag="+flag);

    }
    var LeftExpression1;
    if(Expression_Len > 4 && this.myRight(Expression, 1) == ")") {					//数学函数
    		p=Expression.indexOf("(");
        LeftExpression = Expression.substring(p-3, p+1);
        RightExpression = Expression.substring(p+1, Expression_Len-1 );
        LeftExpression1 = Expression.substring(p-4, p+1)
        RightExpression1 = Expression.substring(p+1, Expression_Len-1);
//        alert(LeftExpression+" "+RightExpression+" "+LeftExpression1+" "+LeftExpression1)
        switch(LeftExpression1)
        {
			        case "atan(":
			        case "sqrt(":
			        case "acos(":
			        case "asin(":
		        	temp=this.paraNum(RightExpression1);
		        	if(temp!=1)
		        	{
		        		result[0]=0;
              	result[1]=("参数数量错误");
		        		return result;
							}
							result=this.checkExp(RightExpression1,def,undef);
							if(result[0])
		        		result[1]=LeftExpression1+result[1]+')';
			            break;

	        default:
	          switch(LeftExpression)
		        {
			        case "sin(":
			        case "cos(":
			        case "tan(":
			        case "abs(":
			        case "exp(":
			        case "log(":
			        case "sgn(":
//								len=RightExpression.length;
//			        	temp=RightExpression.split(",",1);
			        	if(this.paraNum(RightExpression1)!=1)
			        	{
			        		result[0]=0;
		              result[1]=("参数数量错误");
			        		return result;
								}
								result=this.checkExp(RightExpression,def,undef);
								if(result[0])
			      			result[1]=LeftExpression+result[1]+")";
			            break;
			        case "rnd(":
		//	        	alert(RightExpression.length);
			        	if(RightExpression.length >0)
			        	{
			        		result[0]=0;
		                    result[1]=("参数数量错误");
			        		return result;
								}
								result[0]=1;
								result[1]="rnd()";
								result[2]="";
								result[3]="";
			        	break;	
			        case "pow(":
//			        	s=new Array();
//			        	s=RightExpression.split(",");
		//	        	alert(RightExpression);
		//	        	alert(temp);
			        	if(this.paraNum(RightExpression1)!=2)
			        	{
			        		result[0]=0;
		              result[1]=("参数数量错误");
			        		return result;
								}
								result=this.checkExp(RightExpression,def,undef);
								if(result[0])
				        	result[1]=LeftExpression+result[1]+')';
								//alert(result[1])
			        	
		//	        	if(flag==0)
		//	        	alert(RightExpression+"1");
			            break;

			        default:
			        	break;
		        }

        }

        return result;
    }
   	result[0]=1;
   	result[1]=Expression;
		result[2]=def;
		result[3]=undef;
//		alert(result[3]);
    for(i=0;i<Expression.length;i++)
		{
			x=Expression.charAt(i);
//			next=Expression.charAt(i+1);
//					alert(x);
			if(x=="x"||x=="y"||x=="z"||x=="r"||x=="t"||x=="e")
			{
	       break;
	    }
			else if(x>='a'&&x<'z'){
				/*if (constent[x]==undefined || constent[x]==null)
				{
						undef+=x;
					result[3]=undef;
				}
				else
				{
					def+=x;
					str=constent[x].toString();
					if(next>='a'&&next<='z')
						str+='*';
					result[1]=result[1].replace(x,str);
					result[2]=def;
				}*/
				//modi by chenlian
				if (this.varA[x]==undefined || this.varA[x]==null)
				{
//					if (undef.indexOf(x)<0) //排除重复变量	
//					{
						
						undef+=x;
//					}		
					
					result[3]=undef;
					str="(A['"+x+"'])";
//					if(next>='a'&&next<='z') str+='*';
					result[1]=result[1].replace(x,str);
				}
				else
				{
//					if (def.indexOf(x)<0)
//					{
						def+=x;
//					}					
					str="(A['"+x+"'])";//constent[x].toString();
//					if(next>='a'&&next<='z')
//						str+='*';
					result[1]=result[1].replace(x,str);
					result[2]=def;
				}
				//alert(x+"::"+undef+":"+result[3]);

			}
		}
	//    alert("未知错误发生!");

	  return result;
}



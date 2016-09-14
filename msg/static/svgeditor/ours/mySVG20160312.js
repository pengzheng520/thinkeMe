
var svgNS="http://www.w3.org/2000/svg";
var A=new Array();//临时保存已定义变量
var allID2=" BC BF CP FP CR PP fx";//其中BC，BF为移动终端点的背景，用于解决firefox下阻止鼠标默认动作
//function SVG(ID,width,height,xMin,xMax,yMin,yMax,origin,gridUnit,grid,xy,scale){ //
//gridUnit 网格单元，如果为0，表示没有网格
//border 是否画边框
function SVG(parentID,ID,width,height,xMin,xMax,yMin,yMax,gridUnit,border,xy,label,editable,sys){ //
	//global,500,300,-5,5,-3,3,0,T,F,F,T,F;
	//this.top=0;
	//this.left=0;
	if (typeof parentID == "undefined"||parentID==null)
	{
		alert("请提供父元素ID！"); //????????????????无效
		return;
	}
	//alert("gridUnit:"+gridUnit);
	this.editable=(typeof editable == "undefined")?false:editable;//是否可编辑
	this.sys=(typeof sys == "undefined")?false:sys;//是否同步
	this.ID="S"+parentID;
	this.tool="S"; //功能键,s-select,T-text,P-point,line,C-circle
	this.smartTip={"type":"","czObj":""};//智能作图提示
	this.selectedObj=new Array();//选择的所有对象[名称，ID]
	this.mouseState="";//鼠标动作状态
	this.currentObjID=""; //鼠标down被选中的对象
	this.startPoint=new Array();  //画直线的时候分别存储第一点x坐标，y坐标，id，画圆的时候存储圆心
	this.childID=1000;
	this.labelNo=0;   //控制点的名称
	this.decimal=2;  //保留小数位数
	
	this.gridUnit=(typeof gridUnit == "undefined"||gridUnit==null)?1:gridUnit;
	this.grid=(gridUnit==0)?false:true;//是否显示网格
	this.border=(typeof border == "undefined"||border==null)?true:border;//是否有边框
	this.label=(typeof label == "undefined")?true:label;//是否显示坐标刻度标签
	
	
	
	this.xMin=(typeof xMin == "undefined")?-10:xMin;
	this.xMax=(typeof xMax == "undefined")?10:xMax;
	this.yMin=(typeof yMin == "undefined")?-5:yMin;
	this.yMax=(typeof yMax == "undefined")?5:yMax;
	this.mobile=true;  //是否移动终端

	//$("#div_id").height()
	//alert("svg div widht："+$("#"+parentID).width()+"----"+$(window).width()*2/3 );
	//this.width=(typeof width == "undefined")?Math.floor($(window).width()*2/3/this.gridUnit)*this.gridUnit+1:width;
	//this.height=(typeof height == "undefined")?Math.floor($(window).height()/this.gridUnit)*this.gridUnit:height;
	//this.width=(typeof width == "undefined" || width==null)?($(window).width()*2/3):width;
	/*
			editor:peng.zheng
			time:2016/1/30 
			content:生成操作功能区
		*/
	/*if (this.editable)
	{   
	    
		leftexpressionBox();
		
		this.width=(typeof width == "undefined" || width==null)?($("#"+(this.ID).substr(1)).width()-1):width;
	}
	else{
		this.width=(typeof width == "undefined" || width==null)?($("#"+(this.ID).substr(1)).width()-1):width;
	}
	//this.height=(typeof height == "undefined" || height==null)?$(window).height():height;
	//alert("resize Height:"+$("#"+(this.ID).substr(1)).height());
	this.height=(typeof height == "undefined" || height==null)?($("#"+(this.ID).substr(1)).height()-31):height;
	
	
*/
	if (this.editable)
	{
		//leftexpressionBox();
		//alert("width:"+parentID+"|"+$("#"+parentID).width());
		$("#"+parentID).height("100%");

		this.width=(typeof width == "undefined" || width==null)?(parseInt($("#"+parentID).width())-355):width;
		this.height=(typeof height == "undefined" || height==null)?parseInt($("#"+parentID).height()):height;

       //alert("this.width:"+this.width+"::"+$("#"+parentID).height());
	}
	else{
		this.width=(typeof width == "undefined" || width==null)?($("#"+parentID).width()):width;
		//this.height=(typeof height == "undefined" || height==null)?($("#"+parentID).height()):height;
		this.height=(typeof height == "undefined" || height==null)?parseInt(this.width/(this.xMax-this.xMin)*(this.yMax-this.yMin)):height;
	
	}
	//this.height=(typeof height == "undefined" || height==null)?$(window).height():height;
	
	
	this.xy=(typeof xy == "undefined")?true:xy; //是否显示坐标轴
	//this.xyUnit=(this.width/(this.xMax-this.xMin)<this.height/(this.yMax-this.yMin))?Math.floor(this.width/(this.xMax-this.xMin)):Math.floor(this.height/(this.yMax-this.yMin));
    //单位代表的屏幕坐标
    //this.origin=[Math.floor(-this.xMin*this.xyUnit),Math.floor(-this.yMin*this.xyUnit)]; //这个需要修改为用户坐标
	//this.origin=(typeof origin == "undefined")?[(this.xMax-this.xMin)/2*this.xyUnit,(this.yMax-this.yMin)/2*this.xyUnit]:[origin[0]*this.xyUnit,origin[1]*this.xyUnit]; //修改为用户坐标
	//alert("this.origin:"+this.origin);

//this.origin=[0,0];
    this.varA=new Array(); //存储自定义变量
	//varA["varName"]={"val":10,"min":1,"max:":100,"step":0.01,"times":100,"handle":null};
	this.objAttr=new Array();//临时保存对象的属性
	//objAttr[objID]={"stroke":"blue","stroke_width":"2px","fill":"none","stroke_dasharray":};
	this.timer=new Array();//自动运行时间设置
	//test
	/*this.varA["a"]=1;
	this.varA["b"]=2;
	this.varA["s"]=3;
	*/
	this.actA=new Array(); //指令数组
	
	this.thingFocus=0;	//对称编辑框获得焦点的标志
	this.axisFocus=0;
	this.st=new Array();//暂存各个点的坐标
    this.cord=new Array(); //暂存函数各点坐标,以备函数图象移动时使用
	for(i=0;i<10000;i++)
		this.cord[i]=[];
	this.pre=[];				//暂存移动前点的位置,移动的位置以此为基准
	this.tempfuc="";		//存放当前移动图像的函数及其类型

	this.time=5;					//动画持续时间
	//alert("width:"+width+":::"+this.width+"::"+this.height);
   var rootSVG=document.createElementNS(svgNS, "svg");
   rootSVG.setAttributeNS(null,"id",this.ID);
   rootSVG.setAttributeNS(null,"x","0");
   rootSVG.setAttributeNS(null,"y","0");
   rootSVG.setAttributeNS(null,"width",this.width);
   rootSVG.setAttributeNS(null,"height",this.height);

   //transform="translate(500, 600) scale(1,-1)"
   //var trans="rotate("+(rotAngle*180/Math.PI)+","+p1.x+","+p1.y+")";
   //e.setAttributeNS(null, "transform", trans);

   //rootSVG.setAttributeNS(null,"width",this.width);
   //rootSVG.setAttributeNS(null,"height",this.height);
   //mySVG.setAttributeNS(null,"style","border:10px solid; width:300px; height:300px;");
   //mySVG.setAttributeNS(null,"style","border:2px solid;fill: none; stroke: black; stroke-dasharray:10 5;");
   //mySVG.setAttributeNS(null,"border","10px solid");  //不起作用
   //mySVG.setAttributeNS(null,"stroke","red");
   //mySVG.setAttributeNS(null,"fill","green");
   //$("#SVG").append(mySVG);
   this.root=rootSVG;

  

   
   //var pg=document.createElementNS(svgNS, "g");  //第i页的内容
   //pg.setAttributeNS(null,"id","SVG"+i);
   //$("#mySVG").append(pg);
   
   //初始化线
   var initLine=document.createElementNS(svgNS, "line");
   initLine.setAttributeNS(null,"id",this.ID+"initLine");
   initLine.setAttributeNS(null,"x1",-1);
   initLine.setAttributeNS(null,"y1",-1);
   initLine.setAttributeNS(null,"x2",-1);
   initLine.setAttributeNS(null,"y2",-1);
   //initLine.setAttributeNS(null,"class","seg"); //使用class的时候似乎不能通过Attribute修改属性？？？？？？
   initLine.setAttributeNS(null,"stroke","black");
   initLine.setAttributeNS(null,"stroke-width",2);
   rootSVG.appendChild(initLine);
   
   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"grid");  //第i页的网格
   pg.setAttributeNS(null,"class","grid"); 
   rootSVG.appendChild(pg);

   //alert("root:"+$("#"+this.ID));
  /* if (this.grid)
   {
        var hmax,vmax,xs,xe,ys,ye,i,gridline,grid;   
        xs=0;
        xe=this.width;
        ys=0;
        ye=this.height;
        
	    hmax=parseInt((xe-xs)/this.gridUnit);
        vmax=parseInt((ye-ys)/this.gridUnit);

		//var myGrid=document.getElementById("grid"+this.ID);

        //划横线
		//getAttributeNS(null,"cx");
        for(var i=0;i<vmax+1;i++)
        { 
		  
          var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",xs);
          gridline.setAttributeNS(null,"y1",ys+i*this.gridUnit);
	  	  gridline.setAttributeNS(null,"x2",xe);
          gridline.setAttributeNS(null,"y2",ys+i*this.gridUnit);
		  //gridline.setAttributeNS(null,"stroke","green");		  
		  //alert("drawGrid"+gridline);
          pg.appendChild(gridline);
		  //myGrid.appendChild(gridline);

        }
        //划竖线
		
        for(var i=0;i<hmax+1;i++)
        {
          var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",xs+i*this.gridUnit);
	      gridline.setAttributeNS(null,"y1",ys);
          gridline.setAttributeNS(null,"x2",xs+i*this.gridUnit);
          gridline.setAttributeNS(null,"y2",ye);
          pg.appendChild(gridline);
        }
   }
   rootSVG.appendChild(pg);
   */
   
   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"label");  //第i页的坐标标签
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"class","xy");  
   pg.setAttributeNS(null,"id",this.ID+"xy");  //第i页的坐标轴
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "foreignObject");
   pg.setAttribute("x",10);
	pg.setAttribute("y",10);
	pg.setAttribute("width",200);
	pg.setAttribute("height",200);
	pg.setAttribute("xmlns","http://www.w3.org/1999/xhtml" );

   pg.setAttributeNS(null,"id",this.ID+"HTML");  //第i页的foreignObject标签
   rootSVG.appendChild(pg);

	var pg=document.createElementNS(svgNS, "foreignObject");//提示信息
	pg.setAttribute("x",10);
	pg.setAttribute("y",10);
	pg.setAttribute("width",200);
	pg.setAttribute("height",30);
	pg.setAttribute("visibility","hidden");//visible
	pg.setAttribute("xmlns","http://www.w3.org/1999/xhtml" );
	pg.setAttributeNS(null,"id",this.ID+"Hint");  //第i页的提示信息标签
	
	var div=document.createElement("div");//提示信息
	div.innerHTML="提示信息";
	pg.appendChild(div);
	rootSVG.appendChild(pg);



   

  /* <switch>
  <foreignObject width="100" height="50" 
                 requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
   
  </foreignObject>

  <!-- Alternate SVG content if foreignObject is not supported -->
    </switch>
*/
   
   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"con");  //第i页的限制条件
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"angle");  //第i页的角标注条件
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"pen");  //第i页的手写
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"txt");  //第i页的文本
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"fx");  //第i页的函数图行
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"circle");  //第i页的园
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"segment");  //第i页的线段
   rootSVG.appendChild(pg);

   var pg=document.createElementNS(svgNS, "g");
   pg.setAttributeNS(null,"id",this.ID+"point");  //第i页的点
   rootSVG.appendChild(pg); 

   //显示调试信息，发布的时候取消
   var te = document.createElementNS(svgNS,"text");
   te.setAttributeNS(null,"id",this.ID+"disp");  //第i页的调试信息
   te.setAttributeNS(null,"font-size",12);
   te.setAttributeNS(null,"x",600);
   te.setAttributeNS(null,"y",40);
   te.appendChild(document.createTextNode("调试信息"));
   rootSVG.appendChild(te);

   




/*
//SVG DOM结构,这儿SVGParent，SVGSelf分别是SVG构造函数中的parentID，ID
<div id="SVGparent"> 
	<div id="SVGSelf+Parent",class="row">
		<div id="SVGSelf+Left" class="col-xs-3">   <!--左边区域-->
			<div id="SVGSelf+Menu">  <!--左边编辑菜单区-->
			</div>
			<div id="SVGSelf+Input">   <!--左边交互输入区-->
			</div>
		</div>
		<div id="SVGSelf+Right" class "col-xs-9">   <!--右边区域-->
			<div id="SVGSelf+ToolBar">  <!--右边SVG工具栏区-->
			</div>
			<svg id="SVGSelf">   <!--右边SVG作图区-->
			</svg>
		</div>
	</div>
</div>

<div id="ParentID"> this.ID=S+ParentID
	<div id="S+ParentID+P" class="row">
		<div id="S+ParentID+L" class="col-xs-3">   <!--左边区域-->
			<div id="SVG+ParentID+M">  <!--左边编辑菜单menu区-->
			</div>
			<div id="SVG+ParentID+I">   <!--左边交互输入input区-->
			    <div id=this.ID+"exp">   <!--函数表达式-->
				
				</div>
			</div>
		</div>
		<div id="SVG+ParentID+R" class ="col-xs-9">   <!--右边区域-->
			<div id="SVG+ParentID+T">  <!--右边SVG工具栏toolBar区-->
			</div>
			<svg id="SVG+ParentID">   <!--右边SVG作图Graphics区-->
			</svg>
		</div>
	</div>
</div>

*/


   var parentDiv=$("<div></div>");  //根元素
   parentDiv.attr('id',this.ID+"P");  
   /*
	 editor:peng.zheng
	 time:2016/1/30 
	 content:删除row
	*/
  // parentDiv.addClass('row'); 
   /*end*/  
	//点击编辑，然后在

   

   var right=$("<div></div>");   //工具栏及内容，right
   right.attr('id',this.ID+'R');     
   if (this.editable)
   {
	   // right.addClass('col-xs-12 obj');
	   /*
			editor:peng.zheng
			time:2016/1/30 
			content:改变class
		*/
		right.addClass('obj right');
		right.css("left",355);
		/*end*/
		//right.attr("style","border:1px solid #ccc;position:absolute;left:80px;top:10px;width:1200px;height:500px");
	    var left=$("<div></div>");   //左边交互区
		left.attr('id',this.ID+'L');     


	   var leftData = '<!-- left -->'+	
	               '<div class="left">'+
                     '<div id="expressionBox" class="expression-box">'+
                       '<div class="top-bar"><i class="fa fa-angle-double-left pull-out-btn"></i></div>'+
                       '<div class="con-exppanel">'+
                         '<ul class="expression-list" id="'+this.ID+'I"></ul>'+
                         '<ul class="expression-list2" id="'+this.ID+'addRow">'+
                          '<li>'+
                            '<div class="num">添加</div>'+
                            '<div class="exp-con" style="height:56px;"></div>'+
                          '</li>'+
                         '</ul>'+
                        '</div>'+
                      '</div>'+
                   '<div class="pull-in-btn"><i class="fa fa-angle-double-right"></i></div>'+
                 '</div>';
	//动态生成左边输入区
	
	left.append(leftData);
	parentDiv.append(left);	

	
   
   }
   else{
		// right.addClass('col-xs-12');
	   /*
			editor:peng.zheng
			time:2016/1/30 
			content:改变class
		*/
		right.addClass('obj');
		/*end*/ 
   }
	right.append(rootSVG);   
	
	if (this.editable)
	{
		
		var toolBar=$("<div></div>");
		toolBar.attr("class","btn-group svg_edt");
		toolBar.attr("role","group");
		toolBar.attr("id",this.ID+"Tool");
		//<div class="btn-group svg_edt" role="group"></div>

	   /*var toolList="<div id =\""+this.ID+"T"+"\" class=\"btn-toolbar\" role=\"toolbar\" aria-label=\"...\">"
				   +"<div class=\"btn-group\" role=\"group\" aria-label=\"...\">"
				   +"<button type=\"button\" class=\"btn btn-default\" id=\"choice\" data-tool=\"S\">"
				   +"<img src=\"img/tool-select.png\" width=\"16\" height=\"16\" border=\"0\" alt=\"选择\"></button>"
				   +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"P\">"
				   +     "<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>"
				   +"</button>"

				   +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"C\">"
				   +"     <span class=\"glyphicon glyphicon-record\" aria-hidden=\"true\"></span>"
				   +"</button>"

				   +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"W\">"   //手写
				   +"     <span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span>"
				   +"</button>"
				   +"		  </div>"
	+"<div class=\"input-group-btn\">"
    +"    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">Action <span class=\"caret\"></span></button>"
    +"    <ul class=\"dropdown-menu dropdown-menu-right\">"
    +"      <li><a href=\"#\">Action</a></li>"
    +"      <li><a href=\"#\">Another action</a></li>"
    +"      <li><a href=\"#\">Something else here</a></li>"
    +"      <li role=\"separator\" class=\"divider\"></li>"
    +"      <li><a href=\"#\">Separated link</a></li>"
    +"    </ul>"
    +"  </div>";*/
		
							 
	var svg_edt_data = 
	  '<button id='+this.ID+"T"+' type="button" class="btn btn-default" style="cursor:move"><span class="glyphicon glyphicon-move" aria-hidden="true"></span></button>'
      +'<button type="button" class="btn btn-default" id="choice" data-tool="S">'
		+'<img src="img/tool-select.png" width="14" height="16" border="0" alt="选择" />' 
	  +'</button>'
      +'<button type="button" class="btn btn-default" data-tool="P"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'
      +'<button type="button" class="btn btn-default" data-tool="C"><span class="glyphicon glyphicon-record" aria-hidden="true"></span></button>'
      +'<button type="button" class="btn btn-default" data-tool="W"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button>'
      +'<div class="btn-group" role="group" id="svgdrag">'
		  +'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width:44px;box-sizing:border-box"><span class="caret"></span></button>'
          +'<ul id='+this.ID+"dropdown"+' class="dropdown-menu">'
              +'<li><a href="#">请选择对象</a></li>'
              +'<li><a href="#">Dropdown link</a></li>'
          +'</ul>'
      +'</div>'
	 //$(".svg_edt").append(svg_edt_data);
	 toolBar.append(svg_edt_data);
/*
     $("#SSVGParentT").on('touchstart.drag.founder mousedown.drag.founder', function(e) {  
		 alert("xxxx");
                var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,  
				    that = $(this).parent(),
                    startPos = that.position(),  
                    disX = ev.pageX - startPos.left,  
                    disY = ev.pageY - startPos.top;
                $(document).on('touchmove.drag.founder mousemove.drag.founder', function(e) {  
                    var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,  
                        $this = that,   
                        left = ev.pageX - disX,  
                        top = ev.pageY - disY,  
						$parent = $this.parent(),
                        r = $parent.width() - $this.outerWidth(true),  
                        d = $parent.height() - $this.outerHeight(true);  
                        console.log(r-left);
						if(left < 5 || $parent.width()-left < 240){
						    $this.find("button").addClass("vertical"); 
						}else{
							$this.find("button").removeClass("vertical");
						}
						
                    left = left < 0 ? 0 : left > r ? r : left;  
                    top = top < 0 ? 0 : top > d ? d : top;  
  
                    $this.css({left:left,top:top});   
                    e.preventDefault();  
                });  
  
                $(document).on('touchend.drag.founder mouseup.drag.founder', function(e) {  
                    var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;  
                    $(document).off('.drag.founder');  
                });  
              
                e.preventDefault();  
            });  
	      $("#svgdrag").click(function(e){
			  var y = parseInt($(this).parent().css("top"));
			  var w = parseInt($(this).parents(".obj").css("height"))/2 ;
			  if(y > w){
				 $(this).addClass("dropup"); 
			  }else{
				 $(this).removeClass("dropup");  
			  }
			  
		  })
	*/
	/*	var toolList=$("<foreignObject x=\"100\" y=\"100\" width=\"266\" height=\"16\" class=\"menu\">"
  +"<div class=\"btn-group\" role=\"group\">"
  +"<button id=\"SSVGParentT\" type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-move\" aria-hidden=\"true\"></span></button>"
  +"<button type=\"button\" class=\"btn btn-default\" id=\"choice\" data-tool=\"S\"> <img src=\"img/tool-select.png\" width=\"14\" height=\"16\" border=\"0\" alt=\"选择\"> </button>"
  +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"P\"><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></button>"
  +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"C\"><span class=\"glyphicon glyphicon-record\" aria-hidden=\"true\"></span></button>"
  +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"W\"><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span></button>"
  +"  <div class=\"btn-group\" role=\"group\" id=\"svgdrag\">"
  +"    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" style=\"width:40px\">"
  +"    <span class=\"caret\"></span>" 
	+"  </button>"
    +"  <ul class=\"dropdown-menu\">"
    +"    <li><a href=\"#\">Dropdown link</a></li>"
    +"    <li><a href=\"#\">Dropdown link</a></li>"
    +"  </ul>"
    +"</div>"
  +"</div>"
+"</foreignObject>");		
//var toolList=$("");
*/



//rootSVG.appendChild(toolList);
	   //right.append(toolList);
	   right.append(toolBar);
	}

   
   parentDiv.append(right);
   
   //$("#"+this.ID+"TOOLX").append(right);
	

   $("#"+parentID).append(parentDiv);

   
   
   this.init();

}

SVG.prototype.init=function(){ //SVG初始化
	//$("#mySVGxy").attr("transform", "scale(1,-1)");
	/*
	if (this.gridUnit=="undefined") 
	{
        if (this.width/(this.xMax-this.xMin)<this.height/(this.yMax-this.yMin))
        {
			var grid=this.width/(this.xMax-this.xMin);
			this.gridUnit=grid;
			if (grid<20)
			{
				this.gridUnit=20;
			}
			else{
				if (grid>40)
				{
					this.gridUnit=40;
				}
			}
        }
		else{
            var grid=this.height/(this.yMax-this.yMin);
			this.gridUnit=grid;
			if (grid<20)
			{
				this.gridUnit=20;
			}
			else{
				if (grid>40)
				{
					this.gridUnit=40;
				}
			}
		}
	}
	*/
	//alert("init:"+this.gridUnit);

if (this.editable)
{

	
	   var othis=this;
		$("#keyboardBtn").show();//键盘显示
		$(".pull-out-btn").click(function(){
		  $(".left").animate({left:'-355px'},200);
		  $(".right").animate({left:0},200,function(){
			 othis.reSize(); 
		  });
		  $(".pull-in-btn").show();
	  });
	  $(".pull-in-btn").click(function(){
		  $(".left").animate({left:0},200);
		  $(".right").animate({left:'355px'},200,function(){
			 othis.reSize(); 
		  });
		  $(this).hide();
	  });
   
	/*
	var toolList=$("<foreignObject x=\"100\" y=\"100\" width=\"266\" height=\"16\" xmlns=\"http://www.w3.org/1999/xhtml\" class=\"menu\">"
  +"<div class=\"btn-group\" role=\"group\">"
  +"<button id=\"SSVGParentT\" type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-move\" aria-hidden=\"true\"></span></button>"
  +"<button type=\"button\" class=\"btn btn-default\" id=\"choice\" data-tool=\"S\"> <img src=\"img/tool-select.png\" width=\"14\" height=\"16\" border=\"0\" alt=\"选择\"> </button>"
  +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"P\"><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></button>"
  +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"C\"><span class=\"glyphicon glyphicon-record\" aria-hidden=\"true\"></span></button>"
  +"<button type=\"button\" class=\"btn btn-default\" data-tool=\"W\"><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span></button>"
  +"  <div class=\"btn-group\" role=\"group\" id=\"svgdrag\">"
  +"    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" style=\"width:40px\">"
  +"    <span class=\"caret\"></span>" 
	+"  </button>"
    +"  <ul class=\"dropdown-menu\">"
    +"    <li><a href=\"#\">Dropdown link</a></li>"
    +"    <li><a href=\"#\">Dropdown link</a></li>"
    +"  </ul>"
    +"</div>"
  +"</div>"
+"</foreignObject>");		
  $("#"+this.ID).append(toolList);*/

/*
  var menu=document.createElementNS(svgNS, "foreignObject");//作图菜单
	menu.setAttribute("x",100);
	menu.setAttribute("y",100);
	menu.setAttribute("width",260);
	menu.setAttribute("height",40);
	menu.setAttribute("class","menu")
	//pg.setAttribute("visibility","hidden");//visible
	menu.setAttribute("xmlns","http://www.w3.org/1999/xhtml" );
	menu.setAttributeNS(null,"id",this.ID+"XXX");  //

//<div class=\"btn-group\" role=\"group\">"
	var btnGroup=document.createElement("div");
	btnGroup.setAttribute("class","btn-group");
	btnGroup.setAttribute("role","group");
//<button id=\"SSVGParentT\" type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-move\" aria-hidden=\"true\"></span></button>"
var button=document.createElement("button");
button.setAttribute("type","button");
button.setAttribute("class","btn btn-default");
button.setAttribute("id","SSVGParentT");//这儿需要修改？？？？？？？？？？？？？？？
//button.setAttribute("data-tool","P");
var span=document.createElement("span");
span.setAttribute("class","glyphicon glyphicon-move");
span.setAttribute("aria-hidden","true");
button.appendChild(span);
btnGroup.appendChild(button);

//+"<button type=\"button\" class=\"btn btn-default\" id=\"choice\" data-tool=\"S\"> <img src=\"img/tool-select.png\" width=\"14\" height=\"16\" border=\"0\" alt=\"选择\"> </button>"
var button=document.createElement("button");
button.setAttribute("type","button");
button.setAttribute("id","choice");
button.setAttribute("class","btn btn-default");
button.setAttribute("data-tool","S");
var img=document.createElement("img");
img.setAttribute("src","img/tool-select.png");
img.setAttribute("width",14);
img.setAttribute("height",16);
button.appendChild(img);
btnGroup.appendChild(button); 

//<button type=\"button\" class=\"btn btn-default\" data-tool=\"P\"><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span></button>"
var button=document.createElement("button");
button.setAttribute("type","button");
button.setAttribute("class","btn btn-default");
button.setAttribute("data-tool","P");
var span=document.createElement("span");
span.setAttribute("class","glyphicon glyphicon-pencil");
span.setAttribute("aria-hidden","true");
button.appendChild(span);
btnGroup.appendChild(button);

//+"<button type=\"button\" class=\"btn btn-default\" data-tool=\"C\"><span class=\"glyphicon glyphicon-record\" aria-hidden=\"true\"></span></button>"
var button=document.createElement("button");
button.setAttribute("type","button");
button.setAttribute("class","btn btn-default");
button.setAttribute("data-tool","C");
var span=document.createElement("span");
span.setAttribute("class","glyphicon glyphicon-record");
span.setAttribute("aria-hidden","true");
button.appendChild(span);
btnGroup.appendChild(button);

//"<button type=\"button\" class=\"btn btn-default\" data-tool=\"W\"><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span></button>"
var button=document.createElement("button");
button.setAttribute("type","button");
button.setAttribute("class","btn btn-default");
button.setAttribute("data-tool","W");
var span=document.createElement("span");
span.setAttribute("class","glyphicon glyphicon-edit");
span.setAttribute("aria-hidden","true");
button.appendChild(span);
btnGroup.appendChild(button);

//<div class=\"btn-group\" role=\"group\" id=\"svgdrag\">"
//  +"    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" 
//  aria-haspopup=\"true\" aria-expanded=\"false\" style=\"width:40px\">"
//  +"    <span class=\"caret\"></span>" 
//	+"  </button>"
//    +"  <ul class=\"dropdown-menu\">"
//    +"    <li><a href=\"#\">Dropdown link</a></li>"
//    +"    <li><a href=\"#\">Dropdown link</a></li>"
//    +"  </ul>"
//    +"</div>"
//  +"</div>"
var div=document.createElement("div");
div.setAttribute("class","btn-group");
//div.setAttribute("class","input-group-btn");
div.setAttribute("role","group");
div.setAttribute("id","svgdrag");

var button=document.createElement("button");
button.setAttribute("type","button");
button.setAttribute("class","btn btn-default dropdown-toggle");
button.setAttribute("data-toggle","dropdown");
button.setAttribute("aria-haspopup","true");
button.setAttribute("aria-expanded","false");
//button.setAttribute("style","width:40px");

var span=document.createElement("span");
span.setAttribute("class","caret");
button.appendChild(span);

div.appendChild(button);

var ul=document.createElement("ul");
ul.setAttribute("class","dropdown-menu");

var li1=document.createElement("li");
var a=document.createElement("a");
a.setAttribute("href","#");
a.innerText="测试1";
li1.appendChild(a);

var li2=document.createElement("li");
var a=document.createElement("a");
a.setAttribute("href","#");
a.innerText="测试2";
li2.appendChild(a);

ul.appendChild(li1);
ul.appendChild(li2);


div.appendChild(ul);


btnGroup.appendChild(div);  

menu.appendChild(btnGroup);
this.root.appendChild(menu);
*/
/*var attr = document.createAttribute('href');

attr.nodeValue = 'http://www.sitepoint.com/';

element.setAttributeNode(attr);*/
}






	if (this.width/(this.xMax-this.xMin)<this.height/(this.yMax-this.yMin))
	{
       this.xyUnit=Math.floor(this.width/(this.xMax-this.xMin));
	   this.origin=[-this.xMin*this.xyUnit,Math.floor((this.height-this.xyUnit*(this.yMax-this.yMin))/2+(-this.yMin*this.xyUnit))];
	}
	else{
	   this.xyUnit=Math.floor(this.height/(this.yMax-this.yMin));
	   this.origin=[Math.floor((this.width-this.xyUnit*(this.xMax-this.xMin))/2+(-this.xMin*this.xyUnit)),this.height+this.yMin*this.xyUnit];
	}
	
	if (this.gridUnit==1) 
	{
		this.gridUnit=this.xyUnit;
	}
	//alert(this.origin[0]+","+this.origin[1]+":"+this.gridUnit+":"+this.xyUnit);
	 this.drawGrid(this.grid);  //网格
	 this.drawXY(this.xy);      //xy轴
	 this.drawLabel(this.label);   //坐标轴刻度
	this.addMouseEvent();  //添加鼠标事件
	//alert("origin:"+this.origin+"xyUnit:"+this.xyUnit+"this.grid:"+this.grid);

	//this.newAngle("t123",100,50,0,50,0,0);
    /*
	 editor:peng.zheng
	 time:2016/1/30 
	 content:计算SVG父的宽高
	*/
	$("#"+this.ID+"R").css({width:this.width,height:this.height});
	/*end*/
	
};

SVG.prototype.getObjAttr=function(id){
	if (this.objAttr[id]==undefined)
	{
		this.objAttr[id]={"stroke":"black","stroke_width":"2px","fill":"black","stroke_dasharray":""};
	}	
	
	//this.selectedObj.push({"name":getNameById(e.target.id),"id":e.target.id});		
	/*var finded=false;
	for (var i in this.selectedObj){
		if (this.selectedObj[i].id==id)
		{
			finded=true;
			break;
		}
	}
	if (!finded)
	{*/
		var t=document.getElementById(id);
		this.objAttr[id].stroke=t.getAttribute("stroke");
		this.objAttr[id].stroke_width=t.getAttribute("stroke-width");
		this.objAttr[id].stroke_dasharray=t.getAttribute("stroke-dasharray");
		this.objAttr[id].fill=t.getAttribute("fill");

		//console.log("getObjAttr:id,width"+id+","+t.getAttribute("stroke-width"));
	//}
		
};

//判断对象是否在被选中的对象列表中
SVG.prototype.isInSelected=function(id){
	var finded=false;
	for (var i in this.selectedObj){
		if (this.selectedObj[i].id==id)
		{
			finded=true;
			break;
		}
	}
	return finded;
}

SVG.prototype.setObjAttr=function(id){	
	var t=document.getElementById(id);
	if (this.objAttr[id]==undefined){		
		t.setAttributeNS(null,"stroke","black");
		t.setAttributeNS(null,"stroke-width","2");
	}
	else{
		/*var finded=false;
		for (var i in this.selectedObj){
			if (this.selectedObj[i].id==id)
			{
				finded=true;
				break;
			}
		}
		if (!finded){
			this.myAlert("setObj:"+id);*/
			//this.myAlert("ID,fill:"+id+";;"+t.getAttribute("fill"));		
			t.setAttributeNS(null,"fill",this.objAttr[id].fill);
			t.setAttributeNS(null,"stroke",this.objAttr[id].stroke);
			t.setAttributeNS(null,"stroke-width",this.objAttr[id].stroke_width);
			t.setAttributeNS(null,"stroke-dasharray",this.objAttr[id].stroke_dasharray);
			var id2=id.substring(0,2);
			if (id2=="CP"||id2=="FP")
			{
				t.setAttributeNS(null,"r","2");
			}
		//}
	}
}



SVG.prototype.action=function(x){  //存储本地作图指令，判断是否向服务器发送指令
   //alert("action:"+jQuery.inArray("NF~", this.actA)+"::"+this.actA);
   var m=x.split(",");
   var findYN=false;
   /*$.each(this.actA,function(n,value) {
       alert("action:"+this.actA[n]+":"+m[0]);
       if (this.actA[n].split(",")[0]==m[0])
	   {
		   this.actA[n]=x;
		   findYN=true;
		   return false;
       } 
       
   });*/

   //this.actA.push(x);
   /* 20151228必须过滤，否则函数作图有问题，如果有变量定义，变量定义应该放在前面较好*/
   for (var i=0;i<this.actA.length;i++)
   {
	   //alert("action:"+this.actA[i]+":"+m[0]);
       if (this.actA[i].split(",")[0]==m[0])
	   {
		   this.actA[i]=x;
		   findYN=true;
		   break;
       } 
   }
   
   if (!findYN)
   {
	   this.actA.push(x);
   }
   
   if (this.sys)
   {
	   //向服务器发送作图指令
   }
}

SVG.prototype.setSize=function(width,height){  //设置svg大小

//设置了大小就有问题哈
   
   //this.width=(typeof w == "undefined")?Math.floor($(window).width()*2/3/this.gridUnit)*this.gridUnit+1:w;
   //this.height=(typeof h == "undefined")?Math.floor($(window).height()/this.gridUnit)*this.gridUnit:h;
	/*if (this.editable)
	{
		this.width=(typeof width == "undefined" || width==null)?($("#"+(this.ID).substr(1)).width()-1):width;
	}
	else{
		this.width=(typeof width == "undefined" || width==null)?($("#"+(this.ID).substr(1)).width()-1):width;
	}
	//this.height=(typeof height == "undefined" || height==null)?$(window).height():height;
	//alert("resize Height:"+$("#"+(this.ID).substr(1)).height());
	this.height=(typeof height == "undefined" || height==null)?($("#"+(this.ID).substr(1)).height()-31):height;
    */
	
	if (this.editable)
	{
		//leftexpressionBox();
		//console.log("edit width:"+(this.ID).substr(1)+"|"+$("#"+(this.ID).substr(1)).width());
		//+parseInt($(".left").css("left"))
		//$("#"+(this.ID).substr(1)).height("100%");
		//alert("parseInt"+(parseInt($("#"+(this.ID).substr(1)).width())-parseInt($(".right").css("left"))));

		this.width=(typeof width == "undefined" || width==null)?(parseInt($("#"+(this.ID).substr(1)).width())-parseInt($(".right").css("left"))):width;
		this.height=(typeof height == "undefined" || height==null)?(parseInt($("#"+(this.ID).substr(1)).height())):height;

	}
	else{
		//console.log("unedit width:"+(this.ID).substr(1)+"|"+$("#"+(this.ID).substr(1)).width());
		this.width=(typeof width == "undefined" || width==null)?($("#"+(this.ID).substr(1)).width()):width;
		this.height=(typeof height == "undefined" || height==null)?parseInt(this.width/(this.xMax-this.xMin)*(this.yMax-this.yMin)):height;
	
	}
	//this.height=(typeof height == "undefined" || height==null)?$(window).height():height;
	//this.height=(typeof height == "undefined" || height==null)?parseInt(this.width/(this.xMax-this.xMin)*(this.yMax-this.yMin)):height;
	
	/*
	 editor:peng.zheng
	 time:2016/1/30 
	 content:计算SVG父的宽高
	*/
	//$("#SSVGParentR").css({width:this.width,height:this.height});
	//$("#"+this.ID+"R").css({width:this.width,height:this.height});
	/*end*/
   //var wr=w1/this.width;
   //var hr=h1/this.height;
   //alert("setSize:"+(this.ID).substr(1)+"::"+this.width+"::"+this.height);
   
   //var trans="scale("+wr+")";
   
   
   //var trans="translate(500, 600) scale(1,-1)"
   //var trans="rotate("+(rotAngle*180/Math.PI)+","+p1.x+","+p1.y+")";
   //this.root.setAttributeNS(null, "transform", trans);
/*
   $("#mySVGxy").attr("transform", trans);
   $("#mySVGgrid").attr("transform", trans);
   $("#mySVGlabel").attr("transform", trans);
   $("#mySVGpoint").attr("transform", trans);
   $("#mySVGsegment").attr("transform", trans);
*/   
   //this.width=(typeof w == "undefined")?Math.floor($(window).width()*2/3/this.gridUnit)*this.gridUnit+1:w;
   //this.height=(typeof h == "undefined")?Math.floor($(window).height()/this.gridUnit)*this.gridUnit:h;
   //this.width=(typeof w == "undefined")?(this.root.parentNode.clientWidth/this.gridUnit)*this.gridUnit+1:w;
   //this.height=(typeof h == "undefined")?(this.root.parentNode.clientHeight/this.gridUnit)*this.gridUnit:h;
   

   
  // this.xyUnit=(this.width/(this.xMax-this.xMin)<this.height/(this.yMax-this.yMin))?Math.floor(this.width/(this.xMax-this.xMin)):Math.floor(this.height/(this.yMax-this.yMin));
  
	
   //alert(this.width+":"+this.height+":"+this.origin);
   this.root.setAttributeNS(null,"width",this.width);
   this.root.setAttributeNS(null,"height",this.height);
   //this.root.setAttributeNS(null,"viewBox","0 0 "+this.width+" "+this.height);
   //this.root.setAttributeNS(null,"viewBox","0 0 "+w1+" "+h1);

   if (this.width/(this.xMax-this.xMin)<this.height/(this.yMax-this.yMin))
	{
       this.xyUnit=Math.floor(this.width/(this.xMax-this.xMin));
	   //this.origin=[-this.xMin*this.xyUnit, Math.floor((this.height-this.xyUnit*(this.yMax-this.yMin))/2+(-this.yMin*this.xyUnit))];
	   this.origin=[Math.abs(this.xMin*this.xyUnit), Math.floor(this.height/(this.yMax-this.yMin)*(this.yMax))];
	   //alert("以x为准");
	}
	else{
	   this.xyUnit=Math.floor(this.height/(this.yMax-this.yMin));
	   //this.origin=[Math.floor((this.width-this.xyUnit*(this.xMax-this.xMin))/2+(-this.xMin*this.xyUnit)),this.height+this.yMin*this.xyUnit];
	   this.origin=[Math.floor(this.width/(this.xMax-this.xMin)*(-this.xMin)),this.height+this.yMin*this.xyUnit];

	}
	//alert("this.origin:"+this.origin);
	//先简化处理
	this.origin=[Math.floor(this.width/2),Math.floor(this.height/2)]; //这个需要修改为用户坐标
	
	this.gridUnit=this.xyUnit;//是否将网格与用户单位同步？
	/*if (this.gridUnit=="undefined") 
	{
		this.gridUnit=this.xyUnit;
	}*/
	
};

SVG.prototype.u2s=function(p){  //用户坐标到屏幕坐标的转换
	var x=(this.origin[0]+p[0]*this.xyUnit).toFixed(1);
	var y=(this.origin[1]-p[1]*this.xyUnit).toFixed(1);
	//var x=(this.origin[0]+p[0]*this.xyUnit);
	//var y=(this.origin[1]-p[1]*this.xyUnit);
	return [x,y];
};

SVG.prototype.s2u=function(p){  //屏幕坐标到用户坐标的转换
	var px=((p[0]-this.origin[0])/this.xyUnit).toFixed(this.decimal);
	var py=(-(p[1]-this.origin[1])/this.xyUnit).toFixed(this.decimal);
	return [px,py];
};

SVG.prototype.Ls2u=function(p){  //屏幕坐标距离到用户坐标距离
	var len=(p/this.xyUnit).toFixed(this.decimal+3);
	
	return len;
};

SVG.prototype.Lu2s=function(p){  //用户坐标距离屏幕坐标距离
	
	var y=(p*this.xyUnit).toFixed(1);
	return y;
};

SVG.prototype.newChildID=function(){  //获取新孩子ID
	this.childID++;
	return ""+this.ID+""+this.childID;
};

SVG.prototype.newLabel=function(){  //获取点的名称
   var label="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   this.labelNo++;
   if (this.labelNo<27){
     return label.substring(this.labelNo-1,this.labelNo);
   }
   else
   {
     return "A"+(this.labelNo-27);
   }
   
};


SVG.prototype.drawGrid=function(t){  //画网格
           
    this.grid=t;	
	var ch=$("#"+this.ID+"grid").children().length;
	for (var i=ch-1;i>=0;i--){  
       $("#"+this.ID+"grid").children(i).remove();        
    }

	//边界
	if (this.border)
	{
			var border=document.createElementNS(svgNS, "path");
		var d="M0,0 L0,"+this.height;
	    border.setAttributeNS(null,"d",d);
	    border.setAttributeNS(null,"stroke-width",1);
	    border.setAttributeNS(null,"stroke","black");
	    $("#"+this.ID+"grid").append(border);

        var border=document.createElementNS(svgNS, "path");
		var d="M0,0 L"+this.width+",0";
	    border.setAttributeNS(null,"d",d);
	    border.setAttributeNS(null,"stroke-width",1);
	    border.setAttributeNS(null,"stroke","black");
	    $("#"+this.ID+"grid").append(border);

		var border=document.createElementNS(svgNS, "path");
		var d=d="M"+this.width+",0 L"+this.width+","+this.height;
	    border.setAttributeNS(null,"d",d);
	    border.setAttributeNS(null,"stroke-width",1);
	    border.setAttributeNS(null,"stroke","black");
	    $("#"+this.ID+"grid").append(border);

		var border=document.createElementNS(svgNS, "path");
		var d=d="M"+this.width+","+this.height+" L0,"+this.height;
	    border.setAttributeNS(null,"d",d);
	    border.setAttributeNS(null,"stroke-width",1);
	    border.setAttributeNS(null,"stroke","black");
	    $("#"+this.ID+"grid").append(border);
	}
	//alert("drawGrid:"+this.gridUnit+"grid:"+this.grid);
    if (t)
	{
        /*var border=document.createElementNS(svgNS, "rect");
	    border.setAttributeNS(null,"x",0);
	    border.setAttributeNS(null,"y",0);
	    border.setAttributeNS(null,"width",this.width);
	    border.setAttributeNS(null,"height",this.height);
	    $("#"+this.ID+"grid").append(border);

		var border=document.createElementNS(svgNS, "path");
		var d="M0,0 L0,"+this.height+" L"+this.width+","+this.height+" L"+this.width+",0 L0,0";
	    border.setAttributeNS(null,"d",d);
	    border.setAttributeNS(null,"fill","white");
	    //border.setAttributeNS(null,"height",this.height);
	    $("#"+this.ID+"grid").append(border);
        */

		
        
		

        
		//划横线 负
		for(var y=this.origin[1]+this.gridUnit;y<this.height;y+=this.gridUnit)
        { 		  
          var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",0);
          gridline.setAttributeNS(null,"y1",y);
	      gridline.setAttributeNS(null,"x2",this.width);
          gridline.setAttributeNS(null,"y2",y);
          $("#"+this.ID+"grid").append(gridline);		  
        }
		//划横线 正
		
		//for(var y=this.origin[1]-this.gridUnit;y>0;y-=this.gridUnit)
		for(var y=this.origin[1];y>0;y-=this.gridUnit)
        { 		  
          //alert("y:"+ty);
		  var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",0);
          gridline.setAttributeNS(null,"y1",y);
	      gridline.setAttributeNS(null,"x2",this.width);
          gridline.setAttributeNS(null,"y2",y);
          $("#"+this.ID+"grid").append(gridline);		  
        }

		//划竖线 正
		//for(var x=this.origin[0]+this.gridUnit;x<this.width;x+=this.gridUnit)
		for(var x=this.origin[0];x<this.width;x+=this.gridUnit)
        { 		  
          //alert("this.origin:"+this.origin[0]);
		  var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",x);
          gridline.setAttributeNS(null,"y1",0);
	      gridline.setAttributeNS(null,"x2",x);
          gridline.setAttributeNS(null,"y2",this.height);
          $("#"+this.ID+"grid").append(gridline);		  
        }
		//划竖线 负
		
		for(var x=this.origin[0]-this.gridUnit;x>0;x-=this.gridUnit)
        { 		  
          //alert("y:"+ty);
		  var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",x);
          gridline.setAttributeNS(null,"y1",0);
	      gridline.setAttributeNS(null,"x2",x);
          gridline.setAttributeNS(null,"y2",this.height);
          $("#"+this.ID+"grid").append(gridline);		  
        }
/*
        for(var i=0;i<vmax+1;i++)
        { 
		  
          var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",xs);
          gridline.setAttributeNS(null,"y1",ys+i*this.gridUnit);
	      gridline.setAttributeNS(null,"x2",xe);
          gridline.setAttributeNS(null,"y2",ys+i*this.gridUnit);
		  //gridline.setAttributeNS(null,"stroke","green");		  
		  //alert("drawGrid"+document.getElementById(this.ID+"grid"));
          $("#"+this.ID+"grid").append(gridline);
		  
        }*/
        //划竖线
		/*
        for(var i=0;i<hmax+1;i++)
        {
          var gridline=document.createElementNS(svgNS, "line");
          gridline.setAttributeNS(null,"x1",xs+i*this.gridUnit);
	      gridline.setAttributeNS(null,"y1",ys);
          gridline.setAttributeNS(null,"x2",xs+i*this.gridUnit);
          gridline.setAttributeNS(null,"y2",ye);
          $("#"+this.ID+"grid").append(gridline);
        }*/
	}      
};

SVG.prototype.drawXY=function(t){  //画xy轴   
   
   var ch=$("#"+this.ID+"xy").children().length;
   for (var i=ch-1;i>=0;i--){  
       $("#"+this.ID+"xy").children(i).remove();        
   }
   if (t)
   {
   
	   var xe=this.width;
	   var ye=this.height;
	   var xs=0;
	   var ys=0;
	   var oxoy=document.getElementById(this.ID+"xy");
	   var ox=document.getElementById(this.ID+"ox");
	   var oy=document.getElementById(this.ID+"oy");
	   if (ox==null)
	   {
		   
		   ox=document.createElementNS(svgNS, "line");
		   ox.setAttributeNS(null,"id",this.ID+"ox");
		   ox.setAttributeNS(null,"x1",xs);
		   //ox.setAttributeNS(null,"y1",(ye-this.origin[1]));
		   ox.setAttributeNS(null,"y1",this.origin[1]);
		   ox.setAttributeNS(null,"x2",xe);
		   //ox.setAttributeNS(null,"y2",(ye-this.origin[1])); 
		   ox.setAttributeNS(null,"y2",this.origin[1]); 
		   ox.setAttributeNS(null,"stroke-width", 2); 
		   ox.setAttributeNS(null,"stroke", "grey"); 
		   oxoy.appendChild(ox);
	   }
	   else{
		   ox.setAttributeNS(null,"x1",xs);
		   ox.setAttributeNS(null,"y1",(this.origin[1]));
		   ox.setAttributeNS(null,"x2",xe);
		   ox.setAttributeNS(null,"y2",(this.origin[1]));
	   }
	   if (oy==null)
	   {
		   oy=document.createElementNS(svgNS,"line");
		   oy.setAttributeNS(null,"id",this.ID+"oy");
		   oy.setAttributeNS(null,"x1",this.origin[0]);
		   oy.setAttributeNS(null,"y1",ys);
		   oy.setAttributeNS(null,"x2",this.origin[0]);
		   oy.setAttributeNS(null,"y2",ye); 
		   oy.setAttributeNS(null,"stroke-width",2); 
		   oy.setAttributeNS(null,"stroke", "grey"); 
		   oxoy.appendChild(oy);
	   }
	   else{
		   oy.setAttributeNS(null,"x1",this.origin[0]);
		   oy.setAttributeNS(null,"y1",ys);
		   oy.setAttributeNS(null,"x2",this.origin[0]);
		   oy.setAttributeNS(null,"y2",ye);    
	   }
   
	   //加箭头  
	    //var v = [xs,ye-this.origin[1]];
	    //var w = [xe,ye-this.origin[1]];
		var v = [xs,this.origin[1]];
	    var w = [xe,this.origin[1]];
	    arrow(this.ID+"xy",this.ID+"Eox",v,w);
	    var v = [this.origin[0],ye];
	    var w = [this.origin[0],ys];
	    arrow(this.ID+"xy",this.ID+"Eoy",v,w);
	}
	function arrow(parentId,id,v,w){
		  var parentNode=document.getElementById(parentId);
		  var node=document.getElementById(id);
		  var u = [w[0]-v[0],w[1]-v[1]];
		  var d = Math.sqrt(u[0]*u[0]+u[1]*u[1]);
		  if (d > 0.00000001) {
			u = [u[0]/d, u[1]/d];
			up = [-u[1],u[0]];		
			if (node!=null)
			{
			   node.setAttributeNS(null,"d","M "+(w[0]-15*u[0]-4*up[0])+" "+
					(w[1]-15*u[1]-4*up[1])+" L "+(w[0]-3*u[0])+" "+(w[1]-3*u[1])+" L "+
					(w[0]-15*u[0]+4*up[0])+" "+(w[1]-15*u[1]+4*up[1])+" z");
			}
			else{
				var node = document.createElementNS(svgNS,"path");
				node.setAttributeNS(null,"id",id);
				node.setAttributeNS(null,"d","M "+(w[0]-15*u[0]-4*up[0])+" "+
					(w[1]-15*u[1]-4*up[1])+" L "+(w[0]-3*u[0])+" "+(w[1]-3*u[1])+" L "+
					(w[0]-15*u[0]+4*up[0])+" "+(w[1]-15*u[1]+4*up[1])+" z");
				node.setAttributeNS(null,"stroke-width", 1);
				node.setAttributeNS(null,"stroke", "grey"); /*was markerstroke* "#C0C0C0" */
				node.setAttributeNS(null,"fill", "grey"); /*was arrowfill*/
				parentNode.appendChild(node);
			}            
		  }
	  };
};


SVG.prototype.drawLabel=function(t){  //刻度
	var label=document.getElementById(this.ID+"label");
    var childs1=label.childNodes;
    var ch=childs1.length;
    for (i=ch-1;i>=0;i--){  
        child1=childs1.item(i);
        label.removeChild(child1);
    }
    if (t)
    {   
		var labelSize;
		var movey;
		//if (this.width/this.xyUnit>14 || this.height/this.xyUnit>14)
		if (this.xyUnit>39)
		{
			labelSize=20;
			movey=18;
		}
		else{
			labelSize=12;
			movey=10;
		}
		
		var x0=this.origin[0];y0=this.origin[1];
		//alert("label x0,y0:"+x0+""+y0);
		var i=0;
		for (var x=x0;x<this.width ;x+=this.xyUnit)   //x正向
		{
			var te = document.createElementNS(svgNS,"text");
			te.setAttributeNS(null,"font-size",labelSize);
			te.setAttributeNS(null,"x",x);
			//te.setAttributeNS(null,"y",this.height-y0+movey);
			te.setAttributeNS(null,"y",y0+movey);
			te.appendChild(document.createTextNode(i));
			label.appendChild(te);

			//刻度
			var kedu=document.createElementNS(svgNS,"circle")
			kedu.setAttributeNS(null,"cx",""+x);
			//kedu.setAttributeNS(null,"cy",""+(this.height-y0));
			kedu.setAttributeNS(null,"cy",""+y0);
			kedu.setAttributeNS(null,"r","1");
			kedu.setAttributeNS(null,"fill","grey");
			kedu.setAttributeNS(null,"stroke","grey");
			label.appendChild(kedu);
			i++;
		}

		var i=0;
		for (var x=x0;x>0 ;x-=this.xyUnit)   //x负向
		{
			var te = document.createElementNS(svgNS,"text");
			te.setAttributeNS(null,"font-size",labelSize);
			te.setAttributeNS(null,"x",x);
			//te.setAttributeNS(null,"y",this.height-y0+movey);
			te.setAttributeNS(null,"y",y0+movey);
			te.appendChild(document.createTextNode(i));
			label.appendChild(te);
			//刻度
			var kedu=document.createElementNS(svgNS,"circle")
			kedu.setAttributeNS(null,"cx",""+x);
			//kedu.setAttributeNS(null,"cy",""+(this.height-y0));
			kedu.setAttributeNS(null,"cy",""+y0);
			kedu.setAttributeNS(null,"r","1");
			kedu.setAttributeNS(null,"fill","grey");
			kedu.setAttributeNS(null,"stroke","grey");
			label.appendChild(kedu);
			i--;
		}

		var i=1;
		//for (var y=this.height-y0-this.xyUnit;y>0 ;y-=this.xyUnit)   //y正向
		for (var y=y0-this.xyUnit;y>0 ;y-=this.xyUnit)   //y正向
		{
			var te = document.createElementNS(svgNS,"text");
			te.setAttributeNS(null,"font-size",labelSize);
			te.setAttributeNS(null,"x",x0+5);
			te.setAttributeNS(null,"y",y);
			te.appendChild(document.createTextNode(i));
			label.appendChild(te);
			//刻度
			var kedu=document.createElementNS(svgNS,"circle")
			kedu.setAttributeNS(null,"cx",""+x0);
			kedu.setAttributeNS(null,"cy",""+y);
			kedu.setAttributeNS(null,"r","1");
			kedu.setAttributeNS(null,"fill","grey");
			kedu.setAttributeNS(null,"stroke","grey");
			label.appendChild(kedu);
			i++;
		}
		  
		var i=-1;
		for (var y=y0+this.xyUnit;y<this.height ;y+=this.xyUnit)   //y负向
		{
			
			var te = document.createElementNS(svgNS,"text");
			te.setAttributeNS(null,"font-size",labelSize);
			te.setAttributeNS(null,"x",x0+5);
			te.setAttributeNS(null,"y",y);
			te.appendChild(document.createTextNode(i));
			label.appendChild(te);
			//刻度
			var kedu=document.createElementNS(svgNS,"circle")
			kedu.setAttributeNS(null,"cx",""+x0);
			kedu.setAttributeNS(null,"cy",""+y);
			kedu.setAttributeNS(null,"r","1");
			kedu.setAttributeNS(null,"fill","grey");
			kedu.setAttributeNS(null,"stroke","grey");
			label.appendChild(kedu);
			i--;
		}
	 }
};

//暂时未用
SVG.prototype.addToolBar=function(){  //添加工具栏
    //var $toolBar=$("<g id=\"mainMenu\" onmouseover=\"menuOver(evt);\" onclick=\"menuclick(evt);\" transform=\"translate(0,410)\"><text id=\"menuHint\" x=\"100\" y=\"120\" stroke=\"blue\" visibility=\"hidden\" font-size=\"12\">菜单提示信息</text><rect  id=\"tselect\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"stroke:black; fill:white\"/><path  d=\"M4 16 16 4 11 4 M16 4 16 9\" style=\"stroke:black; fill:none\"/><rect  id=\"select\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"stroke:black;fill-opacity:0;fill:white\"/></g>");
    var toolBar=document.createElementNS(svgNS,"g");
	toolBar.setAttributeNS(null,"id","toolBar"+this.ID);	
	toolBar.setAttributeNS(null,"transform","translate(0,410)");
	
	$("#"+this.ID).append(toolBar);
	var te=document.createElementNS(svgNS,"text");
	te.setAttributeNS(null,"font-size","12");
	te.setAttributeNS(null,"x",100);
	te.setAttributeNS(null,"y",120);
	te.appendChild(document.createTextNode("菜单提示信息"));
	$("#toolBar"+this.ID).append(te);

	/*$("#toolBar"+this.ID).draggable({ 
		cursor: "move", 
		cursorAt: { top:5, left:5 } 
	});
    */
   $("#toolBar"+this.ID).click(function(e){
        alert("toolBar click event type,target,pageX,pageY:"+e.type+":"+e.target+":"+e.pageX+":"+e.pageY);
		//e.preventDefault();
		e.stopPropagation();    //阻止冒泡
	});
   $("#toolBar"+this.ID).mouseover(function(e){
        //alert("toolBar mouseover event:"+e.target);
		//e.preventDefault();
	});

};

SVG.prototype.initDropDownMenu=function(){
	$("#"+this.ID+"dropdown").empty();
	//var defli=$("<li><a href=\"javascript:alert(\'请选择响应的对象\')\">请选择对象</a></li>");
	//var defli=$("<li><a id=\"help\" href=\"#\">帮助</a></li>");
	/*$("#id").append($("a").click(function(){
		//点击事件
	})
);*/
	var othis=this;
	for (var i in othis.selectedObj){
		othis.setObjAttr(othis.selectedObj[i].id);
	}
	othis.selectedObj.length=0;  //清空selectedObj数组
	
	var defli=$("<li></li>");
	var defa=$("<a>帮助</a>");
	defa.attr("href","javascript:");
	defa.bind("click",function(e){
		//othis.newPoint("test",100,100,"X");

	});
	defli.append(defa);

	$("#"+this.ID+"dropdown").append(defli);
}

SVG.prototype.DropDownMenu=function(msg,fun){
	//$("#"+this.ID+"dropdown").empty();
	//var defli=$("<li><a href=\"javascript:alert(\'请选择响应的对象\')\">请选择对象</a></li>");
	
	var defli=$('<li><a href=\"javascript:'+fun+'\">'+msg+'</a></li>');
	$("#"+this.ID+"dropdown").append(defli);
	/*var defli=$("<li></li>");
	var defa=$("<a>"+msg+"</a>");
	defa.bind("click",function(e){
		othis.newPoint("test",100,100,"X");

	});
	defli.append(defa);*/

	$("#"+this.ID+"dropdown").append(defli);
}



SVG.prototype.onMouseClick=function(e){  //mouse click
	//alert("e click target,shiftKey,which,detail:"+e.target+":"+e.shiftKey+"::"+e.which+"::"+e.detail);
	//e.which 有三个值 1 左击  2 中间按钮  3 右击
	//alert("mouseclick:"+this.tool);
	var startx = e.clientX;
    var starty = e.clientY;
    var node=e.target;
	var othis=this;
	if (e.shiftKey==1)
	{
		//alert(e.target.id);
		if (allID2.indexOf(e.target.id.substring(0,2))>0)
		{
			//console.log("etarget:"+e.target.id.substring(0,2));
			if (this.isInSelected(e.target.id))
			{
				this.setObjAttr(e.target.id);
				//删除再次被选择的元素
				for (var i in this.selectedObj){
					if (this.selectedObj[i].id==e.target.id)
					{
						this.selectedObj.splice(i,1);
						break;
					}
				}
			}
			else{
				this.selectedObj.push({"name":getNameById(e.target.id),"id":e.target.id});
				//this.getObjAttr(e.target.id);
				//console.log("etarget:"+e.target.id);
				e.target.setAttributeNS(null,"stroke","blue");
				e.target.setAttributeNS(null,"stroke-width","4");
			}
		}
		//alert("s:"+this.selectedObj.length);
		var s=this.selectedObj;
		
		
		switch ((s.length).toString())
		{
			case "1":
				//alert(s[0].name.substring(0,1));
				switch (s[0].name.substring(0,1))
				{
					case "点":
						//alert("点");
						break;
					case "线":
						//alert("线段");
						//this.myAlert("作线段"+s[0].name+"的平行线");
						//$("#"+this.ID+"dropdown").empty();
					//	this.initDropDownMenu();
						//作线段"+s[0].name+"的垂线
						//作线段"+s[0].name+"的锤子平分线
						break;
					default:
						break;				
				}
				break;

			case "2":
				var s=(this.selectedObj[0].name).substring(0,1)+(this.selectedObj[1].name).substring(0,1);
				//this.myAlert("s:"+s);
				switch (s)
				{
					case "线线":
						//作两条线的交点
						//作两条线相等的标注？？可以通过颜色，暂时不考虑
						break;
					case "线点":
					case "点线"://以点为圆心，线段为半径的圆
						var pID,lID,tip;
						if ((this.selectedObj[0].name).substring(0,1)=="点")
						{
							pID=this.selectedObj[0].id;
							lID=this.selectedObj[1].id;
							tip="作以"+this.selectedObj[0].name+"为圆心,"+this.selectedObj[1].name+"为半径的圆";
						}
						else{
							pID=this.selectedObj[1].id;
							lID=this.selectedObj[0].id;
							tip="作以"+this.selectedObj[1].name+"为圆心,"+this.selectedObj[0].name+"为半径的圆";
						}
						//取线段的限制条件并获取端点ID
						var pid1,pid2;
						for (var i=0;i<$("#X"+lID).children().length;i++ )
						{
							var conID=$("#X"+lID).children().eq(i).text();
							var con=($("#"+conID).text()).split(",");
							//LPP，lID，pID1，pID2
							if (con[0]=="LPP")
							{
								pid1=con[2];
								pid2=con[3];								
								break;
							}
						}
						var x,y,x1,y1,x2,y2;
						var p1=document.getElementById(pid1);
						x1=parseInt(p1.getAttribute("cx"));
						y1=parseInt(p1.getAttribute("cy"));
						p1=document.getElementById(pid2);
						x2=parseInt(p1.getAttribute("cx"));
						y2=parseInt(p1.getAttribute("cy"));
						p1=document.getElementById(pID);
						x=parseInt(p1.getAttribute("cx"));
						y=parseInt(p1.getAttribute("cy"));
						
						var r=(Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))).toFixed(this.decimal);
						var defli=$("<li></li>");
						var defa=$("<a>"+tip+"</a>");
						defa.attr("href","javascript:");
												
						defa.bind("click",function(e){
							var cID="CR"+othis.newChildID();
							othis.newCircle(cID,x,y,r);
							//限制条件	
							var con_id="c"+othis.newChildID();
							othis.newCon(con_id,"CPP,"+cID+","+pID+","+pid1+","+pid2,"C"+pID);   //约束条件
							othis.newCon("c"+othis.newChildID(),"CPP,"+cID+","+pID+","+pid1+","+pid2,"C"+pid1);   //约束条件
							othis.newCon("c"+othis.newChildID(),"CPP,"+cID+","+pID+","+pid1+","+pid2,"C"+pid2);
							othis.newCon("x"+othis.newChildID(),con_id,"X"+cID);       //被约束条件
							//发送到服务器
							var point1=othis.s2u([x,y]);
							var r1=othis.Ls2u(r);						
							othis.action("NC~"+cID+"~"+point1[0]+"~"+point1[1]+"~"+r1);	
							othis.initDropDownMenu();

						});
						defli.append(defa);
						$("#"+this.ID+"dropdown").append(defli);
						
						break;
					case "点点":
						//var fun="alert('"+this.selectedObj[0].id+"')";
						//this.DropDownMenu("作线段",fun);
						break;
					case "圆线":
						break;
					case "线圆":
						break;
					case "圆点":
						//做切线
						break;
					case "点圆":
						//作切线
						break;				
				}
				break;
			case "3":
				//alert("3");
				var s=(this.selectedObj[0].name).substring(0,1)+(this.selectedObj[1].name).substring(0,1)+(this.selectedObj[2].name).substring(0,1);
				//console.log("s:"+s);
				switch (s)
				{
					case "点点点":
						//作角平分线，作角标注
					//console.log("name:"+(othis.selectedObj[0].name).substring(1,2));
						var tip="标注∠"+(othis.selectedObj[0].name).substring(1,2)+(othis.selectedObj[1].name).substring(1,2)+(othis.selectedObj[2].name).substring(1,2);
						var defli=$("<li></li>");
						var defa=$("<a>"+tip+"</a>");
						defa.attr("href","javascript:");
						defa.bind("click",function(e){
							othis.newAngle("Ag"+othis.newChildID(),othis.selectedObj[0].id,othis.selectedObj[1].id,othis.selectedObj[2].id);
							othis.initDropDownMenu();
						});
						defli.append(defa);
						$("#"+this.ID+"dropdown").append(defli);
						
						//过三点作圆
						var tip="作过三点"+(othis.selectedObj[0].name).substring(1,2)+(othis.selectedObj[1].name).substring(1,2)+(othis.selectedObj[2].name).substring(1,2)+"的圆";
						var defli=$("<li></li>");
						var defa=$("<a>"+tip+"</a>");
						defa.attr("href","javascript:");
						var pId1=othis.selectedObj[0].id;
						var pId2=othis.selectedObj[1].id;
						var pId3=othis.selectedObj[2].id;
						
						defa.bind("click",function(e){
							var pr=othis.get3PC(pId1,pId2,pId3);
							if (pr[2]!=0)
							{
								//先不考虑画圆心，如果画圆心，还得做圆心的被限制条件
								//var pID="CP"+this.newChildID();
								//var label=this.newLabel();
								//this.newPoint(pID,x,y,label);

								var cID="CR"+othis.newChildID();
								othis.newCircle(cID,pr[0],pr[1],pr[2]);
								//限制条件
								var conID="c"+othis.newChildID();
								othis.newCon(conID,"C3P,"+cID+","+pId1+","+pId2+","+pId3,"C"+pId1);
								conID="c"+othis.newChildID();
								othis.newCon(conID,"C3P,"+cID+","+pId1+","+pId2+","+pId3,"C"+pId2);
								conID="c"+othis.newChildID();
								othis.newCon(conID,"C3P,"+cID+","+pId1+","+pId2+","+pId3,"C"+pId3);
								//被限制条件
								var conIDx="x"+othis.newChildID();
								othis.newCon(conIDx,conID,"X"+cID);
								//发送到服务器
								var point1=othis.s2u([pr[0],pr[1]]);
								var r1=othis.Ls2u(pr[2]);						
								othis.action("NC~"+cID+"~"+point1[0]+"~"+point1[1]+"~"+r1);								
							}
							else{
								othis.myAlert("提示:不能作过这三点的圆！");
							}
							othis.initDropDownMenu();
						});
						defli.append(defa);
						$("#"+this.ID+"dropdown").append(defli);



						break;
					case "线点":
						break;
					case "点线":
						break;
					case "点点线":
						//var fun="alert('"+this.selectedObj[0].id+"')";
						//this.DropDownMenu("作线段",fun);
						break;
					case "圆线":
						break;
					case "线圆":
						break;
					case "圆点":
						//做切线
						break;
					case "点圆":
						//作切线
						break;				
				}
				break;
			case "4":
				break;
			default:
				break;
		
		}
		
		//alert("selectID:"+this.selectedID+getNameById(e.target.id));
	}
		/*
		代码 
		arrayObj. push([item1 [item2 [. . . [itemN ]]]]);// 将一个或多个新元素添加到数组结尾，并返回数组新长度
		arrayObj.unshift([item1 [item2 [. . . [itemN ]]]]);// 将一个或多个新元素添加到数组开始，数组中的元素自动后移，返回数组新长度
		arrayObj.splice(insertPos,0,[item1[, item2[, . . . [,itemN]]]]);//将一个或多个新元素插入到数组的指定位置，插入位置的元素自动后移，返回""。
		arrayObj.length=0;//清空
		toString()：把数组转换成一个字符串 
		toLocaleString()：把数组转换成一个字符串 
		join()：把数组转换成一个用符号连接的字符串 
		shift()：将数组头部的一个元素移出 
		unshift()：在数组的头部插入一个元素 
		pop()：从数组尾部删除一个元素 
		push()：把一个元素添加到数组的尾部 
		concat()：给数组添加元素 
		slice()：返回数组的部分 
		reverse()：将数组反向排序 
		sort()：对数组进行排序操作 
		splice()：插入、删除或者替换一个数组元素

		*/
	//alert("dddd");
	//alert("con"+$("#con:first-child").text());
	//$("#con").children().each(function(i,n){
    // var obj = $(n)
    // alert(obj.text());//弹出子元素标签
    //});
	/*alert("不存在元素测试:"+$("#xxxxxxxxxx").length+"::"+$("#xxxxxxxxxx").children().length);
    alert("空元素测试:"+$("#mySVGcon").length+"::"+$("#mySVGcon").children().length);
	alert("两个元素测试:"+$("#con").length+":"+ $("#con").children().length);

	for (var i=0;i<$("#con").children().length;i++)
		{
           alert("第"+i+"个孩子"+$("#con").children().eq(i).text());
		}
    */
	//$('#test').children().eq(1) 第2个孩子

    //alert("startx,starty:"+startx+","+starty+":"+node.getAttribute("id"));
	/*if (menu_id=="select"){
      node_obj=evt.target;
  
      node_obj_id=node_obj.getAttribute("id");
      //select_array=select_obj_id.split(",");
      if (node_obj_id!="drawing" && evt.shiftKey){
        obj_id_index=select_obj_id.indexOf(node_obj_id);

        if (obj_id_index>0){
          head=select_obj_id.substring(0,obj_id_index-1);
          tail=select_obj_id.substr(obj_id_index+7);
          select_obj_id=head+tail;
          node_obj.setAttribute("stroke","black");
        }
        else{
          select_obj_id=select_obj_id+","+node_obj_id;
          node_obj.setAttribute("stroke","red");
        }
        disp("选定对象:"+select_obj_id);
      }
    }*/

    

	var objID=e.target.id;
	var objID_2;
	if (objID==null)
    {
	    objID_2="NU";
    }
	else{
	    objID_2=objID.substring(0,2);
	}
    
	//排除对象拖动的时候响应click
	if (Math.abs(this.startPoint[0]-startx+$("#"+this.ID).offset().left)>2 || Math.abs(this.startPoint[1]-starty+$("#"+this.ID).offset().top)>2){
		e.stopPropagation();    //阻止冒泡
		e.preventDefault();
		return;
	}
    $(".icon-list ul.dropdown-menu").hide();
    $(".dcg-options-menu").hide(); 
	
    e.preventDefault();
	e.stopPropagation();    //阻止冒泡
    

	

};

SVG.prototype.onMouseDblclick=function(e){
	//alert("dblclick");
	var objID=e.target.id;
	var objID_2;
	if (objID==null)
    {
	    objID_2="NU";
    }
	else{
	    objID_2=objID.substring(0,2);
	}
    
    switch (this.tool){
        case "S":  
			switch (objID_2)
			{
			   case "FP":
			   case "CP":
				   var dx=parseInt($("#T"+objID).attr("dx"));
			       var dy=parseInt($("#T"+objID).attr("dy"));
				   if (dx<0)
				   {
					   if (dy<0) //第二象限->3
					   {
						   //alert("2");
                           $("#T"+objID).attr("dx",-18);
						   $("#T"+objID).attr("dy",18);
					   }
					   else{  //第三象限->4
						   //alert("3");
                           $("#T"+objID).attr("dx",8);
						   $("#T"+objID).attr("dy",18);
					   }
				   }
				   else{  //dx>0
                       if (dy<0) //第一象限->2
					   {
						   //alert("1");
                           $("#T"+objID).attr("dx",-18);
						   $("#T"+objID).attr("dy",-8);
					   }
					   else{  //第四象限->1
						   //alert("4");
                           $("#T"+objID).attr("dx",8);
						   $("#T"+objID).attr("dy",-8);
					   }
				   }
				   break;
			   default:
				   break;
			
			}
			break;
		default:
			break;
	}
    e.stopPropagation();    //阻止冒泡
};


SVG.prototype.onMouseDown=function(e){  //mouse down
  
  //alert("mousedown e.target.id:"+e.target.id);
  
  this.mouseState="down";
  var startx = e.pageX-$("#"+this.ID).offset().left;
  var starty = e.pageY-$("#"+this.ID).offset().top;
  this.startPoint=[startx,starty,null];
  this.currentObjID=e.target.id;
  if (e.target.id.substring(0,1)=="B")//点的背景
  {
		this.currentObjID=e.target.id.substring(1);
  }
  //if (this.mouseState=="down"){
  //  this.mouseState="";
    //var move_obj=state.current_obj;
    //state.current_obj=null;
    //over_obj_id=over_obj.getAttribute("id");
//    alert(this.cord[1]["fxfirstFX"])
	var overObjID=null;
    if (e.target.id==null)
    {
	    overObjID="NU";
    }
	else{
	    overObjID=e.target.id.substring(0,2);
	}

	//var allID="FP CP PP CR";
	if (allID2.indexOf(overObjID)>0 || e.target.id==this.ID)
	{
		e.stopPropagation();    //阻止冒泡   
		e.preventDefault();
	}
    
    switch (this.tool){
        case "S":                       //新添加的，当移动一个对象结束时，向服务器发送信息
			/*var move_obj_id_2=null;    //over_obj.getAttribute("id").substring(0,2);
			var move_obj_id="";
			var select_node_id;
		
			if (move_obj != null){
			  move_obj_id=move_obj.getAttribute("id");
			  move_obj_id_2=move_obj_id.substring(0,2);
			}
			select_node_id=move_obj_id;

			switch(move_obj_id_2){
			  case "FP":  
				var mess="movepoint~"+move_obj_id+"~"+point.x+"~"+point.y;
				sendmessage(mess,"graphics");
				break;
			  case "CP":
				if (sendIf)
				{
				   var mess="movepoint~"+move_obj_id+"~"+point.x+"~"+point.y;
				   sendmessage(mess,"graphics");
				   if (modicon!=""){
					 sendmessage(modicon,"graphics");
					 //alert("发送约束条件："+modicon);
					 modicon="";
				   }
				   
						   
				}
				sendIf=true;
				break;
		   */
		   		//   startx=startx-$("#"+this.ID).offset().left;
				//   starty=starty-$("#"+this.ID).offset().top;
				   //alert(typeof($("#"+this.currentObjID).attr("x1")));
				   //下面这个有用吗？
				   var x1=parseFloat($("#"+this.currentObjID).attr("x1"));
				   var x2=parseFloat($("#"+this.currentObjID).attr("x2"));
				   var y1=parseFloat($("#"+this.currentObjID).attr("y1"));
				   var y2=parseFloat($("#"+this.currentObjID).attr("y2"));
				   this.pre=[startx,starty,x1,x2,y1,y2];
//						alert(pre[0])

	       break;
		case "W"://自有手写
			var m=document.createElementNS(svgNS,"path");
			m.setAttributeNS(null,"stroke","black");
			m.setAttributeNS(null,"fill","none");
			m.setAttributeNS(null,"stroke-width","2");
			m.setAttributeNS(null,"d","M"+startx+ " " +starty);
			var id=id="WR"+this.newChildID();
			m.setAttributeNS(null,"id",id);
			document.getElementById(this.ID+"pen").appendChild(m);
			this.startPoint=[startx,starty,id];
			break;
		case "C":
			 switch (overObjID)
			 {
			    case "FP":
				case "CP":
                   this.startPoint=[$("#"+e.target.id).attr("cx"),$("#"+e.target.id).attr("cy"),e.target.id];			      
				   break;
				case "PP":
				   var label=this.newLabel();	  
	               var id="CP"+this.newChildID();
                   var l_l=0;
				  
				   //startx=startx-$("#"+this.ID).offset().left;
				   //starty=starty-$("#"+this.ID).offset().top;
				   var x1=parseFloat($("#"+this.currentObjID).attr("x1"));
				   var x2=parseFloat($("#"+this.currentObjID).attr("x2"));
				   var y1=parseFloat($("#"+this.currentObjID).attr("y1"));
				   var y2=parseFloat($("#"+this.currentObjID).attr("y2"));
                   
				   if (Math.abs(x2-x1)>Math.abs(y2-y1))
				   {
					 //以x坐标为准
					 l_l=(startx-x1)/(x2-x1);
					 starty=(l_l*(y2-y1)+y1).toFixed();					 					 
				   }	
				   else{
					 l_l=(starty-y1)/(y2-y1);
					 startx=(l_l*(x2-x1)+x1).toFixed();					
				   }
				   
				   this.st[id]=[startx,starty];
                   
				   
				   this.newPoint(id,startx,starty,label);
				   this.startPoint=[startx,starty,id];
                   //添加点在线上的约束条件
				   var conID="c"+this.newChildID();				   

				   this.newCon(conID,"POL,"+id+","+this.currentObjID+","+l_l,"C"+this.currentObjID);
				   //点在线上的被约束条件

				   this.newCon("x"+this.newChildID(),conID,"X"+id);
					break;
				default:
				   var label=this.newLabel();	  
	               var id="FP"+this.newChildID();
                   this.newPoint(id,startx,starty,label);
				   this.startPoint=[startx,starty,id];
				   
				   break;
			 
			 }
			var circle_id="CR"+this.newChildID();
			this.newCircle(circle_id,this.startPoint[0],this.startPoint[1],3);
			this.currentObjID=circle_id;
			  
			 
			  //select_node[1]=center_id;
			  //select_node[2]=circle_id;      
			break;   //end case "C"
		case "P":
			
			switch (overObjID)
			{
				case "FP":				   
				case "CP":
					this.startPoint=[$("#"+e.target.id).attr("cx"),$("#"+e.target.id).attr("cy"),e.target.id];			      
					break;
				case "CR":  //在圆上作点
					if (this.smartTip.type=="CCI")
					{
						//alert("CCI");
								var czCircle_id=this.smartTip.czObj.getAttribute("id");
								var czObj=document.getElementById(czCircle_id);
								var overObj_id=e.target.id;
								var overObj=e.target;
								var points=new Array(5);
								points=pointsCC(overObj,czObj);
								//alert("交点个数："+points[0]+","+points[1]+","+points[2]+","+points[3]+","+points[4]);
								switch (points[0]){
								   case "T":   //两个交点
									 var point_id="CP"+this.newChildID();
									 //this.newLabel();
									 
									 var biaoji=false;  //标记交点是否从两圆心联线逆时针旋转的第一个交点
									 var cx1=overObj.getAttribute("cx");
									 var cy1=overObj.getAttribute("cy");
									 var cx=czObj.getAttribute("cx");
									 var cy=czObj.getAttribute("cy");
									 var angleP1=getAlpha(cx,cy,points[1],points[2]);
									 var angleP2=getAlpha(cx,cy,points[3],points[4]);
									 var angleRR=getAlpha(cx,cy,cx1,cy1);

									 //P1<P2<R or R<P1<P2 or P2<R<P1 的时候P1为第一交点
									 if ((angleP1>angleRR && angleRR>angleP2) || ( (angleP1<angleP2) && (angleRR>angleP2 || angleRR < angleP1)))  biaoji=true;

									 if ((points[1]-startx)*(points[1]-startx)+(points[2]-starty)*(points[2]-starty)>(points[3]-startx)*(points[3]-startx)+(points[4]-starty)*(points[4]-starty)){
										this.newPoint(point_id,points[3],points[4],this.newLabel());
										//this.startPoint=[startx,starty,id];
										//newpoint(parent,points[3],points[4],newLabel(),"CP"+point_id);
										biaoji = !biaoji;
									 }
									 else
									 {
										//newpoint(parent,points[1],points[2],newLabel(),"CP"+point_id);
										this.newPoint(point_id,points[1],points[2],this.newLabel());
									 }
									 var bj="S";   
									 if (biaoji) bj="F";
									 //constraint_id="X"+conID();
									 //newconstraint("PCC,"+"CP"+point_id+","+circle_id+","+line_id+","+bj,"X"+line_id,"X"+conID());  //约束条件
									 //newconstraint("PCC,"+"CP"+point_id+","+circle_id+","+line_id+","+bj,"X"+circle_id,constraint_id);  //约束条件
									 //newconstraint(constraint_id,"CCP"+point_id,"C"+conID());   //被约束条件
								
									var conID="c"+this.newChildID();
									this.newCon(conID,"PCC,"+point_id+","+overObj_id+","+czCircle_id+","+bj,"C"+overObj_id);
									conID="c"+this.newChildID();
									this.newCon(conID,"PCC,"+point_id+","+overObj_id+","+czCircle_id+","+bj,"C"+czCircle_id);
									this.newCon("x"+this.newChildID(),conID,"X"+point_id);
									 over_obj.setAttribute("stroke","black");
									 czline.setAttribute("stroke","black");
									 cztype="";
									 czline=null;
									 break;
								   case "O":    //一个交点
									 break;
								   default:     //无交点
									 break;
								}
								//结束圆与圆的交点
						
					}
					else{
						var label=this.newLabel();
						var id="CP"+this.newChildID();				   
						this.newPoint(id,startx,starty,label);
						this.startPoint=[startx,starty,id];
						//添加点在圆上的约束条件
						var alpha=getAlpha($("#"+e.target.id).attr("cx"),$("#"+e.target.id).attr("cy"),this.startPoint[0],this.startPoint[1]);  //alpha为x正半轴到圆上点的弧角
						
						var conID="c"+this.newChildID();
						this.newCon(conID,"POC,"+id+","+e.target.id+","+alpha,"C"+e.target.id);
						//点在圆上的被约束条件
						this.newCon("x"+this.newChildID(),conID,"X"+id);

					}
					
					break;//end case "CR"
				case "PP":

					if (this.smartTip.type!="")
					{
						
						switch (this.smartTip.type)
						{
							case "MPL"://线段的中点
								//alert("MPL:"+this.smartTip.czObj);
								var czline_id=this.smartTip.czObj.getAttribute("id");
								var cObj=this.smartTip.czObj;
								var ox1=parseInt(cObj.getAttribute("x1"));
								var ox2=parseInt(cObj.getAttribute("x2"));
								var oy1=parseInt(cObj.getAttribute("y1"));
								var oy2=parseInt(cObj.getAttribute("y2"));
								var mx=(ox1+ox2)/2;
								var my=(oy1+oy2)/2;
								var label=this.newLabel();	  
								var id="CP"+this.newChildID();								
								this.newPoint(id,mx,my,label);
								this.startPoint=[mx,my,id];
								//添加中点的约束条件
								var conID="c"+this.newChildID();
								this.newCon(conID,"MPL,"+id+","+czline_id,"C"+czline_id);
								//点在线上的被约束条件
								this.newCon("x"+this.newChildID(),conID,"X"+id);
			
								
								break;
							case "LLI"://线段与线段的交点
								var lineID1=this.currentObjID;								
								var czline_id=this.smartTip.czObj.getAttribute("id");
								var over_obj=e.target;
								
								var czx1=parseFloat(this.smartTip.czObj.getAttribute("x1"));//.toFixed(this.decimal);
								var czy1=parseFloat(this.smartTip.czObj.getAttribute("y1"));//.toFixed(this.decimal);
								var czx2=parseFloat(this.smartTip.czObj.getAttribute("x2"));//.toFixed(this.decimal);
								var czy2=parseFloat(this.smartTip.czObj.getAttribute("y2"));//.toFixed(this.decimal);
																
								var x1=parseFloat(over_obj.getAttribute("x1"));//.toFixed(this.decimal);
								var y1=parseFloat(over_obj.getAttribute("y1"));//.toFixed(this.decimal);
								var x2=parseFloat(over_obj.getAttribute("x2"));//.toFixed(this.decimal);
								var y2=parseFloat(over_obj.getAttribute("y2"));//.toFixed(this.decimal);
								//alert("x");
								var LLIxy=pointLL(x1,y1,x2,y2,czx1,czy1,czx2,czy2);
								//alert(LLIxy);
								//alert("px,py:"+LLIxy+"A"+p_y+":::"+startx+","+starty);
								var label=this.newLabel();	  
								var id="CP"+this.newChildID();
								//this.st[id]=[startx,starty];                   
					   
								this.newPoint(id,LLIxy[0],LLIxy[1],label);
								this.startPoint=[LLIxy[0],LLIxy[1],id];

							   //添加直线交点的约束条件							
								var conID="c"+this.newChildID();
								this.newCon(conID,"PLL,"+id+","+lineID1+","+czline_id,"C"+lineID1);
								conID="c"+this.newChildID();
								this.newCon(conID,"PLL,"+id+","+lineID1+","+czline_id,"C"+czline_id);
								this.newCon("x"+this.newChildID(),conID,"X"+id);


								if (this.smartTip.czObj!="") {
									this.smartTip.czObj.setAttributeNS(null,"stroke","black");
									this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
												
												 //czline=null;
									this.myAlert("No");
									this.smartTip.type="";
									this.smartTip.czObj="";
								}

								break;
							case "LCI"://线段与圆的交点
							//alert("LCI");
								var line_id=this.currentObjID;								
								var circle_id=this.smartTip.czObj.getAttribute("id");
								var over_obj=e.target;
								var points=pointsLC(e.target,this.smartTip.czObj);
            //alert("交点个数："+points[0]+","+points[1]+","+points[2]+","+points[3]+","+points[4]);
			
			                     
								
								//this.st[id]=[startx,starty];                   
					   
								//this.newPoint(id,LLIxy[0],LLIxy[1],label);
								//this.startPoint=[LLIxy[0],LLIxy[1],id];
			switch (points[0]){
			   case "T":   //两个交点
			     //alert("two Point");
			     var point_id="CP"+this.newChildID();
				 var label=this.newLabel();	
				 //var circle_id=czline.getAttribute("id");
				 //var line_id=over_obj.getAttribute("id");
				 var x1=over_obj.getAttribute("x1");
				 var y1=over_obj.getAttribute("y1");
				 var x2=over_obj.getAttribute("x2");
				 //var y2=over_obj.getAttribute("y2");
				 var biaoji="F";       //标记第一个交点离险段起始端点近或远
				 if (x1-x2 !=0){
				    if ((points[3]-x1)/(points[1]-x1) > 1) {biaoji="F";} else {biaoji="S";}
				 }
				 else
				 {
				    if ((points[4]-y1)/(points[2]-y1) > 1) {biaoji="F";} else {biaoji="S";}
				 }

			     if ( (points[1]-startx)*(points[1]-startx)+(points[2]-starty)*(points[2]-starty)>(points[3]-startx)*(points[3]-startx)+(points[4]-starty)*(points[4]-starty)){
                    this.newPoint(point_id,points[3],points[4],label);
					this.startPoint=[points[3],points[4],point_id];
					//biaoji=!(biaoji);
					if (biaoji!="S")
					{
						biaoji="S";
					}
					else{
						biaoji="F";
					}
				 }
				 else
				 {
                    //newpoint(parent,points[1],points[2],newLabel(),"CP"+point_id);
					this.newPoint(point_id,points[1],points[2],label);
					this.startPoint=[points[1],points[2],point_id];
				 }
				 //constraint_id="X"+conID();                 
				 //var bj="F";
				 //if (!biaoji) bj="S";    //"F"表示第一交点，"S"表示第二交点
				//添加直线与圆交点的约束条件							
								var conID="c"+this.newChildID();
								this.newCon(conID,"PLC,"+point_id+","+line_id+","+circle_id+","+biaoji,"C"+line_id);
								conID="c"+this.newChildID();
								this.newCon(conID,"PLC,"+point_id+","+line_id+","+circle_id+","+biaoji,"C"+circle_id);
								this.newCon("x"+this.newChildID(),conID,"X"+point_id);
								if (this.smartTip.czObj!="") {
									this.smartTip.czObj.setAttributeNS(null,"stroke","black");
									this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
												
												 //czline=null;
									this.myAlert("No");
									this.smartTip.type="";
									this.smartTip.czObj="";
								}
			     break;
			   case "O":    //一个交点
			     break;
			   default:     //无交点
			     break;
			}
								
			//结束直线与圆的交点				



								break;
							
							default:
								break;
						
						}
						this.hideHint();
					}
					else{

						var label=this.newLabel();	  
						var id="CP"+this.newChildID();
						var l_l=0;
					   //parseFloat()
						//startx=startx-$("#"+this.ID).offset().left;
						//starty=starty-$("#"+this.ID).offset().top;
						var x1=parseFloat($("#"+this.currentObjID).attr("x1"));
						var x2=parseFloat($("#"+this.currentObjID).attr("x2"));
						var y1=parseFloat($("#"+this.currentObjID).attr("y1"));
						var y2=parseFloat($("#"+this.currentObjID).attr("y2"));
					   
						if (Math.abs(x2-x1)>Math.abs(y2-y1))
						{
						 //以x坐标为准
						 l_l=(startx-x1)/(x2-x1);
						 starty=(l_l*(y2-y1)+y1).toFixed();					 					 
						}	
						else{
						 l_l=(starty-y1)/(y2-y1);
						 startx=(l_l*(x2-x1)+x1).toFixed();					
						}

					   /*
					   if (x2-x1 != 0){
							l_l=(startx-x1)/(x2-x1);
							//alert("LL:"+this.currentObjID+":"+l_l+":starty:"+starty+":"+parseInt(y1+(y2-y1)*(startx-x1)/(x2-x1)));
							//starty=parseInt(y1+(y2-y1)*(startx-x1)/(x2-x1));
					   }
					   else{
							l_l=(starty-y1)/(y2-y1);
							//startx=parseInt(x1+(x2-x1)*(starty-y1)/(y2-y1));
					   }

					   */

					   /*if ( l_l>0.4 && l_l<0.6){
						  newpoint(parent,(x1+x2)/2,(y1+y2)/2,newLabel(),point_id1);
						  l_l=0.5;
					   }
					   */
						this.st[id]=[startx,starty];                   
					   
						this.newPoint(id,startx,starty,label);
						this.startPoint=[startx,starty,id];
					   //添加点在线上的约束条件
						var conID="c"+this.newChildID();				   

						this.newCon(conID,"POL,"+id+","+this.currentObjID+","+l_l,"C"+this.currentObjID);
						//点在线上的被约束条件
						this.newCon("x"+this.newChildID(),conID,"X"+id);
					}  //end if this.smartTip.type
					break;
				 case "fx":
//				 	alert(e.target.id)
				   var label=this.newLabel();	  
	               var id="CP"+this.newChildID();
                   var l_l=0;
				   //parseFloat()
				   //startx=startx-$("#"+this.ID).offset().left;
				   //starty=starty-$("#"+this.ID).offset().top;
				   var x1=parseFloat($("#"+this.currentObjID).attr("x1"));
				   var x2=parseFloat($("#"+this.currentObjID).attr("x2"));
				   var y1=parseFloat($("#"+this.currentObjID).attr("y1"));
				   var y2=parseFloat($("#"+this.currentObjID).attr("y2"));
                   
				   
				   
				   this.st[id]=[startx,starty];        
/*				   if (Math.abs(x2-x1)>Math.abs(y2-y1))
				   {
					 //以x坐标为准
					 l_l=(startx-x1)/(x2-x1);
					 starty=parseInt(l_l*(y2-y1)+y1);					 					 
				   }	
				   else{
					 l_l=(starty-y1)/(y2-y1);
					 startx=parseInt(l_l*(x2-x1)+x1);					
				   }
*/
                   this.newPoint(id,startx,starty,label);
				   this.startPoint=[startx,starty,id];
                   //添加点在线上的约束条件
				   var conID="c"+this.newChildID();
				   
//						alert(startx+"  "+starty);
				   this.newCon(conID,"POF,"+id+","+this.currentObjID,"C"+this.currentObjID);
				   //点在线上的被约束条件
				   this.newCon("x"+this.newChildID(),conID,"X"+id);
				   //this.myAlert("添加被约束");
				   break;

			   default:
				   
				   var label=this.newLabel();	  
	               var id="FP"+this.newChildID();
                   this.newPoint(id,startx,starty,label);
				   this.startPoint=[startx,starty,id];
				   break;			
			}
		    

		   break;  //end case "P"
	} //end swith(this.tool)
  //}//end if (this.mouseState=="down")

   
/*
   var e=(evt)?evt:window.event;
 if (window.event) {
  e.cancelBubble=true;     // ie下阻止冒泡
 } else {
  e.preventDefault();
  e.stopPropagation();     // 其它浏览器下阻止冒泡
 }
*/
//e.preventDefault();
//e.stopPropagation();
};

var cznumber=0;
SVG.prototype.onMouseMove=function(e){  //mouse move
	cznumber=(cznumber+1)%10000;
	this.hideHint();
	
	if (this.smartTip.czObj!="") {
		//this.myAlert("czID:"+this.smartTip.czObj.id);
		/*if (this.objAttr[this.smartTip.czObj.id]==undefined)
		{
			this.smartTip.czObj.setAttributeNS(null,"stroke","black");
			this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
		}
		else{
			this.smartTip.czObj.setAttributeNS(null,"fill",this.objAttr[this.smartTip.czObj.id].stroke);
			this.smartTip.czObj.setAttributeNS(null,"stroke",this.objAttr[this.smartTip.czObj.id].fill);
			this.smartTip.czObj.setAttributeNS(null,"stroke-width",this.objAttr[this.smartTip.czObj.id].stroke_width);
			this.smartTip.czObj.setAttributeNS(null,"stroke-",this.objAttr[this.smartTip.czObj.id].stroke_width);

		}*/
		this.setObjAttr(this.smartTip.czObj.id);
		//this.smartTip.czObj.setAttribute("stroke","black");
		this.smartTip.type="";
		this.smartTip.czObj="";
	}

	var startx = e.pageX-$("#"+this.ID).offset().left;
	var starty = e.pageY-$("#"+this.ID).offset().top; 
	//this.currentObjID=e.target.id;
	//this.myAlert("x,y"+startx+","+starty);
	//this.myAlert("x,y："+this.currentObjID+":"+e.target.id);
	var overObjID_2=null;
		if (e.target.id==null)
		{
			overObjID_2="NU";
		}
		else{
			overObjID_2=e.target.id.substring(0,2);
		}
		//this.myAlert("冒泡:"+((allID2.indexOf(overObjID_2)>=0)||(allID2.indexOf((this.currentObjID).substring(0,2))>=0)));
	//(allID2.indexOf((this.currentObjID).substring(0,2))>=0)|| 
		if ((allID2.indexOf(overObjID_2)>=0)||(e.target.id==this.ID))
		{
			//this.myAlert("冒泡:"+((allID2.indexOf(overObjID_2)>=0)||(allID2.indexOf((this.currentObjID).substring(0,2))>=0)));
			e.stopPropagation();    //阻止冒泡   
			e.preventDefault();
		}
			
	if (this.mouseState=="down"){
		
		//var currentID_2=this.currentObjID.substring(0,2);
	
		
		switch (this.tool){
			case "S":   
				
				switch(this.currentObjID.substring(0,2)){
					case "CP":
						
						//break;
					case "FP":					
                    case "CP":
						/*
		                 editor:peng.zheng
		                 time:2016/1/30 
		                 content:生成提示点
                        */
						var x=startx;//-$("#"+this.ID).offset().left;
						var y=starty;//-$("#"+this.ID).offset().top;
						this.moveObject(this.currentObjID,x,y);
                        var u=this.s2u([x,y]);
				     	tipAlert(e.pageX,e.pageY-20,u[0]+","+u[1]);
						/*end*/
					break;
					case "PP":	//平移直线，暂时可以不考虑
					case "fx":	//平移函数
					var x=startx;//-$("#"+this.ID).offset().left;
					var y=starty;//-$("#"+this.ID).offset().top;
					this.moveObject(this.currentObjID,x,y);		
						break;
					case "CR"://圆
						var x=startx;//-$("#"+this.ID).offset().left;
						var y=starty;//-$("#"+this.ID).offset().top;
						this.moveObject(this.currentObjID,x,y);
						break;
				}
			   
				break;
			case "W"://自有手写
				var m=document.getElementById(this.startPoint[2]);
				var d=m.getAttribute("d")+" L"+startx+ " "+starty;
				m.setAttributeNS(null,"d",d);
				break;
			case "C":
				//this.myAlert("x,y:"+e.target.id);
				switch (overObjID_2)
				{
					case "":
						break;
					default:
						break;
				}		
				  //center_cx=select_circle.getAttribute("cx");
				   //center_cy=select_circle.getAttribute("cy");
				//var r=Math.sqrt((startx-$("#"+this.ID).offset().left-this.startPoint[0])*(startx-$("#"+this.ID).offset().left-this.startPoint[0])+(starty-$("#"+this.ID).offset().top-this.startPoint[1])*(starty-$("#"+this.ID).offset().top-this.startPoint[1]));       
				var r=Math.sqrt((startx-this.startPoint[0])*(startx-this.startPoint[0])+(starty-this.startPoint[1])*(starty-this.startPoint[1]));       
				
				$("#"+this.currentObjID).attr("r",r);
				break;//End case "C"
			case "P":			
				switch (overObjID_2)
				{
					case "FP":
					case "CP":
					   break;  //不能定于一点上
					case "PP":
					   //break;
					case "fx":
					default:
						//线
						//增加智能作图，平行、垂直、相等、切线等
						var all_line=null;
						all_line=document.getElementById(this.ID+"segment");
						if (all_line!= null){ 
							var childs=all_line.childNodes;
							var number=childs.length;
							//var mm=cznumber % (number-1)+1;
							var mm=cznumber % (number);

							//for (i=mm;i<mm+number;i++){
							//child=childs.item(((i % (number-1))+1));

							//for (var i=0;i<number;i++){
							for (i=mm;i<mm+number;i++){
								child=childs.item((i % (number)));
								var x1=parseInt(child.getAttribute("x1"));
								var y1=parseInt(child.getAttribute("y1"));
								var x2=parseInt(child.getAttribute("x2"));
								var y2=parseInt(child.getAttribute("y2"));
             
								czline_xielv=(y2-y1)/(x2-x1);   //参照直线的斜率
								newline_xielv=(starty-this.startPoint[1])/(startx-this.startPoint[0]);   //新直线的斜率
								xielv_diff=Math.abs(czline_xielv-newline_xielv);  //斜率之差
								xielv_pro=czline_xielv*newline_xielv;  //斜率之积
								//为了保证斜率为无穷大的情况
								fczline_xielv=(x2-x1)/(y2-y1);   //参照直线的斜率的倒数
								fnewline_xielv=(startx-this.startPoint[0])/(starty-this.startPoint[1]);   //新直线的斜率的倒数
								fxielv_diff=Math.abs(fczline_xielv-fnewline_xielv);  //斜率的倒数之差
								fxielv_pro=Math.abs(fczline_xielv*fnewline_xielv);  //斜率的倒数之积
               
								if (xielv_diff<0.05 || fxielv_diff<0.05){//判断平行
									//if (this.smartTip.czObj!="") this.smartTip.czObj.setAttribute("stroke","black");
									//this.smartTip.type="LLI";   //intersect
									//this.smartTip.czObj=child;
									

									var czline=child;
									czx1=parseInt(czline.getAttribute("x1"));
									czy1=parseInt(czline.getAttribute("y1"));
									czx2=parseInt(czline.getAttribute("x2"));
									czy2=parseInt(czline.getAttribute("y2"));

									var ldistance=((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1))/((starty-this.startPoint[1])*(starty-this.startPoint[1])+(startx-this.startPoint[0])*(startx-this.startPoint[0]));

									if ((allID2.indexOf(overObjID_2)<0)&&(ldistance>0.95) && (ldistance<1.10)){
									//  cztype="EPA";
										this.myAlert("overObjID_2:"+overObjID_2+":"+allID2.indexOf(overObjID_2));
										this.smartTip.type="EPA"
									//  openhint(startx+5,starty,"作平行线且相等！");
										this.getObjAttr(child.getAttribute("id"));
										child.setAttribute("stroke","blue");
										child.setAttribute("stroke-width","4");
										this.smartTip.czObj=child;
										this.showHint(startx,starty-35,"作平行线且相等");
										break;
									}
									else{
										this.smartTip.type="PARA";
										//openhint(startx+5,starty,"作平行线！");
										//while (state.startx==evt.clientX){disp("==");};
										this.getObjAttr(child.getAttribute("id"));
										child.setAttribute("stroke","blue");
										child.setAttribute("stroke-width","4");
										this.smartTip.czObj=child;
										this.showHint(startx,starty-35,"作平行线");
										break;
									}               
								}else{  //else  if (xielv_diff<0.05 || fxielv_diff<0.05){
            
									if ((-1.2<xielv_pro) && (xielv_pro<-0.85) ){//判断垂直
										//if (this.smartTip.czObj!="") this.smartTip.czObj.setAttribute("stroke","black");
										//child.setAttribute("stroke","red");
										var czline=child;
										var czx1=parseInt(czline.getAttribute("x1"));
										var czy1=parseInt(czline.getAttribute("y1"));
										var czx2=parseInt(czline.getAttribute("x2"));
										var czy2=parseInt(czline.getAttribute("y2"));
										var ldistance=((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1))/((starty-this.startPoint[1])*(starty-this.startPoint[1])+(startx-this.startPoint[0])*(startx-this.startPoint[0]));
										if ((allID2.indexOf(overObjID_2)<0)&&(ldistance>0.95) && (ldistance<1.10)){// && over_obj_id_2!="PP"){
											//  cztype="EPE";
											//  openhint(startx+5,starty,"作垂线且相等！");
											//  break;
											this.smartTip.type="EPE"
											//  openhint(startx+5,starty,"作平行线且相等！");
											this.getObjAttr(child.getAttribute("id"));
											child.setAttribute("stroke","blue");
											child.setAttribute("stroke-width","4");
											this.smartTip.czObj=child;
											this.showHint(startx,starty-35,"作垂线且相等");
											break;
										}
										else{
											//cztype="PERP";
											//openhint(startx+5,starty,"作垂线！");
											this.smartTip.type="PERP";
											this.getObjAttr(child.getAttribute("id"));
											child.setAttribute("stroke","blue");
											child.setAttribute("stroke-width","4");
											this.smartTip.czObj=child;

											//openhint(startx+5,starty,"作平行线！");
											//while (state.startx==evt.clientX){disp("==");};
											this.showHint(startx,starty-35,"作垂线");
											break;
										}

									}
									  /*else{
										if (czline!=null) czline.setAttribute("stroke","black");
										cztype="";
										czline=null;
										closehint();
										//break;
									  }  //end if (-1.2<xielv_pro && xielv_pro<-0.85 )
									*/
								}  //end if (xielv_diff<0.05 || fxielv_diff<0.05){
            
							}  //for (var i=0;i<number;i++){

						}  //if (all_line!= null)
		 
						var line=$("#"+this.ID+"initLine");
						line.attr("x1",this.startPoint[0]);
						line.attr("y1",this.startPoint[1]);
						line.attr("x2",startx);//-$("#"+this.ID).offset().left);
						line.attr("y2",starty);//-$("#"+this.ID).offset().top);
						break;			
					}		    

					break;  //end case "P"
				} //end switch (overObjID_2)
       //}
	/*   else{   //else select_node==null
	      czline=select_node[4];
          x1=parseInt(czline.getAttribute("x1"));
          y1=parseInt(czline.getAttribute("y1"));
          x2=parseInt(czline.getAttribute("x2"));
          y2=parseInt(czline.getAttribute("y2"));
             
               czline_xielv=(y2-y1)/(x2-x1);   //参照直线的斜率
               newline_xielv=(starty-this.startPoint[1])/(startx-this.startPoint[0]);   //新直线的斜率
               xielv_diff=Math.abs(czline_xielv-newline_xielv);  //斜率之差
               xielv_pro=czline_xielv*newline_xielv;  //斜率之积
               //为了保证斜率为无穷大的情况
               fczline_xielv=(x2-x1)/(y2-y1);   //参照直线的斜率的倒数
               fnewline_xielv=(startx-select_line_x1)/(starty-select_line_y1);   //新直线的斜率的倒数
               fxielv_diff=Math.abs(fczline_xielv-fnewline_xielv);  //斜率的倒数之差
               fxielv_pro=Math.abs(fczline_xielv*fnewline_xielv);  //斜率的倒数之积
               
               
			   distance=((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1))/((starty-select_line_y1)*(starty-select_line_y1)+(startx-select_line_x1)*(startx-select_line_x1));
               if (distance>0.95 && distance<1.10){   //长度相等
                  if (xielv_diff<0.05 || fxielv_diff<0.05){
				     //平行相等
					 cztype="EPA";
                     openhint(startx+5,starty,"作线段平行且相等！");
                     //break;
				  }
				  else{
				    if (-1.2<xielv_pro && xielv_pro<-0.85 ){
                      //垂直相等
                      cztype="EPE";
                      openhint(startx+5,starty,"作线段垂直且相等！");
                      //break;
				    }
					else{
					   //相等
                       cztype="ELEN";
                       openhint(startx+5,starty,"作线段相等！");
                       //break;
					}
				  }
			   }
			   else{
                 if (xielv_diff<0.05 || fxielv_diff<0.05){
				     //平行
					 cztype="PARA";
                     openhint(startx+5,starty,"作平行线段！");
                     //break;
				 }
				 else{
				    if (-1.2<xielv_pro && xielv_pro<-0.85 ){
                      //垂直
                      cztype="PERP";
                      openhint(startx+5,starty,"作垂直线段！");
                      //break;
				    }
					else{
					  cztype="";
                      czline=null;
                      closehint();
                      //break;

					}
				 }


			   }  //end if (distance>0.95 && distance<1.10)

			   
			   
			   


	   }   //end if select_node[4]==null

*/


	}//else if (this.mouseState=="down")
	else
	{
		var overObjID_2=null;
		if (e.target.id==null)
		{
			overObjID_2="NU";
		}
		else{
			overObjID_2=e.target.id.substring(0,2);
		}
	  
		switch (this.tool){
		case "S":            
			switch(overObjID_2){
				case "FP":  
				case "CP":
				case "PP":	//平移直线，暂时可以不考虑
				case "fx":	//平移函数
					//var x=startx-$("#"+this.ID).offset().left;
					//var y=starty-$("#"+this.ID).offset().top;
					//this.moveObject(this.currentObjID,x,y);
					break;
				case "CR"://圆
					//var x=startx-$("#"+this.ID).offset().left;
					//var y=starty-$("#"+this.ID).offset().top;
					//this.moveObject(this.currentObjID,x,y);
					break;
			}		   
			break;
		case "C":
			//this.myAlert("x,y:"+e.target.id);
			switch (overObjID_2)
			{
				case "":
					break;
				default:
					break;
			}
		
			  //center_cx=select_circle.getAttribute("cx");
			   //center_cy=select_circle.getAttribute("cy");
			//var r=Math.sqrt((startx-$("#"+this.ID).offset().left-this.startPoint[0])*(startx-$("#"+this.ID).offset().left-this.startPoint[0])+(starty-$("#"+this.ID).offset().top-this.startPoint[1])*(starty-$("#"+this.ID).offset().top-this.startPoint[1]));       
			//$("#"+this.currentObjID).attr("r",r);
			break;//End case "C"
		case "P":
			//alert(overObjID);
			//this.myAlert("overObjID:"+overObjID);
			switch (overObjID_2)
			{
			   case "FP":
				   break;
			   case "PP":
				   //     if (state.startx!=startx || state.starty!=starty){
					//判断是否为作中点
					var cObj=document.getElementById(e.target.id);
					var ox1=parseInt(cObj.getAttribute("x1"));
					var ox2=parseInt(cObj.getAttribute("x2"));
					var oy1=parseInt(cObj.getAttribute("y1"));
					var oy2=parseInt(cObj.getAttribute("y2"));
					var mx=(ox1+ox2)/2;
					var my=(oy1+oy2)/2;
					if ((Math.abs(mx-startx)<4)&&(Math.abs(my-starty)<4))
					{
						this.smartTip.type="MPL";   //middle point of line
						this.smartTip.czObj=cObj;
						this.showHint(startx,starty-35,"作"+getNameById(e.target.id)+"的中点");
					}
					else{
						//this.hideHint();
					}
					
		           //开始判断作两直线的交点				   
					var all_line=document.getElementById(this.ID+"segment");				   
					if (all_line!= null){ 
						var childs=all_line.childNodes;
						var number=childs.length;
						//alert("number:"+number);
						//cznumber++;
						//disp("number,cznumber:"+number+","+cznumber % (number-1));
					
						for (var i=0;i<number;i++){
						   child=childs.item(i);
								
						   if (child.getAttribute("id")!=e.target.id){
							   x1=parseInt(child.getAttribute("x1"));
							   y1=parseInt(child.getAttribute("y1"));
							   x2=parseInt(child.getAttribute("x2"));
							   y2=parseInt(child.getAttribute("y2"));
							   //点(startx,starty)到直线child的距离的平方为
							   d=((y2-y1)*startx-(x2-x1)*starty+(x2-x1)*y1-(y2-y1)*x1)*((y2-y1)*startx-(x2-x1)*starty+(x2-x1)*y1-(y2-y1)*x1)/((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
							   //alert("d:"+d);   
							   
							   if (d<4){
								 //disp("另一条直线："+printNode(child));
								 //czline=child;
								 //this.myAlert("d:"+d+":"+startx+","+starty+";"+child.getAttribute("id"));
								 this.getObjAttr(child.getAttribute("id"));
									
								 child.setAttributeNS(null,"stroke","blue");
								 child.setAttributeNS(null,"stroke-width","4");
								 //openhint(startx+5,starty,"作两直线的交点！");
								 //this.myAlert("作两直线的交点！"+e.target.id+","+child.getAttribute("id"));
								 this.showHint(startx,starty-20,"作"+getNameById(e.target.id)+"与"+getNameById(child.getAttribute("id"))+"的交点");
								 this.smartTip.type="LLI";   //intersect
								 this.smartTip.czObj=child;
								 break;
							   }
							   else{
								 /*if (this.smartTip.czObj!="") {
									 this.smartTip.czObj.setAttributeNS(null,"stroke","black");
									 this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
								
								 //czline=null;
								 //this.myAlert("No");
								
									this.smartTip.type="";
									this.smartTip.czObj="";
								 }*/
								 
								 // this.hideHint();
							   }
							}
							 
						}   //end for (i=mm;i<mm+number;i++)
						 //if (this.smartTip=="LLI")  break;
					}   //end if (all_line!= null)
            
					//判断与圆的交点
					var all_circle=null;
					all_circle=document.getElementById(this.ID+"circle");
					if (all_circle!= null){ 
						//alert("xxx");
						var childs=all_circle.childNodes;
						var number=childs.length;
						for (var i=0;i<number;i++){
							var child=childs.item(i);
							var x1=parseInt(child.getAttribute("cx"));
							var y1=parseInt(child.getAttribute("cy"));
							var r1=parseInt(child.getAttribute("r"));
							var r1=r1*r1;
							//点(startx,starty)到圆child的圆心距离的平方为
							var d=(startx-x1)*(startx-x1)+(starty-y1)*(starty-y1);                      
							if (Math.abs(d-r1)<400){				   
								//child.setAttributeNS(null,"stroke","red");	
								//child.setAttributeNS(null,"stroke-width","4");
								this.getObjAttr(child.getAttribute("id"));
									child.setAttribute("stroke","blue");
									child.setAttribute("stroke-width","4");
								this.smartTip.type="LCI";   ////line and cirlce intersect
								this.smartTip.czObj=child;
								//this.myAlert("作直线与圆的交点！");
								this.showHint(startx,starty-20,"作"+getNameById(e.target.id)+"与"+getNameById(child.getAttribute("id"))+"的交点");
								break;
							}
							else{
								/*if (this.smartTip.czObj!="") {
									this.smartTip.czObj.setAttributeNS(null,"stroke","black");	
									this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
									//this.myAlert("No");
									//this.hideHint();
									this.smartTip.type="";
									this.smartTip.czObj="";
								}*/
							}
						}//end for (var i=0;i<number;i++)
					}   //end if (all_circle!= null)





				   break;
				case "CR":
					//不用判断圆与直线的交点，应为显示直线总在圆之上
            
           //判断圆与圆的交点
		   var all_circle=null;
           all_circle=document.getElementById(this.ID+"circle");
           if (all_circle!= null){ 
			   //alert("xxx");
			   
               var childs=all_circle.childNodes;
               var number=childs.length;
			   for (var i=0;i<number;i++){
					var child=childs.item(i);
					if (child.getAttribute("id")!=e.target.id){
						                   
						var x1=parseInt(child.getAttribute("cx"));
						var y1=parseInt(child.getAttribute("cy"));
						var r1=parseInt(child.getAttribute("r"));
						var r1=r1*r1;
						//点(startx,starty)到圆child的圆心距离的平方为
						var d=(startx-x1)*(startx-x1)+(starty-y1)*(starty-y1);                      
						if (Math.abs(d-r1)<400){				   
							//child.setAttributeNS(null,"stroke","red");	
							//child.setAttributeNS(null,"stroke-width","4");
							this.getObjAttr(child.getAttribute("id"));
									child.setAttribute("stroke","blue");
									child.setAttribute("stroke-width","4");
							this.smartTip.type="CCI";   ////circle and cirlce intersect
							this.smartTip.czObj=child;
							this.myAlert("作圆与圆的交点！");
							break;
						}
						else{
							/*if (this.smartTip.czObj!="") {
								this.smartTip.czObj.setAttributeNS(null,"stroke","black");	
								this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
								this.myAlert("No");
								this.smartTip.type="";
								this.smartTip.czObj="";
							}*/
						}
					}//if (child.getAttribute("id")!=e.target.id){
				}//end for (var i=0;i<number;i++)
			}   //end if (all_circle!= null)
				   



					break;

				case "fx":
				default:
				   
				   break;			
			}
		    

		   break;  //end case "P"
	} //end swith(this.tool)
	                       
  }//end else this.mouseState=="down"
  //e.stopPropagation();    //阻止冒泡
  //e.preventDefault();


};

SVG.prototype.onMouseUp=function(e){  //mouse up
	var startx = e.pageX-$("#"+this.ID).offset().left;
	var starty = e.pageY-$("#"+this.ID).offset().top;
	//alert("mouseUP:"+this.startPoint[2]);
	//alert($("#thing")[0].innerHTML);
	var con=new Array();//约束对象id
	//this.currentObjID=e.target.id;
	
	
	if (this.mouseState=="down"){
		this.mouseState="";   //要判断up所在的对象，如果在外面就不反映？？？？？？？？？？？？？？
		//this.currentObjID="";
	
	    //var move_obj=state.current_obj;
	    //state.current_obj=null;
	    //over_obj_id=over_obj.getAttribute("id");
		/*if ((Math.abs(this.startPoint[0]-startx)<2) && (Math.abs(this.startPoint[1]-starty)<2)){
			e.stopPropagation();    //阻止冒泡
			e.preventDefault();
			return;
		}
	    */
		
		var overObjID=null;
		if (e.target.id==null){
			overObjID="NU";
		}
		else{
			overObjID=e.target.id;
		}

		if ((allID2.indexOf(overObjID.substr(0,2))>0)&& (Math.abs(this.startPoint[0]-startx)<2) && (Math.abs(this.startPoint[1]-starty)<2))
		{
			e.stopPropagation();    //阻止冒泡   
			e.preventDefault();
			return;
		}
	    
		//this.myAlert("mouseUp overObjID:"+overObjID);
		//alert("currentObj:"+this.currentObjID)
        //alert("mouseup:"+this.mouseState+"::"+this.tool);
		switch (this.tool){
			case "S": 
				switch(this.currentObjID.substring(0,2)){
					case "FP":  
					case "CP":
					
						var x=startx;//-$("#"+this.ID).offset().left;
						var y=starty;//-$("#"+this.ID).offset().top;
						this.moveObject(this.currentObjID,x,y);	
						
						//记录移动对象
						var point=this.s2u([x,y]); 
						this.action("Move~"+this.currentObjID+"~"+point[0]+"~"+point[1]);

						break;
					case "PP":	//平移直线，暂时可以不考虑
					case "fx":	//平移函数
						break;
					case "CR":
						var x=startx;//-$("#"+this.ID).offset().left;
						var y=starty;//-$("#"+this.ID).offset().top;
						this.moveObject(this.currentObjID,x,y);

						//记录改变圆的半径
						var point=this.s2u([x,y]); 
						this.action("Move~"+this.currentObjID+"~"+point[0]+"~"+point[1]);
						//var r=this.Ls2u($("#"+this.currentObjID).attr("r")); 
						//this.action("ChRadius~"+this.currentObjID+"~"+r);

						break;
					default:
						break;
					  
				}//end switch(this.currentObjID.substring(0,2)
		
		
					//新添加的，当移动一个对象结束时，向服务器发送信息
					/*var move_obj_id_2=null;    //over_obj.getAttribute("id").substring(0,2);
					var move_obj_id="";
					var select_node_id;
				
					if (move_obj != null){
					  move_obj_id=move_obj.getAttribute("id");
					  move_obj_id_2=move_obj_id.substring(0,2);
					}
					select_node_id=move_obj_id;

					switch(move_obj_id_2){
					  case "FP":  
						var mess="movepoint~"+move_obj_id+"~"+point.x+"~"+point.y;
						sendmessage(mess,"graphics");
						break;
					  case "CP":
						if (sendIf)
						{
						   var mess="movepoint~"+move_obj_id+"~"+point.x+"~"+point.y;
						   sendmessage(mess,"graphics");
						   if (modicon!=""){
							 sendmessage(modicon,"graphics");
							 //alert("发送约束条件："+modicon);
							 modicon="";
						   }
						   
								   
						}
						sendIf=true;
						break;
					  default:
						  break;
					}*/
		//			alert(overObjID)
				if(this.thingFocus==1)
				{
			//		if($("#thing")==null||$("#thing")==undefined)
					$("#thing")[0].innerHTML=overObjID;
					this.thingFocus=0;
			//		alert(1)
				}
				if(this.axisFocus==1)
				{
			//		if($("#thing")==null||$("#thing")==undefined)
			//		alert($("#thing")[0])
					$("#axis")[0].innerHTML=overObjID;
					this.axisFocus=0;
			//		alert(1)
				}

			   if(this.tempfuc[0]&&this.tempfuc[0].substring(0,2)=="fx")									//修改“this.tempfuc[0]”为空时造成的错误
			   {
				tag[this.tempfuc[0]][1]=this.tempfuc[1];	
				tag[this.tempfuc[0]][0]=this.tempfuc[2];	
				fun=this.tempfuc[1].split(",");
					var conID=$("#C"+this.tempfuc[0]).children();
					for(var i=0;i<conID.length;i++)
					{
						con[i]=conID.eq(i).text().split(",")[1];
						this.st[con[i]]=[$("#"+con[i]).attr("cx"),$("#"+con[i]).attr("cy")];
					}
				}
				break; //end case "S"
			case "W"://手写自由画
				//发送到服务器
				this.action("NW~"+this.startPoint[2]+"~"+document.getElementById(this.startPoint[2]).getAttribute("d"));

				break;//end case "W"

			case "P":  //this.tool
				if (this.smartTip.type!="")
				{
					var czx1=parseInt(this.smartTip.czObj.getAttribute("x1"));
					var czy1=parseInt(this.smartTip.czObj.getAttribute("y1"));
					var czx2=parseInt(this.smartTip.czObj.getAttribute("x2"));
					var czy2=parseInt(this.smartTip.czObj.getAttribute("y2"));
					switch (this.smartTip.type)
					{
						case "EPA"://平行相等
							var x1=this.startPoint[0];
							var y1=this.startPoint[1];
							var x2=startx;
							var y2=starty;
							var type=1;//如果参照czx1==czx2,是否需要考虑？？
							if((czx1-czx2)*(x1-x2)>=0 && (czy1-czy2)*(y1-y2)>=0){ //czx1-czx2同向x1-x2
								x2=x1-czx1+czx2;
								y2=y1-czy1+czy2;
								type=1;
							
							}
							else{
								x2=x1+czx1-czx2;
								y2=y1+czy1-czy2;
								type=-1;
							}
						
							var label=this.newLabel();	  
							var id="CP"+this.newChildID();
							this.newPoint(id,x2,y2,label);
							//alert("e.target.id:"+overObjID);
							//clone线，修改ID，添加，还原initLine，添加限制条件
							var lineID="PP"+this.newChildID();
							this.newLine(lineID,this.startPoint[0],this.startPoint[1],x2,y2);

							//var line=$("#"+this.ID+"initLine").clone();
							//line.attr("id",lineID);
							//$("#"+this.ID+"segment").append(line);
							$("#"+this.ID+"initLine").attr("x1",-1);
							$("#"+this.ID+"initLine").attr("y1",-1);
							$("#"+this.ID+"initLine").attr("x2",-1);
							$("#"+this.ID+"initLine").attr("y2",-1);
							//alert(lineID+" "+this.ID)
							//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
							var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
							var pID1="C"+this.startPoint[2];
							var selfID1="c"+this.newChildID();
							this.newCon(selfID1,con1,pID1);
							//alert("限制条件");
							//第二个点限制直线的条件,与第一条件一样
							//var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
							var pID2="C"+id;
							var selfID2="c"+this.newChildID();
							this.newCon(selfID2,con1,pID2);
							   
							//直线的被限制条件                       
							//第一个被限制条件
							var pID="X"+lineID;
							var selfID="x"+this.newChildID();
							this.newCon(selfID,selfID1,pID);
							//平行且相等的约束条件
							//限制条件
							var cId="c"+this.newChildID();
							var con="EPA,"+id+","+this.startPoint[2]+","+this.smartTip.czObj.getAttribute("id")+","+type;
							this.newCon(cId,con,"C"+this.smartTip.czObj.getAttribute("id"));
							//被限制条件
							this.newCon("x"+this.newChildID(),cId,"X"+id);
							this.newCon("x"+this.newChildID(),cId,"X"+this.startPoint[2]);
							//A点约束AB的约束条件
							var cId="c"+this.newChildID();
							//var con="EPA,"+id+","+this.startPoint[2]+","+type+","+this.smartTip.czObj.getAttribute("id");
							this.newCon(cId,con,"C"+this.startPoint[2]);
							//没必要添加被约束条件了，应为是一样的
					
							break;
						case "PARA"://平行
							switch (overObjID.substr(0,2))
							{
								case "PP":
									var x1=parseInt(this.startPoint[0]);
									var y1=parseInt(this.startPoint[1]);
									
									var x2=startx;
									var y2=starty;
									var overObj=document.getElementById(overObjID);
									var over_x1=parseInt(overObj.getAttribute("x1"));
									var over_y1=parseInt(overObj.getAttribute("y1"));
									var over_x2=parseInt(overObj.getAttribute("x2"));
									var over_y2=parseInt(overObj.getAttribute("y2"));
									
									if (czx2-czx1!=0){
										k=(czy2-czy1)/(czx2-czx1);
										if (over_x2-over_x1!=0){
											var k1=(over_y2-over_y1)/(over_x2-over_x1);
											x2=(y1-over_y1+k1*over_x1-k*x1)/(k1-k);
											y2=y1+k*(x2-x1);
										}
										else{
											x2=over_x1;
											y2=k*(x2-x1)+y1;
										}
										//select_line.setAttribute("x2",line_x2);
										//select_line.setAttribute("y2",line_y2);
										//movepoint(select_point,line_x2,line_y2);
										//alert("交点为："+line_x2+","+line_y2);
									}
									else{
										if (over_x2-over_x1!=0){
											var k1=(over_y2-over_y1)/(over_x2-over_x1);
											x2=x1;
											y2=k1*(x2-over_x1)+over_y1;
										}
									}
									/*
									var type;
									if((czx1-czx2)*(x1-x2)>=0 && (czy1-czy2)*(y1-y2)>=0){
										type=1;
									}
									else{
										type=-1;
									}
									*/
									var l_l=0;
									if (over_x2-over_x1 != 0){
										l_l=(x2-over_x1)/(over_x2-over_x1);
										//starty=parseInt(y1+(y2-y1)*(startx-x1)/(x2-x1));
									}
									else{
										l_l=(y2-over_y1)/(over_y2-over_y1);
										//startx=parseInt(x1+(x2-x1)*(starty-y1)/(y2-y1));
									}

								
									var label=this.newLabel();	  
									var id="CP"+this.newChildID();
									this.newPoint(id,x2,y2,label);
									//alert("e.target.id:"+overObjID);
									//clone线，修改ID，添加，还原initLine，添加限制条件
									var lineID="PP"+this.newChildID();
									this.newLine(lineID,this.startPoint[0],this.startPoint[1],x2,y2);

									//var line=$("#"+this.ID+"initLine").clone();
									//line.attr("id",lineID);
									$("#"+this.ID+"segment").append(line);
									$("#"+this.ID+"initLine").attr("x1",-1);
									$("#"+this.ID+"initLine").attr("y1",-1);
									$("#"+this.ID+"initLine").attr("x2",-1);
									$("#"+this.ID+"initLine").attr("y2",-1);
									//alert(lineID+" "+this.ID)
									//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
									var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
									var pID1="C"+this.startPoint[2];
									var selfID1="c"+this.newChildID();
									this.newCon(selfID1,con1,pID1);								
									//第二个点限制直线的条件,与第一条件一样
									//var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
									var pID2="C"+id;
									var selfID2="c"+this.newChildID();
									this.newCon(selfID2,con1,pID2);
									//直线的被限制条件 
									var pID="X"+lineID;
									var selfID="x"+this.newChildID();
									this.newCon(selfID,selfID1,pID);

									//点在直线上的约束条件
									selfID1="c"+this.newChildID();
									this.newCon(selfID1,"POL,"+id+","+e.target.id+","+l_l,"C"+e.target.id);
									this.newCon("x"+this.newChildID(),selfID1,"X"+id);
									
									
									//平行且相等的约束条件
									//限制条件
									var cId="c"+this.newChildID();
									var con="PAR,"+id+","+this.startPoint[2]+","+this.smartTip.czObj.getAttribute("id");//+","+type;
									this.newCon(cId,con,"C"+this.smartTip.czObj.getAttribute("id"));
									//被限制条件
									this.newCon("x"+this.newChildID(),cId,"X"+id);
									//this.newCon("x"+this.newChildID(),cId,"X"+this.startPoint[2]);
									
									var cId="c"+this.newChildID();
									//var con="EPA,"+id+","+this.startPoint[2]+","+type+","+this.smartTip.czObj.getAttribute("id");
									this.newCon(cId,con,"C"+this.startPoint[2]);
									//没必要添加被约束条件了，应为是一样的

									break;//end case "PP"
								default:
									var x1=parseInt(this.startPoint[0]);
									var y1=parseInt(this.startPoint[1]);
									var x2=startx;
									var y2=starty;
									
									//需要纠正x2,y2
									if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){
										//p_x=line_x2;
										y2=parseInt(y1+(czy2-czy1)/(czx2-czx1)*(x2-x1));
									} 
									else{
										//p_y=line_y2;
										if (Math.abs(czy2-czy1)>0)
										{
											x2=parseInt(x1+(czx2-czx1)/(czy2-czy1)*(y2-y1));
										}
										
									} 
								
									var label=this.newLabel();	  
									var id="CP"+this.newChildID();
									this.newPoint(id,x2,y2,label);
									//alert("e.target.id:"+overObjID);
									//clone线，修改ID，添加，还原initLine，添加限制条件
									var lineID="PP"+this.newChildID();
									this.newLine(lineID,this.startPoint[0],this.startPoint[1],x2,y2);

									//var line=$("#"+this.ID+"initLine").clone();
									//line.attr("id",lineID);
									//$("#"+this.ID+"segment").append(line);
									$("#"+this.ID+"initLine").attr("x1",-1);
									$("#"+this.ID+"initLine").attr("y1",-1);
									$("#"+this.ID+"initLine").attr("x2",-1);
									$("#"+this.ID+"initLine").attr("y2",-1);
									//alert(lineID+" "+this.ID)
									//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
									var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
									var pID1="C"+this.startPoint[2];
									var selfID1="c"+this.newChildID();
									this.newCon(selfID1,con1,pID1);
									//alert("限制条件");
									//第二个点限制直线的条件,与第一条件一样
									//var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
									var pID2="C"+id;
									var selfID2="c"+this.newChildID();
									this.newCon(selfID2,con1,pID2);
									   
									//直线的被限制条件									
									var pID="X"+lineID;
									var selfID="x"+this.newChildID();
									this.newCon(selfID,selfID1,pID);
									//平行约束条件
									var cId="c"+this.newChildID();
									var con="PAR,"+id+","+this.startPoint[2]+","+this.smartTip.czObj.getAttribute("id");
									this.newCon(cId,con,"C"+this.smartTip.czObj.getAttribute("id"));
									//被限制条件
									this.newCon("x"+this.newChildID(),cId,"X"+id);
									//this.newCon("x"+this.newChildID(),cId,"X"+this.startPoint[2]);

									var cId="c"+this.newChildID();
									//var con="EPA,"+id+","+this.startPoint[2]+","+type+","+this.smartTip.czObj.getAttribute("id");
									this.newCon(cId,con,"C"+this.startPoint[2]);
									//没必要添加被约束条件了，应为是一样的

									break;
							
							}//end switch (overObjID.substr(0,2))
							
							break;
						case "EPE"://垂直相等
							var x1=this.startPoint[0];
							var y1=this.startPoint[1];
							var x2=startx;
							var y2=starty;
							var type=1;

							//if ((czx2-czx1)*(line_x2-line_x1)>0 && (czy2-czy1)*(line_y2-line_y1)>0){ 
							//被移动点在参照直线的右边，（左边或是右边，如何判断）
							p1_x=czy2-czy1+x1;
							p1_y=-czx2+czx1+y1;
							p2_x=czy1-czy2+x1;
							p2_y=-czx1+czx2+y1;
							//通过检查p1和p2哪个离P2的距离近则采用哪个坐标
							if (((x2-p1_x)*(x2-p1_x)+(y2-p1_y)*(y2-p1_y))> ((x2-p2_x)*(x2-p2_x)+(y2-p2_y)*(y2-p2_y))){
								x2=p2_x;
								y2=p2_y;
							}
							else{
								x2=p1_x;
								y2=p1_y;
							}

/*
							var type=1;//如果参照czx1==czx2,是否需要考虑？？
							if((czx1-czx2)*(x1-x2)>=0 && (czy1-czy2)*(y1-y2)>=0){ //czx1-czx2同向x1-x2
								x2=x1-czx1+czx2;
								y2=y1-czy1+czy2;
								type=1;							
							}
							else{
								x2=x1+czx1-czx2;
								y2=y1+czy1-czy2;
								type=-1;
							}
						*/
							var label=this.newLabel();	  
							var id="CP"+this.newChildID();
							this.newPoint(id,x2,y2,label);
							//alert("e.target.id:"+overObjID);
							//clone线，修改ID，添加，还原initLine，添加限制条件
							var lineID="PP"+this.newChildID();
							this.newLine(lineID,this.startPoint[0],this.startPoint[1],x2,y2);

							//var line=$("#"+this.ID+"initLine").clone();
							//line.attr("id",lineID);
							//$("#"+this.ID+"segment").append(line);
							$("#"+this.ID+"initLine").attr("x1",-1);
							$("#"+this.ID+"initLine").attr("y1",-1);
							$("#"+this.ID+"initLine").attr("x2",-1);
							$("#"+this.ID+"initLine").attr("y2",-1);
							//alert(lineID+" "+this.ID)
							//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
							var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
							var pID1="C"+this.startPoint[2];
							var selfID1="c"+this.newChildID();
							this.newCon(selfID1,con1,pID1);
							//alert("限制条件");
							//第二个点限制直线的条件,与第一条件一样
							//var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
							var pID2="C"+id;
							var selfID2="c"+this.newChildID();
							this.newCon(selfID2,con1,pID2);
							   
							//直线的被限制条件                       
							//第一个被限制条件
							var pID="X"+lineID;
							var selfID="x"+this.newChildID();
							this.newCon(selfID,selfID1,pID);
							//平行且相等的约束条件
							//限制条件
							var cId="c"+this.newChildID();
							var con="EPE,"+id+","+this.startPoint[2]+","+this.smartTip.czObj.getAttribute("id")+","+type;
							this.newCon(cId,con,"C"+this.smartTip.czObj.getAttribute("id"));
							//被限制条件
							this.newCon("x"+this.newChildID(),cId,"X"+id);
							this.newCon("x"+this.newChildID(),cId,"X"+this.startPoint[2]);
							//A点约束AB的约束条件
							var cId="c"+this.newChildID();
							//var con="EPA,"+id+","+this.startPoint[2]+","+type+","+this.smartTip.czObj.getAttribute("id");
							this.newCon(cId,con,"C"+this.startPoint[2]);
							//没必要添加被约束条件了，应为是一样的
							break;
						case "PERP"://垂直	
							switch (overObjID.substr(0,2))
							{
								case "PP":
									var x1=parseInt(this.startPoint[0]);
									var y1=parseInt(this.startPoint[1]);
									
									var x2=startx;
									var y2=starty;
									var overObj=document.getElementById(overObjID);
									var over_x1=parseInt(overObj.getAttribute("x1"));
									var over_y1=parseInt(overObj.getAttribute("y1"));
									var over_x2=parseInt(overObj.getAttribute("x2"));
									var over_y2=parseInt(overObj.getAttribute("y2"));
									
									if (czy2-czy1!=0){
										var k=-(czx2-czx1)/(czy2-czy1);
										if (over_x2-over_x1!=0){
											k1=(over_y2-over_y1)/(over_x2-over_x1);
											x2=(y1-over_y1+k1*over_x1-k*x1)/(k1-k);
											y2=y1+k*(x2-x1);
										}
										else{
											x2=over_x1;
											y2=k*(x2-x1)+y1;
										}
										
									}
									else{
										if (over_x2-over_x1!=0){
											k1=(over_y2-over_y1)/(over_x2-over_x1);
											x2=x1;
											y2=k1*(x2-over_x1)+over_y1;
										}
									}
									

									var l_l=0;
									if (over_x2-over_x1 != 0){
										l_l=(x2-over_x1)/(over_x2-over_x1);
										//starty=parseInt(y1+(y2-y1)*(startx-x1)/(x2-x1));
									}
									else{
										l_l=(y2-over_y1)/(over_y2-over_y1);
										//startx=parseInt(x1+(x2-x1)*(starty-y1)/(y2-y1));
									}

								
									var label=this.newLabel();	  
									var id="CP"+this.newChildID();
									this.newPoint(id,x2,y2,label);
									//alert("e.target.id:"+overObjID);
									//clone线，修改ID，添加，还原initLine，添加限制条件
									var lineID="PP"+this.newChildID();
									this.newLine(lineID,this.startPoint[0],this.startPoint[1],x2,y2);

									//var line=$("#"+this.ID+"initLine").clone();
									//line.attr("id",lineID);
									$("#"+this.ID+"segment").append(line);
									$("#"+this.ID+"initLine").attr("x1",-1);
									$("#"+this.ID+"initLine").attr("y1",-1);
									$("#"+this.ID+"initLine").attr("x2",-1);
									$("#"+this.ID+"initLine").attr("y2",-1);
									//alert(lineID+" "+this.ID)
									//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
									var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
									var pID1="C"+this.startPoint[2];
									var selfID1="c"+this.newChildID();
									this.newCon(selfID1,con1,pID1);								
									//第二个点限制直线的条件,与第一条件一样
									//var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
									var pID2="C"+id;
									var selfID2="c"+this.newChildID();
									this.newCon(selfID2,con1,pID2);
									//直线的被限制条件 
									var pID="X"+lineID;
									var selfID="x"+this.newChildID();
									this.newCon(selfID,selfID1,pID);

									//点在直线上的约束条件
									selfID1="c"+this.newChildID();
									this.newCon(selfID1,"POL,"+id+","+e.target.id+","+l_l,"C"+e.target.id);
									this.newCon("x"+this.newChildID(),selfID1,"X"+id);
									
									
									//垂直的约束条件
									//限制条件
									var cId="c"+this.newChildID();
									var con="PER,"+id+","+this.startPoint[2]+","+this.smartTip.czObj.getAttribute("id");//+","+type;
									this.newCon(cId,con,"C"+this.smartTip.czObj.getAttribute("id"));
									//被限制条件
									this.newCon("x"+this.newChildID(),cId,"X"+id);
									//this.newCon("x"+this.newChildID(),cId,"X"+this.startPoint[2]);
									
									var cId="c"+this.newChildID();
									//var con="EPA,"+id+","+this.startPoint[2]+","+type+","+this.smartTip.czObj.getAttribute("id");
									this.newCon(cId,con,"C"+this.startPoint[2]);
									//没必要添加被约束条件了，应为是一样的

									break;//end case "PP"
								default:
									var x1=parseInt(this.startPoint[0]);
									var y1=parseInt(this.startPoint[1]);
									var x2=startx;
									var y2=starty;
									//需要纠正x2,y2
									//if (czy2-czy1!=0){
									if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){
										x2=parseInt(x1-(czy2-czy1)/(czx2-czx1)*(y2-y1));
										
									} 
									else{
										y2=parseInt(y1-(czx2-czx1)/(czy2-czy1)*(x2-x1));
										
									} 
									
								
									var label=this.newLabel();	  
									var id="CP"+this.newChildID();
									this.newPoint(id,x2,y2,label);
									//alert("e.target.id:"+overObjID);
									//clone线，修改ID，添加，还原initLine，添加限制条件
									var lineID="PP"+this.newChildID();
									this.newLine(lineID,this.startPoint[0],this.startPoint[1],x2,y2);

									//var line=$("#"+this.ID+"initLine").clone();
									//line.attr("id",lineID);
									//$("#"+this.ID+"segment").append(line);
									$("#"+this.ID+"initLine").attr("x1",-1);
									$("#"+this.ID+"initLine").attr("y1",-1);
									$("#"+this.ID+"initLine").attr("x2",-1);
									$("#"+this.ID+"initLine").attr("y2",-1);
									//alert(lineID+" "+this.ID)
									//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
									var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
									var pID1="C"+this.startPoint[2];
									var selfID1="c"+this.newChildID();
									this.newCon(selfID1,con1,pID1);
									//alert("限制条件");
									//第二个点限制直线的条件,与第一条件一样
									//var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
									var pID2="C"+id;
									var selfID2="c"+this.newChildID();
									this.newCon(selfID2,con1,pID2);
									   
									//直线的被限制条件									
									var pID="X"+lineID;
									var selfID="x"+this.newChildID();
									this.newCon(selfID,selfID1,pID);
									//平行约束条件
									var cId="c"+this.newChildID();
									var con="PER,"+id+","+this.startPoint[2]+","+this.smartTip.czObj.getAttribute("id");
									this.newCon(cId,con,"C"+this.smartTip.czObj.getAttribute("id"));
									//被限制条件
									this.newCon("x"+this.newChildID(),cId,"X"+id);
									//this.newCon("x"+this.newChildID(),cId,"X"+this.startPoint[2]);

									var cId="c"+this.newChildID();
									//var con="EPA,"+id+","+this.startPoint[2]+","+type+","+this.smartTip.czObj.getAttribute("id");
									this.newCon(cId,con,"C"+this.startPoint[2]);
									//没必要添加被约束条件了，应为是一样的

									break;
							
							}//end switch (overObjID.substr(0,2))
							
						
							break;
						default:
							break;
					}//end switch (this.smartTip.type)
					
						

				}
				else{  //this.smartTip.czType!=""
					switch (overObjID.substring(0,2)){
						case "FP":
						case "CP":
							startx=startx;//-$("#"+this.ID).offset().left;
							starty=starty;//-$("#"+this.ID).offset().top;
							if (Math.abs(this.startPoint[0]-startx)>4 || Math.abs(this.startPoint[1]-starty)>4)
							{					   
								//$("#"+this.ID+"initLine").attr("x2",$("#"+e.target.id).attr("cx"));
							   //$("#"+this.ID+"initLine").attr("y2",$("#"+e.target.id).attr("cy"));
							   startx=$("#"+e.target.id).attr("cx");//纠正在点上的偏离,是否直接取overOjb
							   starty=$("#"+e.target.id).attr("cy");
							   //alert("e.target.id:"+overObjID);
							   //clone线，修改ID，添加，还原initLine，添加限制条件
							   var lineID="PP"+this.newChildID();
							   /*var line=$("#"+this.ID+"initLine").clone();
							   line.attr("id",lineID);
							   $("#"+this.ID+"segment").append(line);*/
							   this.newLine(lineID,this.startPoint[0],this.startPoint[1],startx,starty);

							   $("#"+this.ID+"initLine").attr("x1",-1);
							   $("#"+this.ID+"initLine").attr("y1",-1);
							   $("#"+this.ID+"initLine").attr("x2",-1);
							   $("#"+this.ID+"initLine").attr("y2",-1);	
							   var selfID=""+this.newChildID();
							   this.newCon("c"+this.newChildID(),"LPP,"+lineID+","+this.startPoint[2]+","+e.target.id,"C"+this.startPoint[2]);
							   //this.newCon("C"+e.target.id,selfID,"LPP,"+lineID+","+this.startPoint[2]+","+e.target.id);
							   this.newCon(selfID,"LPP,"+lineID+","+this.startPoint[2]+","+e.target.id,"C"+e.target.id);
							   this.newCon("x"+this.newChildID(),selfID,"X"+lineID);
							   
							}
							break;
						case "CR"://点在圆上
							
							break;
						case "PP":
							   //alert("PP");
								   
							//startx=startx;//-$("#"+this.ID).offset().left;
							//starty=starty;//-$("#"+this.ID).offset().top;
							if (Math.abs(this.startPoint[0]-startx)>4 || Math.abs(this.startPoint[1]-starty)>4)
							{
								//alert("PP mouse UP");
								var label=this.newLabel();	  
								var id="CP"+this.newChildID();
								var l_l=0;
								var x1=parseFloat($("#"+e.target.id).attr("x1"));
								var x2=parseFloat($("#"+e.target.id).attr("x2"));
								var y1=parseFloat($("#"+e.target.id).attr("y1"));
								var y2=parseFloat($("#"+e.target.id).attr("y2"));
								
								if (x2-x1 != 0){
									l_l=(startx-x1)/(x2-x1);
									//starty=parseInt(y1+(y2-y1)*(startx-x1)/(x2-x1));
								}
								else{
									l_l=(starty-y1)/(y2-y1);
									//startx=parseInt(x1+(x2-x1)*(starty-y1)/(y2-y1));
								}

							   /*if ( l_l>0.4 && l_l<0.6){
								  newpoint(parent,(x1+x2)/2,(y1+y2)/2,newLabel(),point_id1);
								  l_l=0.5;
							   }
							   */
							   //this.myAlert("l_l:"+startx+":"+x2+":"+x1+":"+e.target.id);
							   this.newPoint(id,startx,starty,label);
							   //增加点在线上的约束条件和被约束条件
							   var selfID1="c"+this.newChildID();
							   this.newCon(selfID1,"POL,"+id+","+e.target.id+","+l_l,"C"+e.target.id);
							   this.newCon("x"+this.newChildID(),selfID1,"X"+id);
							   //clone线，修改ID，添加，还原initLine，添加限制条件
							   var lineID="PP"+this.newChildID();
							   this.newLine(lineID,this.startPoint[0],this.startPoint[1],startx,starty);

							   //var line=$("#"+this.ID+"initLine").clone();
							   //line.attr("id",lineID);
							   //line.attr("x2",startx);
							   //line.attr("y2",starty);
							   //$("#"+this.ID+"segment").append(line);

							   $("#"+this.ID+"initLine").attr("x1",-1);
							   $("#"+this.ID+"initLine").attr("y1",-1);
							   $("#"+this.ID+"initLine").attr("x2",-1);
							   $("#"+this.ID+"initLine").attr("y2",-1);
							   //第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
							   var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
							   var pID1="C"+this.startPoint[2];
								   selfID1="c"+this.newChildID();
							   this.newCon(selfID1,con1,pID1);
							   //alert("限制条件");
							   //第二个点限制直线的条件,与第一条件一样
							   //var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
							   var pID2="C"+id;
							   var selfID2="c"+this.newChildID();
							   this.newCon(selfID2,con1,pID2);
							   
							   //直线的被限制条件                       
							   //第一个被限制条件
							   var pID="X"+lineID;
							   var selfID="x"+this.newChildID();
							   this.newCon(selfID,selfID1,pID);
							   //第二个被限制条件,与第一限制条件一样，不用添加了
							   /*selfID="x"+this.newChildID();
							   this.newCon(selfID2,pID,selfID);
							   */
						}
					   
							break;
						case "fx":
	//						alert(e.target.id)
							//startx=startx-$("#"+this.ID).offset().left;
							//starty=starty-$("#"+this.ID).offset().top;
							if (Math.abs(this.startPoint[0]-startx)>2 || Math.abs(this.startPoint[1]-starty)>2)
							{
							   //alert("PP mouse UP");
							   var label=this.newLabel();	  
							   var id="CP"+this.newChildID();
							   var l_l=0;
							   this.newPoint(id,startx,starty,label);
							   //增加点在线上的约束条件和被约束条件
							   this.st[id]=[startx,starty];
							   var selfID1="c"+this.newChildID();
							   this.newCon(selfID1,"POF,"+id+","+e.target.id,"C"+e.target.id);
							   this.newCon("x"+this.newChildID(),selfID1,"X"+id);
							   //clone线，修改ID，添加，还原initLine，添加限制条件
							   var lineID="PP"+this.newChildID();
							   var line=$("#"+this.ID+"initLine").clone();
							   line.attr("id",lineID);
							   line.attr("x2",startx);
							   line.attr("y2",starty);

							   $("#"+this.ID+"segment").append(line);
							   $("#"+this.ID+"initLine").attr("x1",-1);
							   $("#"+this.ID+"initLine").attr("y1",-1);
							   $("#"+this.ID+"initLine").attr("x2",-1);
							   $("#"+this.ID+"initLine").attr("y2",-1);
							   //第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
							   var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
							   var pID1="C"+this.startPoint[2];
								   selfID1="c"+this.newChildID();
							   this.newCon(selfID1,con1,pID1);
							   //alert("限制条件");
							   //第二个点限制直线的条件,与第一条件一样
							   //var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
							   var pID2="C"+id;
							   var selfID2="c"+this.newChildID();
							   this.newCon(selfID2,con1,pID2);
							   
							   //直线的被限制条件                       
							   //第一个被限制条件
							   var pID="X"+lineID;
							   var selfID="x"+this.newChildID();
							   this.newCon(selfID,selfID1,pID);
		//                       alert(1)
							}
							break;
						default:
							//自由点
							//alert("default");
							////startx=startx-$("#"+this.ID).offset().left;
							//starty=starty-$("#"+this.ID).offset().top;
							if (Math.abs(this.startPoint[0]-startx)>4 || Math.abs(this.startPoint[1]-starty)>4)
							{
								var label=this.newLabel();	  
								var id="FP"+this.newChildID();
								this.newPoint(id,startx,starty,label);
								//alert("e.target.id:"+overObjID);
								//clone线，修改ID，添加，还原initLine，添加限制条件
								var lineID="PP"+this.newChildID();
								this.newLine(lineID,this.startPoint[0],this.startPoint[1],startx,starty);

								//var line=$("#"+this.ID+"initLine").clone();
								//line.attr("id",lineID);
								$("#"+this.ID+"segment").append(line);
								$("#"+this.ID+"initLine").attr("x1",-1);
								$("#"+this.ID+"initLine").attr("y1",-1);
								$("#"+this.ID+"initLine").attr("x2",-1);
								$("#"+this.ID+"initLine").attr("y2",-1);
								//alert(lineID+" "+this.ID)
								//第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
								   var con1="LPP,"+lineID+","+this.startPoint[2]+","+id;//直线ID,第一点，第二点
								   var pID1="C"+this.startPoint[2];
								   var selfID1="c"+this.newChildID();
								   this.newCon(selfID1,con1,pID1);
								   //alert("限制条件");
								   //第二个点限制直线的条件,与第一条件一样
								   //var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
								   var pID2="C"+id;
								   var selfID2="c"+this.newChildID();
								   this.newCon(selfID2,con1,pID2);
								   
								   //直线的被限制条件                       
								   //第一个被限制条件
								   var pID="X"+lineID;
								   var selfID="x"+this.newChildID();
								   this.newCon(selfID,selfID1,pID);
								   //第二个被限制条件,与第一限制条件一样，不用添加了
								   /*selfID="x"+this.newChildID();
								   this.newCon(selfID2,pID,selfID);
								   */
							}
							break;
					}  //end of switch overObjID.substring(0,2)
				}//end this.smartTip.czType!=""
				break;

			case "C":
				//alert("mouse UP C");
				switch (overObjID.substring(0,2)){
					case "FP":
					case "CP":						
						over_x=$("#"+overObjID).attr("cx");
						over_y=$("#"+overObjID).attr("cy");
						 $("#"+this.currentObjID).attr("r",Math.sqrt((this.startPoint[0]-over_x)*(this.startPoint[0]-over_x)+(this.startPoint[1]-over_y)*(this.startPoint[1]-over_y)));
						
						 con_id="C"+this.newChildID();
						 this.newCon(con_id,"CPP,"+this.currentObjID+","+this.startPoint[2]+","+this.startPoint[2]+","+overObjID,"C"+overObjID);   //约束条件
						 this.newCon("C"+this.newChildID(),"CPP,"+this.currentObjID+","+this.startPoint[2]+","+this.startPoint[2]+","+overObjID,"C"+this.startPoint[2]);   //约束条件
					
						 this.newCon("X"+this.newChildID(),con_id,"X"+this.currentObjID);       //被约束条件
						break;

					default:
						//alert("mouse up default");
						con_id="C"+this.newChildID();
						//newconstraint("CPR,"+circle_id+","+center_id,"X"+center_id,con_id);   //约束条件
						this.newCon(con_id,"CPR,"+this.currentObjID+","+this.startPoint[2],"C"+this.startPoint[2]);   //约束条件
						this.newCon("X"+this.newChildID(),con_id,"X"+this.currentObjID);      //被约束条件

						break;
				}  //switch (over_obj_id.substring(0,2))

				//发送到服务器
				//var newcircle=svgDocument.getElementById(select_node[2]);
				//var mess = "newcircle~"+select_node[2]+"~"+newcircle.getAttribute("cx")+"~"+ newcircle.getAttribute("cy")+"~"+newcircle.getAttribute("r");
				//sendmessage(mess,"graphics");   //格式newcircle~ID~cx~cy~r
				var point1=this.s2u([$("#"+this.currentObjID).attr("cx"),$("#"+this.currentObjID).attr("cy")]);
				var r1=this.Ls2u($("#"+this.currentObjID).attr("r"));
				//alert("s2u:"+$("#"+this.currentObjID).attr("r")+"::"+r1);
				this.action("NC~"+this.currentObjID+"~"+point1[0]+"~"+point1[1]+"~"+r1);
			
				break;//end case "C"

			default:
				
				break;
			
		} //end swith(this.tool)
		
		this.startPoint=[-1,-1,null];
		this.currentObjID=null;

			//break;
	
	}//end if (this.mouseState=="down")
	
	//e.stopPropagation();    //阻止冒泡  
	

};






SVG.prototype.onMouseOver=function(e){  //mouse over	
	//this.myAlert("Over:"+(this.objAttr[e.target.id]==undefined));
	//alert("this.objAttr[e.target.id]:"+this.objAttr[e.target.id]);
	/*
		    editor:peng.zheng
		    time:2016/1/30 
		    content:隐藏提示点
    */
	$(".dcg-tracept").hide();
	/*end*/
	switch (e.target.id.substring(0,2))
	{
	   case "BF":
	   case "BC"://带大背景的点
				var pID=e.target.id.substring(1);
				if (!this.isInSelected(pID))
				{			
					this.getObjAttr(pID);
					var pNode=document.getElementById(pID);
					pNode.setAttributeNS(null,"r","4");
					pNode.setAttributeNS(null,"fill","red");
					pNode.setAttributeNS(null,"stroke","red");
				}
				
		   break;
	   case "FP":
	   case "CP":
			/*if (this.objAttr[e.target.id]==undefined)
			{
				this.objAttrInit(e.target.id);
			}
		   //alert("this.objAttr[e.target.id]:"+this.objAttr[e.target.id]);
			this.objAttr[e.target.id].stroke=e.target.getAttribute("stroke");
			this.objAttr[e.target.id].fill=e.target.getAttribute("fill");
			this.objAttr[e.target.id].stroke_width=e.target.getAttribute("stroke-width");
			*/
			if (!this.isInSelected(e.target.id))
			{			
				this.getObjAttr(e.target.id);
				e.target.setAttributeNS(null,"r","4");
				e.target.setAttributeNS(null,"fill","red");
				e.target.setAttributeNS(null,"stroke","red");
			}
		   /*
		    editor:peng.zheng
		    time:2016/1/30 
		    content:生成提示点
		   */
	       var x = e.pageX-$("#"+this.ID).offset().left;
           var y = e.pageY-$("#"+this.ID).offset().top; 
		   var u=this.s2u([x,y]);
		   tipAlert(e.pageX,e.pageY-20,u[0]+","+u[1]);
		   /*end*/
//		   alert(1);
		   break;
	   case "PP":
	   case "fx":
		   //alert("mouseover");
			/*if (this.objAttr[e.target.id]==undefined)
			{
				this.objAttrInit(e.target.id);
			}
			this.objAttr[e.target.id].stroke=e.target.getAttribute("stroke");
			//this.myAlert("stroke:"+e.target.getAttribute("stroke"));
			this.objAttr[e.target.id].fill=e.target.getAttribute("fill");
			this.objAttr[e.target.id].stroke_width=e.target.getAttribute("stroke-width");*/
			if (!this.isInSelected(e.target.id))
			{
				this.getObjAttr(e.target.id);
				e.target.setAttributeNS(null,"stroke-width","4");
				e.target.setAttributeNS(null,"stroke","red");
			}
		   //$("#"+e.target.id).removeClass("seg");
		   //$("#"+e.target.id).addClass("seghover");
		  break;
	   case "CR":
			/*if (this.objAttr[e.target.id]==undefined)
			{
				this.objAttrInit(e.target.id);
			}
		   this.objAttr[e.target.id].stroke=e.target.getAttribute("stroke");
			this.objAttr[e.target.id].fill=e.target.getAttribute("fill");
			this.objAttr[e.target.id].stroke_width=e.target.getAttribute("stroke-width");*/
			if (!this.isInSelected(e.target.id))
			{
				this.getObjAttr(e.target.id);
				e.target.setAttributeNS(null,"stroke-width","4");
				e.target.setAttributeNS(null,"stroke","red");
			}
		   break;
	   default:
		   break;
	
	}
	e.preventDefault();
	e.stopPropagation();    //阻止冒泡
};

SVG.prototype.onMouseOut=function(e){  //mouse out
	if (this.smartTip.czObj!="") {
			var czObjId=this.smartTip.czObj.getAttribute("id");
			/*if (this.objAttr[czObjId]==undefined)
			{
				this.smartTip.czObj.setAttributeNS(null,"stroke","black");
			    this.smartTip.czObj.setAttributeNS(null,"stroke-width","2");
			}
			else{
				this.smartTip.czObj.setAttributeNS(null,"fill",this.objAttr[czObjId].stroke);
				this.smartTip.czObj.setAttributeNS(null,"stroke",this.objAttr[czObjId].fill);
				this.smartTip.czObj.setAttributeNS(null,"stroke-width",this.objAttr[czObjId].stroke_width);
			}*/
			this.setObjAttr(czObjId);
							 //czline=null;
			//this.myAlert("No");
			this.smartTip.type="";
			this.smartTip.czObj="";
	}
	switch (e.target.id.substring(0,2))
	{
		case "BF":
		case "BC"://带大背景的点
				var pID=e.target.id.substring(1);
				if (!this.isInSelected(pID))
				{			
					this.setObjAttr(pID);
					var pNode=document.getElementById(pID);
					pNode.setAttributeNS(null,"r","2");
					//pNode.setAttributeNS(null,"fill","red");
					//pNode.setAttributeNS(null,"stroke","red");
				}
				
			break;
		
		case "FP":
		case "CP":
		   
		/*	//e.target.setAttributeNS(null,"stroke-width",this.objAttr[e.target.id].stroke_width);
			e.target.setAttributeNS(null,"fill",this.objAttr[e.target.id].stroke);
			e.target.setAttributeNS(null,"stroke",this.objAttr[e.target.id].fill);
			e.target.setAttributeNS(null,"stroke-width",this.objAttr[e.target.id].stroke_width);
		*/
			if (!this.isInSelected(e.target.id))
			{
				this.setObjAttr(e.target.id);
				e.target.setAttributeNS(null,"r","2");
			}
		   break;
	 case "PP":
     case "fx":  
	 case "CR":
		    //e.target.setAttributeNS(null,"stroke-width",this.objAttr[e.target.id].stroke_width);
			//e.target.setAttributeNS(null,"fill",this.objAttr[e.target.id].fill);
			//e.target.setAttributeNS(null,"stroke",this.objAttr[e.target.id].stroke);
			if (!this.isInSelected(e.target.id))
			{
				this.setObjAttr(e.target.id);
				e.target.setAttributeNS(null,"stroke-width","2");
			}
		   //e.target.setAttributeNS(null,"stroke","black");
	       break;
	   default:
		   break;
	
	}
	e.preventDefault();
	e.stopPropagation();    //阻止冒泡

};

SVG.prototype.reSize=function(){  //resize
	//alert("resize");
	//tResize++;
	//$("#mytish").html(tResize);
	//alert("this.parent:"+$("#"+this.root.parentNode.getAttribute("id")).height());
	//alert("this.parent:"+this.width+"::"+this.root.parentNode.clientWidth);
	/*
		  editor:peng.zheng
		  time:2016/1/30 
		  content:重新对工具栏定位
		  
    */
	if(this.editable){
	   $("#"+this.ID+"Tool").css({left:"50px",top:"20px"})	
	}
	/*end*/
	this.reDraw();

};

SVG.prototype.reDraw=function(){  //重绘
	//alert("重绘");
	this.setSize();
	this.drawGrid(this.grid);
	this.drawXY(this.xy);      //网格
	this.drawLabel(this.label);   //坐标轴刻度
    
    this.delGraph();
    this.processAct(this.actA);
	//alert("this.actA:"+this.actA);

};

SVG.prototype.delGraph=function(){//删除图形
	/*var ch=$("#"+this.ID+"con").children().length;
	for (var i=ch-1;i>=0;i--){  
       $("#"+this.ID+"grid").children(i).remove();        
    }*/
	$("#"+this.ID+"con").children().remove();
	$("#"+this.ID+"pen").children().remove();
	$("#"+this.ID+"point").children().remove();
	$("#"+this.ID+"circle").children().remove();
	$("#"+this.ID+"segment").children().remove();
	$("#"+this.ID+"angle").children().remove();

	$("#"+this.ID+"fx").children().remove();//函数

}
SVG.prototype.processAct=function(actA){  //处理acta指令
	/*action
     坐标均用用户坐标
     新生成点："NP~"+startx+"~"+starty+"~"+label+"~"+id_point 
		 id_point 新生产点的ID
		 label   点的名称
     生成新的约束条件："newCon~"+cont"~"+id+"~"+id1);
		 id 为约束ID；
		 id1 为约束条件节点本身的id
	 */
	//alert("processAct");
	//首先删除，然后初始化，再处理指令
    //alert("actA:"+this.actA[0]+":"+this.actA[1]+":"+this.actA[2]);
	//for (var i=0;i<this.actA.length ;i++ )
	for (var i=0;i<actA.length ;i++ )
	{
		//alert("i,actA:"+i+"::"+this.actA[i]);
		//var comm=this.actA[i].split("~");
		var comm=actA[i].split("~");
		//alert("redraw:"+comm);
		switch ($.trim(comm[0]))
		{
		    case "ChC"://changeColor
				this.changeColor(comm[1],comm[2],false);
				break;
			case "ChD"://changeDash
				this.changeDash(comm[1],comm[2],false);
				break;
			case "ChV"://changevisible
				this.changeVisible(comm[1],comm[2],false);
				break;
			case "NP"://new Point			    
				var point=this.u2s([parseFloat(comm[2]),parseFloat(comm[3])]);
				//alert("typeof:"+(comm[1])+":"+comm[2]+":"+point[0]+":"+point[1]);
			    this.newPoint(comm[1],point[0],point[1],comm[4],false);
				break;
			case "NL"://new Line
			    var p1=this.u2s([parseFloat(comm[2]),parseFloat(comm[3])]);
                var p2=this.u2s([parseFloat(comm[4]),parseFloat(comm[5])]);
				//alert("p1,p2:"+p1+","+p2);
                this.newLine(comm[1],p1[0],p1[1],p2[0],p2[1],false);
				break;
			case "NC"://new Circle
				var p1=this.u2s([parseFloat(comm[2]),parseFloat(comm[3])]);
				var r=this.Lu2s(parseFloat(comm[4]));
				//alert("redraw:"+comm[4]);
				this.newCircle(comm[1],p1[0],p1[1],r,false);
				break;
			case "NA"://new angle
				this.newAngle(comm[1],comm[2],comm[3],comm[4],false);
				break;
			case "NM"://new message
				this.newMessure(comm[1],comm[2],comm[3],false);
			case "ChRadius": //改变圆的半径
				
				break;
			case "newCon": //new constraint
			    //alert("processAct:"+comm);
                this.newCon(comm[1],comm[2],comm[3],false);
				break;
			case "Move":				
				var point=this.u2s([comm[2],comm[3]]);
			    this.moveObject(comm[1],point[0],point[1]);
				break;
			case "NF": //fx函数
			    //NF~ID,type,f(x),minX,maxX,points,id,min_type,max_type,stroke1,strokewidth1,strokedash1,pg
			    //alert("NF:"+this.actA[i]);
				var m=comm[1].split(",");
				for (var j=0;j<m.length ;j++ )
				{
					if (m[j]=="null")
					{
						m[j]=null;
					}
				}
				if (m[3]!=null)
				{
					m[3]=parseFloat(m[3]);
					m[4]=parseFloat(m[4]);
				}
				//alert("NF:"+m.length+":"+m);
				//this.plot(m[0],"y=f(x)","x",-5,5,null,null,null,"black",2,null,1,false);
                this.plot(m[0],m[1],m[2],m[3],m[4],m[5],m[6],m[7],m[8],m[9],m[10],1,false);
				//下面这种方式也是可行的哈
				//eval("this.plot(\"fx0001\",\"y=f(x)\",\"sin(x)\",-5,5,null,null,null,\"black\",2,null,1,false);");
				
				break;
			case "addVar":
				//addVar=function(id,varName,min,max,step,val,t){
				//父元素ID，变量名，最小值，最大值，步长，默认值
				var m=comm[1].split(",");
				
				/*if (m[3]!=null)
				{
					m[3]=parseFloat(m[3]);
					m[4]=parseFloat(m[4]);
				}*/
				//alert("变量名："+typeof(m[1]));
                this.addVar(m[0],m[1],parseFloat(m[2]),parseFloat(m[3]),parseFloat(m[4]),parseFloat(m[5]),false);
				break;
			default:
				//alert("default:"+comm[0]);
				break;
		
		}
	}

    //var n="newCon('xxx','lll','yyy')"
	//eval("this."+n);

};
/*
SVG.prototype.mousewheelEvent=function(e,delta){  //wheel
	
	$("#mytishi").html("wheel"+e+"::"+delta);

};
*/

SVG.prototype.handleMouseWheel=function(evt) {
	//alert("wheel:"+evt.wheelDelta);
    evt.preventDefault();
	if(!enableZoom)
		return;

	if(evt.preventDefault)
		evt.preventDefault();

	evt.returnValue = false;

	var svgDoc = evt.target.ownerDocument;

	var delta;

	if(evt.wheelDelta)
		delta = evt.wheelDelta / 3600; // IE,opera,Chrome/Safari
	else
		delta = evt.detail / -90; // Firefox,Mozilla

	var z = 1 + delta; // Zoom factor: 0.9/1.1

	var g = getRoot(svgDoc);
	
	var p = getEventPoint(evt);

	p = p.matrixTransform(g.getCTM().inverse());

	// Compute new scale matrix in current mouse position
	var k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

        setCTM(g, g.getCTM().multiply(k));

	if(typeof(stateTf) == "undefined")
		stateTf = g.getCTM().inverse();

	stateTf = stateTf.multiply(k.inverse());
}

/*
左边函数结构
<div id="FUN"+this.ID+id>  <!--pID=this.ID+id,函数图像ID为"fun"+pID-->
	<span id="EX"+pID>  <!--函数表达式-->
	</span>
	<span id="TIP"+pID>  <!--信息提示-->
	</span>
    <span id="ADD"+pID>  <!--添加变量提示-->
	</span>
	<button id="addVar"+pID>   <!--添加变量按钮-->
	</button>
	<div>
		<span id="VAR"+变量名+pID><!--变量值-->
		</span>
		<button id="Atuo"+变量名+pID> <!--自动运行-->
		</button>
		<input id="Slider"+变量名+pID> <!--slider-->
		</input>
	</div>
</div>




*/

//在交互区添加一行
//var testm=0;
SVG.prototype.addRow=function(id){
	//alert("add");
	var othis=this;
	var ID=id;
	if (ID==undefined)
	{
       ID=this.newChildID();
	}
	
	var lp=$("<div id="+"FUN"+ID+"></div>");
	
	var n=$("<span id="+"EX"+ID+"></span>");
	//n.html("").css("font-size","24px").mathquill('editable').mathquill('write', "");
	n.mathquill('editable');
	n.addClass('col-xs-12');
	n.bind("keyup", function(e) {//keyup DOMNodeInserted DOMNodeRemoved ，DOMNodeInserted,DOMCharacterDataModified
         //alert(n.mathquill('latex'));
		//othis.myAlert('element:'+ID+":"+this.childNodes.length);
		var ltxStr=n.mathquill('latex');
		//alert("ltxStr");
		var iString=analyticMainProcess(ltxStr);
		//var iString=processedX(this);//刘东明程序,第一个符号为负号处理有问题，-号在中间也有问题，是否是全角的
		//var iString=n.mathquill('latex');
		//alert("iString:"+iString);
		//iString="-x - a";
		//alert(iString);
		 //var iString=iString.replace(/−/g,'-');//小心：前后两个减号不一样哈
		var st=mathConvert(iString);
		//othis.myAlert("iString:"+(iString=="-x-a")+"|st:"+st);
		var def="",undef="";
		//var iString="";
		//alert("st:"+st);
		var result=othis.checkExp(st[0],def,undef);
		othis.myAlert("ex:"+result[0]+"|"+result[1]+"|"+result[2]+"|"+result[3]);
		//result[1]=st[0];
		//alert("test:"+othis.checkExp("-x+1",def,undef));
		result[2]=filterRepeatStr(result[2]);
		result[3]=filterRepeatStr(result[3]);
        
		//testm++;
		othis.myAlert("st[0]:"+st[0]+":result:"+result[0]+"|"+result[1]+"|"+result[2]+"|"+result[3]);
		//是否正确|数学表达式或错误提示|已定义变量|未定义变量
		if (result[0]) //表达式正确
		{
			   //this.myAlert("表达式正确");
			   /*if (result[1]=="1-x")
			   {
				   alert("Right");
			   }
			   else{
				   alert("Wrong:"+"1-x"+":"+result[1]);
			   }*/
			   $("#"+"TIP"+ID).html("");   
			   if (result[3]!=null && result[3]!="") //未定义变量
			   {					 
				   othis.addVarTip(ID,iString,result[3],result[1]); 
				   
			   }
			   else{
				  //alert("oninput:"+result[1]);
				  //如果原来有了变量增加提示符，则删除掉
				  $("#"+"ADD"+ID).html("");

				  if(iString.indexOf(",")>=0)//参数形式
				   {
					 // function(id,type,fun,x_min,x_max,points,min_type,max_type,stroke1,strokewidth1,strokedash1,pg,t) 
					  othis.plot("fx"+ID,"x=f(t)",result[1],-5,5,null,null,null,"black",2,null,"T",1);
				   }
				  else if(iString.indexOf("x=")>=0)//x=f(y)形式
				   {
						  othis.plot("fx"+ID,"x=f(y)",result[1],-5,5,null,null,null,"black",2,null,"T",1);
				   }
				  else if(iString.indexOf("r=")>=0)//极坐标形式
						  othis.plot("fx"+ID,"r=f(t)",result[1],-5,5,null,null,null,"black",2,null,"T",1);
				  else								//y=f(x)形式
					 // othis.plot("fx"+ID,"y=f(x)",result[1],-5,5,null,"fx"+ID,null,null,"black",2,null,1);
					//othis.plot("fx"+ID,"y=f(x)","1- x",-5,5,null,"fx"+ID,null,null,"black",2,null,1);
						  othis.plot("fx"+ID,"y=f(x)",result[1],-10,10,null,null,null,"black",2,null,1,"T",1);
				     //已定义变量的约束条件result[2]
		
				  //svgBox.goBack("fx"+id);
				  if (result[2]!=null && result[2]!="")
				  {
					  //alert("result[2]:"+result[2]);
					  var m=result[2].split("");
					  for (var i=0;i<m.length;i++)
					  {						  
						  if ($("#var"+othis.ID+m[i]).length>0)  //约束条件
						  {
							//alert("var m[i]:");
							var conYN=false;//是否有这个约束条件
							for (var j=0;j<$("#var"+othis.ID+m[i]).children().length;j++ )
							{
							   var con=($("#var"+othis.ID+m[i]).children().eq(j).text()).split(",");
							   //alert(con[1]+"=="+"fx"+id);
							   if (con[1]=="fx"+ID)
							   {
								   conYN=true;
								   break;
							   }					   
							}
							if (!conYN)
							{
								//添加约束条件，还应该检查被约束条件，看原来使用这个变量而现在没使用了，那就应该删除
								//alert("需要添加"+i+"::"+m[i]+"::"+ID);
								var conID=othis.newChildID();
								//svgBox.newCon("var,fx"+id,"var"+m[i],"c"+conID);
								//svgBox.newCon(conID,"fx"+id,"x"+conID);
								othis.newCon("c"+conID,"var,fx"+ID,"var"+othis.ID+m[i]);
								othis.newCon("x"+conID,"c"+conID,"Xfx"+ID);
							}
						  }
						  else{
							  //没有找到约束变量，也需要增加
						}
					  }// end for
					  
				   }//if (result[2]!=null && result[2]!="")
			   }
		   }
		   else{
			  $("#"+"TIP"+ID).html(result[1]);
		   }//if (result[0])
	
	});
	var tip=$("<span id="+"TIP"+ID+"></span>");
	var br=$("<br></br>");
	var varTip=$("<span id="+"ADD"+ID+"></span>");
	lp.append(n,tip,br,varTip);
	
	/*
		  editor:peng.zheng
		  time:2016/1/30 
		  content:生成左边一行菜单
    */
	//几个有些混乱
	var neww = $("<div class='exp-con'></div>");  
	$(lp).appendTo(neww);
	var l =  $("#"+this.ID+"I>li").length+1;
	var newt = $("<li><div class='num'>"+l+"</div></li>");               
	$(neww).appendTo(newt);
	var leftdata =  '<div class="dropdown icon-list">'+
	                 '<button class="btn btn-default dropdown-toggle" type="button"  aria-expanded="true"><span class="caret"></span></button>'+
                     '<ul class="dropdown-menu" id="'+'M'+ID+'">'+
                       '<li><i title="删除" class="fa fa-times"></i></li>'+
					   '<li role="separator" class="divider"></li>'+
					   '<li title="是否隐藏" class="line_open_close"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></li>'+
					   '<li role="separator" class="divider"></li>'+
                       '<li><i title="改变颜色" class="fa fa-color color-000000"></i></li>'+
					   '<li role="separator" class="divider"></li>'+
                       '<li><i title="虚线实线" class="dcg-graph-icon dcg-graph-normal"></i></li>'+
					 '</ul>'+
                    '</div>'	
	$(newt).append(leftdata);
	$("#"+this.ID+"I").append(newt);
	
	//$("<li id="+ID+"><div class=\"input-append\"><input class=\"span2\"  type=\"text\" ><div class=\"btn-group\"><a class=\"btn btn-primary\" href=\"#\" onclick=\"\"><i class=\"icon-remove icon-white\"></i></a><a class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\"><span class=\"caret\"></span></a><ul class=\"dropdown-menu\"><li><a href=\"#\"><i class=\"icon-pencil\"></i> Edit</a></li><li><a href=\"#\"><i class=\"icon-trash\"></i> Delete</a></li><li><a href=\"#\"><i class=\"icon-ban-circle\"></i> Ban</a></li><li class=\"divider\"></li><li><a href=\"#\"><i class=\"i\"></i> Make admin</a></li></ul></div></div><div id="+ID+"ADD"+ ">what</div></li>");	
	//$("#"+this.ID+"I").append($x);

		//$("#"+othis.ID+"math").html("test").mathquill('editable').mathquill('write', "eeee");
		//$("#"+ID+"math").html("test").css("font-size","24px").mathquill('editable').mathquill('write', "");

}

//增加变量提示消息
SVG.prototype.addVarTip=function(id,iString,mm,fun){
//function addVarTip(id,mm,fun){
	//alert("addVarTip:"+id+mm+fun);
	var othis=this;
	var m=(mm.split("")).join(",");
	//m=m.join(",");
	//$("#"+id+"ADD").html("增加变量"+m+",<button id=\"addVar\" class=\"ui-button-primary\" onclick=\"addVars('"+id+"',\""+mm+"\",\""+fun+"\");\">添加</button>");
    $("#"+"ADD"+id).html("增加变量"+m+",<button id="+"addVar"+id+" class=\"ui-button-primary\">添加</button>");

	$("#addVar"+id).click(function(){
		$("#"+"ADD"+id).html("");
	    var varm=mm.split("");
		
	    for (var i=0;i<varm.length ;i++ )
	    {
		   //alert("i:"+i);
           othis.addVar(id+varm[i],varm[i],-5,5,0.01,1);
	    }
		//alert("add");
		//othis.myAlert("fun:"+fun);
		if(iString.indexOf(",")>=0)//参数形式
		{
					 // function(id,type,fun,x_min,x_max,points,min_type,max_type,stroke1,strokewidth1,strokedash1,pg,t) 
			othis.plot("fx"+id,"x=f(t)",fun,-5,5,null,null,null,"black",2,null,1);
		}
		else if(iString.indexOf("x=")>=0)//x=f(y)形式
		{
			othis.plot("fx"+id,"x=f(y)",fun,-5,5,null,null,null,"black",2,null,1);
		}
		else if(iString.indexOf("r=")>=0)//极坐标形式
				othis.plot("fx"+id,"r=f(t)",fun,-5,5,null,null,null,"black",2,null,1);
			else								//y=f(x)形式
				othis.plot("fx"+id,"y=f(x)",fun,-10,10,null,null,null,"black",2,null,1);
					//	  othis.plot("fx"+id,"y=f(x)",result[1],null,null,null,null,null,"black",2,null,1);
				     //已定义变量的约束条件result[2]
		//othis.plot("fx"+id,"y=f(x)",fun,-5,5,null,null,null,"black",2,null,1);
	});
}

SVG.prototype.addVar=function(id,varName,min,max,step,val,t){
    //父元素id+变量名，变量名，最小值，最大值，步长，默认值
	if (typeof t == "undefined")
	{
	     this.action("addVar~"+id+","+varName+","+min+","+max+","+step+","+val);
		 //alert("action:"+varName);
	}
	if ($("#VAR"+id).length>0)
	{
		return;    //阻止刷新时的重画
	}
	
	var othis=this;
	this.varA[varName]={"val":val,"min":min,"max":max,"step":step,"times":50,"direction":1,"handle":null};
	var $pDiv=$("<div></div>");
	$var=$("<div class=\"unSelected\">变量"+varName+"的值:<span id=\"VAR"+id+"\" style=\"border: 0; color: #f6931f; font-weight: bold;\">1</span></div>");
	
    //this.changeVar(varName,val); //初始化   
	//自动播放
	$autoPlay=$(" <button id=Auto"+id+" type=\"button\" class=\"btn btn-xs btn-primary glyphicon glyphicon-play\" aria-label=\"Play\">"
				
				+"</button>");
	$autoPlay.bind("click",function(e){
		
		//+       "<span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span>"
		var $span=$("#Auto"+id);//.find("span").get(0);//this.children("span").get(0);
		if ($span.hasClass("glyphicon-play"))
		{
			$span.removeClass("glyphicon-play");
			$span.addClass("glyphicon-stop");
			/*var K=new Array();
			//var dict = {"Jeremy" : 20,"Jimmy" : 30};  
			K["a"]={"val":10,"min":1,"max:":100,"step":0.01,"times":100,"handle":null};
			//K["a"]["step"]=200;
			K["a"].step=200;
			alert(K["a"].step+"::"+K["a"]["step"]);
            */
			//var val=othis.varA[varName].val;
			othis.varA[varName].handle=setInterval(function(){
				
				othis.varA[varName].val=othis.varA[varName].val+othis.varA[varName].direction*othis.varA[varName].step;
				if (othis.varA[varName].val>=othis.varA[varName].max)
				{
					othis.varA[varName].direction=-1;
					//othis.varA[varName].val-=othis.varA[varName].step;	
					//alert("变-1");
				}
				else{
					if (othis.varA[varName].val<othis.varA[varName].min)
					{
						othis.varA[varName].direction=1;
					//	alert("变+1");
					//	othis.varA[varName].val+=othis.varA[varName].step;	
					}
				}
						
							
				
				$("#Slider"+id).val(othis.varA[varName].val);
				$("#Slider"+id).trigger("input");
				//$("#VAR"+id+varName).html(othis.varA[varName].val);
                //othis.changeVar(varName,othis.varA[varName].val)
				

			},othis.varA[varName].times);

		}
		else{
			$span.removeClass("glyphicon-stop");
			$span.addClass("glyphicon-play");
			clearInterval(othis.varA[varName].handle);
		}
		
		//if($("#b").hasClass("a")){
        //  alert("包含class a");


	});
		//<button id="autoplay" class="ui-button-primary">自动播放</button>
	/*$("#autoplay").on("click",function(event){//外部元素测试
				var count=1;
//				alert($("#leftTool").children("li").length);
//				alert($("#leftTool").children("li").eq(0)[0].id);
					var str=$("#leftTool").children("li").eq(0)[0].id;
         		svgBox.timer[str]=setInterval(function (){count=auto(str,count);},100);
	 });
	*/
	//拖动条
	$input=$("<input>",{
		id:"Slider"+id,
		type:'range',
		val:val,
		min:min,
		max:max,
		step:step
		/*oninput:function(e) {
           //alert("change"+this.value);
		   $("#VAR"+id+varName).html(this.value);
		}*/
	});

	$input.bind('input propertychange', function(e) {//input   'input propertychange' DOMNodeInserted DOMNodeRemoved
           //alert("change"+this.value);
		   $("#VAR"+id).html(this.value);
		   othis.changeVar(varName,this.value);
	});
	
	var pID=id.substring(0,id.length-1);
	$pDiv.append($var,$autoPlay,$input);
	if (othis.editable)
	{
		$("#"+"FUN"+pID).append($pDiv);
	}
	else{
		$("#"+othis.ID+"HTML").append($pDiv);
	}
	
	
//SVG.prototype.newCon=function(id1,cont,id,t){  //约束条件 id为约束对象ID,id1为<constraint>的id,便于被约束条件调用
	 if (typeof t == "undefined")
	{
	     var conID=this.newChildID();
	 //svgBox.newCon("var,fx"+id,"var"+varName,"c"+conID);
	 //svgBox.newCon(conID,"fx"+id,"x"+conID);
		this.newCon("c"+conID,"var,fx"+pID,"var"+this.ID+varName);
		this.newCon("x"+conID,"c"+conID,"Xfx"+pID);
	}
}


//添加变量拖动条
SVG.prototype.addVarX=function(id,varName,min,max,step,val){
//function addVar(id,varName,min,max,step,val){ //父元素ID，变量名，最小值，最大值，步长，默认值
      
   /*var $x= $("<li><div class=\"span3\">  <div>变量"+varName+"的值:<span id=\"val"+varName+"\" style=\"border: 0; color: #f6931f; font-weight: bold;\">1</span></div><div id=\"slider"+varName+"\"></div> </div></li>");
  // style =\"top:300px;left:200px;\"
   */
  
   alert("xxxx");
   var $x=$("<li><div>变量"+varName+"的值:<span id=\"VAR"+id+varName+"\" style=\"border: 0; color: #f6931f; font-weight: bold;\">1</span></div><div id=\""+"Slider"+id+varName+"\"></div></li><br/>");
   $("#"+"FUN"+id).append($x);   

   

   //alert($("#slider"+varName));
  
   $("#Slider"+id+varName).slider({
    //$("#sliderm").slider({
		 value:val,      
		 min: min,      
		 max: max,      
		 step: step,      
		 slide: function( event, ui ) {
			 $("#VAR"+id+varName).html(ui.value);	 
			 
			 //moveCircle(ui.value);
			 //svgBox.drawXY(true);
	//		  svgBox.changeVar(varName,ui.value);
			this.changeVar(varName,ui.value); 
			alert();
			//testK(varName,ui.value);
		 }
	 }); 
     this.changeVar(varName,val); //初始化
	 //添加约束与被约束条件
	 //alert("约束变量ID:"+id);
	 //id=mySVG1001,加"fx"
	 //SVG.prototype.newCon=function(cont,id,id1){  //约束条件 id为约束对象ID,id1为<constraint>的id,便于被约束条件调用
	 var conID=this.newChildID();
	 //svgBox.newCon("var,fx"+id,"var"+varName,"c"+conID);
	 //svgBox.newCon(conID,"fx"+id,"x"+conID);
	this.newCon("c"+conID,"var,fx"+id,"var"+varName);
	this.newCon("x"+conID,"c"+conID,"Xfx"+id);
    
    //克隆的情况
	/*var haha=$("#h-slider").clone();
	haha.attr("id","slidertest");
	$("#leftTool").append(haha); 

	$("#slidertest").slider({
    //$("#sliderm").slider({
		 value:val,      
		 min: min,      
		 max: max,      
		 step: step,      
		 slide: function( event, ui ) {

			 //$("#val"+varName).html(ui.value);			 
			 
			 //moveCircle(ui.value);
			 //svgBox.drawXY(true);
			  svgBox.changeVar(varName,ui.value);
			//testK(varName,ui.value);
		 }
	 }); 
     */


   

   //$("#val"+varName).val($( "#slider"+varName ).slider( "value" ));
   /*
   $("#drag"+varName).draggable({ 
	   //helper: "clone",
	   //addClass: false,
	   cursor: "crosshair",//move,"arrow", 
	   cursorAt: { top:20, left:20 },
	   stop: function(event, ui) { 
		   alert("ui.position.top,left:"+ui.position.top+","+ui.position.left);
		   //alert("slider drag:"+ui.helper.contex);
		   //alert("ui:"+ui+"::this:"+this); 
		   alert("ui.position.offset.top:"+ui.offset.top);
	   }

	 });
  */
}



/*SVG.prototype.addVar=function(varName,sliderID){
	//varNmae 变量名，sliderID html中slider的ID；
			
	//}	
};*/

SVG.prototype.changeVar=function(varName,varValue){
	//varNmae 变量名，varValue 变量值；
	this.varA[varName].val=parseFloat(varValue);
	//检查变量的约束条件
	//
	this.myAlert("变量名和值:"+varName+"="+this.varA[varName].val);
	/*
	this.moveObject("FPmySVG1001",varValue*this.xyUnit+this.origin[0],-varValue*this.xyUnit+this.origin[1]);
	testVar=varValue;
	delFun("svgBoxx");
	this.plot("y=f(x)","x^2+testVar",-8,8,null,"svgBoxx",null,null,"black",2,null,1);
    */
    
	//alert("#var"+this.ID+varName);
	if ($("#var"+this.ID+varName).length>0)  //约束条件
	{
            //alert("hereID:"+hereID);
			for (var i=0;i<$("#var"+this.ID+varName).children().length;i++ )
            {
               var con=($("#var"+this.ID+varName).children().eq(i).text()).split(",");
			   //alert("hereID,con:"+varName+"::"+con);
			   //moveList.push(con[1]);
			   //funSrc
			   switch (con[0])
			   {
				   case "var"://函数
					   var fnode=document.getElementById(con[1]);
                       var funSrc=fnode.getAttribute("funSrc");
					   //alert("fnode,funSrc:"+fnode+"::"+funSrc);
                       if (funSrc!=null && funSrc!=undefined)
                       {
						   var para=funSrc.split(",");
					       //funSrc=type+","+fun+","+x_min+","+x_max+","+points+","+min_type+","+max_type+","+stroke1+","+strokewidth1+","+strokedash1;
                           //         0       1        2        3         4          4            6              7          8                  9
					       //plot=function(id,type,fun,x_min,x_max,points,min_type,max_type,stroke1,strokewidth1,strokedash1,visible,pg)
					       if (para[2]!=null && para[2]!="null")
					       {
							   para[2]=parseFloat(para[2]);
							   para[3]=parseFloat(para[3]);							   
					       }
						   else{
							   para[2]=null;
							   para[3]=null;
						   }
						   //this.myAlert("fun:"+para[1]+"val:"+this.varA[varName]);
						   this.plot(con[1],para[0],para[1],para[2],para[3],null,para[4],para[5],para[7],para[8],para[9],para[10],false);
//								tag[con[1]][0]=$("#expression").innerHTML;
//									alert(con[1])
//								this.plot(tag[con[1]][0],tag[con[1]][1],-5,5,null,con[1],null,null,"black",2,null,1);
		               }
					   
				       //var src=$("#"+con[1]).attr("funSrc"); jquery好像有点问题
				       //alert("src:"+con[1]+":"+funSrc+""+$("#"+con[1]).attr("stroke"));

					   break;  //endcase "var"
					case "varP":
						//varP,pointID,xExpress,Yexpress
						//movePoint=function(ID,x,y)
						var A=new Array();
						for (var key in this.varA)
						{
							  A[key]=this.varA[key].val;
						}
						//eval("f = function(t){ with(Math) return "+this.mathjs(con[2])+" }");
						//eval("g = function(t){ with(Math) return "+this.mathjs(con[3])+" }");
						//var ta="2+3+sin(1)";
						//alert("eval:"+eval("with(Math){"+ta+"}") );
						var Pxy=this.u2s([eval("with(Math){"+con[2]+"}"),eval("with(Math){"+con[3]+"}")]);
						this.moveObject(con[1],Pxy[0],Pxy[1]);
						//this.movePoint(con[1],Pxy[0],Pxy[1]);
						break;//endcase "varP"
					default:
						break;
			   }
			}
	}

};


//过滤重复变量
function filterRepeatStr(str){ 
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

////////////////////////////////////递归处理数学解析式（刘东明）2015年1月24日///////////////////////////////////////////////

//使用递归处理Latex格式所用的函数，只是处理标签添加的符号不同，因此下面的代码可以不用研究
//比如对于分数，1/sinA，Latex格式为{/}frac{1}{sinA}，数学解析式为1/(sinA)，但是分子分母的获取方式是一样的，
//例如处理class为numerator的span标签，获取分子时,Latex格式添加{}，数学解析式添加()

function processedX(elem){                                        //elem为处理的根节点
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
                   t+='^'+processedX(e);                         //递归调用processedX(e)函数。
              else
                t+='^('+processedX(e)+')';                       //递归调用processedX(e)函数。
            }else
            if(e.className=="nthroot non-leaf"){                 //处理n次根号中的上标    
                t+='['+processedX(e)+']';                        //递归调用processedX(e)函数。获取根号的次数
            }else
            if(e.className=="non-leaf limit"){                  //处理积分 ∫ 中的上标 
            if(e.childNodes.length==1)                           //只有一个变量，去掉括号
                 t+='^'+processedX(e);     
              else 
                 t+='^('+processedX(e)+')';                      //递归调用processedX(e)函数。获取上标内容
            }
        break;

        case 'SUB':
            if(e.className=="non-leaf"){                        //处理简单下标, 或积分 ∮ 中的下标
              if(e.childNodes.length==1)                        //只有一个变量，去掉括号
                t+='_'+processedX(e);   
                else
                t+='_('+processedX(e)+')';                        //递归调用processedX(e)函数。
            }else
            if(e.className=="non-leaf limit"){                   //处理积分 ∫ 中的下标
              if(e.childNodes.length==1)                         //只有一个变量，去掉括号
                t+='_'+processedX(e);   
                else       
                 t+='_('+processedX(e)+')';                       //递归调用processedX(e)函数。获取上标内容
            }         
        break;

        case 'SPAN':
             t+=spanProcX(e);                                    //span部分比较多，单独作为一个函数    
        break;
      }

    }//for

    return t;
}//function

//span元素处理函数
//当只有一个变量时，为了简洁美观，要去掉()，现在只考虑一个变量的情况
//未将sin,cos,tan,cot,sec,csc,arctan,arcsin,log,ln等看成一个整体。以及f(x),f(tan(A+3B)),60°,x^2等。
function  spanProcX(spn){
   var m="";
   switch(spn.className){ 
               
               case "scaled paren":                                 //处理括号，()，{}
                     m+=spn.innerHTML.toString();  
               break;
               case "non-leaf":                                     //处理2次根式下面的内容 ，
                    if(spn.firstChild.className=="scaled sqrt-prefix"&&spn.firstChild.nodeName=="SPAN"){
                        if(spn.childNodes.length==1)                //只有一个变量，去掉括号
                             m+=processedX(spn);    
                         else
                            m+=processedX(spn);              //递归调用processedX(e)函数。获取2次根式根号下的内容
                    }else
                    if(spn.firstChild.className=="scaled paren"&&spn.firstChild.nodeName=="SPAN"){    //处理圆括号()，{}里面的内容 ，
                       m+=processedX(spn); 
                    }else
                    if(spn.firstChild.className==""){               //处理含有的变量
                       m+=processedX(spn); 
                    }
 
               break;
               case "scaled":                                       //处理n次根式下面的内容 
                     m+=processedX(spn);                             //递归调用processedX(e)函数。获取n次根式根号下的内容
 
               break;
               case "scaled sqrt-prefix":
               case "sqrt-prefix scaled":                           //2次根式，n次根式的 √
                     m+=spn.innerHTML.toString();                   //不做任何操作
  
               break;
               case "non-leaf sqrt-stem":                           //2次根式下面的内容 ，
                       if(spn.childNodes.length==1)                 //只有一个变量，去掉括号
                             m+=processedX(spn);    
                         else               
                     m+='('+processedX(spn)+')';                      //递归调用processedX(e)函数。获取2次根式，n次根式根号下的内容
 
               break;
               case "sqrt-stem non-leaf":                            //n次根式下面的内容 ，
                       if(spn.childNodes.length==1)                  //只有一个变量，去掉括号
                             m+=processedX(spn);    
                         else               
                         m+='('+processedX(spn)+')';                  //递归调用processedX(e)函数。获取2次根式，n次根式根号下的内容

               break;
               case "non-leaf overline":                             //字符上线，
                        if(spn.childNodes.length==1)                 //只有一个变量，去掉括号
                             m+='~'+processedX(spn);                  //字符上线的解析式格式不知怎样输出，暂时将其定义为'~'
                         else              
                     m+='~('+processedX(spn)+')';                     //递归调用processedX(e)函数。获取字符上线下的内容
               break;

               case "fraction non-leaf":                             //处理分数部分
                     m+=processedX(spn);                              //获取分数内部的部分，分子，分母
  
               break;
               case "numerator":                                     //处理分数的分子
                       if(spn.childNodes.length==1)                  //只有一个变量，去掉括号
                             m+=processedX(spn)+'/';    
                         else                     
                    m+='('+processedX(spn)+')'+'/';                   //递归调用processedX(e)函数。获取分子内容
               break;
               case "denominator":                                   //处理分数的分母
                       if(spn.childNodes.length==1)                  //只有一个变量，去掉括号
                             m+=processedX(spn);    
                         else                 
                         m+='('+processedX(spn)+')';                  //递归调用processedX(e)函数。获取分母内容       
               break;
              
               case "binary-operator":    
                     if (spn.innerHTML.toString()!="·")
                     {
						m+=spn.innerHTML.toString();  
                     }                                                //二元操作符 +，-，X等，最后需要在结果字符串中进行替换。
                                        //现在直接获取其内容，输出即可。
					//m+=spn.innerHTML; 
			   break;

               case "unary-operator":                          //二元操作符 
                                                                //符号 +，-，X等，最后需要在结果字符串中进行替换。
                     m+=spn.innerHTML.toString();               //现在直接获取其内容，输出即可。
					 //m+=spn.innerHTML;  
			   break;

               case "textarea":                                      //root根节点插入的编辑区
                     m+="";                                          //不做任何操作
               break;
               case "":    
                    if(spn.innerHTML.toString()!="&nbsp;"){//没有任何class，  数字，从键盘输入的字母，或者log
                       if(spn.innerHTML.toString()==="/"){//除号
                        m+="/";
                        //alert(spn.innerHTML.toString());
                       }else{
                         m+=spn.innerHTML.toString();                    //直接获取其内容，输出即可。除掉空格
                       }
                       
                    }           
                     
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




SVG.prototype.addMouseEvent=function(){  //添加事件
   var othis=this;
   $("#"+this.ID).click(function(e){
	   //alert("othis,this:"+othis+"::"+this);
	   othis.onMouseClick(e);
   });

   $("#"+this.ID).dblclick(function(e){
	   //alert("othis,this:"+othis+"::"+this);
	   othis.onMouseDblclick(e);
   });


   $("#"+this.ID).mouseup(function(e){
	   othis.onMouseUp(e);
   });

   $("#"+this.ID).mousedown(function(e){
	   othis.onMouseDown(e);
   });

   $("#"+this.ID).mouseover(function(e){
	   othis.onMouseOver(e);
   });

   $("#"+this.ID).mouseout(function(e){
	   othis.onMouseOut(e);
   });

   $("#"+this.ID).mousemove(function(e){
	   othis.onMouseMove(e);
   });


   othis.addLeftEvent();//左边事件

   //alert("工具栏:"+"#"+this.ID+"Tool .btn"+"::"+$("#"+this.ID+"Tool .btn").length);
   $("#"+this.ID+"Tool .btn").click(function(){   //工具栏
                 /*$(this).button('loading').delay(1000).queue(function() {
                     $(this).button('reset');
                 });  */
		 var choice=$(this).data("tool");
		 othis.tool=choice;
		 switch (choice)
		 {
			case "S":	//选择	
			/*	for (var i in othis.selectedObj){
					othis.setObjAttr(othis.selectedObj[i].id);
				}
			 othis.selectedObj.length=0;  //清空selectedObj数组*/
			 othis.initDropDownMenu();
			 break;
		   case "P":   //画点，线
			 break;
			case "C"://画圆
				break;
		   case "T":
			 break;
		   case "W":   //只有画
			break;
		   case "G":
			 break;
		   default:
			 break;
		}
		//alert("choice:"+choice);
	});

	//左边编辑框
	$("#"+this.ID+"Edit").on('click', function () {//编辑按钮
		var $btn = $(this).button('loading')
		// business logic...
		//interArea.attr('id',this.ID+"I");
		//var $x=$("<li id="+id+"><div class=\"input-append\"><input class=\"span2\"  type=\"text\" oninput=\"onInput(this.parentNode.parentNode.id);\"><div class=\"btn-group\"><a class=\"btn btn-primary\" href=\"#\" onclick=\"removeRow(this.parentNode.parentNode.parentNode.id);\"><i class=\"icon-remove icon-white\"></i></a><a class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\"><span class=\"caret\"></span></a><ul class=\"dropdown-menu\"><li><a href=\"#\"><i class=\"icon-pencil\"></i> Edit</a></li><li><a href=\"#\"><i class=\"icon-trash\"></i> Delete</a></li><li><a href=\"#\"><i class=\"icon-ban-circle\"></i> Ban</a></li><li class=\"divider\"></li><li><a href=\"#\"><i class=\"i\"></i> Make admin</a></li></ul></div></div><div id="+id+"ADD"+ ">what</div></li>");	
		
		
		if ($("#"+othis.ID+"addRow").length > 0)
		{
			//存在了就让其可见
			$("#"+othis.ID+"addRow").show();

		}
		else{//没有就添加哈
			//var m=$("<button id="+othis.ID+"addRow"+" type=\"button\" class=\"btn btn-primary\" onclick=\"test(this);\">添加一行</button>");
			
			//$("#"+othis.ID+"I").after(m);
			
			/*$("#"+othis.ID+"addRow").on("click",function(){//=\"this.addRow()\"
				alert("tttt");
			})；*/
		}

		$(".unEdit").removeClass().addClass("edit").attr("contentEditable","true");
		
		$btn.button('reset')
	});

	$("#"+this.ID+"Complete").on('click', function () {//完成按钮
		var $btn = $(this).button('loading')
		$("#"+othis.ID+"addRow").hide();

		
		$btn.button('reset');
		$(".edit").removeClass().addClass("unEdit").attr("contentEditable","false");
	});
	/*
		  editor:peng.zheng
		  time:2016/1/30 
		  content:添加一行按钮
    */
    othis.addRow();
	
	/*end*/
	$("#"+this.ID+"addRow").on('click', function () {//添加一行按钮
	
	   othis.addRow();
	});

	/*$("#"+othis.ID+"F .btn").click(function(){   //工具栏
                
		 var choice=$(this).data("tool");
		 othis.tool=choice;
		 switch (choice)
		 {
		   case "S":		     
			 break;
		   case "P":
			 break;
		   case "T":
			 break;
		   case "G":
			 break;
		   default:
			 break;
		}
	});*/




   /*$(window).resize(function() {
      othis.reSize();
   });*/
   //窗口放大缩小
   
   var resize = $(window).jqElemResize();  
   //resize.$self.on("resize", function (size)或  
   $(resize).on("resize", function(size) {  
      othis.reSize();   
   });  

   //鼠标在SVG上滚动
   /*
   if (document.attachEvent) {
    document.attachEvent("onmousewheel", function(e) {
        document.mousewheelEvent(e, e.wheelDelta);
    });
   }
   else if (document.addEventListener) {
        document.addEventListener("DOMMouseScroll", function(e) {
        document.mousewheelEvent(e, e.detail * -40);
    }, false);
   }
   */

   /*
    if (document.addEventListener)
	{
		  document.getElementById(this.ID).addEventListener('DOMMouseScroll', othis.handleMouseWheel, false);
	}//W3C
	document.getElementById(this.ID).onmousewheel=othis.handleMouseWheel;//IE/Opera/Chrome
    */
	/*
	  editor:peng.zheng
	  time:2016/1/30 
	  content:获得工具栏的宽度
	*/
    var toolWidth = parseInt($("#"+this.ID+"Tool").width());
	/*end*/
	$("#"+this.ID+"T").on('touchstart.drag.founder mousedown.drag.founder', function(e) { 
		 //alert("on drag");
                var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,  
				    that = $(this).parent(),
                    startPos = that.position(),  
                    disX = ev.pageX - startPos.left,  
                    disY = ev.pageY - startPos.top;
                $(document).on('touchmove.drag.founder mousemove.drag.founder', function(e) {  
                    var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,  
                        $this = that,   
                        left = ev.pageX - disX,  
                        top = ev.pageY - disY,  
						$parent = $this.parent(),
                        r = $parent.width() - $this.outerWidth(true),  
                        d = $parent.height() - $this.outerHeight(true);  
                        console.log(r-left);
						if(left < 5 || $parent.width()-left < toolWidth){
						    $this.find("button").addClass("vertical"); 
						}else{
							$this.find("button").removeClass("vertical");
						}
						
                    left = left < 0 ? 0 : left > r ? r : left;  
                    top = top < 0 ? 0 : top > d ? d : top;  
  
                    $this.css({left:left,top:top});   
					//alert("move");
                    e.preventDefault();  
                });  
  
                $(document).on('touchend.drag.founder mouseup.drag.founder', function(e) {  
                    var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;  
                    $(document).off('.drag.founder');  
                });  
              
                e.preventDefault();  
            });  
	      $("#svgdrag").click(function(e){
			  var y = parseInt($(this).parent().css("top"));
			  var w = parseInt($(this).parents(".obj").css("height"))/2 ;
			  if(y > w){
				 $(this).addClass("dropup"); 
			  }else{
				 $(this).removeClass("dropup");  
			  }
			  
		  })



};



SVG.prototype.newPoint=function(id_point,startx,starty,label,t){//t 决定是否更新指令数组
    
    //发送到服务器
     //sendmessage("newpoint~"+startx+"~"+starty+"~"+label+"~"+id_point,"graphics");
     //alert("$(this.ID).css(top):"+$("#"+this.ID).offset().left);
	 //alert("newPoint caller:"+arguments.callee.caller);
	 //alert("newPoint:"+arguments.callee.toString().substr(9).match(/[^/s/(]+/)[0]);
	 // alert("newPoint:"+arguments.callee.toString());
	 var point=this.s2u([startx,starty]);
	 if (typeof t == "undefined")
	 {
		 var point=this.s2u([startx,starty]);
		 //alert("用户坐标："+point);
	     this.action("NP~"+id_point+"~"+point[0]+"~"+point[1]+"~"+label);
	 }
	 
	 
	 
     var x=startx;//-$("#"+this.ID).offset().left;
	 var y=starty;//-$("#"+this.ID).offset().top;
	 var id_text="T"+id_point;
         
     var new_node=document.createElementNS(svgNS,"circle")
	 
     new_node.setAttributeNS(null,"id",id_point);
	 //new_node.setAttributeNS(null,"class","point"); 
	 
	new_node.setAttributeNS(null,"stroke","black");
	new_node.setAttributeNS(null,"fill","black");
	new_node.setAttributeNS(null,"stroke-width","2");
	new_node.setAttributeNS(null,"cursor","pointer");
     new_node.setAttributeNS(null,"cx",""+x);
     new_node.setAttributeNS(null,"cy",""+y);
     new_node.setAttributeNS(null,"r","2");
     //new_node.setAttributeNS(null,"fill","black");
     //new_node.setAttributeNS(null,"stroke","black");
     
    // var stx=x+2;
    // var sty=y-2
     //var text_node=parseXML("<text id='" + id_text +"' x='"+ stx +"' y='"+ sty +"' stroke='black' class='text'>"+label+"</text>",evt.target.ownerDocument);
     var te = document.createElementNS(svgNS,"text");
	 //te.setAttributeNS(null,"font-size",labelSize);
	 te.setAttributeNS(null,"id",id_text);
	 te.setAttributeNS(null,"x",x);
	 te.setAttributeNS(null,"y",y);
	 te.setAttributeNS(null,"dx",8);
	 te.setAttributeNS(null,"dy",-8);
	 te.appendChild(document.createTextNode(label));
			
     
     //parent.appendChild(new_node);
     //parent.appendChild(text_node);

	 $("#"+this.ID+"point").append(new_node);
	 $("#"+this.ID+"point").append(te);
	
	if (this.mobile)
	{
		var new_node=document.createElementNS(svgNS,"circle")

		new_node.setAttributeNS(null,"id","B"+id_point);
		//new_node.setAttributeNS(null,"class","point"); 

		//new_node.setAttributeNS(null,"stroke","black");
		new_node.setAttributeNS(null,"fill","black");
		new_node.setAttributeNS(null,"fill-opacity","0");
		//fill-opacity:0.1;stroke-opacity:0.9
		new_node.setAttributeNS(null,"stroke-width","2");
		new_node.setAttributeNS(null,"cursor","pointer");
		new_node.setAttributeNS(null,"cx",""+x);
		new_node.setAttributeNS(null,"cy",""+y);
		new_node.setAttributeNS(null,"r","15");

		$("#"+this.ID+"point").append(new_node);
	}
	


	/*var oDiv=document.createElement("div");
	oDiv.style.border="1px solid black";
	oDiv.style.width="100px";
	oDiv.style.height="100px";
	oDiv.style.backgroundColor="#E1E1E1";
	oDiv.
	document.body.appendChild(oDiv);*/
	//alert("point:"+$("#I"+id_point));
	if (this.editable)
	{	
		if ($("#I"+id_point).length>0)
		{		
			$("#I"+id_point).remove();
			/*var div = document.createElement("div");
	　　　　//设置 div 属性，如 id
	　　　　div.setAttribute("id", "I"+id_point);
	　　　　div.innerHTML = "点"+label+"("+"<span>"+point[0]+","+point[1]+"</span>)";
	　　　　document.getElementById(this.ID+"I").appendChild(div);*/
		}
		/*
		  editor:peng.zheng
		  time:2016/1/30 
		  content:隐藏点左边属性点
		*/
		/*
		  var div = document.createElement("div");
		  //设置 div 属性，如 
	　　　　div.setAttribute("id", "I"+id_point);
	　　　　div.innerHTML = "点"+label+"("+"<span class=\"unEdit\" contenteditable=\"false\">"+point[0]+","+point[1]+"</span>)";
	　　　　document.getElementById(this.ID+"I").appendChild(div);
	   */
	   /*end*/
	}
	
};

SVG.prototype.newLine=function(id,x1,y1,x2,y2,t){
   if (typeof t == "undefined")
   {
		 var point1=this.s2u([x1,y1]);
		 var point2=this.s2u([x2,y2]);
		 //alert("NewLine用户坐标："+point1);
	     this.action("NL~"+id+"~"+point1[0]+"~"+point1[1]+"~"+point2[0]+"~"+point2[1]);
   }
   var line=document.createElementNS(svgNS, "line");
   line.setAttributeNS(null,"id",id);
   line.setAttributeNS(null,"x1",x1);
   line.setAttributeNS(null,"y1",y1);
   line.setAttributeNS(null,"x2",x2);
   line.setAttributeNS(null,"y2",y2);
   //initLine.setAttributeNS(null,"class","seg"); //使用class的时候似乎不能通过Attribute修改属性？？？？？？
   line.setAttributeNS(null,"stroke","black");
   line.setAttributeNS(null,"stroke-width",2);
   $("#"+this.ID+"segment").append(line);

}


SVG.prototype.newCircle=function(id,x1,y1,r,t){
   if (typeof t == "undefined")
   {
	   /*
		var point1=this.s2u([x1,y1]);
		var point2=this.s2u([r,r]);
		alert("s2u:"+r+"::"+point2[0]);
		this.action("NC~"+id+"~"+point1[0]+"~"+point1[1]+"~"+point2[0]);
        */
   }
   var circle=document.createElementNS(svgNS, "circle");
   circle.setAttributeNS(null,"id",id);
   circle.setAttributeNS(null,"cx",x1);
   circle.setAttributeNS(null,"cy",y1);
   circle.setAttributeNS(null,"r",r);
   circle.setAttributeNS(null,"fill","none");
   circle.setAttributeNS(null,"stroke","black");
   circle.setAttributeNS(null,"stroke-width","2");
   $("#"+this.ID+"circle").append(circle);   
}

SVG.prototype.get3PC=function(pId1,pId2,pId3){//过三个点作圆,返回数组[x,y,r]
   var p=document.getElementById(pId1);
   var x1=parseFloat(p.getAttribute("cx"));
   var y1=parseFloat(p.getAttribute("cy"));

   p=document.getElementById(pId2);
   var x2=parseFloat(p.getAttribute("cx"));
   var y2=parseFloat(p.getAttribute("cy"));

   p=document.getElementById(pId3);
   var x3=parseFloat(p.getAttribute("cx"));
   var y3=parseFloat(p.getAttribute("cy"));

	var a=2*(x2-x1);
	var b=2*(y2-y1);
	var c=x2*x2+y2*y2-x1*x1-y1*y1;
	var d=2*(x3-x2);
	var e=2*(y3-y2);
	var f=x3*x3+y3*y3-x2*x2-y2*y2;
	if ((b*d-e*a)!==0)
	{
		var x=((b*f-e*c)/(b*d-e*a)).toFixed(this.decimal);
		var y=((d*c-a*f)/(b*d-e*a)).toFixed(this.decimal);
		var r=(Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))).toFixed(this.decimal);
		//先不考虑画圆心，如果画圆心，还得做圆心的被限制条件
		//var pID="CP"+this.newChildID();
		//var label=this.newLabel();
		//this.newPoint(pID,x,y,label);
		return new Array(x,y,r);		
	}
	else{
		return new Array(0,0,0);
	}
}

SVG.prototype.new3Circle=function(pId1,pId2,pId3,t){//过三个点作圆
   if (typeof t == "undefined")
   {
	   /*
		var point1=this.s2u([x1,y1]);
		var point2=this.s2u([r,r]);
		alert("s2u:"+r+"::"+point2[0]);
		this.action("NC~"+id+"~"+point1[0]+"~"+point1[1]+"~"+point2[0]);
        */
   }
   var p=document.getElementById(pId1);
   var x1=parseFloat(p.getAttribute("cx"));
   var y1=parseFloat(p.getAttribute("cy"));

   p=document.getElementById(pId2);
   var x2=parseFloat(p.getAttribute("cx"));
   var y2=parseFloat(p.getAttribute("cy"));

   p=document.getElementById(pId3);
   var x3=parseFloat(p.getAttribute("cx"));
   var y3=parseFloat(p.getAttribute("cy"));

	var a=2*(x2-x1);
	var b=2*(y2-y1);
	var c=x2*x2+y2*y2-x1*x1-y1*y1;
	var d=2*(x3-x2);
	var e=2*(y3-y2);
	var f=x3*x3+y3*y3-x2*x2-y2*y2;
	if ((b*d-e*a)!==0)
	{
		var x=((b*f-e*c)/(b*d-e*a)).toFixed(this.decimal);
		var y=((d*c-a*f)/(b*d-e*a)).toFixed(this.decimal);
		var r=(Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))).toFixed(this.decimal);
		//先不考虑画圆心，如果画圆心，还得做圆心的被限制条件
		//var pID="CP"+this.newChildID();
		//var label=this.newLabel();
		//this.newPoint(pID,x,y,label);

		var cID="CR"+this.newChildID();
		this.newCircle(cID,x,y,r);
		//限制条件
		var conID="c"+this.newChildID();
		this.newCon(conID,"C3P,"+cID+","+pId1+","+pId2+","+pId3,"C"+pId1);
		conID="c"+this.newChildID();
		this.newCon(conID,"C3P,"+cID+","+pId1+","+pId2+","+pId3,"C"+pId2);
		conID="c"+this.newChildID();
		this.newCon(conID,"C3P,"+cID+","+pId1+","+pId2+","+pId3,"C"+pId3);
		//被限制条件
		var conIDx="x"+this.newChildID();
		this.newCon(conIDx,conID,"X"+cID);
	}
}

SVG.prototype.newMessure=function(id,p1,p2,t){//新增测量两点的距离
	if (typeof t == "undefined")
	{
	   /*
		var point1=this.s2u([x1,y1]);
		var point2=this.s2u([r,r]);
		alert("s2u:"+r+"::"+point2[0]);*/
		this.action("NM~"+id+"~"+p1+"~"+p2);        
   }
   var x1,y1,x2,y2;
   x1=parseFloat($("#"+p1).attr("cx"));
   y1=parseFloat($("#"+p1).attr("cy"));
   x2=parseFloat($("#"+p2).attr("cx"));
   y2=parseFloat($("#"+p2).attr("cy"));
   var ps=this.s2u([x1,y1]);
   var pe=this.s2u([x2,y2]);

   var distance=Math.sqrt((ps[0]-pe[0])*(ps[0]-pe[0])+(ps[1]-pe[1])*(ps[1]-pe[1])).toFixed(this.decimal);
	   
    //约束条件，标注角暂时本身不能动，因此不添加被限制条件
	if (t==false){
		var conID="c"+this.newChildID();
		this.newCon(conID,"Messure,"+id+","+p1+","+p2,"C"+p1);

		conID="c"+this.newChildID();
		this.newCon(conID,"Messure,"+id+","+p1+","+p2,"C"+p2);
	}
	//修改距离测量的值
	if ($("#M"+id).length>0){
		$("#M"+id).html(distance);
	}
	else{
		var p=$("<div class=\"unSelected\">|"+$("#T"+p1).text()+$("#T"+p2).text()+"|=</div>");
		var j=$("<span></span>");
		j.attr("id","M"+id);
		j.html(distance);
		p.append(j);
		$("#"+this.ID+"HTML").append(p);
	}
}

SVG.prototype.modiMessure=function(id,p1,p2,t){//修改测量两点的距离
	if (typeof t == "undefined")
	{
	   /*
		var point1=this.s2u([x1,y1]);
		var point2=this.s2u([r,r]);
		alert("s2u:"+r+"::"+point2[0]);*/
		//this.action("NM~"+id+"~"+p1+"~"+p2);        
   }
   var x1,y1,x2,y2;
   x1=parseFloat($("#"+p1).attr("cx"));
   y1=parseFloat($("#"+p1).attr("cy"));
   x2=parseFloat($("#"+p2).attr("cx"));
   y2=parseFloat($("#"+p2).attr("cy"));
   var ps=this.s2u([x1,y1]);
   var pe=this.s2u([x2,y2]);

   var distance=Math.sqrt((ps[0]-pe[0])*(ps[0]-pe[0])+(ps[1]-pe[1])*(ps[1]-pe[1])).toFixed(this.decimal);
	//修改距离测量的值
	if ($("#M"+id).length>0){
		$("#M"+id).html(distance);
	}	
}




SVG.prototype.newAngle=function(id,p1,p2,p3,t){//新增加角标注
	if (typeof t == "undefined")
	{
	   /*
		var point1=this.s2u([x1,y1]);
		var point2=this.s2u([r,r]);
		alert("s2u:"+r+"::"+point2[0]);*/
		this.action("NA~"+id+"~"+p1+"~"+p2+"~"+p3);
        
   }
   var x1,y1,x2,y2,x3,y3,alpha,path;
   x1=parseFloat($("#"+p1).attr("cx"));
   y1=parseFloat($("#"+p1).attr("cy"));
   x2=parseFloat($("#"+p2).attr("cx"));
   y2=parseFloat($("#"+p2).attr("cy"));
   x3=parseFloat($("#"+p3).attr("cx"));
   y3=parseFloat($("#"+p3).attr("cy"));
	//alpha=-(Math.asin((y3-y2)/Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2)))
	//	 +Math.asin((y1-y2)/Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))))/Math.PI*180;
	//alpha=-(Math.atan((y3-y2)/(x3-x2))		 +Math.atan((y1-y2)/(x1-x2)))/Math.PI*180;
	//alpha=(Math.atan(-(y3-y2)/(x3-x2))+Math.atan((y1-y2)/(x1-x2)))/Math.PI*180;
	//alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
  if (x1==x2)
  {
	  if (y1>=y2)
	  {
		  if (x3>x2)
		  {
			  //this.myAlert("y3<y2:"+x3+","+x2);
			  alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
	  
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
	  }
	  else{
		  if (x3<x2)
		  {
			  //this.myAlert("y3<y2:"+x3+","+x2);
			  alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
	  
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }

	  }
	  
  }
  else{//y1!=y2
	  if (x1<x2)
	  {
		  if (y3>(y2-y1)/(x2-x1)*(x3-x1)+y1)
		  {
			//this.myAlert("y3:"+x3+","+(x2-x1)/(y2-y1)*(y3-y1)+x1);
			alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }

	  }
	  else{
		  if (y3<(y2-y1)/(x2-x1)*(x3-x1)+y1)
		  {
			//this.myAlert("y3:"+x3+","+(x2-x1)/(y2-y1)*(y3-y1)+x1);
			alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
	  }
  }
	alpha=alpha.toFixed(this.decimal);
	var mA=document.createElementNS(svgNS, "path");
   mA.setAttributeNS(null,"id",id);
   mA.setAttributeNS(null,"stroke","black");
   mA.setAttributeNS(null,"stroke-width","2");
   mA.setAttributeNS(null,"fill","transparent");
    //Mx1 y1 A rx ry x-axis-rotation large-arc-flag sweep-flag x y
	//x-axis-rotation（x轴旋转角度）
	//large-arc-flag决定弧线是大于还是小于180度，0表示小角度弧，1表示大角度弧。
	//sweep-flag表示弧线的方向，0表示从起点到终点沿逆时针画弧，1表示从起点到终点沿顺时针画弧
   //计算开始点和结束点
   var r=15;//假设半径为5
   var sx,sy,ex,ey;
   var d=Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
   if (d==0)
   {
      return;
   }
   else{
	   sy=((y1-y2)/d*r+y2).toFixed(this.decimal);  //这儿假设标注距离为5
	   sx=((x1-x2)/d*r+x2).toFixed(this.decimal);
   }
   d=Math.sqrt((y2-y3)*(y2-y3)+(x2-x3)*(x2-x3));
   if (d==0)
   {
      return;
   }
   else{
	   ey=((y3-y2)/d*r+y2).toFixed(this.decimal);  //这儿假设标注距离为5
	   ex=((x3-x2)/d*r+x2).toFixed(this.decimal);
   }
   if (alpha<180)
   {
		path="M "+sx+" "+sy	+" A"+r +" "+r+" 0 0 0 "+ex+" "+ey;
   }
   else{
	   path="M "+sx+" "+sy	+" A"+r +" "+r+" 0 1 0 "+ex+" "+ey;
   }
   
   mA.setAttributeNS(null,"d",path);
   $("#"+this.ID+"angle").append(mA);	

   if (t!=false)
	{
		//约束条件，标注角暂时本身不能动，因此不添加被限制条件
		var conID="c"+this.newChildID();
		this.newCon(conID,"Angle,"+id+","+p1+","+p2+","+p3,"C"+p1);

		conID="c"+this.newChildID();
		this.newCon(conID,"Angle,"+id+","+p1+","+p2+","+p3,"C"+p2);

		conID="c"+this.newChildID();
		this.newCon(conID,"Angle,"+id+","+p1+","+p2+","+p3,"C"+p3);
	}
	//修改角度的值
	if ($("#T"+id).length>0){
		$("#T"+id).html(alpha);
	}
	else{
		var p=$("<div class=\"unSelected\">∠"+$("#T"+p1).text()+$("#T"+p2).text()+$("#T"+p3).text()+"=</div>");
		var j=$("<span></span>");
		j.attr("id","T"+id);
		j.html(alpha);
		p.append(j);
		$("#"+this.ID+"HTML").append(p);
	}

}

SVG.prototype.modiAngle=function(id,x1,y1,x2,y2,x3,y3,t){//修改角标注
	if (typeof t == "undefined")
	{
	   /*
		var point1=this.s2u([x1,y1]);
		var point2=this.s2u([r,r]);
		alert("s2u:"+r+"::"+point2[0]);
		this.action("NC~"+id+"~"+point1[0]+"~"+point1[1]+"~"+point2[0]);
        */
   }
   var alpha,path;
   //alpha=-(Math.atan((y3-y2)/(x3-x2))+Math.atan((y1-y2)/(x1-x2)))/Math.PI*180;
   //alpha=Math.atan((y3-y1)/(x3-x1))/Math.PI*180;
  // alpha=(-Math.atan((y3-y2)/(x3-x2))+Math.atan((y1-y2)/(x1-x2)))/Math.PI*180;

  if (x1==x2)
  {
	  if (y1>=y2)
	  {
		  if (x3>x2)
		  {
			  //this.myAlert("y3<y2:"+x3+","+x2);
			  alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
	  
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
	  }
	  else{
		  if (x3<x2)
		  {
			  //this.myAlert("y3<y2:"+x3+","+x2);
			  alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
	  
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }

	  }
	  
  }
  else{//y1!=y2
	  if (x1<x2)
	  {
		  if (y3>(y2-y1)/(x2-x1)*(x3-x1)+y1)
		  {
			//this.myAlert("y3:"+x3+","+(x2-x1)/(y2-y1)*(y3-y1)+x1);
			alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }

	  }
	  else{
		  if (y3<(y2-y1)/(x2-x1)*(x3-x1)+y1)
		  {
			//this.myAlert("y3:"+x3+","+(x2-x1)/(y2-y1)*(y3-y1)+x1);
			alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
		  else{
			  alpha=360-Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
		  }
	  }
  }
  //alpha=Math.acos( -((x2-x1)*(x3-x2)+(y2-y1)*(y3-y2))/Math.sqrt(((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))*((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2))))/Math.PI*180;
   
   alpha=alpha.toFixed(this.decimal);
   var mA=document.getElementById(id);
   if (mA==null)
   {
	   return;
   }
   //mA.setAttributeNS(null,"d",null);
   var r=15;//假设半径为5
   var sx,sy,ex,ey;
   var d=Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
   if (d==0)
   {
      return;
   }
   else{
	   sy=((y1-y2)/d*r+y2).toFixed(this.decimal);  //这儿假设标注距离为5
	   sx=((x1-x2)/d*r+x2).toFixed(this.decimal);
   }
   d=Math.sqrt((y2-y3)*(y2-y3)+(x2-x3)*(x2-x3));
   if (d==0)
   {
      return;
   }
   else{
	   ey=((y3-y2)/d*r+y2).toFixed(this.decimal);  //这儿假设标注距离为5
	   ex=((x3-x2)/d*r+x2).toFixed(this.decimal);
   }
   if (alpha<180)
   {
		path="M "+sx+" "+sy	+" A"+r +" "+r+" 0 0 0 "+ex+" "+ey;
   }
   else{
	   path="M "+sx+" "+sy	+" A"+r +" "+r+" 0 1 0 "+ex+" "+ey;
   }
   //var path="M "+sx+" "+sy	+" A"+r +" "+r+" 0 0 0 "+ex+" "+ey;
   mA.setAttributeNS(null,"d",path);

   //修改角度的值
	if ($("#T"+id).length>0){
		$("#T"+id).html(alpha);
	}
   
}



/*function movePoint(pointObj,x,y){
	//pointObj可以是点的ID，也可以是点对象。
	if (typeof pointObj=="object")
	{
		pointObj.setAttributeNS(null,"cx",x);
		pointObj.setAttributeNS(null,"cy",y);
		var objID=pointObj.getAttribute("id");
		$("#T"+objID).attr("x",x);
		$("#T"+objID).attr("y",y);
	}
	else{
		$("#"+pointObj).attr("cx",x);
		$("#"+pointObj).attr("cy",y);
		$("#T"+pointObj).attr("x",x);
		$("#T"+pointObj).attr("y",y);
	}

	
	
};
*/

//新增约束条件
SVG.prototype.newCon=function(id1,cont,id,t){  //约束条件 id为约束对象ID,id1为<constraint>的id,便于被约束条件调用
	//alert("newCon:idself,cont,xid||"+id1+":"+cont+":"+id);
   if (typeof t == "undefined" || t)
   {
		this.action("newCon~"+id1+"~"+cont+"~"+id);
		//alert("action:"+id1+":"+cont+":"+id);
   }

   var conNode=document.createElementNS(svgNS,"g");
       conNode.setAttributeNS(null,"id",id1);
	   conNode.appendChild(document.createTextNode(cont));
	   if ($("#"+id).length>0)
	   {
          $("#"+id).append(conNode);
	   }
	   else{
		   var p=document.createElementNS(svgNS,"g");
		   p.setAttributeNS(null,"id",id);
		   p.appendChild(conNode);

		   $("#"+this.ID+"con").append(p);
	   }

};


var	tempx=0,tempy=0;
SVG.prototype.sortNumber1=function(a, b)
{
//	alert(tempx)
	return Math.abs(a[0]-tempx)-Math.abs(b[0]-tempx)
}
SVG.prototype.sortNumber2=function(a, b)
{
//	alert(tempx)
	return Math.abs(a[1]-tempy)-Math.abs(b[1]-tempy)
}
SVG.prototype.sortNumber3=function(a, b)
{
//	alert(tempx)
	return Math.pow((a[0]-tempx),2)+Math.pow((a[1]-tempy),2)-(Math.pow((b[0]-tempx),2)+Math.pow((b[1]-tempy),2))
}
SVG.prototype.series=function(moveID){			//处理对称的连锁反应
	var conID=$("#A"+moveID).children();
	var i,c=new Array();
	for(i=0;i<conID.length;i++)
	{
		c=conID.eq(i).text().split(",");
		this.symmetry(c[1],c[2],10*this.time);
		this.goBack(c[3]);
		this.series(c[3]);
	}
	conID=$("#T"+moveID).children();
	for(i=0;i<conID.length;i++)
	{
		c=conID.eq(i).text().split(",");
		this.symmetry(moveID,c[2],10*this.time);
		this.goBack(c[3]);
		this.series(c[3]);
	}
	
}


SVG.prototype.moveObject=function(moveID,x,y){  //移动对象
	var moveList=new Array();  //移动对象列表
	var hereID;  //当前移动对象ID
	var x1,x2,y1,y2,cx,cy,temp,key,i,c;
	var xconID=$("#X"+moveID).children().eq(0).text();//这个只取了一个被限制条件？？
	//this.myAlert("被限制条件个数："+$("#X"+moveID).children().eq(1).text());
	var xcon=($("#"+xconID).text()).split(",");
	
	var conID=$("#C"+moveID).children();
	var con=new Array();
	moveList.push(moveID);

	this.series(moveID);//暂时不知道什么用途，雷添加
	var conID1=$("#F"+moveID).children();
	if(conID1.length>0)  //对称后的图形不能移动
		return;

	
	if ($("#X"+moveID).children().length>1)//有两个被限制条件
	{

	}
	else{ //else if ($("#X"+moveID).children().length>1)
		switch (moveID.substring(0,2))
		{
			
			case "FP":
				this.movePoint(moveID,x,y);
				break;
			case "CP": //
				//var xconID=$("#X"+moveID).children().eq(0).text();
				//var xcon=($("#"+xconID).text()).split(",");
				switch (xcon[0])
				{
					case "MPL"://中点
						break;
					case "POL":  //POL,PID,LineID,rate
						var l_l=0;
						x1=parseFloat($("#"+xcon[2]).attr("x1"));
						y1=parseFloat($("#"+xcon[2]).attr("y1"));
						x2=parseFloat($("#"+xcon[2]).attr("x2"));
						y2=parseFloat($("#"+xcon[2]).attr("y2"));	
						if (Math.abs(x2-x1)>Math.abs(y2-y1))
						{
							//以x坐标为准
							l_l=(x-x1)/(x2-x1);
							y=parseInt(l_l*(y2-y1)+y1);
							this.movePoint(moveID,x,y);					 
						}
						else{
							l_l=(y-y1)/(y2-y1);
							x=parseInt(l_l*(x2-x1)+x1);
							this.movePoint(moveID,x,y);
						}
						//修改被约束条件
						$("#"+xconID).text(xcon[0]+","+xcon[1]+","+xcon[2]+","+l_l);
						break; 

					case "POC"://POC,PID,CID,alpha;
						//alert("move POC");
						//var point_node=svgDocument.getElementById(array_con[1]);
						//var circle_node=svgDocument.getElementById(array_con[2]);
						var circle_x=parseFloat($("#"+xcon[2]).attr("cx"));//parseInt(circle_node.getAttribute("cx"));
						var circle_y=parseFloat($("#"+xcon[2]).attr("cy"));//parseInt(circle_node.getAttribute("cy"));
						var r=parseFloat($("#"+xcon[2]).attr("r"));//parseInt(circle_node.getAttribute("r"));

						var p_x=x;
						var p_y=y;
						if (x==circle_x){
							p_x=circle_x;
							if (y>circle_y){
								p_y=circle_y+r;
							}
							else{
								p_y=circle_y-r;
							}
						}
						else{
							var jiao=Math.atan( (y-circle_y)/(x-circle_x) );
							if(x>circle_x){
								p_x=circle_x+r*Math.cos(jiao);
								p_y=circle_y+r*Math.sin(jiao);
							}
							else{
								p_x=circle_x-r*Math.cos(jiao);
								p_y=circle_y-r*Math.sin(jiao);
							}
						}

						var alpha=getAlpha(circle_x,circle_y,p_x,p_y);  //alpha为x正半轴到圆上点的弧角
						
						$("#"+xconID).text(xcon[0]+","+xcon[1]+","+xcon[2]+","+alpha);
						
						this.movePoint(moveID,p_x,p_y);

						/*
						//发送到服务器的修改了的约束条件
						modicon="modicons"+"~"+constraint_ID+"~"+array_con[0]+","+array_con[1]+","+array_con[2]+","+alpha;
						
						*/

						break;
					case "PAR"://PAR,B,A,L,type平行
						if ($("#X"+xcon[2]).children().length<1)//A点无限制条件
						{
							var czline=document.getElementById(xcon[3]);
							var czx1=parseInt(czline.getAttribute("x1"));
							var czy1=parseInt(czline.getAttribute("y1"));
							var czx2=parseInt(czline.getAttribute("x2"));
							var czy2=parseInt(czline.getAttribute("y2"));
							var pa=document.getElementById(xcon[2]);
							var x1=parseInt(pa.getAttribute("cx"));
							var y1=parseInt(pa.getAttribute("cy"));
							var x1,y1;
							/*if (xcon[4]!="1")
							//if ((czx1-czx2)*(x1-x)>=0 && (czy1-czy2)*(y1-y)>=0)
							{
								x1=x-czx1+czx2;
								y1=y-czy1+czy2;
							}
							else{
								x1=x+czx1-czx2;
								y1=y+czy1-czy2;
							}*/
							
							if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){
								y1=parseInt(y-(czy2-czy1)/(czx2-czx1)*(x-x1));
							} 
							else{
								if (Math.abs(czy2-czy1)>0)
								{								
									x1=parseInt(x-(czx2-czx1)/(czy2-czy1)*(y-y1));
								}
							} 
							this.movePoint(moveID,x,y);
							this.moveObject(xcon[2],x1,y1);							
						}
						else{//A点有其它限制条件
						}
						break;
					case "EPA"://EPA,B,A,L,type平行且相等
						var czline=document.getElementById(xcon[3]);
						var czx1=parseInt(czline.getAttribute("x1"));
						var czy1=parseInt(czline.getAttribute("y1"));
						var czx2=parseInt(czline.getAttribute("x2"));
						var czy2=parseInt(czline.getAttribute("y2"));

						var pa=document.getElementById(xcon[2]);
						var x1=parseInt(pa.getAttribute("cx"));
						var y1=parseInt(pa.getAttribute("cy"));
						var x1,y1;
						//if((czx1-czx2)*(x1-x2)>=0 && (czy1-czy2)*(y1-y2)>=0){ //czx1-czx2同向x1-x2
						if (xcon[4]=="1"){						
							x1=x+czx1-czx2;
							y1=y+czy1-czy2;							
						}
						else{
							x1=x-czx1+czx2;
							y1=y-czy1+czy2;
						}
						this.movePoint(moveID,x,y);
						this.moveObject(xcon[2],x1,y1);						
						break;
					case "PER"://PEA,B,A,L,type垂直
						if ($("#X"+xcon[2]).children().length<1)//A点无限制条件
						{
							var czline=document.getElementById(xcon[3]);
							var czx1=parseInt(czline.getAttribute("x1"));
							var czy1=parseInt(czline.getAttribute("y1"));
							var czx2=parseInt(czline.getAttribute("x2"));
							var czy2=parseInt(czline.getAttribute("y2"));
							var pa=document.getElementById(xcon[2]);
							var x1=parseInt(pa.getAttribute("cx"));
							var y1=parseInt(pa.getAttribute("cy"));
							//var x1,y1;
							
							/*
							if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){
								y1=parseInt(y-(czy2-czy1)/(czx2-czx1)*(x-x1));

							} 
							else{
								if (Math.abs(czy2-czy1)>0)
								{								
									x1=parseInt(x-(czx2-czx1)/(czy2-czy1)*(y-y1));
								}
							} 
*/
							if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){										
									
									x1=parseInt(x+(czy2-czy1)/(czx2-czx1)*(y-y1));
								} 
								else{
									if (Math.abs(czy2-czy1)>0){
										y1=parseInt(y+(czx2-czx1)/(czy2-czy1)*(x-x1));
									}	
							} 
							this.movePoint(moveID,x,y);
							this.moveObject(xcon[2],x1,y1);							
						}
						else{//A点有其它限制条件
						}
						break;
					case "EPE"://EPE,B,A,L平行且相等
						var czline=document.getElementById(xcon[3]);
						var czx1=parseInt(czline.getAttribute("x1"));
						var czy1=parseInt(czline.getAttribute("y1"));
						var czx2=parseInt(czline.getAttribute("x2"));
						var czy2=parseInt(czline.getAttribute("y2"));

						var pa=document.getElementById(xcon[2]);
						var x1=parseInt(pa.getAttribute("cx"));
						var y1=parseInt(pa.getAttribute("cy"));
						var p1_x=czy2-czy1+x;
						var p1_y=-czx2+czx1+y;
						var p2_x=czy1-czy2+x;
						var p2_y=-czx1+czx2+y;
						//通过检查p1和p2哪个离P2的距离近则采用哪个坐标
						if (((x1-p1_x)*(x1-p1_x)+(y1-p1_y)*(y1-p1_y))> ((x1-p2_x)*(x1-p2_x)+(y1-p2_y)*(y1-p2_y))){
							x1=p2_x;
							y1=p2_y;
						}
						else{
							x1=p1_x;
							y1=p1_y;
						}
						this.movePoint(moveID,x,y);
						this.moveObject(xcon[2],x1,y1);						
						break;
					case "POF":  //点在函数上

						//					alert(tag[xcon[2]][0])
						tempx=(x-this.origin[0])/this.xyUnit;
						tempy=(this.origin[1]-y)/this.xyUnit;
						var arr=new Array();
						for(i=0;i<len;i++)
						{
							arr[i]=[this.cord[i][xcon[2]][0],this.cord[i][xcon[2]][1]];
						}
						if(tag[xcon[2]][0]=="y=f(x)")
							arr.sort(this.sortNumber1);//对x坐标值排序
						else if(tag[xcon[2]][0]=="x=f(y)")
							arr.sort(this.sortNumber2);//对y坐标值排序
						else
							arr.sort(this.sortNumber3);//对距离排序
						//alert(arr[0][0]+" "+arr[0][1])
						x=arr[0][0]*this.xyUnit+this.origin[0];
						y=this.origin[1]-arr[0][1]*this.xyUnit;
						//alert($("#"+xcon[2]).offset().left+" "+$("#"+xcon[2]).offset().top)
						//alert(this.xMin+" "+this.yMin)
						this.st[moveID]=[x,y];
						this.movePoint(moveID,x,y);
						break;
				}//end switch (xcon[0])

				break;
			case "PP":
				//alert(pre[0])	   
				var chax=x-this.pre[0];
				var chay=y-this.pre[1];
				x1=parseFloat($("#"+xcon[1]).attr("x1"));
				y1=parseFloat($("#"+xcon[1]).attr("y1"));
				x2=parseFloat($("#"+xcon[1]).attr("x2"));
				y2=parseFloat($("#"+xcon[1]).attr("y2"));	
				
				x1=this.pre[2]+chax;
				y1=this.pre[4]+chay;
				x2=this.pre[3]+chax;
				y2=this.pre[5]+chay;
				var line=$("#"+xcon[1]);

				line.attr("x1",x1);
				line.attr("y1",y1);
				line.attr("x2",x2);
				line.attr("y2",y2);
				this.movePoint(xcon[2],x1,y1);
				this.movePoint(xcon[3],x2,y2);

				break;
			case "CR"://圆
				switch(xcon[0]){
					case "CPR":
						var cx=$("#"+xcon[1]).attr("cx");
						var cy=$("#"+xcon[1]).attr("cy");
						//var r=Math.sqrt((x-$("#"+this.ID).offset().left-cx)*(x-$("#"+this.ID).offset().left-cx)+(y-$("#"+this.ID).offset().top-cy)*(y-$("#"+this.ID).offset().top-cy));       
						var r=(Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy))).toFixed(this.decimal);       
						 
						$("#"+xcon[1]).attr("r",r);
						

						break;
					case "CPP":

						break;

				}
				
				break;
			
			case "fx":
				var chax=(x-this.pre[0])/this.xyUnit;
				var chay=(y-this.pre[1])/this.xyUnit;
				var temp=tag[moveID][1],f,txy;
				for(var i=0;i<conID.length;i++)
				{
					con[i]=conID.eq(i).text().split(",")[1];
					txy=this.st[con[i]];
					var cx=parseFloat(txy[0])+x-this.pre[0];
					var cy=parseFloat(txy[1])+y-this.pre[1];
					this.movePoint(con[i],cx,cy);
				}
				switch(tag[moveID][0])
				{
					case "y=f(x)":
						if(chax<0){
							tag[moveID][1]=tag[moveID][1].replace(/x/g,"(x+"+(-chax)+")");
						}
						else if(chax>0)
							tag[moveID][1]=tag[moveID][1].replace(/x/g,"(x-"+chax+")");	
						if(chay>0)
							tag[moveID][1]+=-chay;
						else if(chay<0)
							tag[moveID][1]+="+"+(-chay);
						this.tempfuc=[moveID,tag[moveID][1],"y=f(x)"];		//存放当前移动图像的函数
						this.plot("y=f(x)",tag[moveID][1],-5,5,null,moveID,null,null,"black",2,null,1);
							tag[moveID][1]=temp;

						break;
					case "x=f(y)":

						if(chay<0){
							tag[moveID][1]=tag[moveID][1].replace(/y/g,"(y-"+(-chay)+")");

						}
						else if(chay>0)	
							tag[moveID][1]=tag[moveID][1].replace(/y/g,"(y+"+(chay)+")");	
						if(chax<0)
							tag[moveID][1]+=chax;
						else if(chax>0)
							tag[moveID][1]+="+"+(chax);
						this.tempfuc=[moveID,tag[moveID][1],"x=f(y)"];
						this.plot("x=f(y)",tag[moveID][1],-5,5,null,moveID,null,null,"black",2,null,1);
						tag[moveID][1]=temp;
						break;
					case "r=f(t)":
						f=new Array("("+temp+")*cos(t)","("+temp+")*sin(t)");
						if(chay>0){
							f[1]+=-chay;

						}
						else if(chay<0)	
							f[1]+="+"+(-chay);	
						if(chax>0)
							f[0]+="+"+chax;
						else if(chax<0)
							f[0]+=chax;
						temp=f[0]+","+f[1];
						this.tempfuc=[moveID,temp,"x=f(t)"];
						temp=tag[moveID][1];

						this.plot("x=f(t)",this.tempfuc[1],-5,5,null,moveID,null,null,"black",2,null,1);
						tag[moveID][1]=temp;
						tag[moveID][0]="r=f(t)";
						break;
					case "x=f(t)":
						f=temp.split(",");
						if(chay>0){
							f[1]+=-chay;

						}
						else if(chay<0)	
							f[1]+="+"+(-chay);	
						if(chax>0)
							f[0]+="+"+chax;
						else if(chax<0)
							f[0]+=chax;
						temp=f[0]+","+f[1];
						this.tempfuc=[moveID,temp,"x=f(t)"];
						temp=tag[moveID][1];

						this.plot("x=f(t)",this.tempfuc[1],-5,5,null,moveID,null,null,"black",2,null,1);
						tag[moveID][1]=temp;
						break;
					default:
						break;
				} //end switch(tag[moveID][0])

				break;
		}  //switch (moveID.substring(0,2))
	}//if ($("#X"+moveID).children().length>1)
    //alert("moveID:"+moveID);
	//alert("不存在元素测试:"+$("#xxxxxxxxxx").length+"::"+$("#xxxxxxxxxx").children().length);0,0
    //alert("空元素测试:"+$("#mySVGcon").length+"::"+$("#mySVGcon").children().length); 1,0
	//alert("两个元素测试:"+$("#con").length+":"+ $("#con").children().length); 1;2
	
	while (moveList.length>0)
	{
		hereID=moveList.shift();
		if ($("#C"+hereID).length>0)  //约束条件
		{
			//alert("hereID:"+hereID);
			for (var i=0;i<$("#C"+hereID).children().length;i++ )
			{
				var con=($("#C"+hereID).children().eq(i).text()).split(",");
				//alert("hereID,con:"+hereID+"::"+con);
				moveList.push(con[1]);
				this.series(con[1]);
				//alert("con[0]:"+con[0]);
				switch (con[0])
				{
					case "Angle"://Angle,angleID,p1,p2,p3
						//alert(con);
						var x1,y1,x2,y2,x3,y3;
						x1=parseFloat($("#"+con[2]).attr("cx"));
						y1=parseFloat($("#"+con[2]).attr("cy"));
						x2=parseFloat($("#"+con[3]).attr("cx"));
						y2=parseFloat($("#"+con[3]).attr("cy"));
						x3=parseFloat($("#"+con[4]).attr("cx"));
						y3=parseFloat($("#"+con[4]).attr("cy"));
						this.modiAngle(con[1],x1,y1,x2,y2,x3,y3);
						break;
					case "Messure"://Messure,messureID,p1,p2,p3
						this.modiMessure(con[1],con[2],con[3]);
						break;
					case "MPL"://线段的中点
						//MPL,pointID,lineID						
						var cObj=document.getElementById(con[2]);
						var ox1=parseFloat(cObj.getAttribute("x1"));
						var ox2=parseFloat(cObj.getAttribute("x2"));
						var oy1=parseFloat(cObj.getAttribute("y1"));
						var oy2=parseFloat(cObj.getAttribute("y2"));
						var mx=(ox1+ox2)/2;
						var my=(oy1+oy2)/2;
						this.movePoint(con[1],mx,my);

						break;
					case "LPP":  //LPP，lineID，PID1，PID2 两点决定的直线
						if (hereID==con[2])
						{
							$("#"+con[1]).attr("x1",$("#"+hereID).attr("cx"));
							$("#"+con[1]).attr("y1",$("#"+hereID).attr("cy"));
							//this.moveLine();
						}
						else{
							$("#"+con[1]).attr("x2",$("#"+hereID).attr("cx"));
							$("#"+con[1]).attr("y2",$("#"+hereID).attr("cy"));
						}
						break;
					case "PAR"://PAR,B,A,L表述AB//L
						switch (hereID)
						{
							case con[1]://移动B点
								break;
							case con[2]://移动A点
							case con[3]://移动参照直线
								var cz=document.getElementById(con[3]);
								var czx1=parseInt(cz.getAttribute("x1"));
								var czy1=parseInt(cz.getAttribute("y1"));
								var czx2=parseInt(cz.getAttribute("x2"));
								var czy2=parseInt(cz.getAttribute("y2"));						
								var pa=document.getElementById(con[2]);
								var x1=parseInt(pa.getAttribute("cx"));
								var y1=parseInt(pa.getAttribute("cy"));
								var pb=document.getElementById(con[1]);
								var x2=parseInt(pb.getAttribute("cx"));
								var y2=parseInt(pb.getAttribute("cy"));		
								//检查con[1]是否有别的约束条件
								if ($("#X"+con[1]).children().length>1)//有两个被限制条件
								{
									var secCon;//second con第二限制条件
									//var firset=$("#X"+con[1]).children().eq(0).text();
									var tempCon=($("#"+$("#X"+con[1]).children().eq(0).text()).text()).split(",");
									//this.myAlert("限制条件:"+$("#X"+con[1]).children().length);
									if (tempCon==con)
									{
										secCon=($("#"+$("#X"+con[1]).children().eq(1).text()).text()).split(",");
									}
									else{
										secCon=tempCon;
									}
									//this.myAlert("2:"+sCon);
									switch (secCon[0])//POL,pID,Line
									{
										case "POL":
											var overObj=document.getElementById(secCon[2]);
											var over_x1=parseInt(overObj.getAttribute("x1"));
											var over_y1=parseInt(overObj.getAttribute("y1"));
											var over_x2=parseInt(overObj.getAttribute("x2"));
											var over_y2=parseInt(overObj.getAttribute("y2"));
											
											if (czx2-czx1!=0){
												k=(czy2-czy1)/(czx2-czx1);
												if (over_x2-over_x1!=0){
													var k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=(y1-over_y1+k1*over_x1-k*x1)/(k1-k);
													y2=y1+k*(x2-x1);
												}
												else{
													x2=over_x1;
													y2=k*(x2-x1)+y1;
												}												
											}
											else{
												if (over_x2-over_x1!=0){
													var k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=x1;
													y2=k1*(x2-over_x1)+over_y1;
												}
											}
											this.movePoint(con[1],x2,y2);	
											break;
										default:
											break;
									
									}//end switch (sCon[0])
									
								}
								else{//只有一个限制条件									
									//需要纠正x2,y2
									if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){
											//p_x=line_x2;
											y2=parseInt(y1+(czy2-czy1)/(czx2-czx1)*(x2-x1));
									} 
									else{
										//p_y=line_y2;
										x2=parseInt(x1+(czx2-czx1)/(czy2-czy1)*(y2-y1));
									} 
									this.movePoint(con[1],x2,y2);	
								}
								break;						
						}
						break;
					case "EPA": //EPA,B,A,L,type表述AB//=L
						//alert("con:"+con);
						//应该判断当前移动的对象
						switch (hereID)
						{
							case con[1]://移动B点
								break;
							case con[2]://移动A点
							case con[3]://移动参照直线
								var cz=document.getElementById(con[3]);
								var czx1=parseInt(cz.getAttribute("x1"));
								var czy1=parseInt(cz.getAttribute("y1"));
								var czx2=parseInt(cz.getAttribute("x2"));
								var czy2=parseInt(cz.getAttribute("y2"));						
								var pa=document.getElementById(con[2]);
								var x1=parseInt(pa.getAttribute("cx"));
								var y1=parseInt(pa.getAttribute("cy"));
								var pb=document.getElementById(con[1]);
								var x2=parseInt(pb.getAttribute("cx"));
								var y2=parseInt(pb.getAttribute("cy"));						
								//if((czx1-czx2)*(x1-x2)>=0 && (czy1-czy2)*(y1-y2)>=0){ //czx1-czx2同向x1-x2
								if (con[4]=="1")
								{
									x2=x1-czx1+czx2;
									y2=y1-czy1+czy2;
								}
								else{
									x2=x1+czx1-czx2;
									y2=y1+czy1-czy2;
								}						
								this.movePoint(con[1],x2,y2);	
								break;						
						}
						
											
						break;
					case "PER"://PER,B,A,L表述AB垂直L
						switch (hereID)
						{
							case con[1]://移动B点
								break;
							case con[2]://移动A点
							case con[3]://移动参照直线
								var cz=document.getElementById(con[3]);
								var czx1=parseInt(cz.getAttribute("x1"));
								var czy1=parseInt(cz.getAttribute("y1"));
								var czx2=parseInt(cz.getAttribute("x2"));
								var czy2=parseInt(cz.getAttribute("y2"));						
								var pa=document.getElementById(con[2]);
								var x1=parseInt(pa.getAttribute("cx"));
								var y1=parseInt(pa.getAttribute("cy"));
								var pb=document.getElementById(con[1]);
								var x2=parseInt(pb.getAttribute("cx"));
								var y2=parseInt(pb.getAttribute("cy"));						
								//检查con[1]是否有别的约束条件
								if ($("#X"+con[1]).children().length>1)//有两个被限制条件
								{
									var secCon;//second con第二限制条件
									//var firset=$("#X"+con[1]).children().eq(0).text();
									var tempCon=($("#"+$("#X"+con[1]).children().eq(0).text()).text()).split(",");
									//this.myAlert("限制条件:"+$("#X"+con[1]).children().length);
									if (tempCon==con)
									{
										secCon=($("#"+$("#X"+con[1]).children().eq(1).text()).text()).split(",");
									}
									else{
										secCon=tempCon;
									}
									//this.myAlert("2:"+sCon);
									switch (secCon[0])//POL,pID,Line
									{
										case "POL":
											var overObj=document.getElementById(secCon[2]);
											var over_x1=parseInt(overObj.getAttribute("x1"));
											var over_y1=parseInt(overObj.getAttribute("y1"));
											var over_x2=parseInt(overObj.getAttribute("x2"));
											var over_y2=parseInt(overObj.getAttribute("y2"));
											if (czy2-czy1!=0){
												var k=-(czx2-czx1)/(czy2-czy1);
												if (over_x2-over_x1!=0){
													k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=(y1-over_y1+k1*over_x1-k*x1)/(k1-k);
													y2=y1+k*(x2-x1);
												}
												else{
													x2=over_x1;
													y2=k*(x2-x1)+y1;
												}												
											}
											else{
												if (over_x2-over_x1!=0){
													k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=x1;
													y2=k1*(x2-over_x1)+over_y1;
												}
											}
											this.movePoint(con[1],x2,y2);	
											break;
										default:
											break;									
									}//end switch (sCon[0])
								}
								else{
								//需要纠正x2,y2								
									if (Math.abs(czx2-czx1)>Math.abs(czy2-czy1)){										
										x2=parseInt(x1-(czy2-czy1)/(czx2-czx1)*(y2-y1));
									} 
									else{
										y2=parseInt(y1-(czx2-czx1)/(czy2-czy1)*(x2-x1));										
									} 
									
									this.movePoint(con[1],x2,y2);	
								}
								break;						
						}
						break;
					case "EPE": //EPE,B,A,L,type表述AB垂直L
						//alert("con:"+con);
						//应该判断当前移动的对象
						switch (hereID)
						{
							case con[1]://移动B点
								break;
							case con[2]://移动A点
							case con[3]://移动参照直线
								var cz=document.getElementById(con[3]);
								var czx1=parseInt(cz.getAttribute("x1"));
								var czy1=parseInt(cz.getAttribute("y1"));
								var czx2=parseInt(cz.getAttribute("x2"));
								var czy2=parseInt(cz.getAttribute("y2"));						
								var pa=document.getElementById(con[2]);
								var line_x1=parseInt(pa.getAttribute("cx"));
								var line_y1=parseInt(pa.getAttribute("cy"));
								var pb=document.getElementById(con[1]);
								var line_x2=parseInt(pb.getAttribute("cx"));
								var line_y2=parseInt(pb.getAttribute("cy"));						
								
								 var p1_x=czy2-czy1+line_x1;
				     var p1_y=-czx2+czx1+line_y1;
                     var p2_x=czy1-czy2+line_x1;
				     var p2_y=-czx1+czx2+line_y1;
					 var p_x,p_y;
                   //通过检查p1和p2哪个离P2的距离近则采用哪个坐标
                     if (((line_x2-p1_x)*(line_x2-p1_x)+(line_y2-p1_y)*(line_y2-p1_y))> ((line_x2-p2_x)*(line_x2-p2_x)+(line_y2-p2_y)*(line_y2-p2_y))){
                        p_x=p2_x;
						p_y=p2_y;
					 }
					 else{
                        p_x=p1_x;
						p_y=p1_y;
					 }
							/*	//if((czx1-czx2)*(x1-x2)>=0 && (czy1-czy2)*(y1-y2)>=0){ //czx1-czx2同向x1-x2
								if (con[4]=="1")
								{
									x2=x1-czx1+czx2;
									y2=y1-czy1+czy2;
								}
								else{
									x2=x1+czx1-czx2;
									y2=y1+czy1-czy2;
								}						*/
								this.movePoint(con[1],p_x,p_y);	
								break;						
						}
						
											
						break;
					case "POL":   //POL,PID,LineID,rate点在直线上				       
						if ($("#X"+con[1]).children().length>1)//有两个被限制条件
								{
									var secCon;//second con第二限制条件
									//var firset=$("#X"+con[1]).children().eq(0).text();
									var tempCon=($("#"+$("#X"+con[1]).children().eq(0).text()).text()).split(",");
									//this.myAlert("限制条件:"+$("#X"+con[1]).children().length);
									
									if (tempCon[0]==con[0])
									{
										secCon=($("#"+$("#X"+con[1]).children().eq(1).text()).text()).split(",");
									}
									else{
										secCon=tempCon;
									}
									//alert(secCon+"::"+con);
									//this.myAlert("2:"+secCon);
									var overObj=document.getElementById(con[2]);
											var over_x1=parseInt(overObj.getAttribute("x1"));
											var over_y1=parseInt(overObj.getAttribute("y1"));
											var over_x2=parseInt(overObj.getAttribute("x2"));
											var over_y2=parseInt(overObj.getAttribute("y2"));
									switch (secCon[0])//
									{
										case "PAR"://par,B,A,Line
											//alert("par");
											var cz=document.getElementById(secCon[3]);
											var czx1=parseInt(cz.getAttribute("x1"));
											var czy1=parseInt(cz.getAttribute("y1"));
											var czx2=parseInt(cz.getAttribute("x2"));
											var czy2=parseInt(cz.getAttribute("y2"));											
											
											var pa=document.getElementById(secCon[2]);
											var x1=parseInt(pa.getAttribute("cx"));
											var y1=parseInt(pa.getAttribute("cy"));
											var pb=document.getElementById(secCon[1]);
											var x2=parseInt(pb.getAttribute("cx"));
											var y2=parseInt(pb.getAttribute("cy"));	

											if (czx2-czx1!=0){
												k=(czy2-czy1)/(czx2-czx1);
												if (over_x2-over_x1!=0){
													var k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=(y1-over_y1+k1*over_x1-k*x1)/(k1-k);
													y2=y1+k*(x2-x1);
												}
												else{
													x2=over_x1;
													y2=k*(x2-x1)+y1;
												}												
											}
											else{
												if (over_x2-over_x1!=0){
													var k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=x1;
													y2=k1*(x2-over_x1)+over_y1;
												}
											}
											//this.myAlert(secCon[1]+":"+x2+","+y2);
											this.movePoint(secCon[1],x2,y2);	
											//this.movePoint(con[1],x2,y2);	
											break;
										case "PER":
											var cz=document.getElementById(secCon[3]);
											var czx1=parseInt(cz.getAttribute("x1"));
											var czy1=parseInt(cz.getAttribute("y1"));
											var czx2=parseInt(cz.getAttribute("x2"));
											var czy2=parseInt(cz.getAttribute("y2"));											
											
											var pa=document.getElementById(secCon[2]);
											var x1=parseInt(pa.getAttribute("cx"));
											var y1=parseInt(pa.getAttribute("cy"));
											var pb=document.getElementById(secCon[1]);
											var x2=parseInt(pb.getAttribute("cx"));
											var y2=parseInt(pb.getAttribute("cy"));	

											if (czy2-czy1!=0){
												var k=-(czx2-czx1)/(czy2-czy1);
												if (over_x2-over_x1!=0){
													k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=(y1-over_y1+k1*over_x1-k*x1)/(k1-k);
													y2=y1+k*(x2-x1);
												}
												else{
													x2=over_x1;
													y2=k*(x2-x1)+y1;
												}												
											}
											else{
												if (over_x2-over_x1!=0){
													k1=(over_y2-over_y1)/(over_x2-over_x1);
													x2=x1;
													y2=k1*(x2-over_x1)+over_y1;
												}
											}
											//this.myAlert(secCon[1]+":"+x2+","+y2);
											this.movePoint(secCon[1],x2,y2);	
											break;
										default:
											break;									
									}//end switch (sCon[0])
								}
								else{						
									//假设点分线段的比例不变,还应该检测其它被约束条件      
									//alert("POL");	   
									var x1=parseFloat($("#"+con[2]).attr("x1"));
									var y1=parseFloat($("#"+con[2]).attr("y1"));
									var x2=parseFloat($("#"+con[2]).attr("x2"));
									var y2=parseFloat($("#"+con[2]).attr("y2"));
									this.movePoint(con[1],parseInt((x2-x1)*con[3]+x1),parseInt((y2-y1)*con[3]+y1));
									//this.myAlert(x1+":"+y1+":"+x2+":"+y2+":"+(x2-x1)*con[3]+x1+"::"+(y2-y1)*con[3]+y1);
								}
						break;
					case "POC"://POC,PID,CID,alpha 圆上的点
						//point_node=svgDocument.getElementById(array_con[1]);
						//circle_node=svgDocument.getElementById(array_con[2]);
						var center_x=parseFloat($("#"+con[2]).attr("cx"));
						var center_y=parseFloat($("#"+con[2]).attr("cy"));
						var r=parseFloat($("#"+con[2]).attr("r"));
						var alpha=con[3];
						this.movePoint(con[1],center_x+r*Math.cos(alpha),center_y-r*Math.sin(alpha));
						break;
					case "CPR":  //CPR 点和半径确定的圆
						//CPR C,P
						$("#"+con[1]).attr("cx",$("#"+con[2]).attr("cx"));
						$("#"+con[1]).attr("cy",$("#"+con[2]).attr("cy"));
						break;
					case "C3P"://过三点的圆，C3P,cID,pid1,pid2,pid3
						var pr=this.get3PC(con[2],con[3],con[4]);
						var c=document.getElementById(con[1]);
						c.setAttribute("cx",pr[0]);
						c.setAttribute("cy",pr[1]);
						c.setAttribute("r",pr[2]);
						break;
					case "CPP":
						//CPP,C,o,P1,P2      //o为圆心，P1，P2分别是半径的两点
						var x1=$("#"+con[3]).attr("cx");
						var y1=$("#"+con[3]).attr("cy");
						var x2=$("#"+con[4]).attr("cx");
						var y2=$("#"+con[4]).attr("cy");
						var r=(Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))).toFixed(this.decimal);
						if (hereID==con[2])
						{
							$("#"+con[1]).attr("cx",$("#"+hereID).attr("cx"));
							$("#"+con[1]).attr("cy",$("#"+hereID).attr("cy"));
						}
						$("#"+con[1]).attr("r",r);
						
						break;
					case "PLL"://直线的交点
						//PLL，P，L1，L2 P为直线L1和L2的交点
						var x1=parseFloat($("#"+con[2]).attr("x1"));
						var y1=parseFloat($("#"+con[2]).attr("y1"));
						var x2=parseFloat($("#"+con[2]).attr("x2"));
						var y2=parseFloat($("#"+con[2]).attr("y2"));
						var x3=parseFloat($("#"+con[3]).attr("x1"));
						var y3=parseFloat($("#"+con[3]).attr("y1"));
						var x4=parseFloat($("#"+con[3]).attr("x2"));
						var y4=parseFloat($("#"+con[3]).attr("y2"));
						var pointxy=pointLL(x1,y1,x2,y2,x3,y3,x4,y4);
						this.movePoint(con[1],pointxy[0],pointxy[1]);
						break;
					case "PLC"://直线与圆的交点
						//PLC，P，L，C,Biaoji P为直线L和圆C的交点，Biaoji为F，S为第一交点或第二交点
						var point=document.getElementById(con[1]);
						var line=document.getElementById(con[2]);
						var circle=document.getElementById(con[3]);
						
						//alert("PLC");
						var points=pointsLC(line,circle);
						switch (points[0]){
							case "T":   //两个交点
								if (point.getAttribute("visibility")!="visible") visiblePoint(point);
								var x1=line.getAttribute("x1");
								var y1=line.getAttribute("y1");
								var x2=line.getAttribute("x2");
								var biaoji=true;       //标记第一个交点离线段起始端点近或远
								if (x1-x2 !=0){
									if ((points[3]-x1)/(points[1]-x1) > 1) {biaoji=true;} else {biaoji=false;}
								}
								else
								{
									if ((points[4]-y1)/(points[2]-y1) > 1) {biaoji=true;} else {biaoji=false;}
								}
								if ((biaoji && (con[4]=="F")) || (!biaoji && (con[4]=="S"))){
									this.movePoint(con[1],points[1],points[2]);
								}
								else{
									this.movePoint(con[1],points[3],points[4]);
								}
								break;
							case "O":    //一个交点
								break;
							case "N":
								if (point.getAttribute("visibility")!="hidden") hiddenPoint(point);
								break;     //无交点
						}						
						
						/*
						if (con[4]=="F")
						{
							this.movePoint(con[1],pointxy[1],pointxy[2]);
						}
						else{
							this.movePoint(con[1],pointxy[3],pointxy[4]);
						}
                        */
						break;
					case "PCC"://两圆的交点
					//开始处理圆与圆的交点1
					////PCC，P，C，C,Biaoji P为直线L和圆C的交点，Biaoji为F，S为第一交点或第二交点
              
				
                 var point = document.getElementById(con[1]);
				 var pointx=point.getAttribute("cx");
				 var pointy=point.getAttribute("cy");
				 var c1 = document.getElementById(con[2]);
                 var c2 = document.getElementById(con[3]);
				 var points = new Array(5);
				 points = pointsCC(c1,c2);
				 //alert("points:"+points);
				 switch (points[0]){
                    case "T":   //两个交点
					   if (point.getAttribute("visibility")!="visible") visiblePoint(point);
					   var cx=c1.getAttribute("cx");
					   var cy=c1.getAttribute("cy");
					   var cx1=c2.getAttribute("cx");
					   var cy1=c2.getAttribute("cy");
					   var angleP1=getAlpha(cx,cy,points[1],points[2]);
				       var angleP2=getAlpha(cx,cy,points[3],points[4]);
				       var angleRR=getAlpha(cx,cy,cx1,cy1);
                       var biaoji=false;
                        //P1<P2<R or R<P1<P2 or P2<R<P1 的时候P1为第一交点
				       if ((angleP1>angleRR && angleRR>angleP2) || ( (angleP1<angleP2) && (angleRR>angleP2 || angleRR < angleP1)))  biaoji=true;
                       
					   if ((biaoji && (con[4]=="F")) || (!biaoji && (con[4]=="S"))){
					      this.movePoint(con[1],points[1],points[2]);
					   }
					   else{
					      this.movePoint(con[1],points[3],points[4]);
					   }

					   break;
					case "O":    //一个交点
					   break;
					case "N":
					     if (point.getAttribute("visibility")!="hidden") hiddenPoint(point);
					   break;     //无交点

				 }
			     break;
//结束处理圆与圆的交点1
						
				}//end  switch (con[0])
			}  //end for (var i=0;i<$("#C"+heroID).children().length;i++ )
		}//end if ($("#X"+hereID).length>0)  //约束条件
		
	}//end while (moveList.length>0)		
};





SVG.prototype.movePoint=function(pointObj,x,y){
	//pointObj可以是点的ID，也可以是点对象。
	//alert("movePoint:"+pointObj);
	/*if (typeof pointObj=="object")
	{
		pointObj.setAttributeNS(null,"cx",x);
		pointObj.setAttributeNS(null,"cy",y);
		var objID=pointObj.getAttribute("id");
		$("#T"+objID).attr("x",x);
		$("#T"+objID).attr("y",y);
	}
	else{*/
	    //alert("MovePoint:"+x+","+y);
		$("#"+pointObj).attr("cx",x);
		$("#"+pointObj).attr("cy",y);
		$("#T"+pointObj).attr("x",x);
		$("#T"+pointObj).attr("y",y);

		if (this.mobile)
		{
			$("#B"+pointObj).attr("cx",x);//点的背景
			$("#B"+pointObj).attr("cy",y);
		}
		

		
		if (this.editable)
		{		
			var point=this.s2u([x,y]);		
			$("#I"+pointObj).find("span").html(point[0]+","+point[1]);
			//"点"+label+"("+"<span>"+point[0]+","+point[1]+"</span>)";
		}


	//}	
};

SVG.prototype.showHint=function(x,y,content){//打开提示消息
	var hint=$("#"+this.ID+"Hint");
	hint.attr("visibility","visible");
	hint.attr("x",x);
	hint.attr("y",y);
	hint.children(":first").html(content); 
};

SVG.prototype.hideHint=function(){//隐藏或关闭提示消息
	var hint=$("#"+this.ID+"Hint");
	hint.attr("visibility","hidden");
	
};


SVG.prototype.movePoint1=function(pointObj,x,y){
		var t;
		t=$("#"+pointObj).attr("cx");
		$("#"+pointObj).attr("cx",t+x);
		t=$("#"+pointObj).attr("cy");
		$("#"+pointObj).attr("cy",t+y);
		t=$("#T"+pointObj).attr("x");
		$("#T"+pointObj).attr("x",t+x);
		t=$("#T"+pointObj).attr("y");
		$("#T"+pointObj).attr("y",t+y);
		$("#"+pointObj).setAttributeNS(null,"transform","translate((x1-x)*count/(5*this.time), (y1-y)*count/(5*this.time))");
};




SVG.prototype.moveLine=function(lineID,pNo,x,y){
	//pointObj可以是线段的ID,PNo,第一个点还是第二个点
	
		
	//}	
};
SVG.prototype.symmetry=function(thing,axis,count){
	var x1,y1,x2,y2,cx,cy,id="",id1="",id2="",pos1,pos2;
	var xconID=$("#X"+thing).children().eq(0).text();
	var xcon=($("#"+xconID).text()).split(",");
//	alert(xcon[2])
			if(count>10*this.time){
			clearInterval(this.timer[thing]);
			return ;
		}
	switch(thing.substring(0,2))
	{
	case "FP":
	case "CP":
		switch(axis.substring(0,2))
		{
			case "FP":
			case "CP":
//				cx=$("#"+thing).attr("cx");
//				cy=$("#"+thing).attr("cy");
				this.ppSym(thing,axis,count);
				break;
			case "PP":
//				cx=$("#"+thing).attr("cx");
//				cy=$("#"+thing).attr("cy");
				this.plSym(thing,axis,count);
				break;
		}
		break;
	case "PP":
		var conID=$("#T"+thing).children();
			for(var i=0;i<conID.length;i++)
			{
				var con=conID.eq(i).text().split(",");
				if(con[2]==axis)
				id=con[3];
			}
		switch(axis.substring(0,2))
		{
		case "FP":
		case "CP":
//		alert(1)
//			alert(xcon[2]+" "+x1+" "+y1)
			pos1=this.ppSym(xcon[2],axis,count);
			x1=pos1[0];
			y1=pos1[1];
			id1=pos1[2];
			pos2=this.ppSym(xcon[3],axis,count);
			x2=pos2[0];
			y2=pos2[1];
			id2=pos2[2];
			if(count==1&&id==""){
						var line=$("#"+this.ID+"initLine");
				   line.attr("x1",x1);
				   line.attr("y1",y1);
				   line.attr("x2",x2);
				   line.attr("y2",y2);
						 var lineID="PP"+this.newChildID();
							id=lineID;
					   line=$("#"+this.ID+"initLine").clone();
					   line.attr("id",lineID);
					   $("#"+this.ID+"segment").append(line);
					   $("#"+this.ID+"initLine").attr("x1",-1);
					   $("#"+this.ID+"initLine").attr("y1",-1);
					   $("#"+this.ID+"initLine").attr("x2",-1);
					   $("#"+this.ID+"initLine").attr("y2",-1);
					   //第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
					   var con1="LPP,"+lineID+","+id1+","+id2;//直线ID,第一点，第二点
					   var pID1="C"+id1;
					   var selfID1="c"+this.newChildID();
					   this.newCon(selfID1,con1,pID1);
                       //alert("限制条件");
					   //第二个点限制直线的条件,与第一条件一样
					   //var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
					   var pID2="C"+id2;
					   var selfID2="c"+this.newChildID();
					   this.newCon(selfID2,con1,pID2);
                       
					   //直线的被限制条件                       
                       //第一个被限制条件
					   var pID="X"+lineID;
					   var selfID="x"+this.newChildID();
             this.newCon(selfID,selfID1,pID);
						var con1="SYM,"+thing+","+axis+","+id;//直线ID,第一点，第二点
						var pID1="T"+thing;
						var selfID1="t"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
						pID1="A"+axis;
						selfID1="a"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
						pID1="F"+id;
						selfID1="f"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
//				alert(1)
           }
           else
           {
           		$("#"+id).attr("x1",x1);		
           		$("#"+id).attr("x2",x2);		
           		$("#"+id).attr("y1",y1);		
           		$("#"+id).attr("y2",y2);		
           }
//             
			break;
			case "PP":
			pos1=this.plSym(xcon[2],axis,count);
			pos2=this.plSym(xcon[3],axis,count);
			x1=pos1[0];
			y1=pos1[1];
			id1=pos1[2];
			x2=pos2[0];
			y2=pos2[1];
			id2=pos2[2];
			if(count==1&&id==""){
						var line=$("#"+this.ID+"initLine");
				   line.attr("x1",x1);
				   line.attr("y1",y1);
				   line.attr("x2",x2);
				   line.attr("y2",y2);
						 var lineID="PP"+this.newChildID();
						id=lineID;
					   line=$("#"+this.ID+"initLine").clone();
					   line.attr("id",lineID);
					   $("#"+this.ID+"segment").append(line);
					   $("#"+this.ID+"initLine").attr("x1",-1);
					   $("#"+this.ID+"initLine").attr("y1",-1);
					   $("#"+this.ID+"initLine").attr("x2",-1);
					   $("#"+this.ID+"initLine").attr("y2",-1);
					   //第一个点限制直线(线段)的条件,限制条件ID为"C"+id,孩子为"c"+id,被限制条件为"X"+id,"x"+id
					   var con1="LPP,"+lineID+","+id1+","+id2;//直线ID,第一点，第二点
					   var pID1="C"+id1;
					   var selfID1="c"+this.newChildID();
					   this.newCon(selfID1,con1,pID1);
                       //alert("限制条件");
					   //第二个点限制直线的条件,与第一条件一样
					   //var con2="PP,"+id+","+this.startPoint[2]+","+lineID;//第一点，第二点，直线
					   var pID2="C"+id2;
					   var selfID2="c"+this.newChildID();
					   this.newCon(selfID2,con1,pID2);
                       
					   //直线的被限制条件                       
                       //第一个被限制条件
					   var pID="X"+lineID;
					   var selfID="x"+this.newChildID();
             this.newCon(selfID,selfID1,pID);
							var con1="SYM,"+thing+","+axis+","+id;//直线ID,第一点，第二点
							var pID1="T"+thing;
							var selfID1="t"+this.newChildID();
							this.newCon(selfID1,con1,pID1);
						pID1="A"+axis;
						selfID1="a"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
						pID1="F"+id;
						selfID1="f"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
           }
           else{
           		$("#"+id).attr("x1",x1);		
           		$("#"+id).attr("x2",x2);		
           		$("#"+id).attr("y1",y1);		
           		$("#"+id).attr("y2",y2);		
           			
           }
					break;
		}
		break;
	case "fx":
			this.funSym(thing,axis,count);
			break;
	}
	count++;
	return count;
//		scon[thing]=[axis,]

};



SVG.prototype.addLeftEvent=function(){

//记录需要用到变量
var othis=this;
var id=this.ID;//SVG ID
var ID=id+"I";
var objID="";//操作图形对象的ID
  var recordID = {
	  rank:"EX"+id,                       //记录现在鼠标的焦点在第几个li标签上
  }   
 /* $("#"+ID).on('click',"li",function(e){//获取li下第二个div下的div id
	  //alert("expression-box:"+this.id);children("div").eq(0).
	   var iID=$(this).children("div").eq(1).children("div").eq(0).attr("id");
	   //alert("iID:"+iID);
	   if (iID.substr(0,3)=="FUN")
	   {
		   objID="fx"+iID.substr(3);
	   }
  });*/
  
  $("#"+ID).on('click','li span.mathquill-editable',function(e){
	  recordID.rank = $(this).attr("id");
	 
  });
  $("div.keys-container").on('click','ul.keys-list>li>a',function(e){
	  var q = $(this).attr("name");
	  $("#"+recordID.rank).mathquill("write", q.replace("{/}","\\"));  
  })
  //删除按钮
  $("#"+ID).on('click','li > .icon-list i.fa-times',function(e){
	  e.stopPropagation();
	  alert("del:"+$(this).parent().parent().attr("id")+"|"+$(this).parent().parent().attr("class"));
	  $(this).parent().parent().parent().parent().fadeOut("fast",function(){
			$(this).remove();
			
			$("#"+ID+" > li").each(function(index, element) {
				$(this).find("div.num").text($(this).index()+1); 
			});
		   
	  })
  })
  //记录变量 判断是哪个li点击改变颜色
  var _thisid  =  "";
  //改变颜色按钮
  $("#"+ID).on('click','li > .icon-list i.fa-color',function(e){
	  e.stopPropagation();
	  var toffset = $(this).offset();
	  var fa_color = $(this).attr("class").split(" ")[2];
	  _thisid = $(this).parent().parent().parent().prev().children().attr("id");
	  $(".dcg-options-menu").show().css({left:toffset.left,top:toffset.top-4}).find("span."+fa_color).addClass("dcg-selected").siblings().removeClass("dcg-selected");
	  
  })
  $(".dcg-options-menu").find("span.dcg-color-option").click(function(e){
	  e.stopPropagation();
      //alert("class:"+$(this).attr("class"));
	  var _thiscolor = $(this).attr("class").split(" ")[1];
	  $("#"+_thisid).parent().next().find("i.fa-color").attr("class","fa fa-color "+_thiscolor);
	  //alert("color&id"+_thiscolor+"::"+_thisid);
	  $(".dcg-options-menu").hide();  
	
		othis.changeColor("fx"+_thisid.substring(3),_thiscolor.split("-")[1]);
		//othis.changeColor(objID,_thiscolor.split("-")[1]);

	  
  })
  //虚线实线
  $("#"+ID).on('click','li > .icon-list i.dcg-graph-icon',function(e){
	  e.stopPropagation();	  
	  //alert("recordID:"+recordID.rank+"::"+recordID.id);
	//alert("虚实线:id"+$(this).parent().parent().attr("id")+"|"+$(this).parent().parent().attr("class"));
	  var svgID="fx"+$(this).parent().parent().attr("id").substr(1);
	  if($(this).hasClass("dcg-graph-dashed"))
	  {
		  $(this).attr("class","dcg-graph-icon dcg-graph-normal");
		 
		  //othis.changeDash(recordID.id,"null");
		  othis.changeDash(svgID,"null");
	  }else{
		  $(this).attr("class","dcg-graph-icon dcg-graph-dashed");
		  //othis.changeDash(recordID.id,"10!5");
		  othis.changeDash(svgID,"10!5");
	  }
  }) 
  //隐藏按钮
  $("#"+ID).on('click','li > .icon-list li.line_open_close',function(e){
	e.stopPropagation();	
	//alert("hidden");
	//alert("隐藏:id"+$(this).parent().attr("id")+"|"+$(this).parent().attr("class"));
	var svgID="fx"+$(this).parent().attr("id").substr(1);
	if($(this).children().hasClass("glyphicon-eye-open"))
	{
		//alert("open");
		othis.changeVisible(svgID,"F");

	}
	else{
		//alert("close");
		othis.changeVisible(svgID,"T");
	}

	$(this).children().toggleClass("glyphicon-eye-open").toggleClass("glyphicon-eye-close"); 
  })
  //右边下拉
  $("#"+ID).on('click','li > .icon-list>.dropdown-toggle',function(e){
	  e.stopPropagation();
	  if(!$(this).next().is(":visible"))
	  {
		   $(this).next().show();
	  }else{
		  $(this).next().hide();
		  $(".dcg-options-menu").hide();  
	  }
  })
  //点击其他位置 隐藏左边按钮
  $(document).click(function(){
		  $(".icon-list ul.dropdown-menu").hide();
		  $(".dcg-options-menu").hide();  
  })
  //拖拽
  $("#"+ID).on('touchstart.drag.founder mousedown.drag.founder',"li > div.num",function(e){
	  	  var h = $(this).parent().height();   //得到li的高度
	      $(this).parent().addClass("lidrag");
		  $("#"+id+"addRow").hide();
		  var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,   	
			  disX = ev.pageX,  
			  disY = ev.pageY,  
			  that = $(this).parent(),
			  idx;  
		  $(document).on('touchmove.drag.founder mousemove.drag.founder', function(e) {  
			  var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,  
				  $this = that,     
				  top = ev.pageY - disY;
				  idx = parseInt(top/60);
				$this.siblings().css("transform","translate(0px,0px)"); 
			  if(idx>0){
				$this.nextAll().slice(0,idx).css("transition",".5s").css("transform","translate(0px,"+(-h)+"px)"); 
			  }else if(idx<0){
				$this.prevAll().slice(0,-idx).css("transition",".5s").css("transform","translate(0px,"+h+"px)");  
			  }
			   $this.css("transform","translate(0px,"+top+"px)"); 
			  return false;
		  })
		  $(document).on('touchend.drag.founder mouseup.drag.founder', function(e) {  
			  var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;    
			  $(document).off('.drag.founder');
			  that.releaseCapture && that.releaseCapture();
			  that.removeClass("lidrag");
			  $("#"+ID+">li").css("transition","none").css("transform","none"); 
			  if(idx>0){
				that.nextAll().eq(idx-1 > that.nextAll().length -1?that.nextAll().length -1:idx-1).after(that); 
			  }else if(idx<0){
				that.prevAll().eq(-idx-1 > that.prevAll().length - 1?that.prevAll().length - 1:-idx-1).before(that); 
			  }
			  //排序
			  $("#"+ID+" > li").each(function(index, element) {
               $(this).find("div.num").text($(this).index()+1); 
              });
			  $("#"+id+"addRow").show();
			  return false;  
		  });   
		  that.setCupture && that.setCapture();
		  e.stopPropagation();
		  e.preventDefault();  
	  }); 

}
//content代表显示的内容，x2,y2代表坐标点的位置
function tipAlert(x2,y2,content){
	$(".dcg-tracept").show().css({left:x2,top:y2});
	$(".dcg-tracept .dcg-label").text(content);
}


SVG.prototype.changeColor=function(id,color,t){//改变颜色
	if (typeof t == "undefined")
	{
		this.action("ChC~"+id+"~"+color);
	}
	var obj=document.getElementById(id);
	obj.setAttribute("stroke","#"+color);
	//$("#"+id).attr("stroke","#"+color);
//var funSrc=type+","+fun+","+x_min+","+x_max+","+points+","+min_type+","+max_type+","+stroke1+","+strokewidth1+","+strokedash1;
	var src=obj.getAttribute("funSrc").split(",");
	src[7]="#"+color;
    obj.setAttribute("funSrc",src.toString());
	//alert("changeColor:"+obj.getAttribute("funSrc"));
	//alert("changeColor:"+$("#"+id).attr("funSrc"));//不能用jquery
}
//stroke-dasharray
SVG.prototype.changeDash=function(id,dash,t){//改变颜色
	if (typeof t == "undefined")
	{
		this.action("ChD~"+id+"~"+dash);
	}
	//alert("changeDash:"+id);
	var obj=document.getElementById(id);
	obj.setAttributeNS(null,"stroke-dasharray",dash.split("!"));
	//$("#"+id).attr("stroke","#"+color);
//var funSrc=type+","+fun+","+x_min+","+x_max+","+points+","+min_type+","+max_type+","+stroke1+","+strokewidth1+","+strokedash1+""+visible;
	var src=obj.getAttribute("funSrc").split(",");
	src[9]=dash;
    obj.setAttributeNS(null,"funSrc",src.toString());
	//alert("changeColor:"+obj.getAttribute("funSrc"));
	//alert("changeColor:"+$("#"+id).attr("funSrc"));//不能用jquery
}

SVG.prototype.changeVisible=function(id,v,t){//改变颜色
	if (typeof t == "undefined")
	{
		this.action("ChV~"+id+"~"+v);
	}
	//alert("id:"+id);
	var obj=document.getElementById(id);
	if (v=="T")
	{
		obj.setAttributeNS(null,"visibility","visible");
	}
	else{
		obj.setAttributeNS(null,"visibility","hidden");
	}
	var src=obj.getAttribute("funSrc").split(",");
	src[10]=v;
    obj.setAttributeNS(null,"funSrc",src.toString());
	
}

SVG.prototype.ppSym=function(thing,axis,count){				//点关于点对称
	var x,y,id;
			x=parseFloat($("#"+thing).attr("cx"));
			x1=parseFloat($("#"+axis).attr("cx"));
			y=parseFloat($("#"+thing).attr("cy"));
			y1=parseFloat($("#"+axis).attr("cy"));
			x=x+(x1-x)*count/(5*this.time);
			y=y+(y1-y)*count/(5*this.time);
			var conID=$("#T"+thing).children();
			for(var i=0;i<conID.length;i++)
			{
				var con=conID.eq(i).text().split(",");
				if(con[2]==axis)
				id=con[3];
			}
//			alert(id)

			if(count==1&&id==undefined) 
			{
	    	id="CP"+this.newChildID();						//对称后的点为被控点
				var label=this.newLabel();	 
				this.newPoint(id,x,y,label);
				var con1="SYM,"+thing+","+axis+","+id;//直线ID,第一点，第二点
				var pID1="T"+thing;
				var selfID1="t"+this.newChildID();
				this.newCon(selfID1,con1,pID1);
						pID1="A"+axis;
						selfID1="a"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
						pID1="F"+id;
						selfID1="f"+this.newChildID();
						this.newCon(selfID1,con1,pID1);

//				alert(this.scon[0])
	    }
	    else
	    {
	    	this.movePoint(id,x,y);		
//	    	var node=document.getElementById(id);
//				node.setAttributeNS(null,"transform","translate(1, 1) skewY(15)");
//				alert(id)
	    }
	    return [x,y,id];
//			

}
SVG.prototype.plSym=function(thing,axis,count){				//点关于线对称
	var x,y,id;
	x1=$("#"+axis).attr("x1");
	x2=$("#"+axis).attr("x2");
	y1=$("#"+axis).attr("y1");
	y2=$("#"+axis).attr("y2");
	cx=$("#"+thing).attr("cx");
	cy=$("#"+thing).attr("cy");
	a=y1-y2;
	b=x2-x1;
	c=x1*y2-x2*y1;
	if((a*a+b*b)>0)
	{
	x=cx-2*a*(a*cx+b*cy+c)*count/(10*(a*a+b*b)*this.time);
	y=cy-2*b*(a*cx+b*cy+c)*count/(10*(a*a+b*b)*this.time);
	}
			  var conID=$("#T"+thing).children();
			for(var i=0;i<conID.length;i++)
			{
				var con=conID.eq(i).text().split(",");
				if(con[2]==axis)
				id=con[3];
			}
			if(count==1&&id==undefined) 
			{
				var label=this.newLabel();	  
	    	id="CP"+this.newChildID();						//对称后的点为被控点
				this.newPoint(id,cx,cy,label);
				var con1="SYM,"+thing+","+axis+","+id;//直线ID,第一点，第二点
				var pID1="T"+thing;
				var selfID1="t"+this.newChildID();
				this.newCon(selfID1,con1,pID1);
						pID1="A"+axis;
						selfID1="a"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
						pID1="F"+id;
						selfID1="f"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
	    }
	    else
	    {
	    	this.movePoint(id,x,y);		
	    }
//			alert(1)
	return [x,y,id];
}
SVG.prototype.goBack=function(id){		//当修改函数时，其上的点自动回到修改后函数图像上
	var conID=$("#C"+id).children();
	var con=new Array();
	var i;
	var now=[];
//	alert(conID.eq(0))
//	alert(conID.eq(0).text())
				for(i=0;i<conID.length;i++)
			{
				con[i]=conID.eq(i).text().split(",")[1];
				if(con[i].substring(0,2)=="FP"||con[i].substring(0,2)=="CP"){
				now=this.st[con[i]];
//alert(con[i])				
				this.moveObject(con[i],now[0],now[1]);
			}
			}


}
SVG.prototype.funSym=function(thing,axis,count){
		var arr=new Array(),id;
//		this.goBack(thing)
//				alert(count)
			  var conID=$("#T"+thing).children();
			for(var i=0;i<conID.length;i++)
			{
				var con=conID.eq(i).text().split(",");
				if(con[2]==axis)
				id=con[3];
			}
			if(count==1&&id==undefined){
				id="fx"+this.newChildID();
				var con1="SYM,"+thing+","+axis+","+id;//直线ID,第一点，第二点
				var pID1="T"+thing;
				var selfID1="t"+this.newChildID();
				this.newCon(selfID1,con1,pID1);
						pID1="A"+axis;
						selfID1="a"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
						pID1="F"+id;
						selfID1="f"+this.newChildID();
						this.newCon(selfID1,con1,pID1);
/**/			}
		  else{
			  //删除此ID原来的图形
//			  alert(con)
			  delFun(id);
		  }//alert(count+" "+id)
		  tag[id]=[];
		switch(axis.substring(0,2))
		{
		case "FP":
		case "CP":
			tempx=($("#"+axis).attr("cx")-this.origin[0])/this.xyUnit;
		  tempy=(this.origin[1]-$("#"+axis).attr("cy"))/this.xyUnit;
//alert(this.cord[0][thing])
			for(var i=0;i<len;i++)
			{
		 		arr[i]=[this.cord[i][thing][0],this.cord[i][thing][1]];
				arr[i][0]=arr[i][0]+(tempx-arr[i][0])*count/(5*this.time);
				arr[i][1]=arr[i][1]+(tempy-arr[i][1])*count/(5*this.time);
				this.cord[i][id]=arr[i];
			}
			
			tag[id][0]=tag[thing][0];
			strokewidth=2;
			this.path(arr,id,"","","");
			break;
//		alert(arr[0][1]+" "+len)
		case "PP":
			var cx,cy;
				x1=($("#"+axis).attr("x1")-this.origin[0])/this.xyUnit;
				x2=($("#"+axis).attr("x2")-this.origin[0])/this.xyUnit;
				y1=(this.origin[1]-$("#"+axis).attr("y1"))/this.xyUnit;
				y2=(this.origin[1]-$("#"+axis).attr("y2"))/this.xyUnit;
				a=y1-y2;
				b=x2-x1;
				c=x1*y2-x2*y1;
			for(var i=0;i<len;i++)
			{
		 		cx=this.cord[i][thing][0];
		 		cy=this.cord[i][thing][1];
//			alert(cx+" "+cy+" "+a+" "+b+" "+c)
				if((a*a+b*b)>0){
				tempx=cx-2*a*(a*cx+b*cy+c)/(a*a+b*b);
//			alert(arr[i][0])
				tempy=cy-2*b*(a*cx+b*cy+c)/(a*a+b*b);
				x=cx-a*(a*cx+b*cy+c)*count/(5*(a*a+b*b)*this.time);
				y=cy-b*(a*cx+b*cy+c)*count/(5*(a*a+b*b)*this.time);
			}
				arr[i]=[x,y];
				this.cord[i][id]=arr[i];
			}
			tag[id][0]=tag[thing][0];
			strokewidth=2;
			this.path(arr,id,"","","");
			break;
		}	

}





SVG.prototype.myAlert=function(t){  //显示调试信息
   $("#"+this.ID+"disp").text(t);
};

//距离，如果x3,y3未定义，则是点到点的距离，否则，为点到直线的距离
SVG.prototype.distance=function(x1,y1,x2,y2,x3,y3){  //显示调试信息
   var distance=0;
   if (typeof x3 == "undefined")
   {//点到点的距离
		var ps=this.s2u([x1,y1]);
		var pe=this.s2u([x2,y2]);
		distance=Math.sqrt((ps[0]-pe[0])*(ps[0]-pe[0])+(ps[1]-pe[1])*(ps[1]-pe[1])).toFixed(this.decimal);
 
   }
   else{//点到直线的距离
	   //点(startx,starty)到直线child(x1,y1,x2,y2)的距离的平方为
		var d=((y3-y2)*x1-(x3-x2)*y1+(x3-x2)*y2-(y3-y2)*x2)*((y3-y2)*x1-(x3-x2)*y1+(x3-x2)*y2-(y3-y2)*x2)/((y3-y2)*(y3-y2)+(x3-x2)*(x3-x2));
		distance=Math.sqrt(d);
		distance=this.Ls2u(d);
		
	}
	return distance;
};

//获取对象的名字（点线圆）
function getNameById(id){
	var id2=id.substring(0,2);
	var result="";
	
	switch (id2)
	{
		case "FP":
		case "CP":
			result="点"+$("#T"+id).text();
			break;
		case "PP":
			var xCon=$("#X"+id);
			//var xconID=$("#X"+moveID).children().eq(0).text();
			//var xcon=($("#"+xconID).text()).split(",");
			//var conID=$("#C"+moveID).children();
			if (xCon.length>0)
			{
				var xconID=xCon.children().eq(0).text();//被限制条件ID
				var xcon=($("#"+xconID).text()).split(",");
				switch (xcon[0])
				{
					case "LPP":
						//LPP,PPSSVGParent1003,FPSSVGParent1001,FPSSVGParent1002
						result="线段"+$("#T"+xcon[2]).text()+$("#T"+xcon[3]).text();
						break;
					default:
						break;				
				}
				
			}
			break;
		case "CR":
			var xCon=$("#X"+id);
			//var xconID=$("#X"+moveID).children().eq(0).text();
			//var xcon=($("#"+xconID).text()).split(",");
			//var conID=$("#C"+moveID).children();
			if (xCon.length>0)
			{
				var xconID=xCon.children().eq(0).text();//被限制条件ID
				var xcon=($("#"+xconID).text()).split(",");
				switch (xcon[0])
				{
					case "CPR":
						
						//CPR,CRSSVGParent1002,FPSSVGParent1001
						result="圆"+$("#T"+xcon[2]).text();
						break;
					case "CPP":
						//CPP,CRSSVGParent1018,FPSSVGParent1001,FPSSVGParent1001,CPSSVGParent1007
						result="圆"+$("#T"+xcon[2]).text();
						break;
					default:
						break;				
				}
				
			}

			break;
		default:
			break;
	
	}
	return result;

}

//获取园上点的弧角
function getAlpha(c_x,c_y,sx,sy){
	var center_x=c_x,center_y=c_y;
	var point_x=sx,point_y=sy;
	var alpha=0;
  if (point_x-center_x==0){
    if (point_y<center_y){
      alpha=Math.PI/2;
    }
    else{
      alhpa=3*Math.PI/2;
    }
  }
  else if (point_x>center_x){
    alpha=Math.atan((point_y-center_y)/(center_x-point_x));
    if (alpha<0) alpha=alpha+2*Math.PI;
  }
  else{
    alpha=Math.PI-Math.atan((point_y-center_y)/(point_x-center_x));
   
  }
  
  return alpha;
}

//求两直线的交点，参数两条线段的端点坐标，返回一数组(x,y)为交点坐标
function pointLL(x1,y1,x2,y2,czx1,czy1,czx2,czy2){
	/*var a=x2-x1;
	var b=x4-x3;
	var c=y4-y3;
	var d=y2-y1;
	var x=0+(a*b*(y3-y1)+b*d*x1-a*c*x3)/(b*d-a*c);
	var y=0+c*(x-x3)/b+y3;*/
	var a1=y2-y1;
	var b1=x1-x2;
	var c1=y1*(x2-x1)-x1*(y2-y1);
	var a2=czy2-czy1;
	var b2=czx1-czx2;
	var c2=czy1*(czx2-czx1)-czx1*(czy2-czy1);
	
	//两直线的交点的坐标
	var p_y=0;
	var p_x=(c1*b2-c2*b1)/(a2*b1-a1*b2);
	if (x2!=x1) {
	   p_y=(p_x-x1)*(y2-y1)/(x2-x1)+y1;
	}
	else{
	   p_y=(p_x-czx1)*(czy2-czy1)/(czx2-czx1)+czy1;

	}
	return new Array(p_x,p_y);
}

//求圆和直线的交点，参数为线段和圆对象
//返回一个数组({N|T|O},x1,y1,x2,y2),N表示没交点，T表示两个交点，O表示一个交点
function pointsLC(line,circle){
   var returnValue = new Array(5);
   var x1=parseFloat(line.getAttribute("x1"));
   var y1=parseFloat(line.getAttribute("y1"));
   var x2=parseFloat(line.getAttribute("x2"));
   var y2=parseFloat(line.getAttribute("y2"));

   var cx=parseFloat(circle.getAttribute("cx"));
   var cy=parseFloat(circle.getAttribute("cy"));
   var r=parseFloat(circle.getAttribute("r"));
   
   if ((y2-y1) !=0 ){
     var k=(x1-x2)/(y1-y2);
	 var a=k*k+1;
	 var b=2*(k*(x1-cx-k*y1)-cy);
	 var c=(x1-cx-k*y1)*(x1-cx-k*y1)+cy*cy-r*r;
	 var delta=b*b-4*a*c;
	 if (delta<0){  //没有交点
	    returnValue[0]="N";
        
	 }
	 else 
	 {
	   if (delta>0){  //两个交点
	      returnValue[0]="T";
		  var tempy=(-b+Math.sqrt(delta))/(2*a);
          returnValue[2]=parseFloat(tempy);
		  returnValue[1]=parseFloat(k*(tempy-y1)+x1);
          tempy=(-b-Math.sqrt(delta))/(2*a);
          returnValue[4]=parseFloat(tempy);
		  returnValue[3]=parseFloat(k*(tempy-y1)+x1);
            
	   }
	   else
	   {   //相切 一个交点
	      returnValue[0]="O";
		  var tempy=-b/(2*a);
          returnValue[2]=parseFloat(tempy);
		  returnValue[1]=parseFloat(k*(tempy-y1)+x1);  
	   }
	 }
   }  
   else
   {
     var k=(y1-y2)/(x1-x2);
	 var a=k*k+1;
	 var b=2*(k*(y1-cy-k*x1)-cx);
	 var c=(y1-cy-k*x1)*(y1-cy-k*x1)+cx*cx-r*r;
	 var delta=b*b-4*a*c;
	 if (delta<0){  //没有交点
	    returnValue[0]="N";
        
	 }
	 else 
	 {
	   if (delta>0){  //两个交点
	      returnValue[0]="T";
		  var tempx=(-b+Math.sqrt(delta))/(2*a);
          returnValue[1]=parseFloat(tempx);
		  returnValue[2]=parseFloat(k*(tempx-x1)+y1);
          tempx=(-b-Math.sqrt(delta))/(2*a);
          returnValue[3]=parseFloat(tempx);
		  returnValue[4]=parseFloat(k*(tempx-x1)+y1);
            
	   }
	   else
	   {   //相切 一个交点
	      returnValue[0]="O";
		  var tempx=-b/(2*a);
          returnValue[1]=parseFloat(tempx);
		  returnValue[2]=parseFloat(k*(tempx-x1)+y1);  
	   }
	 }
   }
   return returnValue;
}

//两圆的交点，参数c1，c2为两圆的对象
//返回一个数组({N|T|O},x1,y1,x2,y2),N表示没交点，T表示两个交点，O表示一个交点
function pointsCC(c1,c2){
   var returnValue = new Array(5);
   var cx=parseInt(c1.getAttribute("cx"));
   var cy=parseInt(c1.getAttribute("cy"));
   var r=parseInt(c1.getAttribute("r"));
   
   var cx2=parseInt(c2.getAttribute("cx"));
   var cy2=parseInt(c2.getAttribute("cy"));
   var r2=parseInt(c2.getAttribute("r"));

   var m=(r*r-cx*cx-cy*cy-r2*r2+cx2*cx2+cy2*cy2)/2;   
   var x1,x2,y1,y2;

   
   if ((cx2-cx) !=0 ){
     y1=0;
	 y2=1;
	 x1=m/(cx2-cx);
	 x2=(m-cy2+cy)/(cx2-cx);
     var k=(x1-x2)/(y1-y2);
	 var a=k*k+1;
	 var b=2*(k*(x1-cx-k*y1)-cy);
	 var c=(x1-cx-k*y1)*(x1-cx-k*y1)+cy*cy-r*r;
	 var delta=b*b-4*a*c;
	 if (delta<0){  //没有交点
	    returnValue[0]="N";
        
	 }
	 else 
	 {
	   if (delta>0){  //两个交点
	      returnValue[0]="T";
		  var tempy=(-b+Math.sqrt(delta))/(2*a);
          returnValue[2]=parseInt(tempy);
		  returnValue[1]=parseInt(k*(tempy-y1)+x1);
          tempy=(-b-Math.sqrt(delta))/(2*a);
          returnValue[4]=parseInt(tempy);
		  returnValue[3]=parseInt(k*(tempy-y1)+x1);
            
	   }
	   else
	   {   //相切 一个交点
	      returnValue[0]="O";
		  var tempy=-b/(2*a);
          returnValue[2]=parseInt(tempy);
		  returnValue[1]=parseInt(k*(tempy-y1)+x1);  
	   }
	 }
   }  
   else
   {
     x1=0;
	 x2=1;
	 y1=m/(cy2-cy);
	 y2=(m-cx2+cx)/(cy2-cy);

	 var k=(y1-y2)/(x1-x2);
	 var a=k*k+1;
	 var b=2*(k*(y1-cy-k*x1)-cx);
	 var c=(y1-cy-k*x1)*(y1-cy-k*x1)+cx*cx-r*r;
	 var delta=b*b-4*a*c;
	 if (delta<0){  //没有交点
	    returnValue[0]="N";
        
	 }
	 else 
	 {
	   if (delta>0){  //两个交点
	      returnValue[0]="T";
		  var tempx=(-b+Math.sqrt(delta))/(2*a);
          returnValue[1]=parseInt(tempx);
		  returnValue[2]=parseInt(k*(tempx-x1)+y1);
          tempx=(-b-Math.sqrt(delta))/(2*a);
          returnValue[3]=parseInt(tempx);
		  returnValue[4]=parseInt(k*(tempx-x1)+y1);
            
	   }
	   else
	   {   //相切 一个交点
	      returnValue[0]="O";
		  var tempx=-b/(2*a);
          returnValue[1]=parseInt(tempx);
		  returnValue[2]=parseInt(k*(tempx-x1)+y1);  
	   }
	 }
   }
   return returnValue;
}



//隐藏点，与删除点重复
function hiddenPoint(point){
   point.setAttributeNS(null,"visibility","hidden");
   var text_id="T"+point.getAttribute("id");
   var textNode=document.getElementById(text_id);
   textNode.setAttributeNS(null,"visibility","hidden");
}

//显示点
function visiblePoint(point){
   point.setAttributeNS(null,"visibility","visible");
   var text_id="T"+point.getAttribute("id");
   var textNode=document.getElementById(text_id);
   textNode.setAttributeNS(null,"visibility","visible");
}



//规范化数学表达式
function mathConvert(input)			//除去空格，并转为小写
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
/*
SVG.prototype.checkExp=function(Expression,def,undef)	//判断是否是有效数学表达式
{
		//alert("expression:"+Expression);
		//this.myAlert("expression:"+Expression);
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
		result[0]=0;
		result[1]="缺少参数";
		result[2]=def;
		result[3]=undef;
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
						//alert("-");
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
						else if(LeftExpression==null)
							result=this.checkExp(RightExpression,def,undef);
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
		//alert("-");
        return this.checkExp(Expression.substring(1,Expression_Len),def,undef);
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
		        	temp=RightExpression1.split(",",1);
		        	if(RightExpression1.length==0||temp!=RightExpression1)
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
								len=RightExpression.length;
			        	temp=RightExpression.split(",",1);
			        	if(len==0||temp!=RightExpression)
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
			        	s=new Array();
			        	s=RightExpression.split(",");
		//	        	alert(RightExpression);
		//	        	alert(temp);
			        	if(s.length!=2)
			        	{
			        		result[0]=0;
		              result[1]=("参数数量错误");
			        		return result;
								}
								result=this.checkExp(RightExpression,def,undef);
								if(result[0])
				        	result[1]=LeftExpression+result[1]+')';
			        	
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
			next=Expression.charAt(i+1);
//					alert(x);
			if(x=="x"||x=="y"||x=="z"||x=="r"||x=="t")
			{
	       break;
	    }
			else if(x>='a'&&x<'z'){
				
*/				
				
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
/*				if (this.varA[x]==undefined || this.varA[x]==null)
				{
					if (undef.indexOf(x)<0) //排除重复变量	
					{
						
						undef+=x;
					}		
					
					result[3]=undef;
					str="A['"+x+"']";
					if(next>='a'&& next<='z') str+='*';
					result[1]=result[1].replace(x,str);
				}
				else
				{
					if (def.indexOf(x)<0)
					{
						def+=x;
					}					
					str="A['"+x+"']";//constent[x].toString();
					if(next>='a'&&next<='z')
						str+='*';
					result[1]=result[1].replace(x,str);
					result[2]=def;
				}
				//alert(x+"::"+undef+":"+result[3]);

			}
		}
	//    alert("未知错误发生!");

	  return result;
}

*/



/*
角色:点 线 圆
  角色之间的交互包含在角色的活动函数中.角色函数应该包括生成,移动和删除.

  ID与对象的对应关系
     FPxxxxx表示自由点
     CPxxxxx表示约束点
     PPxxxxx表示两点决定的直线
     CRxxxxx表示圆

  几何关系
      LPP,L,P1,P2  表示两点决定的直线L由P1,P2决定;
      POL,CP,L,rate   表示点CP在直线L上,且r=(Px-x1)/(x2-x1) 或 (Py-y1)/(y2-y1)
      POC,CP,CR,alpha   表示点cp在圆CR上,alpha为弧角，0<=alpha<2Pi
      CPR,CR,P   表示点P为圆CR的圆心，自由圆
	  C3P,CID,pid1,pid2,pid3 三点决定的圆
      CPP,CR,C,A,B   表示点C为圆心，线段AB为半径的圆
      PAR,L1,L2  平行   改为PAR,B,A,L1,
	  PER,B,A,L   垂直
      EPA,B,A,L  L平行且等于AB 改为EPA,B,A,L1,type  直线AB//L1,type为1或-1，1表示BA与L1同向，-1表述AB与L1反向，L1的方向由x1,x2决定，如果x1=x2,则由y1,y2决定    

      EPE,B,A,L  L垂直且等于AB

      PLL,P,L1,L2  两直线的交点
      PLC,P,L,C   直线与圆的交点
      PCC,P,C,C   圆和圆的焦点      
      ELN,B,A,L  作线段AB，长度等于L的长度

	  Angle,angleID,P1,P2,P3
	  MPL,P,L  点P为线段L的中点


  var,fxID  变量限制函数 
  varP,PointID,xExpress,YExpress 变量限制点，xExpress,yExpress分别为x,y的表达式

约束点:
  点在线上
  点在圆上
  两直线的交点
  直线与圆的交点
  圆与圆的交点
  垂心
  重心

直线:
  两点决定的直线
  平行线
  垂线
  角平分线
  圆的切线
  
圆:
  过三点的圆
  内切圆

  action
  坐标均用用户坐标
  新生成点："NP~"+id_point+"~"+startx+"~"+starty+"~"+label+"~"+id_point 
     id_point 新生产点的ID
	 label   点的名称
  生成新的约束条件："newCon~"+id1+"~"+cont+"~"+id);
     id 为约束ID；
	 id1 为约束条件节点本身的id



  

  公共函数
  1.新点
  newPoint(id,x,y,label);
  2.新线段
  newLine(id,x1,y1,x2,y2);
  3.新约束条件
  newCon(id,con,id_con);

  newAngle(id,x1,y1,x2,y2,x3,y3)

  get3PC(pid1,pid2,pid3)//返回三点确定圆的圆心和半径数组[x,y,r]

  getNameById(ID);//根据ID返回对象的名字，如点A，圆O，线段AB

  showHint(x,y,content)//打开提示信息
  hideHint();//关闭提示信息

  distance(x1,y1,x2,y2,x3,y3);//距离，如果x3,y3未定义，则是点到点的距离，否则，为点到直线的距离

*/
$(function () {

	
	$(".SVG").each(function(){
		//alert("this id:"+this.id+"src:"+this.title+"style.width:"+this.style.width);
		var myID=this.id;
        //alert("$(+myID).width():"+$("#"+myID).width());//这种方法是对的
		//alert("this,this.id:"+this+"::"+$("#"+myID).attr("src"));
		processComm(this.id,"S"+this.id,$("#"+myID).attr("src"));
	});
    
	function processComm(parent,id,src){
	//   $("#"+id).append("<div id=\"tool"+id+"\"</div>"); //mySVG+id的工具栏
	 //  var w=$("#"+parent).width();
	 //  var h=$("#"+parent).height();//这儿可能为0
	 //  alert("id,w,h:"+parent+"::"+w+"::"+h);
	   
	   //SVG(parentID,ID,width,height,xMin,xMax,yMin,yMax,gridUnit,grid,xy,label,editable,sys){ //
	   //var svg=new SVG(parent,id,null,null,-5,5,-5,5);
       //alert("wait"+svg);
	   //$("#"+id).append(svg.root);
	/*   var ts="NP~FPmySVG1001~0.99~1.02~A;newCon~CmySVG1003~CPR,CRmySVG1002,FPmySVG1001~CFPmySVG1001;"
				+"newCon~XmySVG1004~CmySVG1003~XCRmySVG1002;"
				+"NC~CRmySVG1002~0.99~1.02~0.92451;"
				+"NP~CPmySVG1005~0.86~1.95~B;"
				+"newCon~cmySVG1006~POC,CPmySVG1005,CRmySVG1002,1.7126933813990604~CCRmySVG1002;"
				+"newCon~xmySVG1007~cmySVG1006~XCPmySVG1005;"
				+"NL~PPmySVG1008~0.86~1.95~0.99~1.02;"
				+"newCon~cmySVG1010~LPP,PPmySVG1008,CPmySVG1005,FPmySVG1001~CCPmySVG1005;"
				+"newCon~mySVG1009~LPP,PPmySVG1008,CPmySVG1005,FPmySVG1001~CFPmySVG1001;"
				+"newCon~xmySVG1011~mySVG1009~XPPmySVG1008;"
				+"Move~CPmySVG1005~0.74~2.27";
				
	*/			
/* testSVG1
				NP~FPStestSVG11001~-1.90~1.90~A;
newCon~CStestSVG11003~CPR,CRStestSVG11002,FPStestSVG11001~CFPStestSVG11001;
newCon~XStestSVG11004~CStestSVG11003~XCRStestSVG11002;
NC~CRStestSVG11002~-1.90~1.90~0.81820;
NF~fxStestSVG11005,y=f(x),A['a']+x,-10,10,null,null,null,black,2,null;
addVar~StestSVG11005,a,-5,5,0.01,1;
newCon~cStestSVG11006~var,fxStestSVG11005~vara;
newCon~xStestSVG11006~cStestSVG11006~XfxStestSVG11005*/
		//var ats=ts.split(";");
		var ats=src.split(";");
		var m=ats[0].split(",");
		var svg;
		if (m[0]=="global")
		{//global,500,300,-5,5,-3,3,0,T,F,F,T,F;
			//1.width,2.height,3.xMin,4.xMax,5.yMin,6.yMax,7.gridUnit,8.border,9.xy,10.label,11.editable,12.sys
			if (isNaN(m[1]))
			{
				//alert("m[1]:"+isNaN(m[1]));
				m[1]=null;
				m[2]=null;
			}
			else{
				m[1]=parseInt(m[1]);
				m[2]=parseInt(m[2]);
			}

			if (isNaN(m[3]))
			{
				m[3]=-5;
				m[4]=5;
				m[5]=-5;
				m[6]=5;
			}
			else{
				m[3]=parseFloat(m[3]);
				m[4]=parseFloat(m[4]);
				m[5]=parseFloat(m[5]);
				m[6]=parseFloat(m[6]);
			}

			if (isNaN(m[7]))
			{
				m[7]=40;
			}
			else{
				m[7]=parseInt(m[7]);
			}

			if (m[8]=="F" || m[8]=="false")
			{
				m[8]=false;
			}
			else{
				m[8]=true;
			}

			if (m[9]=="F" || m[9]=="false")
			{
				m[9]=false;
			}
			else{
				m[9]=true;
			}

			if (m[10]=="F" || m[10]=="false")
			{
				m[10]=false;
			}
			else{
				m[10]=true;
			}
            //alert("m[1]:"+m[1]);
			svg=new SVG(parent,id,m[1],m[2],m[3],m[4],m[5],m[6],m[7],m[8],m[9],m[10]);
		}
		else{
			svg=new SVG(parent,id,null,null,-5,5,-5,5);
		}
		//SVG(parentID,ID,width,height,xMin,xMax,yMin,yMax,gridUnit,grid,xy,label,editable,sys){ //
	   //var svg=new SVG(parent,id,null,null,-5,5,-5,5);
		svg.actA=ats;
		svg.processAct(ats);
		with (svg){
			

		    /*eval("newPoint(100,100,'A','FPid1')");
		    eval("newPoint(300,300,'B','FPid2')");
		    eval("newLine(100,100,300,300,'LPPid3')");
		    eval("newCon(\"LPP,LPPid3,FPid1,FPid2\",\"CFPid1\",\"cFPid4\")");
			eval("newCon(\"LPP,LPPid3,FPid1,FPid2\",\"CFPid2\",\"cFPid5\")");
			eval("newCon(\"cFPid4\",\"XLPPid3\",\"xFPid6\")");
					*/
					   
		}

	}
/*
    // Horizontal slider
    $('#h-slider').slider({
        range: "min",
        min: -10,
        max: 10,
        value: 0,
        slide: function (event, ui) {
            $("#amount").val(ui.value);
        }

    });

    // Vertical slider
    $("#v-slider").slider({
        //orientation: "vertical",
        range: "min",
        min: -10,
        max: 10,
        value: 0,
        slide: function (event, ui) {
            $("#amount").val(ui.value);
        }
    });
    $("#amount").val($("#v-slider").slider("value"));


	//主菜单
    $("#subtool").buttonset();

*/
    
});
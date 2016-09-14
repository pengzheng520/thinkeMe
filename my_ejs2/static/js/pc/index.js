/**
 * Created by pengpeng on 2016/3/11.
 */

$(function(){

    var isFluorescentPen = false ; //判断当前状态是否为荧光笔

    //动态加载图形
    goSVG();

    //设置中间内容区域的宽度
    resizeSvg();

    //重置右边的高度
    resizebooknoteBox();

    //屏幕宽度变化时，自动调整大小
    var resize = $(window).jqElemResize();
    $(resize).on("resize", function() {
        //重置中间的大小
        resizeSvg();
        //重置右边的高度
        resizebooknoteBox();

        //重置视口宽高
        var windowHeight = window.parent.document.documentElement.clientHeight;
        window.parent.document.getElementById("content").height = windowHeight;
    });

    //点击笔触发的效果
    $("#notes").on('click',function(e){
        //e.stopPropagation();
        //e.preventDefault();
        $(this).addClass("active").siblings().removeClass("active");
        variable.selectColor = this.id;
        $("#containerSvg").css("cursor","url(/image/notes.png),auto");

        isFluorescentPen = false;
    });

    //点击画线触发的效果,//点击荧光笔触发的效果
    $("#drawLine,#fluorescentPen").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();

        isFluorescentPen = false;

        //显示颜色控制面板
        $(this).addClass("active").siblings().removeClass("active");
        showSelectColor(this);
        if(this.id == "drawLine"){
            $("#containerSvg").css("cursor","url(/image/line.png),auto");
        }else if(this.id == "fluorescentPen"){
            $("#containerSvg").css("cursor","auto");
            isFluorescentPen = true;
        }else{
            $("#containerSvg").css("cursor","auto");
        }
    });

    //荧光笔显示效果
    $("#containerSvg").on('mouseenter','foreignobject',function(e){
        if(isFluorescentPen) {
            $("#containerSvg").css("cursor", "url(/image/ygbpen.png),auto");
        }
    });
    $("#containerSvg").on('mouseleave','foreignobject',function(e){
        if(isFluorescentPen) {
            $("#containerSvg").css("cursor", "auto");
        }
    });

    //隐藏右边目录结构
    $("#directory").on('click',function(e){
        //e.stopPropagation();
        //e.preventDefault();
        //如果有identifiers class 说明显示右边目录结构
        if($(this).hasClass("identifiers")){
            $(this).removeClass("identifiers").text("隐藏").attr("title","隐藏右边目录");
            resizeSvg("haveIdentifiers");
        }else{
            $(this).addClass("identifiers").text("显示").attr("title","显示右边目录");
            resizeSvg("noIdentifiers");
        }
    });

    //选择颜色
    $("#selectColor").find(".tkm-color-option").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var thisColor = $(this).attr("class").split(" ")[1].substring(2);
        variable[variable.selectColor+"color"] = thisColor.split('-')[1];
        $("#"+variable.selectColor).attr("class","active "+thisColor);
        //隐藏颜色条
        hideselectColor();
    });

    //关闭笔记框
    $("#js_close").on('click',function(){
       $("#mark").hide();
        $("#modalMark").hide();
    });

    //评注窗口的拖拽
    $("#r22").on('touchstart.drag.founder mousedown.drag.founder',function(e){
        var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
            startPos = $(this).parent().position(),
            disX = ev.pageX - startPos.left,
            disY = ev.pageY - startPos.top,
            that = $(this).parent();
        $(document).on('touchmove.drag.founder mousemove.drag.founder', function(e) {
            var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,
                $this = that,
                $parent = $this.offsetParent().is(':root')?$(document):$parent,
                pPos = $parent.offset()?pPos:{left:0,top:0},
                left = ev.pageX - disX - pPos.left,
                top = ev.pageY - disY - pPos.top,
                r = $parent.width() - $this.outerWidth(true),
                d = $parent.height() - $this.outerHeight(true);
            left = left < 0 ? 0 : left > r ? r : left;
            top = top < 0 ? 0 : top > d ? d : top;
            left = left < 0 ? 0 : left;
            top = top < 0 ? 0 : top ;
            $this.css({
                left: left + 'px',
                top: top + 'px'
            });
            e.preventDefault();
        });
        $(document).on('touchend.drag.founder mouseup.drag.founder', function(e) {
            var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
            $(document).off('.drag.founder');
        });
        e.preventDefault();
    });

    //document事件
    $(document).on('click',function(){
        //隐藏颜色条
        hideselectColor();
    });

    //单击笔记查看笔记内容
    $(document).on("click",".note-mark",function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).attr("data-id");
        var $overview = $("#overview");
        var $dataLiID = $("#overview [data-liid='"+id+"']");
        $dataLiID.addClass("active").siblings().removeClass("active");
        var myolTop = Number($overview.scrollTop());
        var liTop = Number($dataLiID.position().top);
        var top = liTop + myolTop;
        $overview.scrollTop(top);
    });

    //双击笔记修改笔记内容或者删除笔记
    $(document).on("dblclick",".note-mark",function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).attr("data-id");
        var $overview = $("#overview");
        var $dataLiID = $("#overview [data-liid='"+id+"']");
        var mockTxtTitle = $dataLiID.find(".item-summary").html();
        var mockTxtContent = $dataLiID.find(".item-customstr").html();

        //标注是想改变哪个笔记
        $("#mark").attr("data-wid","").attr("data-wid",id);

        //显示笔记框
        showMark(false,e,mockTxtTitle,mockTxtContent);
    });

    //点击左边的显示
    $("#jia").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var time = 300;

        isFluorescentPen = false;
        $("#containerSvg").css("cursor","auto");

        //取消任何控制事件
        $(this).addClass("active").siblings().removeClass("active");
        cancelAttr();

        if(!$(this).hasClass("cur")) {
            $(this).addClass("cur");
            $("#drawLine").show().stop(true).animate({"top": -52, "opacity": 1}, time);
            $("#fluorescentPen").show().stop(true).animate({"top": -104, "opacity": 1}, time);
            $("#notes").show().stop(true).animate({"top": -156, "opacity": 1}, time);
            $("#directory").show().stop(true).animate({"left":52, "opacity": 1}, time);
        }else{
            $(this).removeClass("cur");
            $("#notes").stop(true).animate({"top": 0, "opacity": 0}, time,function(){
                $("#notes").hide();
            });
            $("#fluorescentPen").stop(true).animate({"top": 0, "opacity": 0}, time,function(){
                $("#fluorescentPen").hide();
            });
            $("#drawLine").stop(true).animate({"top": 0, "opacity": 0}, time,function(){
                $("#drawLine").hide();
            });
            $("#directory").stop(true).animate({"left": 0, "opacity": 0}, time,function(){
                $("#directory").hide();
            });
        }
    });

    //鼠标移动到笔记显示笔记内容
    $(document).on("mouseover",".note-mark > rect",function(e){
        var id = $(this).parent().attr("data-id");
        var $overview = $("#overview");
        var $dataLiID = $("#overview [data-liid='"+id+"']");
        var mockTxtTitle = $dataLiID.find(".item-summary").html();
        var mockTxtContent = $dataLiID.find(".item-customstr").html();

        //获得svg的实际高
        var theSvgWidth = this.getBoundingClientRect().width;
        var theSvgHeight = this.getBoundingClientRect().height;
        $("#noteMarkzs").show().css({
            left:$(this).offset().left+theSvgWidth+12,
            top:$(this).offset().top-20
        });
        $("#triangleSummary").html(mockTxtTitle);
        $("#triangleCustomstr").html(mockTxtContent);
    });
    $(document).on("mouseout",".note-mark > rect",function(e){
        $("#noteMarkzs").hide();
        $("#triangleSummary").html("");
        $("#triangleCustomstr").html("");
    });

    window.addEventListener("message", function( event ) {
        // 返回是哪个HTML页面
        var data = {
            "book" : window.location.pathname.split("books/")[1],
             page  : fenbu.fenbuchapter,
             totalPage  : variable.chapterLenght
        };
        var stringData = JSON.stringify(data);
        window.top.postMessage(stringData,'http://www.livebooks.cn');
    }, false);
});


function hideModal(){
    $("#mark").hide();
    $("#modalMark").hide();
    $("#mockTxtTitle").html("");
    $("#editor").html("");
}
//清除选中文本
function clearSlct() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else {
        document.selection.empty();
    }
}
//获得选中文字
function getSlct(){
    var userSelection, text;
    if (window.getSelection) {
        //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) {
        //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (!(text = userSelection.text)) {
        text = userSelection;
    }
    return text.toString();
}
//显示做笔记的框框 一些相应的操作
function showMark(tf,dis,mockTxtTitle,mockTxtContent){
   //显示评注框
    $("#modalMark").show();
    $("#mark").show().css({
                           "left":dis.pageX,
                           "top":dis.pageY
                          });

    //调整评注框的位置
    setMarkDis();


    $("#mockTxtTitle").html("");
    $("#editor").html("");

    if(tf) {
        //显示发布按钮
        $("#addbtn").show();
        //隐藏修改和删除按钮
        $("#queen").hide();
        $("#fremove").hide();
        $("#r22").text("添加笔记");
    }else{
        $("#addbtn").hide();
        //隐藏修改和删除按钮
        $("#queen").show();
        $("#fremove").show();
        $("#mockTxtTitle").html(mockTxtTitle);
        $("#editor").html(mockTxtContent);
        $("#r22").text("修改笔记");

        //转化latex
        $("#editor").find(".mathquill-rendered-math").each(function(index, element) {
            $(this).html($(this).mathquill("latex"));
        });
        //latex转化成html
        var  latex_html  = $("#editor").find(".mathquill-rendered-math");
        latex_html.each(function(index, element) {
            var lat = $(this).html();
            $(this).html("");
            $(this).mathquill('editable').mathquill("write", lat);
        });
    }
}

//调整评注框的位置
function setMarkDis(){
    var documentHeight =  $(document).scrollTop()   //滚动条的高度
    var windowHeight  =  $(window).height();        //屏幕可视区域的高度
    var scrollHeight = documentHeight+windowHeight; //上面2个加起来的高度
    var markHeight = parseFloat($("#mark").css("top")) +380;  //笔记框的高度（底部）

    //先考虑底部，如果超出则上移
    if(scrollHeight < markHeight){
        $("#mark").css("top",scrollHeight - 390)
    }

    //在考虑顶部
    if(documentHeight > scrollHeight - 390){
       $("#mark").css("top",documentHeight+10)
    }

    //考虑宽度
    var windowWidth  =  $(window).width();        //屏幕可视区域的宽度
    var markWidth = parseFloat($("#mark").css("left")) +430;  //笔记框的宽度（右边部）

    //先考虑右边，如果超出则左移
    if(windowWidth < markWidth){
        $("#mark").css("left",windowWidth - 440)
    }

    //在考虑左边
    if(0 > windowWidth - 440){
        $("#mark").css("left",10)
    }


}

//显示颜色控制面板
function showSelectColor(Othis){
    var thisLeftTop = $(Othis).offset()
    var thisParLeftTop =  $(Othis).parent().offset() ;
    OthisTop = thisLeftTop.top -  thisParLeftTop.top + $(Othis).parent().position().top;
    OthisLeft = thisLeftTop.left -  thisParLeftTop.left + $(Othis).parent().position().left;
    $("#selectColor").show().css({
        top:OthisTop,
        left:OthisLeft+62
    });
    variable.selectColor = Othis.id;
}
//控制svg大小 判断是手动控制还是自动控制  false 代表浏览器控制
function resizeSvg(type){
    //获得屏幕的宽度
    var windowWidth = parseFloat($(window).width());
    var containerMainWidth;
    if(type){
       if(type == "noIdentifiers"){
           containerMainWidth = windowWidth - 70;
           $("#booknoteBox").stop(true).animate({right: -260},500);
           $("#containerMain").stop(true).animate({marginRight:0},500);
       }else if(type == "haveIdentifiers"){
           containerMainWidth = windowWidth - 350;
           $("#booknoteBox").stop(true).animate({right: 20},500);
           $("#containerMain").stop(true).animate({marginRight:280},500);
       }
    }else{
        if(windowWidth < 800){
            containerMainWidth = windowWidth - 70;
            $("#booknoteBox").stop(true).animate({right: -260},500);
            $("#containerMain").stop(true).animate({marginRight:0},500);
            $("#directory").addClass("identifiers").text("显示").attr("title","显示右边目录结构");
        }else{
            containerMainWidth = windowWidth - 350;
            $("#booknoteBox").stop(true).animate({right: 20},500);
            $("#containerMain").stop(true).animate({marginRight:280},500);
            $("#directory").removeClass("identifiers").text("隐藏").attr("title","隐藏右边目录结构");
        }
    }


    $("#containerMain").css("width",containerMainWidth);

    //如果是分布阅读
    if($("body").hasClass("bodyDistribution")){
        resizebody();
        return false;
    }


    var svgWidth = parseFloat($("#containerSvg").css("width"));

    fangSuoScre(svgWidth);
}
//控制右边的高度
function resizebooknoteBox(){
   var hgt =  parseFloat($(window).height()) - 200;
   $("#overview").css("height",hgt);

    allbzheight(hgt+40);

   $("#bituise_rcontent").children("div.main:gt(0)").css("height",hgt);
}


/**
 * Created by pengpeng on 2016/3/2.
 */
$(function(){

    //初始化svg
    goSVG();

    $("#containerMain").css("width",$("body").width());

    //设置中间内容区域的宽度
    resizeSvg();

    //控制按钮点击事件
    $("#controlBox").on('tap',function(e){
       e.stopPropagation();
       e.preventDefault();
       if($("#fluorescentPen").css("opacity") == 1){
           hideControlBoxcHild();
       }else{
           showControlBoxcHild();
       }
    });

    //点击笔触发的效果
    $("#notes").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#controlText").text($(this).text());
        $("#controlBox").children("div.circle-btn").removeClass("active");
        $(this).addClass("active");
        variable.selectColor = this.id;
        //隐藏控制区域的孩子
        hideControlBoxcHild();
    });

    //点击画线触发的效果,//点击荧光笔触发的效果
    $("#drawLine,#fluorescentPen").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#controlText").text($(this).text());
        $("#controlBox").children("div.circle-btn").removeClass("active");
        $(this).addClass("active");
        //显示颜色控制面板
        showSelectColor(this);
    });

    //取消任何操作
    $("#cancel").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#controlText").html($(this).html());
        $("#controlBox").children("div.circle-btn").removeClass("active");
        $(this).addClass("active");
        //隐藏控制区域的孩子
        hideControlBoxcHild();
        variable.selectColor=false;
    });

    //选择颜色
    $("#selectColor").find(".tkm-color-option").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        var thisColor = "border"+$(this).attr("class").split(" ")[1].substring(2);
        variable[variable.selectColor+"color"] = thisColor.split('-')[1];
        $("#"+variable.selectColor).attr("class","circle-btn fluorescent-pen active "+thisColor);
        $("#controlBox").attr("class","circle-btn control-box "+thisColor);
        //隐藏控制区域的孩子
        hideControlBoxcHild();
    });

    //点击目录图标出来目录
    $("#dragBar").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        //如果没显示目录，则显示。反正
        ebookSidebar();
    });

    //隐藏modal层
    $("#mockClose,#noBtn").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        hideModal();
    });

    //放大
    $("#enlarge").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#ebookSidebar").css("left","-9999px");
        fangda();
    });

    //缩小
    $("#narrow").on('tap',function(e){
        e.stopPropagation();
        e.preventDefault();
        $("#ebookSidebar").css("left","-9999px");
        suoxiao();
    });

    //点击笔记 显示笔记内容
    $(document).on('tap','.note-mark,.otheruser-note-mark',function(e){
        e.stopPropagation();
        e.preventDefault();
        showNotemark(this);
    });

    //目录切换
    $(document).on('tap','.tab-directory > button',function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass("active").siblings().removeClass("active");
        var index = $(this).index();
        if(index == 0){
            $(".catalog-list").show();
            $("#overview").hide();
            $(".setting").hide();
            $("#recommendedcontent").hide();
        }else if(index == 1){
            $(".setting").hide();
            $(".catalog-list").hide();
            $("#overview").show();
            $("#recommendedcontent").hide();
        }else if(index == 2){
            $(".setting").show();
            $(".catalog-list").hide();
            $("#overview").hide();
            $("#recommendedcontent").hide();
        }else if(index == 3){
            $(".setting").hide();
            $(".catalog-list").hide();
            $("#overview").hide();
            $("#recommendedcontent").show();
        }

    });

    $(document).on('tap',"#ebookSidebar",function(e){
        e.stopPropagation();
        e.preventDefault();
    })

    $(document).on('tap',function(e){
        //mock
        if(typeof e.target.className == "string") {
            var mock = e.target.className.slice(0, 4);
            if (mock == "mock") {
                return false;
            }
        }
        //如果没显示目录图标，则显示。反正
        ebookdragBar();
        //隐藏控制区域的孩子
        hideControlBoxcHild();
    });
});

//隐藏控制区域的孩子
function hideControlBoxcHild(){
    $("#controlBox").children("div.circle-btn").hide().animate({top:"-3px",opacity:0},100,'linear');
    $("#selectColor").hide();
}

//显示控制区域的孩子
function showControlBoxcHild(){
    $("#notes").css("display","block").animate({top:"-153px",opacity:1},200,'linear');
    $("#fluorescentPen").css("display","block").animate({top:"-103px",opacity:1},200,'linear');
    $("#drawLine").css("display","block").animate({top:"-53px",opacity:1},200,'linear');
    $("#cancel").css("display","block").animate({left:"47px",opacity:1},200,'linear');
    $("#enlarge").css("display","block").animate({left:"97px",opacity:1},200,'linear');
    $("#narrow").css("display","block").animate({left:"147px",opacity:1},200,'linear');
}

//显示颜色控制面板
function showSelectColor(Othis){
    OthisTop = $(Othis).offset().top ;
    OthisLeft = $(Othis).offset().left ;
    $("#selectColor").show().css({
        top:OthisTop,
        left:OthisLeft+60
    });
    variable.selectColor = Othis.id;
}

//显示隐藏目录图标
function ebookdragBar(){
    var  $ebookSidebar = $("#ebookSidebar");
    if($ebookSidebar.hasClass("dragBar")){
        $ebookSidebar.css("left","-9999px").removeClass("dragBar");
    }else{
        var width =  (window.innerWidth > 0) ? window.innerWidth : screen.width;
        $ebookSidebar.css("left",-width).addClass("dragBar");
    }
}

//显示隐藏目录
function ebookSidebar(){
    var  $ebookSidebar = $("#ebookSidebar");
    if($ebookSidebar.hasClass("sideBar")){
        var width =  (window.innerWidth > 0) ? window.innerWidth : screen.width;
        $ebookSidebar.animate({"left":-width},500).removeClass("sideBar");
    }else{
        $ebookSidebar.animate({"left":"-30px"},500).addClass("sideBar");
    }
}

//控制svg大小
function resizeSvg(){
    var containerSvgWidth = parseFloat($("#containerSvg").css("width"));

    fangSuoScre(containerSvgWidth);
}

//点击，显示笔记
function showNotemark(Othis){
    var id = $(Othis).data("id");
    $(".mock-backdrop").show();
    $(".mock").show();
    $(".mock-bodyer .mock-txt").attr("contenteditable",false);
    $(".mock-bottom").hide();
    var $dataLiId =  $("[data-liid='"+id+"']");
    $("#mockTxtTitle").html($dataLiId.find(".item-summary").html());
    $("#mockTxtContent").html($dataLiId.find(".item-customstr").html());
}
//显示modal层
function showModal(Othis){
    $(".mock-backdrop").show();
    $(".mock").show();
    $("#mockTxtTitle").text("第"+Othis.id+"章节");
    $("#mockTxtContent").html("");
    $(".mock-bodyer .mock-txt").attr("contenteditable",true);
    $(".mock-bottom").show();
}

//隐藏modal层
function hideModal(){
    $(".mock-backdrop").hide();
    $(".mock").hide()
}
//放大svg
function fangda(){
    var svgWidth = parseFloat($(".mainSvg").css("width"))*1.3;
    fangSuoScre(svgWidth);
}

//缩小svg
function suoxiao(){
    var svgWidth = parseFloat($(".mainSvg").css("width"))/1.3;
    fangSuoScre(svgWidth);
}


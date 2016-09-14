/**
 * Created by pengpeng on 2016/3/18.
 */
/*右边显示区一系列操作*/
var fenbu = {
    fenbuchapter : 1,      //保存现在在第几章
    loaded       : true   //判断加载完成没有
};
$(function(){
    //全局变量，判断加载一次评注
    var allbz = true ;


    //右边一系列操作 滑动效果
    $("#bituise_list").find(".list").hover(function(){
        $(this).find("a").stop().animate({marginTop:"-33px"},200)
    },function(){
        $(this).find("a").stop().animate({marginTop:"0px"},200)
    }).click(function(){
        $("#bituise_list").find("div.active").removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();                                         //tab
        $("#bituise_rcontent").children("div.main").hide().eq(index).show();
    });

    //右边目录点击 显示在哪
    $("#overview").on('click',"li",function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $(this).data("liid");
        $(".note-mark").children().attr("fill-opacity", 0.6);
        $(".otheruser-note-mark").children().attr("fill-opacity", 0.6);
        var  $dataID = $("[data-id='" + id + "']");

        //如果是分布阅读，干什么什么 else
        if($("body").hasClass("bodyDistribution")){
            var svgWidth = $(".mainSvg").width();
            var idChapter =  $dataID.parent().parent().index() + 1 ;
            fenbu.fenbuchapter = idChapter;
            $("#containerSvg").stop(true).animate({marginLeft: svgWidth*(1-fenbu.fenbuchapter)},500);
            $dataID.children().attr("fill-opacity", 1);
            var dataOffset = $dataID.children().attr("fill-opacity", 1).end().offset();
            $(window).scrollTop(dataOffset.top - 100);
        }else {
            var dataOffset = $dataID.children().attr("fill-opacity", 1).end().offset();
            $(window).scrollTop(dataOffset.top - 100);
        }
    });

    //显示自己全部笔记事件
    $("#allbz").on('click',function(e){
        e.stopPropagation();

        //加载全部笔记
        if(variable.isLogin && allbz){
            loadAllbz();
            allbz　=　false ;
        }else if(!variable.isLogin){
            $("#loginModal").modal("show");
            return false;
        }

        var w = parseInt($("#allpingzhu").css("width"));
        var windowWidth = $(window).width() - 300;
        if(windowWidth > 600){
            windowWidth = 600;
        }
        if(w == 0){
            $("#allpingzhu").stop(true).animate({
                width:windowWidth,
                left:-windowWidth-4
            },"slow");
            $("#viewport").css("width",windowWidth)
        }else{
            $("#allpingzhu").stop(true).animate({
                width:"0px",
                left:"0px"
            },"slow");
        }
    });

    //绑定滚动条拖拽事件
    $(document).on('mousedown',"#scroll_bar",function(e){
        var _this = $(this);
        var defPos = parseInt(_this.css("top"));
        _this.css("background-color","#999999");
        var y = e.clientY - defPos;
        var tsheight = scrollbar();   //返回滚动条的高度
        $(document).bind('touchmove mousemove', function(e){
            var t = e.clientY - y;
            if(t<=0) return false;

            var percent = t/tsheight.scrollheight;
            if(percent>=1) return false;

            $("#alloverview").css("top",tsheight.toplistheight*percent);
            _this.css("top",t);
            return false;
        });
        $(document).bind('mouseup', function(e){
            _this.css("background-color","#D1CDBA");
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            _this.releaseCapture && _this.releaseCapture();
            return false;
        });
        _this.setCupture && _this.setCapture();
        e.stopPropagation();
        return false;
    });

    //兼容移动端
    $("#allpingzhu").on('mousedown',function(e){
        e.stopPropagation();
        e.preventDefault();
        var _this = $("#scroll_bar");
        var defPos = parseInt(_this.css("top"));
        _this.css("background-color","#999999");
        var y = e.clientY - defPos;
        var tsheight = scrollbar();   //返回滚动条的高度
        $(document).bind('touchmove mousemove', function(e){
            e.stopPropagation();
            e.preventDefault();
            var t = e.clientY - y;
            if(t<=0) return false;

            var percent = t/tsheight.scrollheight;
            if(percent>=1) return false;

            $("#alloverview").css("top",tsheight.toplistheight*percent);
            _this.css("top",t);
            return false;
        });
        $(document).bind('mouseup', function(e){
            _this.css("background-color","#D1CDBA");
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            _this.releaseCapture && _this.releaseCapture();
            return false;
        });
        _this.setCupture && _this.setCapture();
        e.stopPropagation();
        return false;
    });


    //全部笔记滚动事件
    $('ul#alloverview').mousewheel(function(event, delta) {
        if($("#scroll_bar").is(":hidden")){
            return false;
        }
        var gundongjuli  = 5 ;                          //默认滚动距离
        if(delta == 1){
            var jul = -gundongjuli;
        }else if(delta == -1){
            var jul = gundongjuli;
        }
        var defPos = parseFloat($("#scroll_bar").css("top"))+jul; //得到滚动条想滚动的位置
        var a =  parseFloat($(this).parent().css("height"))-parseFloat($("#scroll_bar").css("height"));
        if(defPos<0){
            $("#alloverview").css("top",0);
            $("#scroll_bar").css("top",0);
            return false;
        }else if(defPos > a){
            var endjl =parseFloat($(this).parent().css("height"))- parseFloat($("#alloverview").css("height"));
            $("#alloverview").css("top",endjl+10);
            $("#scroll_bar").css("top",a-2);
            return false ;
        }else{
            $("#scroll_bar").css("top",defPos+jul);
            var contentgdjl = jul/parseFloat($(this).parent().css("height"))*parseFloat($("#alloverview").css("height"));
            var  returncontentjl  = parseFloat($("#alloverview").css("top"))-contentgdjl;      //计算后内容显示
            $("#alloverview").css("top",returncontentjl);
        }
        event.preventDefault();
    });

    //隐藏全部评注
    $("#allpingzhu").find(".close").click(function () {
        $("#allpingzhu").animate({
            width:"0px",
            left:"0px"
        },"slow");
    });

    //分页和全部阅读切换
    $(".reading_mode").find(".distribution").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass('cur').siblings().removeClass('cur');
        if($(this).index() == 1){

            //得到在第几章
            fenbu.fenbuchapter =  getfenbuchapter();

            $(window).scrollTop(0);
            $("body").addClass("bodyDistribution");

             //重置body大小
            resizebody();

            //滚动到这章
            srollChapter(fenbu.fenbuchapter);

            //显示对应章节的和推荐笔记
            showNotesRecomd();

            //显示翻滚按钮
            $("#fb_button").show();
        }else if($(this).index() == 0){
            $("body").removeClass("bodyDistribution");

            $("body").css({width:"100%",height:"100%"});

            //隐藏翻滚按钮
            $("#fb_button").hide();

            //重置svg大小
            resizeSvg();
            $("#containerSvg").css("marginLeft",0);

            //调整到底第几章
            $(window).scrollTop($("#containerSvg").children().eq(fenbu.fenbuchapter-1).offset().top);

            //显示全部笔记和推荐资源
            $("#recommendedcontent li").show();
            $("#overview li").show();
        }
    });

    //分布阅读上下切换事件绑定
    $("#left-cover").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var svgWidth = $(".mainSvg").width();
        if(fenbu.fenbuchapter <= 1){
            console.log("没有前一页了");
            return false;
        }else{
            fenbu.fenbuchapter -= 1;
            //执行动画操作，并在分页阅读显示这章相应的笔记和推荐资源
            goAmShow(svgWidth)
        }
    });

    $("#right-cover").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var svgWidth = $(".mainSvg").width();
        fenbu.fenbuchapter += 1;
        if(fenbu.fenbuchapter > variable.chapterLenght){
            fenbu.fenbuchapter -= 1;
            console.log("已经加载完成");
            return false;
        }

        if(fenbu.fenbuchapter <= variable.chapter && fenbu.loaded) {
            goAmShow(svgWidth);
        }else if(fenbu.loaded){
            var len = $("#containerSvg").children().length +1;
            fenbu.loaded = false ;
            var end = len + 1;
            variable.chapter = end;
            loadBooks(len, end);

            //加载其他好友的毕竟
            loadOtherUser();
        }else{
            fenbu.fenbuchapter -= 1;
        }

    })
});

//
function goAmShow(svgWidth){
    $("#containerSvg").stop(true).animate({marginLeft: svgWidth * (1 - fenbu.fenbuchapter)}, 500,showNotesRecomd);
}
//显示相应的笔记和章节
function showNotesRecomd(){
    $("#overview").children().hide().end().find(".note-"+fenbu.fenbuchapter).show();
    $("#recommendedcontent > ul").find("li").hide().end().find(".rec_"+(fenbu.fenbuchapter-1)).show();
}

//滚动到这章
function srollChapter(fenbuchapter){
    var svgWidth = $(".mainSvg").width();
    $("#containerSvg").css("marginLeft",svgWidth*(1-fenbuchapter));
}

//分布阅读获得在第几章
function  getfenbuchapter(){
    var i ;
    var $svg = $("#containerSvg").children();
    for(i=0;i < $svg.length;i++){
        var _height =  $svg.eq(i).offset().top + $svg.eq(i).height();
        if( _height > $(document).scrollTop()){
            return i+1;
        }
    }
}

//重置body宽高
function resizebody(){
    var windowWidth = $(window).width();
    $("body").css("width",windowWidth);


    var svgWidth = parseFloat($("#containerMain").css("width"));


    $(".mainSvg").css({
        "width":svgWidth,
        "height":svgWidth
    });

    //设置div
    $(".mainDiv").css({
        "width":svgWidth
    });

    //重置
    $("#containerSvg").css("marginLeft",svgWidth*(1-fenbu.fenbuchapter));

    $("#containerSvg").children("div").css("width",svgWidth)

    svgWidth = svgWidth*0.9

    //里面的div设置
    $("#containerSvg").children("div").children("svg").css("width",svgWidth);

    for(var i=0;i<arraySvgData.length;i++){
        var acta = arraySvgData[i].actA;
        var svgHeight = (arraySvgData[i].height/arraySvgData[i].width)*svgWidth;
        $("#"+arraySvgData[i].ID+"R").css({
            width:svgWidth,
            height:svgHeight
        });
        arraySvgData[i].reDraw(svgWidth,svgHeight);
    }
}

//加载全部笔记
function loadAllbz(){
    var data = {
        arg       : window.location.pathname.split("books/")[1],
        userName  : variable.isLogin.userName
    };
    data = JSON.stringify(data);

    $.ajax({
        type: 'post',
        url: '/loadAllbz',
        contentType:'text/plain',
        data:data,
        success: function(data){
            $(data).each(function(i,value) {
                appedAllNote(value);
            });
            scrollbar();
        },
        error:function(err,str){
            console.log(str)
            allbz　=　true ;
        }
    })
}

//生成全部笔记li
function appedAllNote(data){
    var a = "<div class='item-summary'>"+data.mockTxtTitle+"</div>"+
        "<div class='item-customstr'>"+decodeURIComponent(data.mockTxtContent)+"</div>";
    var b = "<li data-liid='"+data.noteID+"'>"+a+"</li>";
    $("#alloverview").append(b);
    //latex转化成html
    var  latex_html  = $("#alloverview li").last().find(".mathquill-editable");
    latex_html.each(function(index, element) {
        var lat = $(this).html();
        $(this).html("");
        $(this).mathquill('editable').mathquill("write", lat);
        $(this).find("span.textarea").remove();
        $(this).attr("class","mathquill-rendered-math");
    });
}

//调整全部笔记的高度
function allbzheight(hgt){
    //全部笔记的高度
    $("#viewport").css("height",hgt);
    scrollbar();
}

function scrollbar(){
    //动态获得滚动条的位置
    var toplistheight = $("#alloverview").height();
    var listheight =  $("#viewport").height();

    //百分比
    var percent = listheight/toplistheight;
    if(percent>=1){
        $("#scroll_bar").hide();
        return false;
    }else{
        $("#scroll_bar").show();
        $("#scroll_bar").height(listheight*percent);
        return {"toplistheight":listheight-toplistheight,
            "scrollheight":listheight*(1-percent)
        };
    }
}
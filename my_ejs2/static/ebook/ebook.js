/**
 * Created by Administrator on 2016/7/7.
 */
$(function(){

    window.nowChpter = 1;          //现在用户所在的章节
    window.chapter =  3;          //用户读取的章节，初始化是3
    window.totalChpater = 0;     //一共所有的章节

    //初始化 book
    initBook();

    //选择书本
    $("#yesBtn").one('click',function(){
        window.book = $(".selectBooks").val();
        $(".header").remove();
        $(".btn-group").show();
        $("#containerSvg").show();
        var mack = layer.load(1, {
            shade: [0.5,'#000'] //0.1透明度的白色背景
        });
        loadBooks(window.book,0,window.chapter,function(data){
            appendBody(mack,data,0);
        });

        //获得章节数
        getchapterLenght(book);
    });

    $(window).resize(function(){
        setSize();
    });

    //按钮切换
    $("#buttonPrev").click(function(){
        if(window.nowChpter <= 1){
            layer.msg('这是第一页');
            return false;
        }
        window.nowChpter--;

        $("#containerSvg").children().hide();
        var index = window.nowChpter - 1;
        $("#containerSvg").children().eq(index).show();
    });
    $("#buttonNext").click(function(){

        if(window.nowChpter >= window.totalChpater){
            layer.msg('这是最后一页');
            return false;
        }
        window.nowChpter++;

        if(window.nowChpter > window.chapter){
            var mack = layer.load(1, {
                shade: [0.5,'#000'] //0.1透明度的白色背景
            });
            window.chapter = window.nowChpter;
            loadBooks(window.book,window.chapter,window.chapter+2,function(data){
                window.chapter = window.chapter+2;
                appendBody(mack,data,window.nowChpter-1);
            });
            return false;
        }

        $("#containerSvg").children().hide();
        var index = window.nowChpter - 1;
        $("#containerSvg").children().eq(index).show();
    })
});


//
function appendBody(index,data,chpter){
    var dataContent = "" ;

    for (x in data)
    {
        if(data[x].type == 1){
            dataContent = '<svg id="box_'+data[x].chapter+'" class="mainSvg">'+data[x].content+'</svg>';
        }else{
            dataContent = '<div id="box_'+data[x].chapter+'" class="mainDiv">'+data[x].content+'</div>';
        }
        $("#containerSvg").append(dataContent);
    }
    //加载动态图像
    goSVG();
    //设置大小
    setSize();
    $("#containerSvg").children().hide();
    $("#containerSvg").children().eq(chpter).show();
    layer.close(index);
}

//设置大小
function setSize(){
    var svgWidth = $(this).width();
    var svgHeight = $(this).height();
    $("#containerSvg").width(svgWidth);
    $(".mainSvg").height(svgWidth);
    $(".mainDiv").width(svgWidth);

    for(var i=0;i<arraySvgData.length;i++){
        var acta = arraySvgData[i].actA;
        var svgHeight = (arraySvgData[i].height/arraySvgData[i].width)*svgWidth;
        $("#"+arraySvgData[i].ID+"R").css({
            width:svgWidth,
            height:svgHeight
        });
        arraySvgData[i].reDraw2(svgWidth,svgHeight);
    }


}

//初始化 book
function initBook(){
    $.ajax({
        type: "post",
        url: "/ebookName",
        success: function(msg) {
            var data = $.each(msg,function(n,v){
                v.id = v.book;
                v.text = v.bookname;
            });
            $(".selectBooks").select2({
                theme: "classic",
                data: data
            })

        },
        error: function(msg) {
            alert("查询失败！");
        }
    });
}

//动态加载书的内容
function loadBooks(book,begin,end,cb){
    //数据
    var data = {
        arg:book,
        chapter1 : begin,
        chapter2 : end
    };
    data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        url: '/loadBooks',
        contentType:'text/plain',
        data:data,
        success: function(data){
            cb(data);
        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//获得一共多少章节
function getchapterLenght(book){
    var data = {
        arg       : book
    };
    data = JSON.stringify(data);
    $.ajax({
        type: "post",
        url: "/getchapterLenght",
        data: data,
        success: function (data) {
            window.totalChpater = data[0]["count(*)"];
        }
    })
}
/**
 * Created by pengpeng on 2016/3/18.
 */
/*移动端和PC端公用的一些事件属性*/
//保存一些变量
var variable ={
    selectColor           : false,            //判断是谁想用颜色
    fluorescentPencolor   : "000000",         //荧光笔当前选中的颜色
    drawLinecolor         : "000000",         //划线当前选中的颜色
    mouseState            : false,            //手指动作状态
    startPoint            : false,            //保存生成点是谁
    ratio                 : "",               //比例
    chapterBegin          : 0,                //保存起始章节
    chapter               : 0,                //保存现有章节
    chapterLenght         : 0,                //获得一共章节
    fluorescentPendisX    : false,            //保存荧光笔的X坐标
    isLogin               : false,           //判断用户是否登录
    arg                   : window.location.pathname.split("books/")[1], //哪本书
    notesD                : "M696.087669 136.025023 230.342132 136.025023c0 0-58.603723 0.741897-66.623373 67.36527l0 619.349937c0 0-0.617054 71.375607 78.961376 71.375607l542.239721 0c0 0 62.922075-3.518127 67.857481-68.291362l0-500.908384-69.090565 51.818179-1.234107 447.856098-549.642319-0.617054L232.810347 204.623377l412.694273 0L696.087669 136.025023z M754.84591 168.844499l73.100902 56.907081 15.267728-20.35663c0 0 11.56643-15.267728 0-33.774221 0 0-10.641361-17.581424-28.685319-27.759227 0 0-24.521486-13.417591-40.714284 2.77623L754.84591 168.844499z M804.812929 255.825526 680.357406 420.995333c0 0-11.103896 20.35663-30.535457 29.610388l-55.056943 26.371624c0 0-14.805194 7.402597-18.043958-12.954033l9.716292-60.60838c0 0-0.925069-11.103896 13.880125-30.535457l131.85812-174.423565L804.812929 255.825526z M344.002798 565.80851l326.176804 0c0 0 10.641361-2.77623 10.178827 15.267728l0.014326 30.535457c0 0-2.328022 8.327666-14.81952 6.477528l-318.310649 0.268106c0 0-11.103896 0.656963-12.028964-9.984399l0-35.161824C335.211575 573.211107 337.062735 565.80851 344.002798 565.80851z M344.002798 687.025269l326.176804 0c0 0 10.641361-2.77623 10.178827 15.267728l0.014326 30.535457c0 0-2.328022 8.327666-14.81952 6.477528l-318.310649 0.268106c0 0-11.103896 0.656963-12.028964-9.984399l0-35.161824C335.211575 694.427866 337.062735 687.025269 344.002798 687.025269z"
};
//SVG距离起止，截止点距离大小。来判断用户想放大还是缩小屏幕
var distance = {
    begin : 0,
    end   : 0
};
//svg域名空间
var svgNS = "http://www.w3.org/2000/svg";

$(function(){

    //获得一共有多少章节
    getchapterLenght();

    //获得现在网页上有几章节
    variable.chapter = $("#containerSvg").children().length;

    //获得推荐内容
    bookRecommended(1,variable.chapter);

    //鼠标功能事件
    goEvent();

    //老版asp，如果登录，就登录
    var name  = window.location.search.split("=")[1];
    if(typeof(name) != "undefined"){
        variable.isLogin = {};
        variable.isLogin.userName = name ;
        loadUserNote();
    }else {
        //判断用户是否登录
        isLogin();
    }

    //判断是否在底部，加载书本内容
    $(window).scroll(function(){

        //判断是否是分布阅读,如果是阻止默认事件
        if($("body").hasClass("bodyDistribution")){
            return false;
        }

        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight >= scrollHeight - 10){
            var len = $("#containerSvg").children().length +1;
            if(len > variable.chapterLenght){
                console.log("已经加载完成");
                return false;
            }
            //加载书的内容
            if(len > variable.chapter) {
                var end = len + 1;

                variable.chapter = end;
                loadBooks(len, end);

                //加载其他好友的毕竟
                loadOtherUser();
            }else{
                console.log("我在加载")
            }
        }
    });

    //判断是移动端还是PC端
    var clickTap = "click" ;
    if(isMobile.any){
        clickTap = "tap";
    }

    //显示隐藏笔记，画线和荧光笔
    $("#showHideLine").on(clickTap,function(e){
        if(!isMobile.any){
            e.stopPropagation();
            e.preventDefault();
        }

        if($(this).hasClass("cur")) {
            $(this).removeClass("cur").text("隐藏标注");
            $("svg.linePen").find(".line").show();
        }else{
            $(this).addClass("cur").text("显示标注");
            $("svg.linePen").find(".line").hide();

        }

    });
    $("#showHidePen").on(clickTap,function(e){
        if(!isMobile.any){
            e.stopPropagation();
            e.preventDefault();
        }

        if($(this).hasClass("cur")) {
            $(this).removeClass("cur").text("隐藏荧光笔");
            $("svg.linePen").find(".rect").show();
        }else{
            $(this).addClass("cur").text("显示荧光笔");
            $("svg.linePen").find(".rect").hide();
        }

    });
    $("#showHideNotes").on(clickTap,function(e){
        if(!isMobile.any){
            e.stopPropagation();
            e.preventDefault();
        }

        if($(this).hasClass("cur")) {
            $(this).removeClass("cur").text("隐藏笔记");
            $(".note-mark").show();
        }else{
            $(this).addClass("cur").text("显示笔记");
            $(".note-mark").hide();

        }
    });

    //删除笔记
    $("#fremove").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $("#mark").attr("data-wid");
        if(id == ""){ swal("警告，错误，非法操作") }
        var data = {
            arg      : window.location.pathname.split("books/")[1],
            userName : variable.isLogin.userName,
            noteId   : id
        };
        deleteNotes(data);
    });

    //修改笔记
    $("#queen").on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var id = $("#mark").attr("data-wid");
        if(id == ""){ swal("警告，错误，非法操作") }

        //转化latex过程
        $("#editor").find(".mathquill-rendered-math").each(function(index, element) {
            $(this).html($(this).mathquill("latex"));
        });
        var noteContent = encodeURIComponent($("#editor").html().replace(/id=\"msg_chat\w\"/g,""));
        if(noteContent == "") {
            swal("不能为空") ;
            return false ;
        }
        if(noteContent.length>2000000000){
            swal("超出文本限制");
            return false;
        }

        var data = {
            arg             : window.location.pathname.split("books/")[1],
            noteID          : id,
            mockTxtTitle    : $("#mockTxtTitle").html(),
            mockTxtContent  : $("#editor").html(),
            userName        : variable.isLogin.userName
        };

        //更新笔记
        updateNotes(data);
    });



    //删除荧光笔
    $(document).on("click",".linePen > .rect",function(e){
            e.stopPropagation();
            e.preventDefault();
        if(variable.selectColor == "notes"){
            return false;
        }

        var _this = $(this);
        swal({
                title: "确定删除荧光笔",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function(){
                deleteRectLine("rect",_this.attr("data-id"));
            });
    });

    //删除线
    $(document).on("click",".linePen > .line",function(e){
            e.stopPropagation();
            e.preventDefault();

        if(variable.selectColor == "notes"){
            return false;
        }

        var _this = $(this);
        var clickOne = true ;
        swal({
            title: "确定删除评注",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function(){
            if(clickOne){
                clickOne = false;
                deleteRectLine("line",_this.attr("data-id"));
            }else{
                console.log("请等待通讯")
            }
        });
    })

});

//删除评注线
function deleteRectLine(type,id){
   var data ={
       arg      : window.location.pathname.split("books/")[1],
       type     : type,
       theID    : id,
       userName : variable.isLogin.userName
   };
    data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        contentType:'text/plain',
        url: '/deleteRectLine',
        data: data,
        success: function(msg){
            if(msg == "success"){
                swal.close();
                $("[data-id='"+id+"']").remove();
            }else{
                swal("删除失败","","error");
            }
        },
        error:function(err,str){
            console.log(str)
        }
    });

}

//执行功能操作
function goEvent(){
    //中间控制区域的一些DOM操作，当鼠标按下时操作
    $(document).on("touchstart mousedown",'.mainSvg,.mainDiv',function (e) {
        var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e;
        //获得开始点击的位置
        var dis;

        //判断是否是移动端并且如果2个手指滑动的一些事件
        if(e.type == 'touchstart' && e.originalEvent.touches.length > 1){
            var ev1 = e.originalEvent.touches[1];
            distance.begin = (ev1.pageX - ev.pageX)*(ev1.pageX - ev.pageX) + (ev1.pageY -ev.pageY)*(ev1.pageY -ev.pageY);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        //如果是移动端，隐藏控制区域的孩子
        if(isMobile.any){
            //隐藏控制区域的孩子
            hideControlBoxcHild();
        }

        //判断用户选中操作没有
        if(variable.selectColor){

            if($(this).attr("class") == "mainSvg") {
                //获得svg比例
                newSvg.getRatio(this);
            }else{
                //获得div里面的比例
                newSvg.getDivRatio(this);
            }

            //获得开始点击的位置
            dis = newSvg.onMouseDown(this, ev);

            //获得这个节点的对象
            var _this = $(ev.target);

            //if 画线 else if 画荧光笔else if 笔记
            if(variable.selectColor == "drawLine"){

                //阻止默认事件
                e.stopPropagation();
                e.preventDefault();

                //改变变量状态，说明已经按下
                variable.mouseState = true ;

                //生成线
                var m = document.createElementNS(svgNS, "path");
                m.setAttributeNS(null, "stroke", "#"+variable.drawLinecolor);
                m.setAttributeNS(null, "fill", "none");
                m.setAttributeNS(null, "stroke-width", "2");
                m.setAttributeNS(null, "class", this.id+" line");
                m.setAttributeNS(null, "d", "M" + dis.disX + " " + dis.disY);
                $(this).find("svg.linePen").prepend(m);
                variable.startPoint = m;
            }else if(variable.selectColor == "fluorescentPen" && ev.target.nodeName == "foreignObject") {

                //阻止默认事件
                e.stopPropagation();
                e.preventDefault();

                //改变变量状态，说明已经按下
                variable.mouseState = true ;

                var _x = _this.attr("x");
                if(_x  > dis.disX - 8 && dis.disX > _x){
                    dis.disX = _x;
                }

                //生成方块
                variable.fluorescentPendisX = dis.disX ;
                var  y  = _this.attr("y");
                var height = _this.attr("height");

                //方块系数
                var rect = document.createElementNS(svgNS, "rect");
                rect.setAttributeNS(null, "fill", "#"+variable.fluorescentPencolor);
                rect.setAttributeNS(null, "fill-opacity", "0.5");
                rect.setAttributeNS(null, "class", this.id+" rect");
                rect.setAttributeNS(null, "x", dis.disX);
                rect.setAttributeNS(null, "y", y);
                rect.setAttributeNS(null, "height", height);
                $(this).find("svg.linePen").prepend(rect);
                variable.startPoint = rect;
            }
        }
    });

    //当鼠标移动时候一些操作
    $(document).on("touchmove mousemove",'.mainSvg,.mainDiv',function(e){
        var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;

        //判断是否是移动端并且如果2个手指滑动的一些事件
        if(e.type == 'touchmove' && e.originalEvent.touches.length > 1){

            //阻止默认事件
            e.stopPropagation();
            e.preventDefault();

            var ev1 = e.originalEvent.touches[1];
            distance.end = (ev1.pageX - ev.pageX)*(ev1.pageX - ev.pageX) + (ev1.pageY -ev.pageY)*(ev1.pageY -ev.pageY);
            var pointerDistance = (Math.sqrt(distance.end) - Math.sqrt(distance.begin))/8000;
            scre(1+pointerDistance);
            return false;
        }

        //鼠标按下时同时移动的一些操作
        if(variable.mouseState){

            //阻止默认事件
            e.stopPropagation();
            e.preventDefault();

            //获得按下时基于svg的坐标点
            var dis = newSvg.onMouseDown(this,ev);

            //if 线 else if 荧光笔
            if(variable.selectColor == "drawLine") {
                //画线
                var d = variable.startPoint.getAttribute("d") + " L" + dis.disX + " " + dis.disY;
                variable.startPoint.setAttributeNS(null, "d", d);
            }else if(variable.selectColor == "fluorescentPen"){
                //画方块
                var wx = dis.disX-variable.fluorescentPendisX;
                if(wx>0) {
                    variable.startPoint.setAttributeNS(null, "width", wx);
                }else{
                    variable.startPoint.setAttributeNS(null, "x", dis.disX);
                    variable.startPoint.setAttributeNS(null, "width", -wx);
                }
            }
        }

    });

    //当鼠标弹起时候一些操作
    $(document).on("touchend mouseup",'.mainSvg,.mainDiv',function(e){

        var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
        //鼠标状态设置为false
        variable.mouseState = false;

        //if 画的线 else if 画的荧光笔 else if 笔记
        if(variable.startPoint.className  && variable.startPoint.className.baseVal.split(" ")[1] == "line"){

            var newLine = $(variable.startPoint);
            //如果线小于好多，则取消
            if(newLine.attr("d").split("L").length < 10){
                $(variable.startPoint).remove();
            }else {
                //建立一个对象，保存这个线的基本数据
                var data = {};
                data.d = newLine.attr("d");
                data.stroke = newLine.attr("stroke");
                data.box = newLine.attr("class").split(" ")[0].split("_")[1];
                data.type = newLine.attr("class").split(" ")[1];
                //把线的基本数据存入数据库
                postSvgAjax(data);
            }
        }else if(variable.startPoint.className  && variable.startPoint.className.baseVal.split(" ")[1] == "rect"){

            var newRect = $(variable.startPoint);
            //如果方块的宽度小于5，则取消
            if(typeof newRect.attr("width") == "object" || newRect.attr("width") < 5){
                $(variable.startPoint).remove();
            }else{
                //建立一个对象，保存这个方块的基本数据
                var dataRect = {};
                dataRect.x = newRect.attr("x");
                dataRect.y = newRect.attr("y");
                dataRect.width = newRect.attr("width");
                dataRect.height = newRect.attr("height");
                dataRect.fill = newRect.attr("fill");
                dataRect.box = newRect.attr("class").split(" ")[0].split("_")[1];
                dataRect.type = newRect.attr("class").split(" ")[1];
                //把方块的基本数据存入数据库
                postSvgAjax(dataRect);
            }
        }

        //PC做笔记
        if(variable.selectColor == "notes" && !isMobile.any && e.type == "mouseup") {

            if($(e.target).parents(".editSVG").length == 1){
                return false;
            }
            //阻止默认事件
            e.stopPropagation();
            e.preventDefault();

            //显示做笔记的框框 一些相应的操作
            var dis  =  newSvg.onMouseDown(this,ev),
                _this = this ;
            var topY = ev.pageY-200;
            showMark(true,ev); //1.做笔记还是修改笔记 true做笔记,false修改笔记
            //点击发布按钮
            $("#addbtn").unbind().on('click tap',function(e){
                e.stopPropagation();
                e.preventDefault();
                $("#editor").find(".mathquill-rendered-math").each(function(index, element) {
                    $(this).html($(this).mathquill("latex"));
                });
                var noteContent = encodeURIComponent($("#editor").html().replace(/id=\"msg_chat\w\"/g,""));
                if(noteContent == "") {
                    swal("不能为空") ;
                    return false ;
                }
                if(noteContent.length>2000000000){
                    swal("超出文本限制");
                    return false;
                }
                //保存PC端笔记
                newNotesIcon(_this,dis,$("#mockTxtTitle").html(),noteContent,true);
            })
        }else if(variable.selectColor == "notes" && isMobile.any  && e.type == "touchend"){   //移动端笔记

            if($(e.target).parents(".editSVG").length == 1){
                return false;
            }

            //阻止默认事件
            e.stopPropagation();
            e.preventDefault();

            var dis  =  newSvg.onMouseDown(this,ev),
                _this = this ;
            var topY = ev.pageY-200;
            showModal(this);//Y坐标。this对象
            //modal层确定按钮
            $("#yesBtn").unbind().on('tap',function(e){
                newNotesIcon(_this,dis,$("#mockTxtTitle").html(),$("#mockTxtContent").html(),false);
            });
        }
    });
}

var newSvg = {
    //获得鼠标按下时基于svg的x和y坐标
    onMouseDown : function(Othis,ev){
        var dis,startPos;
        if($(Othis).attr("class") == "mainDiv"){
            startPos = $(Othis).children().offset();
        }else{
            startPos = $(Othis).offset();
        }

        var disX = ev.pageX - startPos.left;
        var disY = ev.pageY - startPos.top;
        return dis = {
            "disX":disX*variable.ratio,
            "disY":disY*variable.ratio
        }
    },
    //获得比例
    getRatio : function(Othis){
        //获得比例
        var _this = $(Othis);
        var _thischild = _this.children("svg")[0];
        var _thisWidth =  parseFloat(_this.css('width'));
        var _thischildWidth = _thischild.getAttribute("viewBox").split(" ")[2];
        variable.ratio = _thischildWidth/_thisWidth;
    },
    //获得div比例
    getDivRatio : function(Othis){
        //获得比例
        var _this = $(Othis);
        var _thischild = _this.children("svg")[0];
        var _thisWidth =  parseFloat($(_thischild).css('width'));
        var _thischildWidth = _thischild.getAttribute("viewBox").split(" ")[2];
        variable.ratio = _thischildWidth/_thisWidth;
    }
};

//生成新的笔记图片
function newNotesIcon(Othis,dis,mockTxtTitle,mockTxtContent,isPc){

    //隐藏modal
    hideModal();

    //如果没有登录，则登录
    if(!variable.isLogin){
        $("#loginModal").modal("show");
        return false;
    }

    var m = document.createElementNS(svgNS, "path");
    m.setAttributeNS(null, "fill", "#d9534f");
    m.setAttributeNS(null, "fill-opacity", "0.6");
    m.setAttributeNS(null, "d",variable.notesD);
    //创建外层svg
    var n = document.createElementNS(svgNS, "svg");
    n.setAttributeNS(null, "viewBox", "0 0 1024 1024");
    n.setAttributeNS(null, "width", "30");
    n.setAttributeNS(null, "height", "30");
    var date = new Date();
    date = variable.isLogin.userName + date.getTime() + Math.random();
    n.setAttributeNS(null, "class", "note-mark");
    n.setAttributeNS(null, "data-id", date);
    n.setAttributeNS(null, "x", dis.disX-15);
    n.setAttributeNS(null, "y", dis.disY-15);
    $(n).append(m);

    //生成透明方块
    var tpRect = transparentRect();
    $(n).append(tpRect);

    $(Othis).children("svg").append(n);
    //保存数据
    var data = {
        "id":date,
        "noteID":date,
        "x":$(n).attr("x"),
        "y":$(n).attr("y"),
        "mockTxtTitle":mockTxtTitle,
        "mockTxtContent":mockTxtContent,
        box:Othis.id.split("_")[1]                     //属于哪个章节
    };
    saveNotes(data,n,isPc);
}

//传输数据进入后台（笔记）
function saveNotes(olddata,Othis,isPc){

    olddata.userName = variable.isLogin.userName;
    olddata.arg      = window.location.pathname.split("books/")[1];
    var data = JSON.stringify(olddata);
    $.ajax({
        type: 'post',
        contentType:'text/plain',
        url: '/saveNotes',
        data: data,
        success: function(data){
            if(data != "success"){
                $(Othis).empty();
            }else{
                appedLiNote(olddata);
                if(isPc){
                    appedAllNote(olddata);
                    scrollbar();
                }
            }

        },
        error:function(err,str){
            console.log(str)
        }
    });
}

//传输数据进入后台（线,荧光笔）
function postSvgAjax(data){

    //ID
    var date = new Date();
    date = variable.isLogin.userName + date.getTime() + Math.random();
    data.id = date;
    data.arg = window.location.pathname.split("books/")[1];
    $(variable.startPoint).attr('data-id',date);

    var $startPoint  = variable.startPoint;

    // 把状态节点取消
    variable.startPoint = false ;


    //如果没有登录，则登录
    if(!variable.isLogin){
        $startPoint.parentNode.removeChild($startPoint);
        $("#loginModal").modal("show");
        return false;
    }

    //用户名
    data.userName = variable.isLogin.userName;


    var data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        contentType:'text/plain',
        url: '/postSvgAjax',
        data: data,
        success: function(data){
            if(data != "success"){
                $startPoint.parentNode.removeChild($startPoint);
            }
        },
        error:function(err,str){
            swal("请检查网络连接情况")
            $startPoint.parentNode.removeChild($startPoint);
        }
    });
}

//显示画线
function showLine(data){
    var data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        url: '/showLine',
        contentType:'text/plain',
        data:data,
        success: function(data){
            var line = data;
            for (x in line)
            {
                var newLine = newmline(line,x);
                $("#box_"+line[x].box).find("svg.linePen").prepend(newLine);

                //如果隐藏笔记什么的，就隐藏
                EV_notePenLine();
            }
        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//生成线
function newmline(line,x){
    var m = document.createElementNS(svgNS, "path");
    m.setAttributeNS(null, "class", line[x].type+" "+line[x].box);
    m.setAttributeNS(null, "stroke", line[x].stroke);
    m.setAttributeNS(null, "data-id", line[x].theID);
    m.setAttributeNS(null, "fill", "none");
    m.setAttributeNS(null, "stroke-width", "2");
    m.setAttributeNS(null, "d", line[x].d);
    return m ;
}

//显示荧光笔
function showPen(data){
    data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        url: '/showPen',
        contentType:'text/plain',
        data:data,
        success: function(data){
            var rect = data;
            for (x in rect)
            {
                var newrect = newmRect(rect,x);
                $("#box_"+rect[x].box).find("svg.linePen").prepend(newrect);

                //如过果隐藏笔记什么的，就隐藏
                EV_notePenLine();
            }
        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//生成方块
function newmRect(rect,x){
    var svgNS = "http://www.w3.org/2000/svg";
    var m = document.createElementNS(svgNS, "rect");
    m.setAttributeNS(null, "class", rect[x].type+" "+rect[x].box);
    m.setAttributeNS(null, "fill", rect[x].fill);
    m.setAttributeNS(null, "data-id", rect[x].theID);
    m.setAttributeNS(null, "fill-opacity", "0.5");
    m.setAttributeNS(null, "x", rect[x].x);
    m.setAttributeNS(null, "y", rect[x].y);
    m.setAttributeNS(null, "width", rect[x].width);
    m.setAttributeNS(null, "height", rect[x].height);
    return m ;
}

//显示笔记
function showNotes(data){
    data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        url: '/showNotes',
        contentType:'text/plain',
        data:data,
        success: function(data){
            //var notes = JSON.parse(data);
            var notes = data;
            $(notes).each(function(i,value){
                //生成笔记
                newNotes(value);
                //生成左边目录结构
                appedLiNote(value);
            })
        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//生成笔记
function  newNotes(note){

    var m = document.createElementNS(svgNS, "path");
    m.setAttributeNS(null, "fill", "#d9534f");
    m.setAttributeNS(null, "fill-opacity", "0.6");
    m.setAttributeNS(null, "d",variable.notesD);
    //创建外层svg
    var n = document.createElementNS(svgNS, "svg");
    n.setAttributeNS(null, "viewBox", "0 0 1024 1024");
    n.setAttributeNS(null, "width", "30");
    n.setAttributeNS(null, "height", "30");
    n.setAttributeNS(null, "class", "note-mark");
    n.setAttributeNS(null, "data-id", note.noteID);
    n.setAttributeNS(null, "x", note.noteX);
    n.setAttributeNS(null, "y", note.noteY);
    $(n).append(m);

    //生成透明方块
    var tpRect = transparentRect();
    $(n).append(tpRect);

    $("#box_"+note.box).children("svg").append(n);

    //如过果隐藏笔记什么的，就隐藏
    EV_notePenLine();
}

//生成一个透明的方块
function transparentRect(){
    var m = document.createElementNS(svgNS, "rect");
    m.setAttributeNS(null, "x", 150);
    m.setAttributeNS(null, "y", 100);
    m.setAttributeNS(null, "width", 700);
    m.setAttributeNS(null, "height", 800);
    m.setAttributeNS(null, "fill", "transparent");
    return m;
}

//生成左边笔记li
function appedLiNote(data){
    var a = "<div class='item-summary'>"+data.mockTxtTitle+"</div>"+
        "<div class='item-customstr'>"+decodeURIComponent(data.mockTxtContent)+"</div>";
    var b = "<li class='note-"+data.box+"' data-liid='"+data.noteID+"'>"+a+"</li>";
    $("#overview").append(b);
    //latex转化成html
    var  latex_html  = $("#overview li").last().find(".mathquill-editable");
    latex_html.each(function(index, element) {
        var lat = $(this).html();
        $(this).html("");
        $(this).mathquill('editable').mathquill("write", lat);
        $(this).find("span.textarea").remove();
        $(this).attr("class","mathquill-rendered-math");
    });
}

//比例缩放
function scre(ratio){
    var svgWidth = parseFloat($(".mainSvg").css("width"))*ratio;

    fangSuoScre(svgWidth);
}


//放大缩小
function fangSuoScre(svgWidth){

    //设置svg
    $(".mainSvg").css({
        "width":svgWidth,
        "height":svgWidth
    });

    //设置div
    $(".mainDiv").css({
        "width":svgWidth
    });

    //暂且让图形好看
    svgWidth = svgWidth*0.8;

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

    //动态控制svg高度
    $("#containerSvg > .mainDiv svg").each(function(i,value){
        var wh =  value.getAttribute("viewBox");
        if(typeof wh  == "string"){
          var ratio = wh.split(" ")[2]/wh.split(" ")[3];
          var svgHeight = $(value).width()/ratio;
          $(value).css("height", svgHeight);
        }
    })
}

//动态加载书的内容
function loadBooks(len,end){

    //提示
    $("#resourcewaiting").show();

    //数据
    var data = {
        arg:window.location.pathname.split("books/")[1],
        chapter1 : len,
        chapter2 : end
    };
    data = JSON.stringify(data);

    $.ajax({
        type: 'post',
        url: '/loadBooks',
        contentType:'text/plain',
        data:data,
        success: function(data){

            data.sort(function(a,b){
                return a.chapter > b.chapter
            })

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

            //判断是否是分布阅读,如果是阻止默认事件
            if($("body").hasClass("bodyDistribution")){
                fenbu.loaded = true ;
                $("#containerSvg").children("div").css("width",$("#containerMain").width()*0.9);
                var SvgWidthLeft = $(".mainSvg").width();
                goAmShow(SvgWidthLeft)
            }
            //加载动态图像
            goSVG();

            //重置SVG大小
            fangSuoScre($("#box_1").width());

            //加载笔记等内容
            loadUserNote();

            //获得推荐内容
            bookRecommended(len,end);

            //隐藏提示
            $("#resourcewaiting").hide();

        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//获得推荐内容
function bookRecommended(begin,end) {
    var data = {
        arg       : window.location.pathname.split("books/")[1],
        begin     : begin-1,
        end       : end-1
    };
    data = JSON.stringify(data);

    $.ajax({
        type: "post",
        url: "/bookRecommended",
        data: data,
        success: function (msg) {
            $.each(msg, function (i, n) {
                $("#recommendedcontent>ul").append(n.content);
            });
        }
    })
}

//判断笔记等内容是显示还是隐藏状态
function EV_notePenLine(){
    if($("#showHideLine").hasClass("cur")) {
        $("svg.linePen").find(".line").hide();
    }
    if($("#showHidePen").hasClass("cur")) {
        $("svg.linePen").find(".rect").hide();
    }
    if($("#showHideNotes").hasClass("cur")) {
        $(".note-mark").hide();
    }
}

//如果用户登录，加载用户做的笔记
function loadUserNote(){
    var begin = variable.chapterBegin;
    var end = variable.chapter;

    //如果没有登录，则登录
    if(!variable.isLogin || begin == end){
         return false;
    }else{
        var data = {
            arg       : window.location.pathname.split("books/")[1],
            begin     : begin,
            end       : end,
            userName  : variable.isLogin.userName
        };
        //重置初始化加载笔记的章
        variable.chapterBegin = variable.chapter;
        showLine(data);
        showPen(data);
        showNotes(data);
    }
}

//获得一共多少章节
function getchapterLenght(){
    var data = {
        arg       : window.location.pathname.split("books/")[1]
    };
    data = JSON.stringify(data);
    $.ajax({
        type: "post",
        url: "/getchapterLenght",
        data: data,
        success: function (data) {
           variable.chapterLenght = data[0]["count(*)"];
        }
    })
}

//用户登录，注册等操作
$(function() {

    //快速注册
    $("#spellzc").click(function(e){
        e.stopPropagation();
        $("#loginModal").modal('hide');
        $("#submitLoginModal").modal('show');
    });

    //快速登录
    $("#spelldl").click(function(e){
        e.stopPropagation();
        $("#loginModal").modal('show');
        $("#submitLoginModal").modal('hide');
    });

    //登陆函数，用户向服务端验证用户名和密码
    $("#login").click(function(){
        var login_email = $("#login_email").val();
        var login_password = $("#login_password").val();
        //判断用户名和密码不能为空
        if (login_email == "") {
            $("#login_email").focus().attr("placeholder", "用户名不能为空！").parents("login-field");
            return false ;
        } else if(login_password == ""){
            $("#login_password").focus().attr("placeholder", "密码不能为空！");
            return false ;
        }else {
            login(login_email,login_password);
        }
    });

    //注册
    $("#submitLogin").click(function(){
        var submitLogin_email = $("#submitLogin_email").val();
        var submitLogin_nc = $("#submitLogin_nc").val();
        var submitLogin_password = $("#submitLogin_password").val();
        var submitLogin_repassword = $("#submitLogin_repassword").val();
        if(submitLogin_password != submitLogin_repassword)
        {
            $("#submitLogin_password").val("").attr("placeholder", "两次输出的密码不一致，请重新输入密码！").focus();
            $("#submitLogin_repassword").val("");
        }else
        {
            ajaxCheckUserName(submitLogin_email,submitLogin_password,submitLogin_nc);
        }

    });
});

//用户登录
function login(userName,userPwd){
    var data = {
        userName : userName,
        userPwd  : userPwd
    };
    data = JSON.stringify(data);
    $.ajax({
        type: 'post',
        url: '/login',
        data: data,
        contentType:'text/plain',
        success: function(data){
            if(data){

                if(!isMobile.any) {
                    /*初始化msg*/
                    initMsg(data);
                }

                variable.isLogin = data;
                $("#loginModal").modal('hide') ;
                $("#userlogin",window.parent.document).hide();
                $("#userExit",window.parent.document).show();
                loadUserNote();
            }else{
                variable.isLogin = false;
                $("#login_email").val("").focus().attr("placeholder", "用户名或密码错误,请重新输入！");
                $("#login_password").val("").attr("placeholder", "密码");
            }
        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//判断用户是否登录
function isLogin(){
    $.ajax({
        type: 'post',
        url: '/isLogin',
        contentType:'text/plain',
        success: function(data){
            if(data == "false"){
                variable.isLogin = false;
                $("#loginModal").modal("show");
            }else{

                if(!isMobile.any) {
                    /*初始化msg*/
                    initMsg(data);
                }

                variable.isLogin = data;
                loadUserNote();
            }
        },
        error:function(err,str){
            console.log(str)
        }
    })
}

//验证用户唯一性 如果没有就注册 如果有就返回
function ajaxCheckUserName(e,p,n) {
    var data = {
        userName : e,
        userPwd  : p,
        userNc   : n
    };
    data = JSON.stringify(data);
    $.ajax({
        type: "post",
        url: "/ajaxCheckUserName?s=" + Math.random(),
        data: data,
        success: function(msg) {
           if(msg){
              //注册
              reg(data);
           }else{
               $("#submitLogin_email").val("").focus().attr("placeholder", "此用户名已被注册！");
           }
        },
        error: function(msg) {
            alert("注册失败！");
        }
    });
}

//注册
function reg(data){
    $.ajax({
        type: "post",
        url: "/reg?s=" + Math.random(),
        data: data,
        success: function(msg) {
            if(msg = "success") {
                $("#submitLoginModal").modal('hide');
            }
        },
        error: function(msg) {
            alert("注册失败！");
        }
    });
}

//删除笔记
function deleteNotes(data){
    var id = data.noteId;
    data = JSON.stringify(data);
    $.ajax({
        type: "post",
        url: "/deleteNotes?s=" + Math.random(),
        data: data,
        success: function(msg) {
            if(msg == "success"){
                hideModal();
                $("[data-id='"+id+"']").remove();
                $("[data-liid='"+id+"']").remove();
            }
        },
        error: function(msg) {
            swal("删除失败！");
        }
    });
}

//更新笔记
function updateNotes(olddata){
    data = JSON.stringify(olddata);
    $.ajax({
        type: "post",
        url: "/updateNotes?s=" + Math.random(),
        data: data,
        success: function(msg) {
            if(msg == "success"){
                $liID = $("[data-liid='"+olddata.noteID+"']");

                $liID.find(".item-summary").html(olddata.mockTxtTitle);
                $liID.find(".item-customstr").html(olddata.mockTxtContent);

                //latex转化成html
                var  latex_html  = $liID.find(".mathquill-editable");
                latex_html.each(function(index, element) {
                    var lat = $(this).html();
                    $(this).html("");
                    $(this).mathquill('editable').mathquill("write", lat);
                    $(this).find("span.textarea").remove();
                    $(this).attr("class","mathquill-rendered-math");
                });

                hideModal();
            }
        },
        error: function(msg) {
            swal("删除失败！");
        }
    });
}

//隐藏颜色条
function hideselectColor(){
    $("#selectColor").hide();
}

//取消任何控制事件基于作图部分
function cancelAttr(){
    variable.selectColor = false;
    variable.mouseState  = false;
    variable.startPoint  = false;
    hideselectColor();
}

//初始化消息
function initMsg(data){
    var options = {
        id : data.userID
    };
    if(!window.parent.firstMsg){
        window.parent.msg.init(options);
    }
}
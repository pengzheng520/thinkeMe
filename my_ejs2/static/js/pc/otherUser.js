/**
 * Created by Administrator on 2016/7/13.
 */
//如果用户登录，加载用户做的笔记
//其他用户需要加载笔记的章节
var otherUser = {
    ids  : 0 ,
    begin : 0,
    end   : 0,
    isShare : false, //是否分享
    count  : 0,   //计数器，判断异步是否加载完成
    mack   : 0    //遮罩
};

$(function(){

    //判断是移动端还是PC端
    var otherUserWidth = '30%';
    var otherUserHeight = '50%';
    if(isMobile.any){
        otherUserWidth = '100%';
        otherUserHeight = '100%';
    }

    //分享笔记
    $("#shareNotesBtn").click(function(){

        if(!variable.isLogin){
            $("#loginModal").modal("show");
            return false;
        }

        //分享笔记给朋友
        newShareFrineds(function(friends,sharedFriends){
            var shared = "";  //已分享好友
            var allFriends = "";  //全部好友
            var lsData = {} ; //临时保存数据
            try {
                //遍历全部好友
                $.each(friends, function (n, v) {
                    allFriends += '<div data-id="' + v.userID + '"><img width="30" height="30" src="' + v.img + '"><span>' + v.userNickname + '</span></div>';
                    lsData[v.userID] = {};
                    lsData[v.userID].name = v.userNickname;
                    lsData[v.userID].img = v.img;
                });
            }catch(e){
                allFriends  = '<div class="share-ts">你没有好友，赶快去加好友吧！</div>';
            }

            try{
                $.each(sharedFriends,function(n,v){
                    shared  += '<div data-id="'+ v.shareid+'"><img width="30" height="30" src="'+ lsData[v.shareid].img+'"><span>'+lsData[v.shareid].name+'</span><button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button></div>';
                })
            }catch(e){
                shared = '<div class="share-ts">你没有分享给好友这本书籍的笔记</div>';
            }


            var htmlData = '<div class="share">'+
                '<div class="share-header clearfix"><h4>全部好友</h4>'+allFriends+'</div>'+
                '<div class="share-body clearfix"><h4>已分享好友</h4>'+shared+'</div>'+
                '<div class="modal-footer">'+
                '<button type="button" class="btn btn-primary share-save" id="shareSave">保存</button>'+
                '</div>'+
                '</div>';

            window.parent.layer.open({
                type: 1,
                title: '分享笔记',
                area: [otherUserWidth, otherUserHeight], //宽高
                content: htmlData
            });
        });
    })

    //查看别人分享给我的笔记
    $("#LookNotesBtn").click(function(){

        if(!variable.isLogin){
            $("#loginModal").modal("show");
            return false;
        }

        shareBookToMe(function(friends){
            var shared = "";
            if(friends.length != 0) {
                $.each(friends, function (n, v) {
                    shared += '<div class="radio"><label>'+
                        '<input type="radio" name="optionsRadios" value="'+v.userName+'">'+
                        '<img width="30" height="30" src="' + v.img + '"><span>' + v.userNickname + '</span>'+
                        '</label></div>'
                })
            } else{
                shared = '<div class="share-ts">你没有好友分享这本书籍的笔记给你</div>';
            }


            var htmlData = '<div class="share">'+
                '<div class="share-body clearfix"><h4>分享书的好友</h4>'+shared+'</div>'+
                '<div class="modal-footer">'+
                '<button type="button" class="btn btn-primary share-save" id="delShareSave">取消查看好友分享的笔记</button>'+
                '<button type="button" class="btn btn-primary share-save" id="lookShared">确定</button>'+
                '</div>'+
                '</div>';

            window.parent.layer.open({
                type: 1,
                title: '查看好友分享的笔记',
                area: [otherUserWidth, otherUserHeight], //宽高
                content: htmlData
            });
        })
    });

    // 取消查看分享的好友
    $('body',window.parent.document).on('click','.share  #delShareSave',function(){
            $(".other-user").remove();
            otherUser.isShare = false;
            window.parent.layer.closeAll('page');
    })

    // 查看分享的好友
    $('body',window.parent.document).on('click','.share  #lookShared',function(){
        var ids = $(this).parents('.share').find("input[type='radio']:checked").val();
        if(ids){
            otherUser.ids = ids;
            otherUser.begin = 0;
            otherUser.mack = window.parent.layer.load(1, {
                shade: [0.5, '#000'] //0.1透明度的白色背景
            });
            $(".other-user").remove();
            otherUser.isShare = true;
            loadOtherUser();
        }else{
            window.parent.layer.alert('请选择一个好友');
        }
    })

    //鼠标移动到笔记显示笔记内容
    $(document).on("mouseover",".otheruser-note-mark > rect",function(e){
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
    $(document).on("mouseout",".otheruser-note-mark > rect",function(e){
        $("#noteMarkzs").hide();
        $("#triangleSummary").html("");
        $("#triangleCustomstr").html("");
    });
    //单击笔记查看笔记内容
    $(document).on("click",".otheruser-note-mark",function(e){
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
});

    //加载其他人的笔记
    function loadOtherUser(){

        if(!otherUser.isShare){
            return false;
        }

        otherUser.end = variable.chapter;
        var data = {
            arg: variable.arg,
            begin: otherUser.begin,
            end: otherUser.end,
            userName: otherUser.ids
        };
        data = JSON.stringify(data);
        showLineOtherUser(data);
        showPenOtherUser(data);
        showNotesOtherUser(data);
    }


    //加载东西
    function showLineOtherUser(data){
        $.ajax({
            type: 'post',
            url: '/showLine',
            contentType:'text/plain',
            data:data,
            success: function(data){
                var line = data;
                for (x in line)
                {
                    var newLine = othernewmline(line,x);
                    $("#box_"+line[x].box).find("svg.linePen").prepend(newLine);

                }

                otherDoneCount();

            },
            error:function(err,str){
                console.log(str)
            }
        })
    }
    //生成线
    function othernewmline(line,x){
        var m = document.createElementNS(svgNS, "path");
        m.setAttributeNS(null, "class", 'other-user');
        m.setAttributeNS(null, "stroke", line[x].stroke);
        m.setAttributeNS(null, "data-id", line[x].theID);
        m.setAttributeNS(null, "fill", "none");
        m.setAttributeNS(null, "stroke-width", "2");
        m.setAttributeNS(null, "d", line[x].d);
        return m ;
    }
    function showPenOtherUser(data){
        $.ajax({
            type: 'post',
            url: '/showPen',
            contentType:'text/plain',
            data:data,
            success: function(data){
                var rect = data;
                for (x in rect)
                {
                    var newrect = othernewmRect(rect,x);
                    $("#box_"+rect[x].box).find("svg.linePen").prepend(newrect);

                }

                otherDoneCount();
            },
            error:function(err,str){
                console.log(str)
            }
        })
    }
    //生成方块
    function othernewmRect(rect,x){
        var svgNS = "http://www.w3.org/2000/svg";
        var m = document.createElementNS(svgNS, "rect");
        m.setAttributeNS(null, "class", 'other-user');
        m.setAttributeNS(null, "fill", rect[x].fill);
        m.setAttributeNS(null, "data-id", rect[x].theID);
        m.setAttributeNS(null, "fill-opacity", "0.5");
        m.setAttributeNS(null, "x", rect[x].x);
        m.setAttributeNS(null, "y", rect[x].y);
        m.setAttributeNS(null, "width", rect[x].width);
        m.setAttributeNS(null, "height", rect[x].height);
        return m ;
    }
    function showNotesOtherUser(data){
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
                    othernewNotes(value);
                    //生成左边目录结构
                    otherappedLiNote(value);
                });

                otherDoneCount();

            },
            error:function(err,str){
                console.log(str)
            }
        })
    }
    //生成笔记
    function  othernewNotes(note){

        var m = document.createElementNS(svgNS, "path");
        m.setAttributeNS(null, "fill", "#017f62");
        m.setAttributeNS(null, "fill-opacity", "0.6");
        m.setAttributeNS(null, "d",variable.notesD);
        //创建外层svg
        var n = document.createElementNS(svgNS, "svg");
        n.setAttributeNS(null, "viewBox", "0 0 1024 1024");
        n.setAttributeNS(null, "width", "30");
        n.setAttributeNS(null, "height", "30");
        n.setAttributeNS(null, "class", 'other-user otheruser-note-mark');
        n.setAttributeNS(null, "data-id", note.noteID);
        n.setAttributeNS(null, "x", note.noteX);
        n.setAttributeNS(null, "y", note.noteY);
        $(n).append(m);

        //生成透明方块
        var tpRect = transparentRect();
        $(n).append(tpRect);

        $("#box_"+note.box).children("svg").append(n);
    }
    //生成左边笔记li
    function otherappedLiNote(data){
        var a = "<div class='item-summary'>"+data.mockTxtTitle+"</div>"+
            "<div class='item-customstr'>"+decodeURIComponent(data.mockTxtContent)+"</div>";
        var b = "<li class='other-user' data-liid='"+data.noteID+"'>"+a+"</li>";
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


    function otherDoneCount(){
        otherUser.count++;
        if(otherUser.count == 3){
            otherUser.begin = otherUser.end;
            otherUser.count = 0;
            window.parent.layer.close(otherUser.mack);
            window.parent.layer.closeAll('page');
        }
    }

    //分享给我的
    function shareBookToMe(callback){
        var baseMack = window.parent.layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        var data = {
            arg       : window.location.pathname.split("books/")[1]
        };
        data = JSON.stringify(data);

        $.ajax({
            type: "post",
            url: "/shareBookToMe",
            data : data,
            success: function (friends) {
                callback(friends);
                window.parent.layer.close(baseMack);
            }
        })
    }

    //分享的朋友
    function newShareFrineds(callback){
        var baseMack = window.parent.layer.load(1, {
            shade: [0.5, '#000'] //0.1透明度的白色背景
        });
        var data = {
            arg       : window.location.pathname.split("books/")[1]
        };
        data = JSON.stringify(data);
        $.ajax({
            type: "post",
            url: "/getUser",
            success: function (msg) {
                if(msg != ""){
                    $.ajax({
                        type: "post",
                        url: "/shareBookToWho",
                        data : data,
                        success: function (friendsId) {
                            callback(msg,friendsId);
                            window.parent.layer.close(baseMack);
                        }
                    })
                }else{
                    callback();
                    window.parent.layer.close(baseMack);
                }
            }
        })
    }



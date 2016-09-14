


//用户登录，注册等操作
$(function() {

    setContentHeight();
    var resize = $(window).jqElemResize();
    $(resize).resize(function() {
        setContentHeight();
    });

    //判断用户是否登录
    isLogin();

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

    //用户退出登录
    $("#userLoginOut").click(function(){
        $.ajax({
            type: 'Get',
            url: '/logout',
            success: function(data){
                window.location.href="/";
            },
            error:function(err,str){
                console.log(str)
            }
        })
    });

    //分享好友这本书的笔记
    $(document).on('click','.share > .share-header > div',function(){
        var id= $(this).attr('data-id');
        if($('.share > .share-body > div[data-id="'+id+'"]').length == 0){
            var  data  = '<div data-id="'+id+'">'+ $(this).html()+'<button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button></div>';
            $('.share > .share-body').append(data);
        }
        $(".share-ts").remove();
    });

    //删除分享好友这本书的笔记
    $(document).on('click','.share > .share-body button.close',function(){
        $(this).parent().remove();
    });
    //保存分享的好友
    $(document).on('click','.share  #shareSave',function(){
        var shareid = "";
        $(".share-body > div").each(function(){
            shareid += $(this).attr('data-id') + ',';
        });
        if(shareid.length > 0){
            shareid = shareid.substring(0,shareid.length-1);
        }
        if(shareid  == "undefined") {
            return false;
        }
        var data = {
            shareId  : shareid,
            bookname : window.frames["content"].variable.arg
        };
        $.ajax({
            type: 'post',
            url: '/saveShareId',
            data: JSON.stringify(data),
            contentType:'text/plain',
            success: function(msg){
                console.log(msg)
                if(msg == 'success'){
                    layer.closeAll('page');
                    layer.alert('设置成功')
                }
            },
            error:function(err,str){
                console.log(str)
            }
        })

    })



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
                /*临时解决方案*/
                window.location.reload();
                /*初始化msg*/
                initMsg(data);

                $("#userlogin").hide();
                $("#userExit").show();
                $("#loginModal").modal('hide');
            }else{
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
                //用户没有记录session
            }else{

                /*初始化msg*/
                initMsg(data);

                //用户记录session
                $("#userlogin").hide();
                $("#userExit").show();
                $("#loginModal").modal('hide');
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
                window.location.href="/";
                $("#submitLoginModal").modal('hide');
                $("#userlogin").hide();
                $("#userExit").show();
            }
        },
        error: function(msg) {
            alert("注册失败");
        }
    });
}


function setContentHeight(){
    var windowHeight = window.document.documentElement.clientHeight;
    window.document.getElementById("content").height = windowHeight;
}

//初始化消息
function initMsg(data){
    var options = {
        id : data.userID
    };
    if(msg.id != data.userID && !isMobile.any){
        msg.init(options);
    }
}
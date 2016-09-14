/**
 * Created by Administrator on 2016/5/10.
 */
(function($) {
    var msg = function(options){
        //连接的url路径
        this.http  = "http://localhost:9999";
        //是不是因为网络不稳定断线重连
        this.reconnection = false;
        //连接服务器
        this.socket = io.connect(this.http+"?userName="+options.id);
        //取得用户名
        this.id = options.id;
        //消息事件初始化
        this.EV_init();
        //选择的文本状态，富文本编辑器适用
        this.selectedRange = false;
        //保存数学iframe对象
        this.iframeMath  = false ;
        //保存用户个人照片
        this.img  = "" ;
        //保存昵称
        this.name  = "";
        //群组
        this.groupDiscussion  =  ['语文讨论组','数学讨论组','英语讨论组','物理讨论组','化学讨论组','历史讨论组','地理讨论组','生物讨论组','思想品德讨论组','音乐讨论组','美术讨论组','体育讨论组','信息技术讨论组'];
    };


    msg.prototype = {

      //消息事件初始化
      EV_init:function(){
          var self = this ;
          //当连接上时候
          self.socket.on('connect', function(){

              //首次连接
              if(!self.reconnection){
                  //触发登陆事件
                  self.socket.emit('login',{
                      id : self.id
                  });
                //   self.init_Interface();
              }


              //再次连接的话就不是初次连接
              self.reconnection =  true;
          });

          //获得原来的状态
          self.socket.on('oldInformation',function(data){
              $("#imFold").hide();
              $("#imChatWindow").show();
              $("#imChatHead").find("li").removeClass('active').eq(1).addClass('active');
              $("#imChatBody").css('margin-left','-270px');

              //进入讨论组
              var $liGroup =  $("#zGroup").children('li[data-group="'+data.userGroup.groupID+'"]');
              self.enterGroupAnimate($liGroup);

              //讨论组里面的群
              self.addClassLi(data.groupInformation);
              if(data.userGroup.classID) {
                  //创建群
                  //self.getGroupInterface(data.groupInformation.group[data.userGroup.classID]);
                  //发送消息给后台说我进入群组
                  var enterClass = {
                      classID       : data.userGroup.classID,                        //在什么教室ID
                      classdomianID : data.userGroup.groupID,                       //在什么区域
                      pwd           : data.pwd,                     //密码
                      id            : self.id,                                       //用户id
                      name          : self.name,                                     //用户名字
                      img           : self.img                                       //用户个人照片
                  };
                  self.enterClass(enterClass);
              }

          });

          //获得好友列表
          self.socket.on('getUser',function(data){
              if(data) {
                  var friends = $.grep(data, function (n, i) {
                      if (n.id == self.id) {
                          //保存个人照片
                          self.img = n.img;
                          self.name = n.name;
                      }
                      return n.id != self.id;
                  });

                  self.init_Interface(friends);

                  //获得未读消息
                  self.socket.emit('noRead', self.id, function (msg, userInformation) {
                      if (msg != null) {
                          $.each(msg, function (n, data) {
                              $.each(userInformation, function (n, value) {
                                  if (value.id == data.sender) {
                                      data.senderImg = value.img;
                                      data.senderName = value.name;
                                  }
                              });
                              self.newMsgFun(data);
                          })
                      }

                  })
              }else{
                  layer.alert("非法用户")
              }


          });



          //是否有其他人登陆此账号
          self.socket.on('relogin',function(data){
              layer.alert(data.msg)
          });

          //获得好友发送的消息
          self.socket.on('sendOneMsg',function(data,callback){
             self.newMsgFun(data,callback);
          });

          //获得群组发送的消息
          self.socket.on('getGroupMsg',function(data,callback){
              if(data.sender == self.id){
                  data.who = 'me';
              }else{
                  data.who = 'you';
              }
              data.$receiver = $('.interface[data-id="'+data.receiver+'"]');
              self.newMsgContent(data)
          });

          //在这个群组新建立起来的群
          self.socket.on('NewClass',function(data){
              self.newClass(data);
          });

          //当在讨论组里面的人员，群组有变化的时候
          self.socket.on('groupClassNum',function(data){
             $("#zGroup").find('.panel_group_item[data-id="'+data.classID+'"]').find(".class-num").text(data.num);
          });


          //群里面进来新的人员
          self.socket.on('LeftClass',function(data){
              self.appendClassUser(data);
          });

          //如果有群解散
          self.socket.on('DismissClass',function(data){
              //此用户在讨论组
              var groupInterface = $('.group-interface[data-id="'+data.classID+'"]');
              if(groupInterface.length > 0){
                      layer.alert('群主离开');
                     groupInterface.remove();
              }

              $("#zGroup").find('.panel_group_item[data-id="'+data.classID+'"]').remove();

          });

          //获得教室人数
          self.socket.on('upClassNum',function(data){
              //此用户在讨论组
              $("#zGroup").find('.panel_group_item[data-id="'+data.classID+'"]').find(".class-num").text(data.num);
          });


          //某某某离开教室
          self.socket.on('leaveClass',function(data){
              var groupInterface = $('.group-interface[data-id="'+data.classID+'"]');
              //此用户在讨论组
              if(data.id == self.id){
                  groupInterface.remove();
              }else{
                var $userLI =  groupInterface.find('.group-members .panel_item[data-id="'+data.id+'"]');
                var name = $userLI.find(".panel_single-row").text();
                $userLI.remove();
                var tsxx = '<p class="u-msgTime">- - - 用户'+name+'离开群组 - - -</p>';
                groupInterface.find(".chat-content").append(tsxx);
              }

          });

      },

      //动态判断生成消息方法
      newMsgFun :function(data,callback){
          var self = this ;
          //判断有木有这个好友
          var $li = $("#singleFriends").children('li[data-id="'+data.sender+'"]');
          if($li.length == 0){
              var friends = {
                  id   : data.sender,
                  name : data.senderName,
                  img  : data.senderImg
              };
              //当没有这个用户,生成这个用户
              var liFriend = self.appendFriendS([friends]);
              $("#singleFriends").append(liFriend);
          }

          //判断聊天框生成没有
          var $face = $('.interface[data-id="'+data.sender+'"]');

          if($face.length == 0){
              var userData = {
                  imgSrc : data.senderImg,
                  name   : data.senderName,
                  id     : data.sender,
                  top    : $(window).height()-445+"px",
                  left   : $(window).width() - 722+"px"
              };
              //如果没有这个聊天框,生成这个聊天框
              self.getOneInterface(userData);
          }
          //创建消息
          var value = {
              who   :  "you",
              content  :  data.content,
              $receiver : $('.interface[data-id="'+data.sender+'"]'),
              img   :  data.senderImg
          };
          self.newMsgContent(value);

          //先判断聊天框显示没有
          if($('.interface[data-id="'+data.sender+'"]').is(':hidden')){
              //如果是隐藏
              //判断聊列表展示没有
              if($("#imChatWindow").is(':hidden')){
                  //如果界面隐藏
                  $("#imFold").find(".fold_font").text("你有新的消息");
              }

              //未读消息+1
              var $badge = $("#singleFriends").children('li[data-id="'+data.sender+'"]').find(".badge");
              $badge.show().text(+$badge.text()+1);
          }else{
                  //没有隐藏的话(说明已读)
                  callback('true');
          }

      },

      //初始化事件
      addEvent:function(){

          var self = this ;

          //点击
          $("#thinkMsg").on('click','#imFold',function(e){
              e.stopPropagation();
              $(this).hide();
              $("#imChatWindow").slideDown();
              $(this).find(".fold_font").text("LiveBooks");
          });

          //隐藏
          $("#thinkMsg").on('click','#closeImWindow',function(e){
              e.stopPropagation();
              $("#imChatWindow").slideUp("fast",function(){
                  $("#imFold").show();
              });
          });

          //好友显示
          $("#thinkMsg").on('click','#friends',function(e){
              e.stopPropagation();
              $("#imChatHead > li").removeClass("active");
              $(this).parent().addClass('active');
              $("#imChatBody").animate({"marginLeft":0},"fast");
          });

          //群组显示
          $("#thinkMsg").on('click','#groupFriends',function(e){
              e.stopPropagation();
              $("#imChatHead > li").removeClass("active");
              $(this).parent().addClass('active');
              $("#imChatBody").animate({"marginLeft":"-270px"},"fast");
          });

          //设置显示
          $("#thinkMsg").on('click','#setting',function(e){
              e.stopPropagation();
              $("#imChatHead > li").removeClass("active");
              $(this).parent().addClass('active');
              $("#imChatBody").animate({"marginLeft":"-540px"},"fast");
          });

          //弹出添加好友
          $("#thinkMsg").on('click','#addFriends',function(e){
              e.stopPropagation();
              $("#j-mask").show();
              $("#addFriendBox").show().find("input.j-account").val("");
          });


          //关闭添加好友
          $("#thinkMsg").on('click','#addFriendBox i.icon-close,#addFriendBox button.j-close',function(e){
              e.stopPropagation();
              $("#j-mask").hide();
              $("#addFriendBox").hide().attr("class","m-dialog");
          });

          //添加账号，输入ID
          $("#thinkMsg").on('click','#addFriendBox button.j-search',function(e){
              e.stopPropagation();
              var valId = $("#addFriendBox input.j-account").val();
              if(valId == ""){
                  return false;
              }else if(valId == self.id){
                  $("#addFriendBox").attr("class","m-dialog done");
                  $("#addFriendBox div.tip").text("别看了就是你自己");
              }else if($('#singleFriends li[data-id="'+valId+'"]').length == 1){
                  $("#addFriendBox").attr("class","m-dialog friend");
                  var friendsLi = $('#singleFriends li[data-id="'+valId+'"]');
                  var friendsImg = friendsLi.find(".panel_image").attr("src");
                  var nickname = friendsLi.find(".panel_single-row").text();
                  var Info = $("#addFriendBox div.info");
                  Info.find("img").attr("src",friendsImg);
                  Info.find(".j-nickname").text(nickname);
                  Info.find(".j-username").text("账号："+valId);

                  //点击聊天
                  $("#addFriendBox button.j-chat").unbind().click(function(e){
                      self.showChatFace(valId,$('#singleFriends li[data-id="'+valId+'"]'));
                      $("#j-mask").hide();
                      $("#addFriendBox").hide().attr("class","m-dialog");
                  });
              }else{
                  var senddata = {
                     sender    : self.id,
                     addFriend : valId
                  };
                  self.addFriends(senddata);
              }

          });


          //添加账号，返回一级菜单
          $("#thinkMsg").on('click','#addFriendBox button.j-back',function(e){
              e.stopPropagation();
              $("#addFriendBox").attr("class","m-dialog");
              $("#addFriendBox input.j-account").val("");
          });

          //点击讨论组显示具体的群组
          $("#thinkMsg").on('click','#zGroup .panel_head',function(e){
              e.stopPropagation();
              var panelGroup  = $(this).next();

              //切换讨论组
              if(panelGroup.is(":hidden")){

                  //提示如果此用户加入了群，则需要退出群，才能切换讨论组
                  if($(".group-interface").length > 0){
                      layer.msg('需要退出群,才能切换讨论组,如果想切换讨论组,请先退出讨论组。');
                      return false;
                  }

                  var $liGroup = $(this).parent();

                  //发送消息给后台说我已经进入这个讨论组
                  var enterUser = {
                      group : $liGroup.attr('data-group'),
                      id    : self.id
                  };
                  self.enterGroup(enterUser,function(msgdata){
                      if(msgdata.code == 44){
                          layer.msg(msgdata.msg);
                          return false;
                      }else{
                          //构建讨论组里面的群
                          self.addClassLi(msgdata.data);
                          //进入讨论组动画
                          self.enterGroupAnimate($liGroup);
                      }
                  });
              }/*else{
                  if(msg.supportCss3("transform")) {
                      $(this).find(".iconfont").css('transform', 'rotate(0deg)');
                  }else{
                      $(this).find(".iconfont").replaceWith('<i class="icon iconfont">&#xe605;</i>');
                  }
                  panelGroup.slideUp();
              }*/
          });

          //创建群讨论组
          $("#thinkMsg").on('click','#createGroup',function(e){

              //提示如果此用户加入了群或者创建群，则需要退出群，才能切换讨论组
              if($(".group-interface").length > 0){
                  layer.msg('你已经有群，如果需要，请退出此群，创建自己的群');
                  return false;
              }

              //展示创建群界面
              var layerOpen =   layer.open({
                                      type: 1,
                                      title: '创建讨论群',
                                      skin: 'layui-layer-molv', //加上边框
                                      area: ['80%', '90%'], //宽高
                                      shift: 5, //动画类型
                                      content: self.addClassModal()
                                  });

              //创建讨论组
              $("#CreateClass").on('click',function(e){
                  var classPWD1 = $("#classPWD1").val();
                  var classPWD2 = $("#classPWD2").val();
                  if(classPWD1 != classPWD2){
                      $("#classPWD1").focus().val("");
                      $("#classPWD2").val("");
                      layer.tips('请两次输入相同的密码','#classPWD1',{
                          tips: 3
                      });
                      return false;
                  }else{
                      var className = $("#className").val();
                      var classMaxNum = $("#classMaxNum").val();
                      if(className == ""){
                          layer.tips('为你的群取一个响亮的名字吧！','#className',{
                              tips: 3
                          });
                          $("#className").focus();
                          return false ;
                      }
                      if(/^[0-9]*$/.test(classMaxNum)){
                          if(classMaxNum == ""){
                              layer.tips('请为你的群设置人数或者包含非法字母！','#classMaxNum',{
                                  tips: 3
                              });
                              $("#classMaxNum").focus();
                              return false ;
                          }
                      }else{
                          layer.tips('请输入数字','#classMaxNum',{
                              tips: 3
                          });
                          $("#classMaxNum").val("");
                          return false;
                      }

                      var classDesc = $("#classDesc").val();
                      var classdomian = $("#classdomian").find("option:selected").val();

                      var classInformation = {
                          cleateUser  : self.id,                                       //用户ID
                          classID     : self.id + new Date().getTime(),                //教室ID
                          classdomian : classdomian,                                   //在什么区域
                          className   : className,                                     //教室名称
                          classNum    : 0,                                             //教室人数
                          classMaxNum : classMaxNum,                                   //教室最大人数
                          classDesc   : classDesc,                                     //描述
                          classPWD    : classPWD1                                      //密码
                      };

                      //发送创建群给后台
                      self.socket.emit('createClass',classInformation,function(data){

                          if(data.code == 44){
                              layer.msg(data.msg);
                              return false;
                          }

                          layer.close(layerOpen);

                          //找到进入讨论组的节点
                          var $liGroup = $("#zGroup").children('li[data-group="'+classInformation.classdomian+'"]');

                          //发送消息给后台说我已经进入这个讨论组
                          var enterUser = {
                              group : classInformation.classdomian,
                              id    : self.id
                          };
                          self.enterGroup(enterUser,function(msgdata){
                              if(msgdata.code == 44){
                                  layer.msg(msgdata.msg);
                                  return false;
                              }else{
                                  //构建讨论组里面的群
                                  self.addClassLi(msgdata.data);
                                  //进入讨论组动画
                                  self.enterGroupAnimate($liGroup);
                              }

                              //发送消息给后台说我进入群组
                              var enterClass = {
                                  classID       : classInformation.classID,                      //在什么教室ID
                                  classdomianID : classdomian,                                   //在什么区域
                                  pwd           : classInformation.classPWD,                     //密码
                                  id            : self.id,                                       //用户id
                                  name          : self.name,                                     //用户名字
                                  img           : self.img                                       //用户个人照片
                              };
                              self.enterClass(enterClass);
                          });

                      })
                  }

                  //阻止冒泡
                  return false;
              });

              //阻止冒泡
              return false;
          });

          //单击自己的好友聊天
          $("#thinkMsg").on('click','#singleFriends > li',function(e){
              e.stopPropagation();
              var id = $(this).attr('data-id');
              self.showChatFace(id,$(this));
          });

          //点击群成员聊天
          $("#thinkMsg").on('click','.group-interface div.group-members > ul > li',function(e){
              e.stopPropagation();
              var id = $(this).attr('data-id');

              //获得聊天对象
              var $interface = $('.interface[data-id="'+id+'"]');

              //获得当前窗口距浏览器距离，并设置相应的高度
              var topH = $(window).height()-445+"px" ;

              if($interface.length  == 0){
                  var userData = {
                      imgSrc : $(this).find(".panel_image").attr('src'),
                      name   : $(this).find('.panel_single-row').text(),
                      id     : id,
                      top    : topH,
                      left   : $(window).width() - 722+"px"
                  };
                  self.getOneInterface(userData);
              }
              //显示
              $('.interface[data-id="'+id+'"]').slideDown();

              //改变层级
              $(".interface").css('z-index','998');
              $('.interface[data-id="'+id+'"]').css('z-index','999');

          });

          //拖拽
          msg.dragMove(".interface-header");
          //改变聊天框的层级
          self.changeZIndex(".interface");
          //关闭聊天框
          self.closeInterface();
          //放大缩小聊天框
          self.zoomInterface();
          //聊天面版表情
          self.qqface();
          //数学符号
          self.mathTool();
          //记录鼠标选中的位置
          $("#thinkMsg").on("mouseup keyup mouseout",".editor",function(e){
              self.saveSelection();
          });
          $("#thinkMsg").on("mouseup keyup",".editor",function(e){
              $(this).attr('data-math',false);
          });

          //one to one 聊天 发送消息事件
          $("#thinkMsg").on("click",".one-interface .btn-send",function(e){
              //不能输入空
              if($(this).prev().html() == ""){
                  layer.alert("不能为空",{icon:5});
                  return false;
              }

              var $editor = $(this).prev().clone();
              $editor.find(".mathquill-embedded-latex").each(function(){
                        var dataLatex = '<div class="mathquill-embedded-latex">'+$(this).attr('data-latex')+'</div>';
                        $(this).replaceWith(dataLatex);
              });
              var data = {
                  sender      : self.id,
                  senderName  : self.name,
                  senderImg   : self.img,
                  receiver    : $(this).parents(".interface").attr('data-id'),
                  content     : $editor.html()
              };
              $(this).prev().attr("data-math",false);
              self.sendOneMsg(data);
          });

          //群组聊天
          $("#thinkMsg").on("click",".group-interface .btn-send",function(e){
              //不能输入空
              if($(this).prev().html() == ""){
                  layer.alert("不能为空",{icon:5});
                  return false;
              }

              var $editor = $(this).prev().clone();
              $editor.find(".mathquill-embedded-latex").each(function(){
                  var dataLatex = '<div class="mathquill-embedded-latex">'+$(this).attr('data-latex')+'</div>';
                  $(this).replaceWith(dataLatex);
              });
              var data = {
                  sender      : self.id,
                  name        : self.name,
                  img         : self.img,
                  groupID     :$(this).parents(".interface").attr('data-groupID'),
                  receiver    : $(this).parents(".interface").attr('data-id'),
                  content     : $editor.html()
              };
              $(this).prev().attr("data-math",false);
              self.sendGroupMsg(data);
          });

          //加入讨论组的群
          $("#thinkMsg").on("dblclick","#zGroup .panel_group_item",function(e){

              //提示如果此用户加入了群或者创建群，则需要退出群，才能切换讨论组
              if($(".group-interface").length > 0){
                  if($(this).attr('data-id') == $(".group-interface").attr('data-id')){
                      $(".group-interface").fadeIn();
                  }else{
                      layer.msg('你已经有群，如果需要，请退出此群，加入其他群');
                  }
                  return false;
              }

              //判断群是否满员
              var classNum = +$(this).find(".class-num").text();
              var classMaxNum = +$(this).find(".class-max-num").text();
              if(classNum >= classMaxNum){
                  layer.msg('此群已达上线');
                  return false;
              }

              //发送消息给后台说我进入群组
              var enterClass = {
                  classID       : $(this).attr('data-id'),                                     //在什么教室ID
                  classdomianID : $(this).parents(".panel_team").attr('data-group'),           //在什么区域
                  pwd           : "",                                                          //密码
                  id            : self.id,                                                     //用户id
                  name          : self.name,                                                   //用户名字
                  img           : self.img                                                     //用户个人照片
             };
              if($(this).attr('data-pwd') == "false"){
                  self.enterClass(enterClass);
              }else if($(this).attr('data-pwd') == "true"){
                  var layerprompt  = layer.prompt({
                      title: '请输入密码',
                      formType: 1
                  },function(pass){
                      enterClass.pwd = pass;
                      self.enterClass(enterClass,layerprompt);
                  });
              }
          });

          //改变聊天框大小
          $("#thinkMsg").on("touchstart.drag.founder mousedown.drag.founder",".group-interface > .move-drag",function(e){
              var $document = $(document);
              var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
                  startPos = $(this).position(),
                  disX = ev.pageX - startPos.left,
                  $this = $(this);
                  that = $(this).parent();
              var mackModel  = $('<div style="width: 100%;height: 100%;z-index:99999;position:absolute;"></div>').appendTo($(this).parent());
              $document.on('touchmove.drag.founder mousemove.drag.founder', function(e) {
                  var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,
                      $that = that,
                      $parent = $that.offsetParent().is(':root')?$(window):$parent,
                      pPosoffset = $parent.offset(),
                      pPos = pPosoffset?pPosoffset:{left:0,top:0},
                      left = ev.pageX - disX - pPos.left,
                      interfaceWidth = $that.width() - left;
                  if(left < 200 || interfaceWidth < 200){
                      $(document).off('.drag.founder');
                      mackModel.remove();
                      return false;
                  }
                  $this.css('left',left);
                  $that.find(".interface-bodyer-one").css('width',left);

                  $that.find(".interface-bodyer").eq(1).css('width',interfaceWidth);
              });

              $document.on('touchend.drag.founder mouseup.drag.founder', function(e) {
                  var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
                  $(document).off('.drag.founder');
                  mackModel.remove();
              });


              e.preventDefault();
              e.stopPropagation();
          });

          //document事件移除事件
          $(document).on('click',function(){
              //隐藏QQ表情包
             self.hideQQFace();
              //隐藏数学公式
              self.hideMathFace();
          })
      },

      //展示单人聊天框
      showChatFace : function(id,$this){
          var self = this ;
          //获得聊天对象
          var $interface = $('.interface[data-id="'+id+'"]');

          //获得当前窗口距浏览器距离，并设置相应的高度
          var topH = $(window).height()-445+"px" ;

          if($interface.length  == 0){
              var userData = {
                  imgSrc : $this.find(".panel_image").attr('src'),
                  name   : $this.find('.panel_single-row').text(),
                  id     : id,
                  top    : topH,
                  left   : $(window).width() - 722+"px"
              };
              self.getOneInterface(userData);
          }
          //显示
          $('.interface[data-id="'+id+'"]').slideDown();

          //发送消息我已读
          if($this.find(".badge").text() != 0){
              var readly = {
                  sender    : id,
                  receiver  : self.id
              };
              self.readEnd(readly);
          }

          $this.find(".badge").hide().text(0);

          //改变层级
          $(".interface").css('z-index','998');
          $('.interface[data-id="'+id+'"]').css('z-index','999');
      },

      //socket.io 发送事件（与后台交互）

      //单对单聊天
      sendOneMsg : function(data){
          var self = this ;
          self.socket.emit('sendOneMsg',data,function(data){
              var chatWindow  = $('.one-interface[data-id="'+data.receiver+'"]');
              var value = {
                 who   :  "me",
                 content  :  data.content,
                 $receiver : chatWindow,
                 img   :  self.img
              };
              self.newMsgContent(value);
              chatWindow.find(".editor").html("");
          });
      },

      //发送群聊
      sendGroupMsg : function(data){
          var self = this ;
          self.socket.emit('sendGroupMsg',data,function(){
              var chatWindow  = $('.group-interface[data-id="'+data.receiver+'"]');
              chatWindow.find(".editor").html("");
          });
      },

      //加为好友
      addFriends : function(data){
          var self = this ;
          self.socket.emit('addFriends',data,function(msg){
              if(msg.code == 200){
                  $("#addFriendBox").attr("class","m-dialog noFriend");
                  var Info = $("#addFriendBox div.info");
                  Info.find("img").attr("src",msg.data[0].img);
                  Info.find(".j-nickname").text(msg.data[0].name);
                  Info.find(".j-username").text("账号："+data.addFriend);

                  //加为好友
                  $("#addFriendBox button.j-add").unbind().click(function(e){
                      self.socket.emit('saveFriends',data,function(){
                          console.log(1);
                          $("#addFriendBox").attr("class","m-dialog done");
                          $("#addFriendBox div.tip").text("添加好友成功！");

                          var friends = {
                              id   : data.addFriend,
                              name : msg.data[0].name,
                              img  : msg.data[0].img
                          };
                          //当没有这个用户,生成这个用户
                          var liFriend = self.appendFriendS([friends]);
                          $("#singleFriends").append(liFriend);
                          
                      })
                  });

              }else if(msg.code == 44){
                  $("#addFriendBox").attr("class","m-dialog done");
                  $("#addFriendBox div.tip").text(msg.msg);
              }
          });
      },

      //进入讨论组动画
      enterGroupAnimate : function($liGroup){
          if($liGroup.children(".panel_group").is(':hidden')){
              var $siblingsLi = $liGroup.siblings();
              if(msg.supportCss3("transform")) {
                  $liGroup.find(".panel_head > .iconfont").css('transform', 'rotate(90deg)');
                  $siblingsLi.find(".panel_head > .iconfont").css('transform', 'rotate(0deg)');
              }else{
                  $liGroup.find(".panel_head > .iconfont").replaceWith('<i class="icon iconfont">&#xe604;</i>');
                  $siblingsLi.find(".panel_head > .iconfont").replaceWith('<i class="icon iconfont">&#xe605;</i>');
              }
              $siblingsLi.find(".panel_group").slideUp();
              $liGroup.children(".panel_group").slideDown();
          }
      },

      //聊天框生成聊天内容(数学公式使用的是以iframe方式呈现)(备用)
      newMsgContent1 : function(data){
          var content = '<div style="visibility: hidden;position: absolute"  class="item item-'+data.who+'">'+
                        '<img class="img z-img" src="'+data.img+'" />'+
                        '<div class="msg msg-text">'+
                            '<div class="box"><div class="cnt"><div class="f-maxWid">'+this.latex_html(data.content)+'</div></div></div>'+
                        '</div>'+
                      '</div>';
          var $chatContent = data.$receiver.find(".chat-content");
          $chatContent.append(content);
          this.onloadIframe($chatContent.find(".item").last().find('iframe'),function($data){
              $data.parents(".item").css({visibility:'visible',position:'static'});
              data.$receiver.find(".chat-content").scrollTop("999999999");
          },function($data){
              $data.css({visibility:'visible',position:'static'});
              data.$receiver.find(".chat-content").scrollTop("999999999");
          });

      },
      //文本内容转化//latex转化成html(使用的是以iframe方式呈现)
      latex_html : function(text){
          var  latex_html  = $("<div></div>").append(text);
          latex_html.find(".mathquill-embedded-latex").each(function(index, element) {
              var lat = $(this).html();
              var diframe = '<iframe class="mathquill-disbedded-latex" src="../../static/msg/disformula.html" data-latex="'+lat+'" frameborder="0"></iframe>';
              $(this).replaceWith(diframe);
          });
          return latex_html.html();
      },


        // 聊天框生成聊天内容(数学公式使用的是以div方式呈现)(现目前用这种)
        newMsgContent : function(data){
            var content = '<div  class="item item-'+data.who+'">'+
                '<img class="img z-img" src="'+data.img+'" />'+
                '<div class="msg msg-text">'+
                '<div class="box"><div class="cnt"><div class="f-maxWid">'+data.content+'</div></div></div>'+
                '</div>'+
                '</div>';
            var $chatContent = data.$receiver.find(".chat-content");
            $chatContent.append(content);
            if(data.$receiver.is(":hidden")) {
                data.$receiver.css({display: 'block', visibility: 'hidden'});
                this.newMathWrite($chatContent);
                data.$receiver.css({display: 'none', visibility: 'visible'});
            }else{
                this.newMathWrite($chatContent);
            }
            data.$receiver.find(".chat-content").scrollTop("999999999");
        },
        newMathWrite : function($chatContent){
            $chatContent.find(".mathquill-embedded-latex").each(function (n, value) {
                var lat = $(this).html();
                $(this).html("");
                $(this).mathquill('editable').mathquill("write", lat);
                $(this).find("span.textarea").remove();
                $(this).off();
                $(this).attr("class", "mathquill-rendered-math");
            })
        },

     //判断iframe是否加载完成
     onloadIframe:function($iframe,callback,callback1) {
           var   $iframenumber = $iframe.length;
           var cout = 0;
           if($iframenumber == 0){
               callback1($iframe.end());
           }else {
               $iframe.each(function (n, data) {
                   var iframe = data;
                   if (iframe.attachEvent) {
                       iframe.attachEvent("onload", function () {
                           cout++;
                           if (cout == $iframenumber) {
                               callback($iframe);
                           }
                       });
                   } else {
                       iframe.onload = function () {
                           cout++;
                           if (cout == $iframenumber) {
                               callback($iframe);
                           }
                       };
                   }
               })
           }
      },

      //发送消息给后台表示我已经读了消息
      readEnd : function(data){
          var self = this ;
          self.socket.emit('readEnd',data);
      },

      //进入讨论组，发送消息给后台(并且返回相关的讨论组信息)
      enterGroup : function(data,callback){
          var self = this ;
          self.socket.emit('enterGroup',data,function(msgdata){
              callback(msgdata)
          });
      },

      //进入群组，发送消息给后台(并且返回相关的群组信息)
      enterClass : function(data,layerprompt){
          var self = this ;
          self.socket.emit('enterClass',data,function(msgdata){
             if(msgdata.code == 200){
                 if(layerprompt){
                     layer.close(layerprompt)
                 }
                 self.getGroupInterface(msgdata.data);
                 self.Acts  =  msgdata.svgAct;
             }else{
                 layer.alert(msgdata.msg);
             }

          });
      },

      //退出群
      exitGroup : function(data){
          var self = this ;
          self.socket.emit('exitGroup',data);
      },

      //socket end//
      //隐藏QQ表情包
      hideQQFace : function(){
          $(".qqFace").hide();
          $(".chat-tool-emoji").removeClass("active");
      },
      //隐藏数学符号包
      hideMathFace : function(){
          $(".edui-formula-wrapper").hide();
          $(".chat-tool-math").removeClass("active");
      },

      //数学符号
      mathTool : function(){

          var self = this ;

          //显示隐藏数学符号一些事件
          $("#thinkMsg").on('click',".chat-tool-math",function(e){
              var that = this;
              var ismath = $(this).parents(".chat-tool").next().attr('data-math');
              if(ismath != "true") {
                  self.restoreSelection();
              }
              $(this).next('.edui-formula-wrapper').slideToggle("fast",function(){
                  if($(this).is(':hidden')){
                      $(that).removeClass("active");
                  }else{
                      $(that).addClass("active").siblings(".qqFace").hide();
                      $(that).siblings(".chat-tool-emoji").removeClass("active");
                  }
              });
              e.stopPropagation();
              if(ismath != "true") {
                  $(this).parent().next(".editor").focus();
                  self.saveSelection();
              }
          });

          //数学符号阻止冒泡
          $("#thinkMsg").on('click',".edui-formula-wrapper",function(e){
              if($(this).parents(".chat-tool").next().attr('data-math') != "true"){
                  self.restoreSelection();
                  $(this).parent().next(".editor").focus();
              }
              return false;
          });

          //tab切换
          $("#thinkMsg").on('click',".edui-tab-item",function(e){
              $(this).addClass("edui-active").siblings().removeClass('edui-active');
              var index = $(this).index();
              $(this).parent().next().find('.edui-tab-pane').removeClass('edui-active').eq(index).addClass("edui-active");
          });

          //点击数学符号
          $("#thinkMsg").on('click',".edui-formula-latex-item",function(e){
              var ismath = $(this).parents(".chat-tool").next().attr('data-math');
              //判断是否是在同一个编辑器，如果不是这保存当前状态，把当前编辑器设置为焦点
              if(ismath != "true") {
                  self.isSameFace(this);
                  self.restoreSelection();
              }
              var dataLatex = $(this).attr("data-latex").replace("{/}", "\\");
              if(ismath == "true"){
                  self.iframeMath.get(0).contentWindow.formula.insertLatex(dataLatex);
              }else{
                  var zIframe = '<iframe class="mathquill-embedded-latex" src="../../static/msg/formula.html" data-latex="'+dataLatex+'" frameborder="0"></iframe>';
                  if ($.browser.msie){
                      document.execCommand("InsertImage",false,'testMath.jpg');
                      $('img[src="testMath.jpg"]').replaceWith(zIframe);
                  }else{
                      document.execCommand("insertHTML",false,zIframe);

                  }
                  self.saveSelection();
              }
              self.hideMathFace();

          });

      },

      //判断是否在同一个窗口
      isSameFace : function($this){
          var self = this ;
          var chatClass = $($this).parents(".interface").attr("class");
          try{
              if(self.selectedRange.commonAncestorContainer.offsetParent.className != chatClass){
                  $($this).parents(".chat-tool").next().focus();
                  self.saveSelection();
              }
          }catch (e){
              self.restoreSelection();
              $($this).parents(".chat-tool").next().focus();
              self.saveSelection();
          }
      },

      //显示隐藏qq表情包等一些事件
      qqface : function(){

          var self = this;

          $("#thinkMsg").on('click',".chat-tool-emoji",function(e){
              var that = this;
              self.restoreSelection();
              $(this).next('.qqFace').toggle(10,function(){
                  if($(this).is(':hidden')){
                      $(that).removeClass("active");
                  }else{
                      $(that).addClass("active").siblings(".edui-formula-wrapper").hide();
                      $(that).siblings(".chat-tool-math").removeClass("active");
                  }
              });
              e.stopPropagation();
              $(this).parent().next(".editor").focus();
              self.saveSelection();
          });

          //qq面板阻止冒泡
          $("#thinkMsg").on('click',".qqFace",function(e){
              $(this).parent().next().attr('data-math',false);
              self.restoreSelection();
              $(this).parent().next(".editor").focus();
              return false;
          });

          //插入表情
          $("#thinkMsg").on('click',".qqFace img",function(e){
              self.isSameFace(this);
              self.restoreSelection();
              var $thisHtml = $(this).attr("src");
              document.execCommand("InsertImage",false,$thisHtml);
              self.saveSelection();
              self.hideQQFace();
          });
      },

        //插入数据
        getCurrentRange : function () {
            var sel;
            if (window.getSelection) { //现代浏览器
                sel = window.getSelection();
            } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
                sel = document.selection.createRange();
            }
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        },

        //保存选中状态
        saveSelection : function () {
            this.selectedRange = this.getCurrentRange();
        },
        //禁止除数学公式的编辑
        enEditorMath : function($this){
           $this.parents(".editor").attr("data-math",true);
           this.iframeMath  = $this;
        },

        //还原选中状态
        restoreSelection : function () {
            var selection;
            if (window.getSelection) { //现代浏览器
                 selection = window.getSelection();
            } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
                 selection = document.selection.createRange();
            }
            if (this.selectedRange) {
                try {
                    selection.removeAllRanges();
                } catch (ex) {
                    var textRange = document.body.createTextRange();
                    textRange.select();
                    document.selection.empty();
                }
                selection.addRange(this.selectedRange);
            }
        },

      //动态设置比例
      activeRatioGroupFace : function(radio,width,$this){
          $this.css("visibility","visible");
          var zreoWidth = radio/(radio+1)*width;

          $this.eq(0).css("width",zreoWidth);
          $this.parent().children(".move-drag").css("left",zreoWidth);
          $this.eq(1).css("width",1/(radio+1)*width);
      },


      //放大缩小聊天框
      zoomInterface : function(){
          var self = this ;
          //放大
          $("#thinkMsg").on('click',".interface-max",function(e){

              var height   =  $(window).height();
              var contentHeight = height  - 185 ;
              if(contentHeight < 0){
                  return;
              }
              var interface = $(this).parents(".interface") ;

              //群聊天框设置比例
              var isGroupFace = interface.hasClass("group-interface");
              if(isGroupFace){
                  var bodyer = interface.find(".interface-bodyer");
                  bodyer.css("visibility","hidden");
                  var radio = bodyer.eq(0).width()/bodyer.eq(1).width();
              }

              interface.animate({'left':0,'top':0,'width':'100%','height':height},'500',function(){
                  if(isGroupFace) {
                      self.activeRatioGroupFace(radio,interface.width(),bodyer);
                  }
              });
              interface.find('.interface-content').css('height',contentHeight);
              $(this).attr('class','interface-ico interface-maxmin');
              e.stopPropagation();


          });
          //缩小
          $("#thinkMsg").on('click',".interface-maxmin",function(e){

              var interface = $(this).parents(".interface") ;

              //群聊天框设置比例
              var isGroupFace = interface.hasClass("group-interface");
              if(isGroupFace){
                  var bodyer = interface.find(".interface-bodyer");
                  bodyer.css("visibility","hidden");
                  var radio = bodyer.eq(0).width()/bodyer.eq(1).width();
              }

              interface.css({'width':'450px','height':'445'});
              var topH = $(window).height()/2- interface.height()/2 +"px" ;
              var left = $(window).width()/2 -  interface.width()/2 +"px";
              interface.animate({'left':left,'top':topH},'500',function(){
                  if(isGroupFace) {
                      self.activeRatioGroupFace(radio,interface.width(),bodyer);
                  }
              });
              interface.find('.interface-content').css('height','260px');
              $(this).attr('class','interface-ico interface-max');
              e.stopPropagation();


          });

          //浏览器窗口发生变化时候
          $(window).resize(function() {
              //放大过后的聊天框
              var height   =  $(window).height();
              var contentHeight = height  - 185 ;
              var interfaceMax = $(".interface-maxmin").parents(".interface");
              interfaceMax.css('height',height);
              interfaceMax.find('.interface-content').css('height',contentHeight);

              //正常大小的聊天框
              var interfaceMin = $(".interface-max").parents(".interface");
              // interfaceMin.animate({'left':left,'top':topH},'500');
              interfaceMin.css('z-index','998').each(function(idx,value){
                  var topH = $(window).height()/2 - $(this).height()/2 ;
                  var left = $(window).width()/2 - $(this).width()/2;
                  $(this).stop(true).animate({'left':left-idx*15,'top':topH-idx*20},'500');
              });

              if($(window).width()<400){
                  return false;
              }

              if(self.interfaceTimer){
                 window.clearTimeout(self.interfaceTimer)
              }
              self.interfaceTimer = setTimeout(function(){
                  //群聊天框设置比例
                  var interface = $(".group-interface") ;
                  if(interface.length > 0){
                      var bodyer = interface.find(".interface-bodyer");
                      bodyer.css("visibility","hidden");
                      var radio = bodyer.eq(0).width()/bodyer.eq(1).width();
                      self.activeRatioGroupFace(radio,interface.width(),bodyer);
                  }
              },1000);



          });
      },

      //改变层级
      changeZIndex : function(theClass){
          $("#thinkMsg").on('touchstart mousedown',theClass,function(e){
              $(theClass).css('z-index','998');
              $(this).css('z-index','999');
              e.stopPropagation();
          });
      },

      //缩小，关闭聊天框
      closeInterface : function(){

          var self = this ;

          $("#thinkMsg").on('click',".one-interface .interface-close1,.interface-min",function(e){
              $(this).parents(".interface").slideUp();
          });
          //群组关闭聊天框
          $("#thinkMsg").on('click',".group-interface .interface-close1",function(e){

              var msg,_that = this;

              var GroupInterface = $(this).parents(".group-interface");

              var createUserID = GroupInterface.attr("data-createuser");

              var classID = GroupInterface.attr("data-id");

              var groupID = GroupInterface.attr("data-groupid");

              if(createUserID == self.id){
                  msg = '是否解散该群？';

              }else{
                  msg = '是否退出该群？';
              }

              var layerconfirm = layer.confirm(msg, {
                                      btn: ['确定','不，点错了'] //按钮
                                  }, function(){
                                      self.exitGroup({id:self.id,classID:classID,createUser:createUserID,groupID:groupID});
                                      layer.close(layerconfirm);
                                  });


          })
      },

      //初始化界面.第一参数是朋友
      init_Interface : function (friends){
        var self = this ;
        var data = '<div id="thinkMsg">'+
                        '<div id="imFold" class="im_fold">'+
                            '<div class="fold_bg"></div>'+
                            '<p class="fold_cont"><em class="fold_font">LiveBooks</em></p>'+
                        '</div>'+
                        '<div class="im_chat_window" id="imChatWindow">'+
                            '<ul class="im_chat_head" id="imChatHead">'+
                                '<li class="active"><i id="friends" class="icon iconfont" title="好友">&#xe602;</i></li>'+
                                '<li><i id="groupFriends" class="icon iconfont"  title="群组">&#xe601;</i></li>'+
                                '<li><i id="setting" class="icon iconfont" title="设置">&#xe603;</i></li>'+
                                '<li><i id="closeImWindow" class="icon iconfont" title="关闭">&#xe600;</i></li>'+
                            '</ul>'+
                            '<div class="im_chat_body" id="imChatBody">'+
                                '<div class="friends">'+
                                    '<ul class="z-panel j-friend" id="singleFriends">'+self.appendFriendS(friends)+'</ul>'+
                                '</div>'+
                                '<div class="friends"><div id="createGroup" class="create-group">创建讨论群</div>'+self.appendGroup()+'</div>'+
                                '<div class="friends"><div id="addFriends" class="create-group">添加好友</div></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
          $("body").append(data);
          //生成添加好友界面
          self.newFriendBox();
          //添加事件
          this.addEvent();
      },
      //生成好友列表
      appendFriendS : function(friends){
       if(friends != null) {
           var data = "";
           $.each(friends, function (n, value) {
               data += '<li class="panel_item" data-id="'+value.id+'">' +
                   '<div class="panel_avatar"><img class="panel_image" src="' + value.img + '" /></div>' +
                   '<span class="badge">0</span>'+
                   '<div class="panel_text"><p class="panel_single-row">' + value.name + '</p></div>' +
                   '</li>';
           });
           return data;
       }else{
           return "";
       }
      },

      //添加好友生成html
      newFriendBox : function(){
          var sb="<div class=\"m-dialog\" id=\"addFriendBox\">";
          sb=sb+"		<div class=\"title box-sizing\">";
          sb=sb+"			添加好友";
          sb=sb+"			<i  class=\"icon iconfont icon-close\" title=\"关闭\">&#xe600;</i>";
          sb=sb+"		</div>";
          sb=sb+"		<div class=\"content tc\">";
          sb=sb+"			<input type=\"text\" class=\"ipt radius5px box-sizing j-account\" placeholder=\"请输入帐号\">";
          sb=sb+"			<div class=\"info f-cb\">";
          sb=sb+"				<img src=\"\">";
          sb=sb+"				<div class=\"desc\">";
          sb=sb+"					<p class=\"j-nickname\"></p>";
          sb=sb+"					<p><span class=\"j-username\"></span></p>";
          sb=sb+"				</div>";
          sb=sb+"			</div>";
          sb=sb+"			<div class=\"tip\">";
          sb=sb+"			</div>";
          sb=sb+"		</div>";
          sb=sb+"		<div class=\"btns tc\">";
          sb=sb+"			<button class=\"btn btn-cancel radius4px cancel j-close\">取消</button>";
          sb=sb+"			<button class=\"btn btn-ok radius4px search j-search\">确定</button>";
          sb=sb+"			<button class=\"btn btn-cancel radius4px back j-back\">继续搜索</button>";
          sb=sb+"			<button class=\"btn btn-ok radius4px add j-add\">加为好友</button>";
          sb=sb+"			<button class=\"btn btn-ok radius4px done j-close\">完成</button>";
          sb=sb+"			<button class=\"btn btn-ok radius4px chat j-chat\">聊天</button>";
          sb=sb+"		</div>		";
          sb=sb+"	</div>";
          sb=sb+"	<div id=\"j-mask\" class=\"mask\"></div>";
          $("#thinkMsg").append(sb);
      },

      //生成数学列表
      newMathFace : function(){
           var lang = {
             'lang_tab_common':'常用公式',
             'lang_tab_symbol':'符号',
             'lang_tab_letter':'字母'
           };
           var formula = {
              'common' : [
                  "{/}frac{ }{ }", "^{ }/_{ }", "x^{ }", "x_{ }", "x^{ }_{ }", "{/}bar{ }", "{/}sqrt{ }", "{/}nthroot{ }{ }",
                  "{/}sum^{ }_{n=}", "{/}sum", "{/}log_{ }", "{/}ln", "{/}int_{ }^{ }", "{/}oint_{ }^{ }"
              ],
              'symbol': [
                  "+", "-", "{/}pm", "{/}times", "{/}ast", "{/}div", "/", "{/}bigtriangleup",
                  "=", "{/}ne", "{/}approx", ">", "<", "{/}ge", "{/}le", "{/}infty",
                  "{/}cap", "{/}cup", "{/}because", "{/}therefore", "{/}subset", "{/}supset", "{/}subseteq", "{/}supseteq",
                  "{/}nsubseteq", "{/}nsupseteq", "{/}in", "{/}ni", "{/}notin", "{/}mapsto", "{/}leftarrow", "{/}rightarrow",
                  "{/}Leftarrow", "{/}Rightarrow", "{/}leftrightarrow", "{/}Leftrightarrow"
              ],
              'letter': [
                  "{/}alpha", "{/}beta", "{/}gamma", "{/}delta", "{/}varepsilon", "{/}varphi", "{/}lambda", "{/}mu",
                  "{/}rho", "{/}sigma", "{/}omega", "{/}Gamma", "{/}Delta", "{/}Theta", "{/}Lambda", "{/}Xi",
                  "{/}Pi", "{/}Sigma", "{/}Upsilon", "{/}Phi", "{/}Psi", "{/}Omega"
              ]
           };
           var headHtml = [], xMax = 0, yMax = 0,
           $tabContent = $("<div class=\"edui-tab-content clearfix\"></div>");
           //遍历
           $.each(formula, function (k, v) {
              var contentHtml = [];
              $.each(v, function (i, f) {
                  contentHtml.push('<li class="edui-formula-latex-item" data-latex="' + f + '" style="background-position:-' + (xMax * 30) + 'px -' + (yMax * 30) + 'px"></li>');
                  if (++xMax >=8) {
                      ++yMax; xMax = 0;
                  }
              });
              yMax++; xMax = 0;
              $tabContent.append('<div class="edui-tab-pane"><ul>' + contentHtml.join('') + '</ul>');
              headHtml.push('<li class="edui-tab-item"><a href="javascript:void(0);" class="edui-tab-text">' + lang['lang_tab_' + k] + '</a></li>');
           });

           var wapperContent = $("<div class=\"edui-formula-wrapper clearfix\"></div>");
           wapperContent.append($("<ul class=\"edui-tab-nav clearfix\"></ul>").append(headHtml)).append($tabContent);
           /* 选中第一个tab */
          wapperContent.find(".edui-tab-item").eq(0).addClass("edui-active");
          wapperContent.find(".edui-tab-pane").eq(0).addClass("edui-active");

           return $("<div></div>").append(wapperContent).html();
      },

      //生成表情面板
      newQQFace : function(){
          var path = "../../static/msg/image/arclist/";
          var strFace = '<div class="qqFace"><table border="0" cellspacing="0" cellpadding="0"><tr>';
          for(var i=1; i<=75; i++){
              strFace += '<td><img data-path="[em-'+i+']" src="'+path+i+'.gif" /></td>';
              if( i % 15 == 0 ) strFace += '</tr><tr>';
          }
          strFace += '</tr></table></div>';
          return strFace;
      },

      //生成one to one 聊天界面
      getOneInterface : function(userData){
        var self = this ;
        var data = '<div class="interface one-interface" data-id="'+userData.id+'" style="left:'+userData.left+';top:'+userData.top+'">'+
                        '<div class="interface-header">'+
                            '<img class="user-photo" src="'+userData.imgSrc+'" />'+
                            '<span class="user-name">'+userData.name+'</span>'+
                            '<span class="interface-setwin">'+
                                '<a class="interface-min" href="javascript:;"><cite></cite></a>'+
                                '<a class="interface-ico interface-max" href="javascript:;"></a>'+
                                '<a class="interface-ico interface-close interface-close1" href="javascript:;"></a>'+
                            '</span>'+
                        '</div>'+
                        '<div class="interface-bodyer">'+
                            '<div class="interface-content chat-content">'+
                                '<p class="u-msgTime">- - - - - '+msg._getTimeStamp()+' - - - - -</p>'+
                            '</div>'+
                            '<div class="chat-tool">'+
                                '<a class="chat-tool-ico chat-tool-emoji" href="javascript:;"></a>'+
                                self.newQQFace()+
                                '<a class="chat-tool-ico chat-tool-math" href="javascript:;"></a>'+
                                self.newMathFace()+
                            '</div>'+
                            '<div class="editor" contenteditable="true"></div>'+
                            '<button type="button" class="btn btn-send">发送</button>'+
                        '</div>'+
                    '</div>';
        $("#thinkMsg").append(data);
      },

      //生成群组聊天界面
      getGroupInterface : function(groupData){
        var left = $(window).width()/2 - 400 +'px';
        var top = $(window).height()/2 - 225 + 'px';
        var self = this ;
        var data = '<div class="interface group-interface" data-createUser="'+groupData.cleateUser+'" data-id="'+groupData.classID+'" data-groupID="'+groupData.classdomian+'" style="left:'+left+';top:'+top+'">'+
                        '<div class="interface-header">'+
                            '<img class="user-photo" src="../../static/image/group.jpg" />'+
                            '<span class="user-name">'+groupData.className+'</span>'+
                            '<span class="interface-setwin">'+
                                '<a class="interface-min" href="javascript:;"><cite></cite></a>'+
                                '<a class="interface-ico interface-max" href="javascript:;"></a>'+
                                '<a class="interface-ico interface-close interface-close1" href="javascript:;"></a>'+
                            '</span>'+
                        '</div>'+
                        '<div class="interface-bodyer interface-bodyer-one">'+
                           '<div class="interface-content whiteboard">' +
                              '<iframe  src="../../static/svgeditor/index.html" frameborder="0" width="100%" height="100%"></iframe>'+
                           '</div>'+
                           '<div class="group-members">'+
                             '<div class="header">群成员</div>'+
                             '<ul class="bodyer">'+self.newClassUser(groupData.user)+'</ul>'+
                           '</div>'+
                        '</div>'+
                        '<div class="interface-bodyer">'+
                            '<div class="interface-content chat-content">'+
                                '<p class="u-msgTime">- - - - - '+msg._getTimeStamp()+' - - - - -</p>'+
                            '</div>'+
                            '<div class="chat-tool">'+
                                '<a class="chat-tool-ico chat-tool-emoji" href="javascript:;"></a>'+
                                self.newQQFace()+
                                '<a class="chat-tool-ico chat-tool-math" href="javascript:;"></a>'+
                                self.newMathFace()+
                            '</div>'+
                            '<div class="editor" contenteditable="true"></div>'+
                            '<button type="button" class="btn btn-send">发送</button>'+
                        '</div>'+
                        '<div class="move-drag"></div>'+
                    '</div>';
        $("#thinkMsg").append(data);

        //改变群组聊天界面的人数
        $("#zGroup").find('[data-id="'+groupData.classID+'"] .class-num').text(groupData.classNum);

      },

      //生成教室里面的成员
      newClassUser : function(data){
          var self = this ;
          var content = "";
          $.each(data,function(n,value){
              content += '<li class="panel_item" data-id="'+n+'">' +
                        '<div class="panel_avatar"><img class="panel_image" src="' + value.img + '" /></div>' +
                        '<div class="panel_text"><p class="panel_single-row">' + value.name + '</p></div>' +
                      '</li>';
          });
          return content ;
      },

      //新增教室成员
      appendClassUser : function(value){

           var  content = '<li class="panel_item" data-id="'+value.id+'">' +
                  '<div class="panel_avatar"><img class="panel_image" src="' + value.img + '" /></div>' +
                  '<div class="panel_text"><p class="panel_single-row">' + value.name + '</p></div>' +
                  '</li>';

           var group = $('.group-interface[data-id="'+value.classID+'"]');
           group.find(".group-members > ul").append(content);
           //提示
           var tsxx = '<p class="u-msgTime">- - - 用户'+value.name+'加入群组 - - -</p>';
           group.find(".chat-content").append(tsxx);
      },

      //生成教室model
      addClassModal:function(){

        var listGroup = "";
        $.each(this.groupDiscussion,function(n,value){
            listGroup += '<option value="group_'+n+'">'+value+'</option>'
        });

        var data = '<div class="add-class-modal">'
                    +'<div class="form-group">'
                        +'<label for="classdomian">请选择你想进入的区域</label>'
                        +'<select class="form-control" id="classdomian">'
                            +listGroup
                        +'</select>'
                    +'</div>'
                    +'<div class="form-group">'
                        +'<label for="className">教室名称</label>'
                        +'<input type="text" class="form-control" id="className" placeholder="请输入教师名称" value="默认教室">'
                    +'</div>'
                    +'<div class="form-group">'
                        +'<label for="classMaxNum">最大人数</label>'
                        +'<input type="number" class="form-control" id="classMaxNum" placeholder="请输入需要进入你的群最大的人数" value="15"/>'
                    +'</div>'
                    +'<div class="form-group">'
                        +'<label for="classDesc">请对你创建的教室进行描述</label>'
                        +'<input type="text" class="form-control" id="classDesc" placeholder="教室描述" >'
                    +'</div>'
                    +'<div class="form-group">'
                        +'<label for="classPWD1">教室密码</label>'
                        +'<input type="password" class="form-control" id="classPWD1" placeholder="Password">'
                    +'</div>'
                    +'<div class="form-group">'
                        +'<label for="classPWD2">请再次输入教室密码</label>'
                        +'<input type="password" class="form-control" id="classPWD2" placeholder="Password">'
                    +'</div>'
                    +'<div class="modal-footer">'
                      +'<button type="button" class="btn btn-primary" id="CreateClass">创建教室</button>'
                    +'</div>'
                   +'</div>';
            return data;
      },

        //构建讨论组里面的群
        addClassLi : function(msgdata){
            var self = this;
            //清空数据
            $("#zGroup").children('li[data-group="'+msgdata.groupID+'"]').children(".panel_group").html("");
            //如果返回来数据不为空
            if(!$.isEmptyObject(msgdata.group)){
                $.each(msgdata.group,function(n,value){
                    self.newClass(value)
                });
            }
        },

        //生成群LI
        newClass : function(value){
              var data = '<li class="panel_group_item" data-id="'+value.classID+'" data-pwd="'+value.classPWD+'">'+
                            '<div class="panel_avatar"><img class="panel_image" src="../../static/image/group.jpg" /></div>'+
                            '<span class="badge"><span class="class-num">'+value.classNum+'</span>/<span class="class-max-num">'+value.classMaxNum+'</span></span>'+
                            '<div class="panel_text"><p class="panel_single-row">'+value.className+'</p></div>'+
                         '</li>';
              var $liGroup = $("#zGroup").children('li[data-group="'+value.classdomian+'"]');
              $liGroup.children(".panel_group").append(data);
        },

        //生成群组
      appendGroup : function(){
          var groupData = '<ul class="z-team" id="zGroup">';
          for(var i = 0;i<this.groupDiscussion.length;i++){
              groupData+='<li class="panel_team" data-group=group_'+i+'>'+
                            '<div class="panel_head">'+
                                '<i class="icon iconfont">&#xe605;</i>'+
                                '<span>'+this.groupDiscussion[i]+'</span>'+
                            '</div>'+
                            '<ul class="panel_group">'+
                            '</ul>'+
                         '</li>';
          }
          groupData += "</ul>";
          return groupData;
      }
    };
    /**
     * 获取当前时间戳 YYYYMMddHHmm
     *
     * @returns {*}
     */
    msg._getTimeStamp = function() {
        var now = new Date();
        var timestamp = now.getFullYear() + '年'
            + ((now.getMonth() + 1) >= 10 ?""+ (now.getMonth() + 1) : "0"
            + (now.getMonth() + 1))+'月'
            + (now.getDate() >= 10 ? now.getDate() : "0"
            + now.getDate())+'日'
            + (now.getHours() >= 10 ? now.getHours() : "0"
            + now.getHours())+':'
            + (now.getMinutes() >= 10 ? now.getMinutes() : "0"
            + now.getMinutes());
        return timestamp;
    };
    //判断是否支持CSS3方法
    msg.supportCss3 = function(style){
            var prefix = ['webkit', 'Moz', 'ms', 'o'],
                i,
                humpString = [],
                htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };

            for (i in prefix)
                humpString.push(_toHumb(prefix[i] + '-' + style));

            humpString.push(_toHumb(style));

            for (i in humpString)
                if (humpString[i] in htmlStyle) return true;

            return false;
    };

    //拖拽
    msg.dragMove = function($draggable) {
        var $document = $(document);
        $("#thinkMsg").on('touchstart.drag.founder mousedown.drag.founder',$draggable,function(e) {
            var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
                startPos = $(this).parent().position(),
                disX = ev.pageX - startPos.left,
                disY = ev.pageY - startPos.top,
                that = $(this).parent();
            $document.on('touchmove.drag.founder mousemove.drag.founder', function(e) {
                var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,
                    $this = that,
                    $parent = $this.offsetParent().is(':root')?$(window):$parent,
                    pPosoffset = $parent.offset(),
                    pPos = pPosoffset?pPosoffset:{left:0,top:0},
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
            });

            $document.on('touchend.drag.founder mouseup.drag.founder', function(e) {
                var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
                $(document).off('.drag.founder');
            });
            e.preventDefault();
        });
    };

    //init
    msg.init = function(options){
       window.firstMsg = new this(options);
    };


    //暴露接口
    window.msg = msg ;
})(jQuery);

//判断浏览器类型
(function ($) {
    var BOM = self;

    var UA = BOM.navigator.userAgent;

    var is_Trident = UA.match(/MSIE (\d+)|Trident[^\)]+rv:(\d+)/i),
        is_Gecko = UA.match(/; rv:(\d+)[^\/]+Gecko\/\d+/),
        is_Webkit = UA.match(/AppleWebkit\/(\d+\.\d+)/i);
    var IE_Ver = is_Trident ? Number(is_Trident[1] || is_Trident[2]) : NaN,
        FF_Ver = is_Gecko ? Number(is_Gecko[1]) : NaN,
        WK_Ver = is_Webkit ? parseFloat(is_Webkit[1]) : NaN;

    var is_Pad = UA.match(/Tablet|Pad|Book|Android 3/i),
        is_Phone = UA.match(/Phone|Touch|Android 2|Symbian/i);
    var is_Mobile = (
            is_Pad || is_Phone || UA.match(/Mobile/i)
        ) && (! UA.match(/ PC /));

    var is_iOS = UA.match(/(iTouch|iPhone|iPad|iWatch);[^\)]+CPU[^\)]+OS (\d+_\d+)/i),
        is_Android = UA.match(/(Android |Silk\/)(\d+\.\d+)/i);

    $.browser = {
        msie:             IE_Ver,
        mozilla:          FF_Ver,
        webkit:           WK_Ver,
        modern:           !  (IE_Ver < 9),
        mobile:           !! is_Mobile,
        pad:              !! is_Pad,
        phone:            !! is_Phone,
        ios:              is_iOS  ?  parseFloat( is_iOS[2].replace('_', '.') )  :  NaN,
        android:          is_Android ? parseFloat(is_Android[2]) : NaN,
        versionNumber:    IE_Ver || FF_Ver || WK_Ver
    };

})(jQuery);

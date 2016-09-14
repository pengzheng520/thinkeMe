
//var io = require('socket.io').listen(9999);

var work = require('./routes/connect-mysql.js');

var mime = require('mime');

var zRedis = require('./routes/redis.js');

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
function handler (req, res) {
    var path = req.url;
    if(path == "/"){
       path = "/views/pc/index.html"
    }
    var filepath = __dirname + path;
    fs.readFile(filepath,
        function (err, data) {
            if (err) {
                res.writeHead(500,{
                    'Content-Type' : 'text/plain;charset=utf-8'  // 添加charset=utf-8
                });
                return res.end('请不要乱输');
            }
            res.writeHeader(200,{
                'Content-Type' : mime.lookup(filepath)+';charset=utf-8'  // 添加charset=utf-8
            }) ;
            res.end(data);
        });
}

var gadget = require( './routes/log4js.js' );

//格式{
//     userid : socket，
//     userid : socket，
//     userid : socket
//   }
//在线用户
var onlineUsers = {};


//格式{
//     userid : {
//                   groupID : {xxxxxxxxxxxx},
//                   classID : {xxxxxxxxxxxx},
//               }
//     userid : {
//                   groupID : {xxxxxxxxxxxx},
//                   classID : {xxxxxxxxxxxx},
//               }
//    }
//保存用户所在的群组
var userGroup = {};

//格式{
//     group_1 : {
//                   groupID : {xxxxxxxxxxxx},
//                   groupID : {xxxxxxxxxxxx},
//                   ...
//               }
//     group_2 : {
//                   groupID : {xxxxxxxxxxxx},
//                   groupID : {xxxxxxxxxxxx},
//                   ...
//               }
//    }
//保存讨论组有哪些群
var  groupInformation = {};

//获取原来的状态
getRedis('userGroup',function(data){
    if(data == null){
        return false;
    }
    userGroup = data;
});
getRedis('groupInformation',function(data){
    if(data == null){
        return false;
    }
    groupInformation = data;
});


io.on('connection', function(socket){

    //判断有用户名没有，如果没有则取消连接，以后可以自己写加密算法，用token的形式
    if(socket.handshake.query.userName == ""){
        socket.disconnect();
        return false;
    }

    //保存用户id到socket
    socket.userId  = socket.handshake.query.userName ;

    //判断是否是再次登陆
    if(typeof onlineUsers[socket.userId] == "object"){
        //输出日志
        gadget.logInfo.info('用户'+socket.userId+'被提下线');
        //发送给最早的登陆提示自己被踢下线
        onlineUsers[socket.userId].emit('relogin',{msg:"你的账号在别的浏览器登陆"});
        onlineUsers[socket.userId].disconnect();
    }

    //保存用户进数组
    onlineUsers[socket.userId] = socket;

    //输出日志
    gadget.logInfo.info('用户'+socket.userId+'连接进聊天程序');



    //当连接断开的时候
    socket.on('disconnect',function(){
        //输出日志
        gadget.logInfo.info('用户'+socket.userId+'离开聊天室');
        /*if(userGroup[socket.userId]){
            //如果用户加入讨论组或者加入群组
            console.log(userGroup)
        }
         */
        //删除账号信息
        delete (onlineUsers[socket.userId]);
        //判断退出的用户有木有加入群组，如果加入了，则提醒这个群的人，此人已经下线
        try {
            if (userGroup[socket.userId] && userGroup[socket.userId].classID) {
                var groupID = userGroup[socket.userId].groupID;
                var classID = userGroup[socket.userId].classID;

                //删除群成员信息
                var num = --groupInformation[groupID][classID].classNum;
                delete (groupInformation[groupID][classID].user[socket.userId]);

                //群成员离开
                for (var j in userGroup) {
                    if (j != socket.userId) {
                        //用户离开群,分发给讨论组此群人数减少
                        if (onlineUsers[j] && userGroup[j].groupID == groupID) {
                            onlineUsers[j].emit('upClassNum', {classID: classID, num: num})
                        }

                        //分发给群成员，某某某离开群组
                        if (onlineUsers[j] && userGroup[j].classID == classID) {
                            onlineUsers[j].emit('leaveClass', {id: socket.userId, classID: classID})
                        }
                    }
                }

                //保存状态信息
                saveRedis('userGroup',userGroup);
                saveRedis('groupInformation',groupInformation);
            }
        }catch (e){
            console.log(e)
        }

    });

    //退出群或者群组解散群
    socket.on('exitGroup', function(obj){

        //清除用户加入的群组
        if(obj.id == obj.createUser){

            //输出日志
            gadget.logInfo.info('用户'+socket.userId+'解散教室');

            for( var i in userGroup){

                //群主离开,分发给讨论组此群已经解散
                if(userGroup[i].groupID == obj.groupID){
                    if(onlineUsers[i]) {
                        onlineUsers[i].emit('DismissClass', {classID: obj.classID})
                    }
                }

                //删除在这个群组的成员在这个群组的信息
                if(userGroup[i].classID == obj.classID){
                    delete (userGroup[i].classID);
                }
            }

            //删除群组信息
            delete (groupInformation[obj.groupID][obj.classID]);
            //删除数据
            delete(global[obj.classID])
        }else{

            //输出日志
            gadget.logInfo.info('用户'+socket.userId+'离开教室');

            //删除群成员信息
            var num =  --groupInformation[obj.groupID][obj.classID].classNum;
            delete (groupInformation[obj.groupID][obj.classID].user[obj.id]);

            //群成员离开
            for( var j in userGroup) {

                //用户离开群,分发给讨论组此群人数减少
                if(onlineUsers[j] && userGroup[j].groupID == obj.groupID){
                    onlineUsers[j].emit('upClassNum',{classID:obj.classID,num:num})
                }

                //分发给群成员，某某某离开群组
                if (onlineUsers[j] && userGroup[j].classID == obj.classID) {
                    onlineUsers[j].emit('leaveClass', {id: obj.id,classID:obj.classID})
                }
            }
            //删除群成员信息
            delete (userGroup[obj.id].classID);

        }

    });

    //加好友
    socket.on('addFriends',function(obj,callback){
        //保存消息，先统一作未读处理
        //获得好友列表（包括自己的信息）
        work.addFriends(obj,function(data){
            if(data.length == 0){
                callback({code:44,msg:"该帐号不存在，请检查你输入的帐号是否正确"})
            }else{
                    callback({code:200,data:data});
            }
        })
    });

    //删除好友
    socket.on('delFriends',function(obj,callback){
        work.delFriends(obj,function(data){
            if(data.code == 200){
                callback({code:200,msg:"删除成功"});
            }else{
                callback({code:44,msg:"删除失败"})
            }
        })
    });

    //存储好友
    socket.on('saveFriends',function(obj,callback){
        work.undtReletionship(obj,function(data){
            callback(data);
        });
    });

    //用户登陆的时候,触发事件
    socket.on('login', function(obj){

        //输出日志
        gadget.logInfo.info('用户'+socket.userId+'登陆，获取好友');

        //获得好友列表（包括自己的信息）
        work.getUser(obj,function(data){
            socket.emit('getUser',data);
        })
    });

    //获得未读消息触发事件
    socket.on('noRead',function(data,callback){
        //保存消息，先统一作未读处理
        work.noRead(data,function(msg,userInformation){
            //回调
            callback(msg,userInformation)
        });

        //输出日志
        gadget.logInfo.info('用户'+socket.userId+'登陆，获取自己的原来状态');

        //查看用户有哪些保留信息，复原原来的状态
        isoldInformation(socket);
    });

    //当用户发送单个消息的时候
    socket.on('sendOneMsg',function(data,callback){
        //保存消息，先统一作未读处理
        work.saveChatHistory(data,function(){
            //如果当前用户在线
            if(onlineUsers[data.receiver]){
                onlineUsers[data.receiver].emit('sendOneMsg',data,function(msg){
                    //未读消息变为已读消息
                    work.readEnd(data);
                });
            }
        });
        //回调
        callback(data)
    });

    //当用户发送群消息的时候
    socket.on('sendGroupMsg',function(data,callback){
        //分发消息
        var user = groupInformation[data.groupID][data.receiver].user;
        for(var key in user){
            if(onlineUsers[key]) {
                onlineUsers[key].emit('getGroupMsg', data);
            }
        }

        //回调
        callback();
    });

    //当用户发送控制消息的时候
    socket.on('svgDirective',function(data,callback){
        console.log(data)
        if(!global[data.receiver]){
            global[data.receiver] = [];
        }
        global[data.receiver].push(data.content);
        //分发消息
        var user = groupInformation[data.groupID][data.receiver].user;
        for(var key in user){
            if(onlineUsers[key] && onlineUsers[key] != socket) {
                console.log(key)
                onlineUsers[key].emit('svgDirective',data.content);
            }
        }
    });

    //改变消息状态
    socket.on('readEnd',function(data){
        //未读消息变为已读消息
        work.readEnd(data);
    });

    //创建群
    socket.on('createClass',function(data,callback){

        //判断创建群人员是否已经在群，如果已经在群，则需要提示用户先退出群，才能创建自己的群
        userHaveClass(data.cleateUser,function(msgdata){
            if(msgdata.code == 44){
                callback(msgdata);
                return false;
            }

            //输出日志
            gadget.logInfo.info('用户'+socket.userId+'创建教室');

            //判断有木有这个讨论组，如果没有的话 则添加
            if(!groupInformation[data.classdomian]){
                //生成这个讨论组
                groupInformation[data.classdomian] ={};
            }
            groupInformation[data.classdomian][data.classID] = data;

            var newInformation ={};
            //新建数据，不返回密码
            Object.extend(newInformation,data);
            //返回是否有密码
            if(newInformation.classPWD == ""){
                newInformation.classPWD = false;
            }else{
                newInformation.classPWD = true;
            }

            //分发消息给在这个讨论组里面的人员，某某某建立了群
            for(var i in  userGroup){
                if(userGroup[i].groupID == data.classdomian){
                    if(onlineUsers[i]) {
                        onlineUsers[i].emit('NewClass', newInformation);
                    }
                }
            }

            callback({code:200});
        });
    });

    //进入讨论组，发送消息给后台(并且返回相关的讨论组信息)
    socket.on('enterGroup',function(data,callback){

        //判断创建群人员是否已经在群，如果已经在群，则需要提示用户先退出群，才能创建自己的群
        userHaveClass(data.id,function(msgdata){
            if(msgdata.code == 44){
                callback(msgdata);
                return false;
            }

            //输出日志
            gadget.logInfo.info('用户'+socket.userId+'进入'+data.group);

            //保存用户进入了哪个讨论组
            userGroup[data.id].groupID = data.group ;


            //新建数据，不返回密码
            var  newInformation = {};
            newInformation.group = {};
            newInformation.groupID = data.group;

            //判断有木有这个讨论组，如果没有的话 则添加
            if(!groupInformation[data.group]){
                //生成这个讨论组
                groupInformation[data.group] ={};
            }else{
                //新建数据，不返回密码
                Object.extend(newInformation.group,groupInformation[data.group]);
                //返回是否有密码
                for(var i in newInformation.group){
                    if(newInformation.group[i].classPWD == ""){
                        newInformation.group[i].classPWD = false;
                    }else{
                        newInformation.group[i].classPWD = true;
                    }
                }
            }

            //返回这个讨论组有多少群
            callback({code:200,data:newInformation,msg:'成功'});
        },data.classID);

    });

    //进入群组，发送消息给后台（并且返回相关的群组信息）
    socket.on('enterClass',function(data,callback){

        //判断创建群人员是否已经在群，如果已经在群，则需要提示用户先退出群，才能创建自己的群
        userHaveClass(data.id,function(msgdata){
            if(msgdata.code == 44){
                callback(msgdata);
                return false;
            }
            //判断此群是否已经达上线，如果上线则返回
            if((+groupInformation[data.classdomianID][data.classID].classNum) >= (+groupInformation[data.classdomianID][data.classID].classMaxNum)){
                if(userGroup[data.id].classID){
                    delete (userGroup[data.id].classID)
                }
                callback({code:45,msg:'此群已达上线'});
                return false;
            }
            //输出日志
            gadget.logInfo.info('用户'+socket.userId+'进入'+data.classID);

            //保存用户进入教室信息
            userGroup[data.id].classID = data.classID ;
            userGroup[data.id].name = data.name ;
            userGroup[data.id].img = data.img ;

            //获得群组信息
            var theGroup = groupInformation[data.classdomianID][data.classID];


            if(theGroup.classPWD == data.pwd){

                //判断群里面有用户对象没有
                if(!theGroup.user){
                    theGroup.user = {};
                }else{
                    //判断群组有木有这个人，如果有就返回不执行下面的动作
                    for(var j in theGroup.user){
                        if(j == data.id){
                            return false;
                        }
                    }

                    //分发消息,说哪个用户加入此群
                    for(var i in theGroup.user){
                        if(onlineUsers[i]) {
                            onlineUsers[i].emit('LeftClass', data);
                        }
                    }
                }

                theGroup.classNum++;

                //分发消息给在这个讨论组里面的人员，某某某群的人数
                for(var i in  userGroup){
                    if(userGroup[i].groupID == data.classdomianID){
                        if(onlineUsers[i]) {
                            onlineUsers[i].emit('groupClassNum', {classID: data.classID, num: theGroup.classNum});
                        }
                    }
                }

                theGroup.user[data.id] = data ;

                //保存状态信息
                saveRedis('userGroup',userGroup);
                saveRedis('groupInformation',groupInformation);
                callback({code:200,data:theGroup,svgAct:global[data.classID],msg:'成功'});

            }else{
                //返回这个群组有信息
                callback({code:45,msg:'密码错误'});
            }
        },data.classID);

    });

});

//对象深拷贝
Object.extend = function(tObj,sObj){
    for(var i in sObj){
        if(typeof sObj[i] !== "object"){
            tObj[i] = sObj[i];
        }else if (sObj[i].constructor == Array){
            tObj[i] = Object.clone(sObj[i]);
        }else{
            tObj[i] = tObj[i] || {};
            Object.extend(tObj[i],sObj[i]);
        }
    }
};

function userHaveClass(id,callback,classId){
    //判断有木有这个讨论组，如果没有的话 则添加
    if(!userGroup[id]){
        //生成这个讨论组
        userGroup[id] ={};
    }

    if(userGroup[id].classID && userGroup[id].classID !=classId){
        //判断这个用户加入群没有，如果加入了。就返回此用户已经加入了群组
        callback({code:44,msg:'亲，你已经加入群，一次只能加入一个群，请先退出'});
    }else{
        callback({code:200});
    }
}

//查看用户有哪些保留信息，复原原来的状态
function isoldInformation(socket){
    if(userGroup[socket.userId]){
        var groupID = userGroup[socket.userId].groupID;

        //新建数据，不返回密码
        var  newInformation = {};
        newInformation.group = {};
        newInformation.groupID = groupID;


        //新建数据，不返回密码
        Object.extend(newInformation.group,groupInformation[groupID]);
        //返回是否有密码
        for(var i in newInformation.group){
            if(newInformation.group[i].classPWD == ""){
                newInformation.group[i].classPWD = false;
            }else{
                newInformation.group[i].classPWD = true;
            }
        }

        var pwd = "";
        if(userGroup[socket.userId].classID){
            pwd = groupInformation[groupID][userGroup[socket.userId].classID].classPWD
        }

        socket.emit('oldInformation',{userGroup:userGroup[socket.userId],groupInformation:newInformation,pwd:pwd});
    }
}

//保存缓存数据
function saveRedis(key,value){
    zRedis.set(key,value);
}
//取得缓存数据
function getRedis(key,callback){
    zRedis.get(key,callback);
}
app.listen(9999);
console.log('Server listening at port %d', 9999);
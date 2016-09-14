/**
 * Created by pengpeng on 2016/3/4.
 */
//引入mysql api
var mysql = require('mysql');

//新版
var db_config = {
    host:    '123.57.149.123',
    user:    'root',
    password:'thinkme',
    database:'thinkme'
};

//连接方式
var db;

function handleDisconnect() {
    db = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    db.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    db.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

//keep-alive
setInterval(function () {
    db.query('SELECT 1');
}, 5000);

//解析http post数据
exports.parseReceivedData = function(req,cb){
    var body = '';
    req.setEncoding('utf8');
    req.on('data',function(chunk){body += chunk});
    req.on('end',function(){
        var data = JSON.parse(body);
        cb(data);
    })
};

//获取好友列表
exports.getUser = function(work,cb){
    //开启事物
    db.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        db.query('select reletionship from friends where id = ?', [work.id], function (err, result) {
            if (err) {
                return db.rollback(function () {
                    throw err;
                });
            }
            try {
                var friends = result[0].reletionship.split("-");
            }catch (e){
                var friends = [];
            }

            //加入自己的id
            friends.push(work.id);

            var $sql = 'select userID,userName,userNickname,userSign,img from t_user where userID in (' ;
            var arrayData = [];
            for(var i = 0;i<friends.length;i++){
                $sql += "?,";
                arrayData.push(friends[i]);
            }
            $sql = $sql.substr(0,$sql.length-1)+")";
            db.query($sql,arrayData,function(err,result){
                if (err) {
                    return db.rollback(function() {
                        throw err;
                    });
                }

                db.commit(function(err) {
                    if (err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                    cb(result);
                });
            })
        })
    })

};

//先做统一处理 当作未读消息处理
exports.saveChatHistory = function(work,cb){
    var time = _getTimeStamp();
    //保存未读消息
    db.query(
        "INSERT INTO msgHistory (sender,receiver,content,date) " +
        " VALUES (?,?,?,?) ",
        [work.sender,work.receiver,work.content,time],
        function(err,rows){
            if(err) throw err;
            cb(rows);
        }
    )
};

//未读消息变为已读消息
exports.readEnd = function(work){
    db.query(
        "UPDATE msgHistory SET isread = ? " +
        " where sender = ? AND receiver = ?",
        [1,work.sender,work.receiver],
        function(err,rows){
            if(err) throw err;
        }
    )
};

//加好友
exports.addFriends = function(work,cb){
    db.query('select userID,userNickname,img from t_user where userName = ?', [work.addFriend], function (err, rows) {
        if(err) throw err;
        cb(rows);
    })
};

//删除好友
exports.delFriends = function(work,cb){
    //开启事物
    db.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        db.query('select reletionship from friends where id = ?', [work.sender], function (err, result) {
            if (err) {
                return db.rollback(function () {
                    throw err;
                });
            }
            var userReletionship = "";

            try {
                var index = result[0].reletionship.split('-');
                for(var i in index){
                    if(index[i] != work.friends){
                        userReletionship += index[i]+"-"
                    }
                }
                userReletionship = userReletionship.slice(0,userReletionship.length-1)
            } catch (e) {
                userReletionship = result;
            }

            db.query("UPDATE friends SET reletionship = ? " + " where id = ?",
                [userReletionship,work.sender],
                function(err,rows){
                    if (err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                    db.commit(function(err) {
                        if (err) {
                            return db.rollback(function() {
                                throw err;
                            });
                        }
                        cb({code:200});
                    });

                }
            )

        })
    })
};

//更新数据
exports.undtReletionship = function(work,cb){
    //开启事物
    db.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        db.query('select reletionship from friends where id = ?', [work.sender], function (err, result) {
            if (err) {
                return db.rollback(function () {
                    throw err;
                });
            }

            try {
                var index = result[0].reletionship.indexOf(work.addFriend);
                var userReletionship = result[0].reletionship + "-" + work.addFriend;
            } catch (e) {
                var index = -1;
                var userReletionship = work.addFriend;

            }


            if(index == -1){
                db.query("UPDATE friends SET reletionship = ? " + " where id = ?",
                    [userReletionship,work.sender],
                    function(err,rows){
                        if (err) {
                            return db.rollback(function() {
                                throw err;
                            });
                        }
                        db.commit(function(err) {
                            if (err) {
                                return db.rollback(function() {
                                    throw err;
                                });
                            }
                            cb({code:200});
                        });

                    }
                )
            }else{
                db.commit(function(err) {
                    if (err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                    cb({code:200});
                });

            }
        })
    })
}


//获得未读消息
exports.noRead = function(id,cb){
    //开启事物
    db.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        db.query('select content,date,sender from msgHistory where receiver = ? AND isread = ?', [id,0], function (err, result) {
            if (err) {
                return db.rollback(function () {
                    throw err;
                });
            }

            //判断有木有未读消息
            if(result.length == 0){
                db.commit(function(err) {
                    if (err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                    cb();
                });
                return false;
            }

            try {
                var arruser = [];
                for(var p in result){
                    arruser.push(result[p].sender)
                }
                var friends = unique(arruser);
            }catch (e){
                db.commit(function(err) {
                    if (err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                    cb();
                });
                return false;
            }
            var $sql = 'select userName,userNickname,img,userID from t_user where userID in (' ;
            var arrayData = [];
            for(var i = 0;i<friends.length;i++){
                $sql += "?,";
                arrayData.push(friends[i]);
            }
            $sql = $sql.substr(0,$sql.length-1)+")";
            db.query($sql,arrayData,function(err,result1){
                if (err) {
                    return db.rollback(function() {
                        throw err;
                    });
                }
                db.commit(function(err) {
                    if (err) {
                        return db.rollback(function() {
                            throw err;
                        });
                    }
                    cb(result,result1);
                });
            })
        })
    })
};


//数组去重
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
/**
 * 获取当前时间戳 YYYYMMddHHmmss
 *
 * @returns {*}
 */
function _getTimeStamp() {
    var now = new Date();
    var timestamp = now.getFullYear() + ''
        + ((now.getMonth() + 1) >= 10 ?""+ (now.getMonth() + 1) : "0"
        + (now.getMonth() + 1))
        + (now.getDate() >= 10 ? now.getDate() : "0"
        + now.getDate())
        + (now.getHours() >= 10 ? now.getHours() : "0"
        + now.getHours())
        + (now.getMinutes() >= 10 ? now.getMinutes() : "0"
        + now.getMinutes())
        + (now.getSeconds() >= 10 ? now.getSeconds() : "0"
        + now.getSeconds());
    return timestamp;
}
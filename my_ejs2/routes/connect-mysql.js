/**
 * Created by pengpeng on 2016/3/4.
 */
//引入mysql api
var mysql = require('mysql');

var qs = require('querystring');

//连接mysql
/*var db = mysql.createConnection({
    host:    '123.57.149.123',
    user:    'root',
    password:'thinkme',
    database:'thinkme'
});*/



//新版
var db_config = {
    host:    '123.57.149.123',
    user:    'root',
    password:'thinkme',
    database:'thinkme'
};

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

//保存线
exports.add = function(req,res){
    exports.parseReceivedData(req,function(work){
        if(Object.getOwnPropertyNames(work).length  == 7){
            //线
            db.query(
                "INSERT INTO userDrawImg (d,stroke,box,type,userName,theID,bookname) "+
                " VALUES (?,?,?,?,?,?,?)",
                [work.d,work.stroke,work.box,work.type,work.userName,work.id,work.arg],
                function(err){
                    if(err) throw err;
                    res.send("success");
                }
            )
        }else if(Object.getOwnPropertyNames(work).length  == 10){
            //方块
            db.query(
                "INSERT INTO userRectImg (x,y,width,height,fill,box,type,userName,theID,bookname) "+
                " VALUES (?,?,?,?,?,?,?,?,?,?)",
                [work.x,work.y,work.width,work.height,work.fill,work.box,work.type,work.userName,work.id,work.arg],
                function(err){
                    if(err) throw err;
                    res.send("success");
                }
            )
        }
    })
};

//保存笔记
exports.addNotes = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "INSERT INTO notes (noteID,noteX,noteY,mockTxtTitle,mockTxtContent,box,userName,bookname) "+
            " VALUES (?,?,?,?,?,?,?,?)",
            [work.id,work.x,work.y,work.mockTxtTitle,work.mockTxtContent,work.box,work.userName,work.arg],
            function(err){
                if(err) throw err;
                res.send("success");
            }
        )
    })
};

//保存PC端的笔记 现目前无用
exports.savePcNotes = function(req,res){
    exports.parseReceivedData(req,function(work){
       // 添加工作记录的sql
        db.beginTransaction(function(err) {
            if (err) { throw err; }
            db.query(
                "INSERT INTO pcnotes (noteID,mockTxtTitle,mockTxtContent,box,fill) "+
                " VALUES (?,?,?,?,?)",
                [work[2].noteID,work[0],work[1],work[2].box,work[2].fill],
                function(err){
                    if (err) {
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    var datah = "";
                    var datab = [];
                    for(var i = 0;i < work.length-2;i++){
                        datah += "(?,?,?,?,?), ";
                        var index = i+2 ;
                        datab.push(work[index].noteID);
                        datab.push(work[index].x);
                        datab.push(work[index].y);
                        datab.push(work[index].width);
                        datab.push(work[index].height);
                    }
                    var query = "INSERT INTO pcnotesattr (noteID,noteX,noteY,notew,noteh) VALUES " + datah;
                    query = query.substring(0,query.length -2);
                    db.query(
                        query,
                        datab,
                        function(err){
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            db.commit(function(err) {
                                if (err) {
                                    return db.rollback(function() {
                                        throw err;
                                    });
                                }
                                res.send('success');
                            });
                        }
                    );
                }
            );
        });
    })
};

//读取PC端的内容 现目前无用
exports.getPcNotes = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT * from pcnotes as u LEFT JOIN pcnotesattr as ui on u.noteID = ui.noteID",
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};

//mysql 读取画线的条数
exports.showLine = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT * from userDrawImg "+
            " where bookname=? and userName=? and box > ? and box <= ?  ",
            [work.arg,work.userName,work.begin,work.end],
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};

//读取荧光笔
exports.showPen = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT * from userRectImg "+
            " where bookname=? and  userName=? and box > ? and box <= ?  ",
            [work.arg,work.userName,work.begin,work.end],
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};

//读取笔记坐标
exports.showNotes = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT box,noteID,noteX,noteY,mockTxtTitle,mockTxtContent from notes "+
            " where bookname=? and userName=? and box > ? and box <= ?  ",
            [work.arg,work.userName,work.begin,work.end],
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};

//读取笔记内容 现目前无用
exports.getNote = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT mockTxtTitle,mockTxtContent from notes "+
            " where noteID=? ",
            [work.noteID],
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};

//获取书的内容  书名，第几章到第几章
exports.getBook = function(bookname,chanter1,chapter2,work){
    //添加工作记录的sql
    db.query(
        "SELECT content,chapter,type from book "+
        " where name=? and chapter >= ? and chapter <= ? ",
        [bookname,chanter1,chapter2],
        function(err,rows){
            if(err) throw err;
            work(rows);
        }
    )
};

//获取书的内容
exports.loadBooks = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT content,chapter,type from book "+
            " where name=? and chapter >= ? and chapter <= ? ",
            [work.arg,work.chapter1,work.chapter2],
            function(err,rows){
                if(err) throw err;
                res.send(rows);
            }
        )
    })
};

//判断用户登录是否成功
exports.login = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "select * from t_user "+
            "where userName= ? and userPwd= ? ",
            [work.userName,work.userPwd],
            function(err,rows){
                if(err) throw err;
                if(rows.length == 0){
                    res.send(false);
                }else {
                    var user ={ "userName":rows[0].userName,"userID":rows[0].userID};
                    req.session.user = user;
                    res.send(user);
                }
            }
        )
    })
};

//验证用户名是否存在
exports.ajaxCheckUserName = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "select * from t_user "+
            "where userName= ? ",
            [work.userName],
            function(err,rows){
                if(err) throw err;
                if(rows.length == 0){
                    res.send(true);
                }else {
                    res.send(false);
                }
            }
        )
    })
};

//注册
exports.reg = function(req,res){
    exports.parseReceivedData(req,function(work){
        // 添加工作记录的sql
        db.beginTransaction(function(err) {
            if (err) { throw err; }
            db.query(
                "INSERT INTO t_user (userName,userPwd,userNickname) " +
                " VALUES (?,?,?) ",
                [work.userName,work.userPwd,work.userNc],
                function(err,result){
                    if (err) {
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    db.query(
                        "INSERT INTO friends (id) "+
                        "VALUES (?) ",
                        result.insertId,
                        function(err){
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            db.commit(function(err) {
                                if (err) {
                                    return db.rollback(function() {
                                        throw err;
                                    });
                                }
                                var user ={ "userName":work.userName,"userID":result.insertId};
                                req.session.user = user;
                                res.send('success');
                            });
                        }
                    );
                }
            );
        });
    })
};

//推荐内容
exports.bookRecommended = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "select content from bookrecommended " +
            "where BookID = ? and PageID >= ? and PageID <= ? ",
            [work.arg,work.begin,work.end],
            function(err,rows){
                if(err) throw err;
                res.send(rows);

            }
        )
    })
};

//加载全部笔记
exports.loadAllbz = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "SELECT noteID,mockTxtTitle,mockTxtContent from notes "+
            " where userName=? and bookname=? ",
            [work.userName,work.arg],
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};

//获得一共多少章节
exports.getchapterLenght = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "select count(*) from book "+
            " where name=? ",
            [work.arg],
            function(err,rows){
                if(err) throw err;
                res.send(rows)
            }
        )
    })
};


//删除笔记
exports.deleteNotes = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "DELETE from notes "+
            " where noteID=? AND userName=? AND bookname=? ",
            [work.noteId,work.userName,work.arg],
            function(err,rows){
                if(err) throw err;
                if(rows.affectedRows != 0){
                    res.send("success");
                }else{
                    res.send(false);
                }
            }
        )
    })
};

//删除评注和荧光笔
exports.deleteRectLine = function(req,res){
    exports.parseReceivedData(req,function(work){
        var theType ;
        if(work.type == "rect"){
            theType = "userrectimg" ;
        }else if(work.type == "line"){
            theType = "userdrawimg" ;
        }
        //添加工作记录的sql
        db.query(
            "DELETE from " + theType +
            " where theID=? AND userName=? AND bookname=? ",
            [work.theID,work.userName,work.arg],
            function(err,rows){
                if(err) throw err;
                if(rows.affectedRows != 0){
                    res.send("success");
                }else{
                    res.send(false);
                }

            }
        )
    })
};


//更新笔记
exports.updateNotes = function(req,res){
    exports.parseReceivedData(req,function(work){
        //添加工作记录的sql
        db.query(
            "UPDATE notes SET mockTxtTitle=? , mockTxtContent=? "+
            " where noteID=? AND userName=? AND bookname=? ",
            [work.mockTxtTitle,work.mockTxtContent,work.noteID,work.userName,work.arg],
            function(err,rows){
                if(err) throw err;
                res.send("success");
            }
        )
    })
};


//获得书名
exports.ebookName = function(req,res){
    //添加工作记录的sql
    db.query(
        "SELECT * from bookname ",
        function(err,rows){
            if(err) throw err;
            res.send(rows)
        }
    )
};

//获取好友列表
exports.getUser = function(req,cb){
    try{
        var userID = req.session.user.userID;
    }catch(e) {
        return false;
    }
    //开启事物
    db.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        db.query('select reletionship from friends where id = ?', [req.session.user.userID], function (err, result) {
            if (err) {
                return db.rollback(function () {
                    throw err;
                });
            }
            try {
                var friends = result[0].reletionship.split("-");
            }catch (e){
                return db.rollback(function () {
                    cb();
                });
            }

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
//获取分享的好友
exports.shareBookToWho  = function(req,res){
    try{
        var userID = req.session.user.userID;
    }catch(e) {
        return false;
    }
    exports.parseReceivedData(req,function(work){
        db.query(
            "SELECT shareid from sharebooktowho "+
            " where id=? and bookname=? ",
            [req.session.user.userID,work.arg],
            function(err,rows){
                if(err) throw err;
                res.send(rows);
            }
        )

    })
};
//重新分享好友列表
exports.saveShareId  = function(req,res){
    try{
        var userID = req.session.user.userID;
    }catch(e) {
        return false;
    }
    exports.parseReceivedData(req,function(work){
        var friends = work.shareId.split(',');
        //开启事物
        db.beginTransaction(function(err) {
            if (err) {
                throw err;
            }
            db.query('delete from sharebooktowho where id = ? and bookname = ?', [req.session.user.userID,work.bookname], function (err, result) {
                if (err) {
                    return db.rollback(function () {
                        throw err;
                    });
                }

                if(work.shareId == ""){
                    return db.rollback(function () {
                        res.send('success');
                    });
                }

                var $sql = 'INSERT INTO sharebooktowho (id,bookname,shareid) VALUES ' ;
                var arrayData = [];
                for(var i = 0;i<friends.length;i++){
                    $sql += "(?,?,?),";
                    arrayData.push(req.session.user.userID);
                    arrayData.push(work.bookname);
                    arrayData.push(+friends[i]);
                }
                $sql = $sql.substr(0,$sql.length-1);
                db.query($sql,arrayData,function(err,row){
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
                        res.send('success');
                    });
                })
            })
        })
    })
};

//分享给我的人
exports.shareBookToMe  = function(req,res){
    try{
        var userID = req.session.user.userID;
    }catch(e) {
        return false;
    }
    exports.parseReceivedData(req,function(work){
        //开启事物
        db.beginTransaction(function(err) {
            if (err) {
                throw err;
            }
            db.query('SELECT id from sharebooktowho where shareid=? and bookname=? ',[req.session.user.userID,work.arg],function (err, result) {
                if (err) {
                    return db.rollback(function () {
                        throw err;
                    });
                }

                var friends = [];
                for( var i in result){
                    friends.push(result[i].id);
                }

                if(friends.length == 0){
                    return db.rollback(function () {
                        res.send('');
                    });
                }

                var $sql = 'select userID,userName,userNickname,userSign,img from t_user where userID in (' ;
                var arrayData = [];
                for(var i = 0;i<friends.length;i++){
                    $sql += "?,";
                    arrayData.push(friends[i]);
                }
                $sql = $sql.substr(0,$sql.length-1)+")";
                db.query($sql,arrayData,function(err,rows){
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
                        res.send(rows);
                    });
                })
            })
        })
    })
};

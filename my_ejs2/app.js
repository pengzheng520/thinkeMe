var express = require('express');
var path = require('path');
var url = require('url');
var methodFu = require('./routes/methodFu');
var work =  require('./routes/connect-mysql');
var app = express();

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'static')));
var server = app.listen(80);

app.get('/', function (req, res) {
    res.render("index-asp");
});
app.get('/bookContent', function (req, res) {
    res.render("bookContent");
});
app.get('/books/*', function (req, res) {
    var arg = url.parse(req.url).pathname.split("books/")[1];
    //获取这本书的内容
    work.getBook(arg,"1","3",function(work){
        var Mobile = methodFu.isMobile(req);
        if(Mobile){
            res.render("mobile/index",{"work":work})
        }else {
            res.render("pc/index",{"work":work})
        }
    });

});
//保存线数据
app.post('/postSvgAjax',function (req, res) {
    work.add(req, res);
});
app.post('/showLine',function (req, res) {
    work.showLine(req, res);
});
app.post('/showPen',function (req, res) {
    work.showPen(req, res);
});
//保存笔记数据
app.post('/saveNotes',function (req, res) {
    work.addNotes(req, res);
});
app.post('/showNotes',function (req, res) {
    work.showNotes(req, res);
});
//加载全部笔记
app.post('/loadAllbz',function (req, res) {
    work.loadAllbz(req, res);
});
app.post('/getNote',function (req, res) {
    work.getNote(req, res);
});
//加载书的内容
app.post('/loadBooks',function (req, res) {
    var arg = url.parse(req.url).pathname.split("books/")[1];
    work.loadBooks(req,res,arg);
});
//保存PC端笔记的内容
app.post('/savePcNotes',function (req, res) {
    work.savePcNotes(req, res);
});
//获得PC端的笔记内容
app.post('/getPcNotes',function (req, res) {
    work.getPcNotes(req, res);
});
//获得推荐内容
app.post('/bookRecommended',function (req, res) {
    work.bookRecommended(req, res);
});

//获得一共多少章节
app.post('/getchapterLenght',function (req, res) {
    work.getchapterLenght(req, res);
});

//全部获得书名
app.post('/ebookName',function (req, res) {
    work.ebookName(req, res);
});

//引入session模块
var session = require('express-session');
var cookieParser = require('cookie-parser');

//应用cookie和session
app.use(cookieParser());
app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'love'
}));

//登录设计
app.post('/login',function(req,res){
    work.login(req,res);
});
app.post('/isLogin',function(req,res){
    if(req.session.user){
        res.send(req.session.user)
    }else{
        res.send("false")
    }
});
app.get('/logout',function(req,res){
    req.session.user = null;
    res.send('success');
});
//验证用户名是否存在
app.post('/ajaxCheckUserName',function(req,res){
    work.ajaxCheckUserName(req,res);
});
//注册
app.post('/reg',function(req,res){
    work.reg(req,res);
});

//删除笔记
app.post('/deleteNotes',function(req,res){
    work.deleteNotes(req,res);
});

//更新笔记
app.post('/updateNotes',function(req,res){
    work.updateNotes(req,res);
});

//删除评注和线
app.post('/deleteRectLine',function(req,res){
    work.deleteRectLine(req,res);
});


//获得好友
app.post('/getUser',function(req,res){
    work.getUser(req,function(data){
        res.send(data);
    });
});

//分享书给朋友
app.post('/shareBookToWho',function(req,res){
    work.shareBookToWho(req,res);
});
//重新刷新分享的好友
app.post('/saveShareId',function(req,res){
    work.saveShareId(req,res);
});
//分享给我的好友
app.post('/shareBookToMe',function(req,res){
    work.shareBookToMe(req,res);
});


console.log('app listening');
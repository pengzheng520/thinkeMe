/**
 * Created by pengpeng on 2016/3/2.
 */
 var fs = require('fs');
 var http = require('http');
 var util = require('util');

//判断是否是移动端
exports.isMobile = function (req){
    var ua = req.headers['user-agent'].toLowerCase();
    var agentID = ua.match(/(iphone|ipod|ipad|android)/);
     
	var ip =  getClientIp(req);
	
	console.log(ip)
	if(typeof ip == "undefined"){
			return false;
	}
	getIpInfo(ip.split("ffff:")[1],function(err, msg){
		var date = new Date();
        console.log(typeof msg)
		if(typeof msg != "object"){
			return false;
		}
		var msg1 = {
			city : msg.city,
			date : date.toLocaleString()
		};
		console.log(msg1)
	    //写入文件
 	    fs.appendFile('log.txt', util.inspect(msg1, true, 8), function (err) {
		   if (err) throw err;
	    });
	})
	
	if (agentID)
    {
        return true;
    }
    else{
        return false;
    }
};

//获取IP
function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

/**
 * 根据 ip 获取获取地址信息
 */
var getIpInfo = function(ip, cb) {
    var sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
    var url = sina_server + ip;
    http.get(url, function(res) {
        var code = res.statusCode;
        if (code == 200) {
            res.on('data', function(data) {
                try {
                    cb(null, JSON.parse(data));
                } catch (err) {
                    cb(err);
                }
            });
        } else {
            cb({ code: code });
        }
    }).on('error', function(e) { cb(e); });
};
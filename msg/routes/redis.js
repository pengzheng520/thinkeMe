/**
 * Created by Administrator on 2016/5/31.
 */
var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});


//保存
exports.set = function(key,data) {
    client.set(key, JSON.stringify(data), function (err, reply) {
        if (err) {
            console.log(err);
            return;
        }

    });
}
//读取
exports.get = function(key,callback){
    client.get(key, function(err, reply) {
        if (err) {
            console.log(err);
            return;
        }
        callback(JSON.parse(reply))
    });
};
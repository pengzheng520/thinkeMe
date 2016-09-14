var ws;  //websocket连接
var SocketCreated = false;  //是否创建socket连接
var isUserloggedout = false;  //用户是否
var fromClass="1",toClass="1";   //临时变量，用户登录后，应该放在用户变量中去
//var server="123.57.149.123";     //websocket 服务器端IP
var server="192.168.1.100";
/*
var user=new Array();
var class=new Array();
user["ID"]=new Array("userName":"张三","nickName":"麻子");
*/
function socketCheck(){
	alert("socketCheck");            
	var WebSocketsExist = true;
	try {
		var dummy = new WebSocket("ws://localhost:8989/test");
	} catch (ex) {
		try
		{
			webSocket = new MozWebSocket("ws://localhost:8989/test");
		}
		catch(ex)
		{
			WebSocketsExist = false;
		}
	}

	if (WebSocketsExist) {
		//Log("您的浏览器支持WebSocket. 您可以尝试连接到聊天服务器!", "OK");
		//document.getElementById("Connection").value = "172.19.55.10:4141/chat";
		socketConnect();
	} else {
		alert("您的浏览器不支持WebSocket。请选择其他的浏览器再尝试连接服务器。");
		//Log("您的浏览器不支持WebSocket。请选择其他的浏览器再尝试连接服务器。", "ERROR");
		//document.getElementById("ToggleConnection").disabled = true;
	}  
}
            
         
function socketConnect() {
            if (SocketCreated && (ws.readyState == 0 || ws.readyState == 1)) {
                //lockOn("离开聊天室...");  
                SocketCreated = false;
                isUserloggedout = true;
                ws.close();
            } else {
                //lockOn("进入聊天室...");  
                //Log("准备连接到聊天服务器 ...");
                try {
                    if ("WebSocket" in window) {
                    	ws = new WebSocket("ws://"+server+":4141/chat?name=userName");
                    }
                    else if("MozWebSocket" in window) {
                    	ws = new MozWebSocket("ws://"+server+":4141/chat?name=userName");
                    }
                    
                    SocketCreated = true;
                    isUserloggedout = false;
                } catch (ex) {
                    //Log(ex, "ERROR");
                    return;
                }
                //document.getElementById("ToggleConnection").innerHTML = "断开";
                ws.onopen = WSonOpen;
                ws.onmessage = WSonMessage;
                ws.onclose = WSonClose;
                ws.onerror = WSonError;
            }
        };


        function WSonOpen() {
            //lockOff();
            //Log("连接已经建立。", "OK");
            //$("#SendDataContainer").show();
            
            //var msg=document.getElementById("txtFromClass").value + ";" + document.getElementById("txtFromUser").value +
            //		";" + document.getElementById("txtToClass").value + ";" + document.getElementById("txtToUser").value + ";" + "";
            	var msg=fromClass+";"+userName+";"+toClass+";"+"toUser"+";连接成功";	            		
   			    ws.send(msg);
        };

        function WSonMessage(event) {
            //Log(event.data);  
            //data:fromClass+";"+userName+";"+toClass+";"+"toUser"+";message";
			alert("received:"+event.data);
        };

        function WSonClose() {
            //lockOff();
            //if (isUserloggedout)
            //    Log("【"+document.getElementById("txtName").value+"】离开了聊天室！");
            //document.getElementById("ToggleConnection").innerHTML = "连接";
            //$("#SendDataContainer").hide();
			alert("CLOSE");
        };

        function WSonError() {
            //lockOff();
            //Log("远程连接中断。", "ERROR");
			alert("Error");
        };


        function SendDataClicked() {
            var msg=document.getElementById("txtFromClass").value + ";" + document.getElementById("txtFromUser").value +
            		";" + document.getElementById("txtToClass").value + ";" + document.getElementById("txtToUser").value + 
            		";" + document.getElementById("DataToSend").value + "\"";
        	    //fromClass;fromUser;toClass;toUser;message
                ws.send(msg);
                document.getElementById("DataToSend").value = "";
            
        };

		function sendData(m){
            ws.send(m);
		}


        function Log(Text, MessageType) {
            if (MessageType == "OK") Text = "<span style='color: green;'>" + Text + "</span>";
            if (MessageType == "ERROR") Text = "<span style='color: red;'>" + Text + "</span>";
            document.getElementById("LogContainer").innerHTML = document.getElementById("LogContainer").innerHTML + Text + "<br />";
            var LogContainer = document.getElementById("LogContainer");
            LogContainer.scrollTop = LogContainer.scrollHeight;
        };

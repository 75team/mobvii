/*
 * @fileoverview send events like twitter
 * @author　Akira
 * @version $version
 */
(function(){

	var mix = QW.ObjectH.mix,
		CustEvent = QW.CustEvent,
		g = QW.DomU.g;

	var eventTarget = CustEvent.createEvents({},[]);
	//var timeout = 200; //default timeout
	var receiveMap = {};
	
	eventTarget.on("*", function(evt){
		var type = evt.type;
		var sender = evt.sender;
		var receiveList = receiveMap[type] || [];

		for (var i = 0, len = receiveList.length; i < len; i++){
			var r = receiveList[i];
			mix(evt, {target:r.receiver, receiver:r.receiver}, true);
			r.callback.call(r.receiver, evt);
		}
	});

	var TweetH = {
		/**
		 * 让一个对象发起消息
		 *
		 * @param target 消息发送者
		 * @param type 消息类型
		 * @param data 发送的数据
		 * @param async 是否异步消息 （如果未加载Async组件，忽略此参数）
		 */
		tweet : function(target, type, data, async){
			data = data || {};

			//如果定义了XPC并且type是一个以XPC开头的消息，利用XPC发送跨域消息
			if(QW.XPC && /^XPC/.test(type)){
				var xpc = new XPC();
				var pack = {message:data, type:type};
				xpc.send(pack);
				return;
			}

			var pack = {data:data, sender:target};

			eventTarget.createEvents([type]);	//如果有需要，创建对应类型的事件
			eventTarget.fire(type, pack);

			//如果有Async可以让消息支持异步
			if(QW.Async && async){
				QW.Async.wait("twitter." + type, function(){
					eventTarget.fire(type, pack);
				});
			}
		},
		receive : function(target, type, callback){

			//如果定义了XPC，并且type是一个以XPC开头的消息，准备接收跨域消息
			if(QW.XPC && /^XPC/.test(type)){
				var xpc = new XPC();
				xpc.on('message', function(evt){
					var pack = evt.data;
					if(pack.type == type){
						callback.call(target, {data: pack.message, sender:'xpc', receiver:target});
					}
				});
				return;
			}

			var list = receiveMap[type] = receiveMap[type] || []; //创建对应事件的hash表
			list.push({receiver:target, callback:callback}); //将接收者存入列表

			//如果有Async，接收全部消息
			if(QW.Async){
				QW.Async.signal("twitter." + type, true);				
			}
		}
	}

	QW.provide("TweetH",TweetH);
})();
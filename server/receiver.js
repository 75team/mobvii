var WebSocketServer = require('ws').Server,
	Binder = require('./binder'),
	Event = require('events').EventEmitter;

var Server = {
	listen: function(port){
		var wss = new WebSocketServer({port: port});
		wss.on('connection', function(ws) {
			console.log('connected');

			var emitter = new Event();
			Binder.provide(emitter); //等待绑定

		    ws.on('close', function(){
		    	emitter.emit('close');	//断开了
		    });

		    emitter.on('message', function(message){
		    	ws.send(message);
		    });

		    ws.send('connected');
		});		
	}
}

module.exports = Server;

var WebSocketServer = require('ws').Server,
    Binder = require('./binder'),
	Event = require('events').EventEmitter;

var Server = {
    listen: function(port){
        var wss = new WebSocketServer({port: port})
        wss.on('connection', function(ws) {
            console.log('connected');
            
            ws.on('message', function(message) {
                console.log('received: %s', message);
                ws.send(message);

                if(ws.emitter == null){
                    Binder.bind(ws);
                }
                if(ws.emitter){
                    ws.emitter.emit('message', message);
                }
            });

            ws.send('connected');
        });        
    }
}

module.exports = Server;
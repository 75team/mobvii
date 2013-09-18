var when = require('when');

var emitters = [];

var Binder = {
	provide: function(emitter){
		emitters.push(emitter);
	},
	unprovide: function(emitter){
		var idx = emitters.indexOf(emitter);
		if(idx >= 0){
			emitters.splice(idx, 1);
		}
	},
	bind: function(sender){
		if(emitters.length > 0){

			//从列表的第一个开始绑定，只能绑定一个
			sender.emitter = emitters.shift();
			console.log('binded');

			//如果链接断开，将sender的emitter解绑
			sender.emitter.on('close', function(){
				sender.emitter.removeAllListeners('close');
				sender.emitter = null;
			});
		}
	}
};

module.exports = Binder;
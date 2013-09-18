(function(){

/**
 * 这个文件控制读取传感器数据状态并转换成相应的命令
 */

 var mix = ObjectH.mix;

 //默认传感器对象
 var _sensors = {
 	//加速度感应器
 	Accelerometer : {
 		_id : null,
 		start : function(){
 			if(!navigator.accelerometer){
 				return;
 			}
 			if(this._id) return; //已经在运行了 			
 			this._id = navigator.accelerometer.watchAcceleration(
 				function(data){
 					SensorMonitor.fire("DataArrived", {sender:"Accelerometer", data:data, timestamp:data.timestamp});
 				}, 
 				function(){
 					SensorMonitor.fire("Error", {sender:"Accelerometer"});
 				}, 
 				{frequency: this.frequency || SensorMonitor.default_frequency}
 			);
 		},
 		stop : function(){
 			if(!navigator.accelerometer){
 				return;
 			}
 			if(this._id){
 				navigator.accelerometer.clearWatch(this._id);
 				this._id = null;
 			}
 		},
 		frequency: 40
 	},
 	//指南针
 	Compass : {
 		_id : null,
 		start : function(){
 			if(!navigator.accelerometer){
 				return;
 			}
 			if(this._id) return; //已经在运行了
 			this._id = navigator.compass.watchHeading(
					function(heading){
 					SensorMonitor.fire("DataArrived", {sender:"Compass", data:heading, timestamp:data.timestamp});
 				}, function(){
 					SensorMonitor.fire("Error", {sender:'Compass'});
 				},
 				{
 					frequency : this.frequency || SensorMonitor.default_frequency
 				}
 			);
 		},
 		stop : function(){
 			if(!navigator.accelerometer){
 				return;
 			}
 			if(this._id){
 				navigator.compass.clearWatchFilter(this._id);
 				this._id = null;
 			}
 		},
 		frequency: 40,
 		filter : 1
 	}
 };

/*设备收到外力*/
var forceOnDevice = function (data){
	var _a = data.x * data.x + data.y * data.y + data.z * data.z;
	return  Math.floor(_a / 50);
}

 /* 默认命令处理器/状态机 */
 var _commanders = {
 	device_down : {
 		/** 翻转
 		* x、y轴上没外力加速度
 		* z轴上重力加速度-10
 		**/
 		sensorsfilter : ['Accelerometer'],
 		filter : function(data, collection, sender){	
 			if(data.z > -6){
 				return false;
 			}

 			if(forceOnDevice(data) > 4){
 				delete collection;
 				return false;
 			}
 			
 			return true;
 		},
 		map : function(data, collection, sender){
 			collection.push(data);
 			if(10 > collection.length){
 				return false;
 			}
 			var _ret = true;
 			collection.slice(-3).forEach(function(i){
 				/*x、y不足够倾斜范围当作是z面垂直地面*/
 				if(Math.abs(i.x) > 2 || Math.abs(i.y) > 2 || i.z > -8){
	 				_ret = false;
	 			}
 			});
 			return _ret;
 		},
 		reduce : function(collection, sender){
 			return 'device_down';
 		}
 	},
 	device_font : {
 		/**
 		* 翻转过来继续播放
 		**/
 		/*传感器过滤器，忽略不在过滤器内传感器数据*/
 		sensorsfilter : ['Accelerometer'],
 		/**
 		 	map，处理 data 的函数，return true 表示当前 data 处理完毕，可以 reduce
 		 */
 		filter : function(data, collection, sender){
 			if(!collection.length && data.z > -6) {
 				return false;
 			}

 			if(forceOnDevice(data) > 4){
 				delete collection;
 				return false;
 			}

 			return true;
 		},
 		map : function(data, collection, sender){
 			collection.push(data);

 			if(10 > collection.length){
 				return false;
 			}
 			var _ret = true;
 			collection.slice(-3).forEach(function(i){
 				if(i.z < 0){
	 				_ret = false;
	 			}
 			});
 			return _ret;
 		},
 		/**
 			处理完 data， 返回操作指令
 		 */
 		reduce : function(collection, sender){
 			return "device_font";
 		}
 	},
 	tilt : {
 		sensorsfilter :['Accelerometer'],
 		filter : function(data, collection, sender){
 			if(Math.abs(data.x) < 7 || Math.abs(data.y) > 2){
 				return false;
 			}

 			if(forceOnDevice(data) > 2){
 				delete collection;
 				return false;
 			}

 			return true;
 		},
 		map : function(data, collection, sender){
 			collection.push(data);
 			if(collection.length < 10){
 				return false;
 			}
 			return true;
 		},
 		reduce : function(collection, sender){
 			var left_right = collection[collection.length -1].x < 0 ? 'tilt_right' : 'tilt_left';
 			return left_right;
 		}
 	},
 	hr : {
 		sensorsfilter : ['Accelerometer'],
 		filter : function(data, collection, sender){
 			if(Math.abs(data.x) > 2 || Math.abs(data.y) > 2 || data.z < 7){
 				return false;
 			}

 			if(forceOnDevice(data) > 2){
 				delete collection;
 				return false;
 			}

 			return true;
 		},
 		map : function(data, collection, sender){
 			collection.push(data);
 			if(collection.length < 10){
 				return false;
 			}
 			return true;
 		},
 		reduce : function(collection, sender){
 			return 'device_hr';
 		}
 	},
 	vertical : {
 		/**
 		* 手机竖拿静音
 		**/
 		sensorsfilter :['Accelerometer'],
 		filter : function(data, collection, sender){
 			if(Math.abs(data.y) < 6){
 				return false;
 			}

 			if(forceOnDevice(data) > 4){
 				delete collection;
 				return false;
 			}

 			return true;
 		},
 		map : function(data, collection, sender){
 			collection.push(data);

 			var _ret = true;
 			collection.slice(-10).forEach(function(i){
 				/*x、z不足够倾斜范围当作是y面垂直地面*/
 				if(Math.abs(i.x) > 3 || Math.abs(i.z) > 3 || Math.abs(i.y) < 8){
	 				_ret = false;
	 			}
 			});
 			return _ret;
 		},
 		reduce : function(collection, sender){
 			return 'vertical_' + (collection[collection.length - 1].y > 0 ? 'u' : 'd');
 		}
 	},
 	
 	wave : {
 		/*摇晃控制播放、暂停*/
 		sensorsfilter : ['Accelerometer'],
 		map : function(data, collection, sender){
 			return wave(data, collection, sender);         	
	    },
	    reduce : function(collection, sender){	    	
	    	/*将obj{x,y,z}转化成数组*/
	    	var _cdata = [];
	    	collection.forEach(function(data){
	    		_cdata.push([data.x, data.y, data.z]);
	    	});
	    	var _d = new DollarRecognizer();
	    	var ret = _d.recognize(_cdata);

	    	/* 数据记录 */
	    	//alert(JSON.stringify(_cdata));
	    	//Ajax.post('http://app.ivershuo.com/test/s.php', {'s[]': _cdata}, function(d){});

	    	/*如果没达到指定score不匹配*/
	    	var _reta = ret.name.split('|');
	    	if(ret.score > (_reta[1] || 0)){
	    		return _reta[0];
	    	}
	    	return 'unmatched';
	    }
 	},
 };

 //单例，传感器监视器
 var SensorMonitor = {
 	
 	default_frequency : CONF.frequency,  //每40ms取样一次数

 	//添加一个传感器
 	addSensor : function(id, sensor){
 		_sensors[id] = sensor;
 	},

 	removeSensor : function(id){
 		_sensors[id].stop();
 		delete _sensors[id];
 	},

 	//添加一个命令处理器
 	addCommander : function(id, commander){
 		_commanders[id] = commander;
 	},

 	removeCommander : function(id){
 		delete _commanders[id];
 	},

 	//开始监控
 	start : function(s){
 		if(s && _sensors[s]){
 			_sensors[s].start();
 		}
		for(var id in _sensors){
			var sensor = _sensors[id];
			sensor.start();
		}
 	},

 	//停止监控
 	stop : function(s){
 		if(s && _sensors[s]){
 			_sensors[s].start();
 		}
		for(var id in _sensors){
			var sensor = _sensors[id];
			sensor.stop();
		}
 	},

 	lastTime : (new Date()).getTime(),

 	//是否用户设置状态
 	isUserSetup : false
 };

var cmdMap = CONF.cmdMap || {},
	itvTime = CONF.itvTime || 1000,
	cmdSingular = CONF.cmdSingular || [];
	_sentResult = '';

CustEvent.createEvents(SensorMonitor);
SensorMonitor.on('DataArrived', function(evt){
 	var data = evt.data,
 		sender = evt.sender;

 	window.sensorxyz = data;

 	for(var id in _commanders){
 		var commander = _commanders[id];
 		commander._collection = commander._collection || [];

 		if(SensorMonitor.isUserSetup){
 			return;
 		}

 		if(undefined === commander.sensorsfilter || -1 < commander.sensorsfilter.indexOf(sender)){
	 		if(undefined === commander.filter || commander.filter(data, commander._collection, sender)){
	 			if(commander.map(data, commander._collection, sender)){
	 				var result = commander.reduce(commander._collection, sender);
	 				if(SensorMonitor.fire('CommanderReduce', {commander:commander, result:result, collection:commander._collection, sender:sender}) !== false){
	 					delete commander._collection;
	 				}

	 				var userCmdMap = L.get('user_map');
	 				var MixCmdMap = mix(cmdMap, userCmdMap, 1);

	 				var result = MixCmdMap[result] || (typeof(result) == 'string' ? result : 'unknown');
	 				var _nt = (new Date).getTime();
	 				if(_nt - SensorMonitor.lastTime < itvTime){
	 					return;
	 				}
	 				if(result != _sentResult || -1 == cmdSingular.indexOf(result)){
						W(document).tweet("command_sent", result);
						SensorMonitor.lastTime = _nt;
						_sentResult = result;
					}
	 			}
	 		}
 		}
 	}
});

 //SensorMonitor.on('Error', function(evt){
 	//在这里处理错误
 //});

 SensorMonitor.on('CommandReduce', function(evt){
 	/*命令发送之后清除所有命令状态机内传感器数据队列*/
 	for(var cid in _commanders){
 		delete _commanders[cid]._collection;
 	}
 	/*如果是播放指令，取消静音*/
 	/*
 	if('video_play' == evt.commander){
 		W(document).tweet("command_sent", 'player.mute|0');
 	}
 	*/
 });

QW.provide("SensorMonitor", SensorMonitor);
})();
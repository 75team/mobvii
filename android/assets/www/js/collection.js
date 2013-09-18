(function(){
	var mix = ObjectH.mix;

	var collection = [],
		AtimeCollection = {},
		gestureName = '',
		firstTime = true,
		UserGestures = {
			'slash' : [],
			'r_slash' : [],
			'swing' : []
		};

	/*监听训练开始手势*/
	var training_panel = g("training");
	var context = training_panel.getContext('2d');
	
	var pic = new Image();
	pic.src = "pic/phone.png";
	
	pic.onload = function(){
		var player = new GuesturePlayer(context, pic, 1000);
		context.drawImage(pic, 100, 60);
		W(document).receive('showdemo', function(evt){
			player.play(evt.data.demo);
			W('#xlret').html('请按图示手势训练');
			SensorMonitor.isUserSetup = true;
		});		
	}

	var demos = ['r_slash', 'slash', 'swing'],
		gesturei = 0;

	W(document).receive("xlstart", function(evt){
		var i = gesturei++;
		gestureName = demos[i%3];
		W(document).tweet('showdemo', {demo : gestureName});		
		firstTime = true;
		//var _i = Math.floor(Math.random()*3),		
	});


	SensorMonitor.on('DataArrived', function(evt){
		if(!SensorMonitor.isUserSetup){
			return;
		}
		var data = evt.data,
 			sender = evt.sender;
 		if('Accelerometer' == sender){
 			var retc = wave(data, collection);
 			if(retc){
 				var _nowLgestures = mix(L.get('usergestures'), UserGestures);
 					_gesture = _nowLgestures[gestureName];

 				//var _k = 'usrmap' + (new Date).getTime() + '|0.5';
 				var nowUserColl = L.get('user_collection'),
 					nowUsermap = L.get('user_map');
 					o_o = {},
 					$o_o = {},
 					_ut = [];

 				retc.forEach(function(i){
 					_ut.push([i.x, i.y, i.z]);
 				});
 				collection = [];

 				var match = false;
 					_d = new DollarRecognizer(true);
		    		ret = _d.recognize(_ut),
		    		/*如果没达到指定score不匹配*/
		    		_reta = ret.name.split('|'),
		    		score = ret.score;
		    	if(_reta[0].replace(/\d+$/, '') == gestureName){
		    		match = true;
		    	}

 				/*如果是第一次训练则再训练一次*/
 				if(!match){ 					
 					W('#xlret').html('没匹配上，请再玩一次');
 					return;
 				}

 				var _tm = (new Date).getTime();
 				var thisCollection = {
					collection : _ut,
					score : score,
					userMapkey : 'usergesture' + _tm,
					userActKey : 'usergesture' + _tm + '|0.5'
				}

 				if(firstTime){
 					AtimeCollection = thisCollection;
	 				firstTime = false;
	 				W('#xlret').html('请再玩一次确认');
	 				return;
 				} 				

 				/*如果是训练完成则存下*/
 				var betterCollection = Math.max(AtimeCollection.score, score) == score ? thisCollection: AtimeCollection;

 				o_o[betterCollection.userActKey] = _ut;
 				var _u = mix(nowUserColl, o_o, 1); 				

 				_gesture.push(betterCollection.userMapkey);
 				if(_gesture.length > 3){
 					var _delGestureKey = _gesture.shift();
 				}
 				delete nowUserColl[_delGestureKey];
 				L.set('user_collection', _u);
 				L.set('usergestures', _nowLgestures)

 				$o_o[betterCollection.userMapkey] = CONF.cmdMap[gestureName];
 				var _um = mix(nowUsermap, $o_o, 1);
 				L.set('user_map', _um);
				
 				SensorMonitor.isUserSetup = false;
 				AtimeCollection = {};
 				W('#xlret').html('学习完成');
 				setTimeout(function(){
 					W(document).tweet('xlstart');
 				}, 1000); 				
 			}
 		}
	});

	/*
	var _option = '<option value="$1">$1</option>';
	var _map = CONF.cmdMap;
	for(var c in _map){
		var _o = _option.replace(/\$1/g, c);
		W('#act').appendChild(W(_o));
	}
	*/

	/*换一个手势*/
	W('#gesture-next').click(function(e){
		e.preventDefault();
		W(document).tweet("xlstart");
	});
	/*清除手势*/
	W('#clear-user-templates').click(function(e){
        e.preventDefault();
        try{
        	if(confirm('确定清除自定义手势？')){
        		localStorage.clear();
        		W('#xlret').html('清除自定义手势成功！');
        	}
        } catch(e){};
    });

})();
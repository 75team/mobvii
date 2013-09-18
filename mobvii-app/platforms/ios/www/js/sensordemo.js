(function(){
	var easingList = {
		r_slash : function(p){
			var x;

			if ((p /= 0.5) < 1) x = 200 * p * p;
			else x = -200 * ((--p) * (p - 2) - 1);
			return [1,0,0,1,x,0,100,60];
		},

		slash : function(p){
			var x;

			if ((p /= 0.5) < 1) x = 400 + -200 * p * p;
			else x = 400 + 200 * ((--p) * (p - 2) - 1);
			return [1,0,0,1,x,0,100,60];
		},

		swing : (function(){
			var angle = 0;
			return function(p){
				angle += 0.2;
				var a = angle - Math.round(angle);
				return [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 200, 120, -100, -60];
			}
		})()
	};

	function GuesturePlayer(context, pic, dur){
		this.context = context;
		this.pic = pic;
		this.dur = dur || 3000;
		this.easing = easingList['slash'];
	}

	GuesturePlayer.prototype.play = function(easingk){
		easing = easingList[easingk] || this.easing;
		context = this.context;
		pic = this.pic;
		if(this.timer) return; //已经运行了

		var startTime = new Date().getTime();
		var me = this;

		this.timer = setInterval(function(){
            var per = (new Date().getTime() - startTime) / me.dur;
            
            if(per > 1)
            	me.stop();
			
			context.clearRect(0, 0, 600, 400);
            context.save(); 

            var trans = easing(per); 
            console.log(trans);

            context.transform.apply(context, trans);

            context.drawImage(pic, trans[6], trans[7]);
            context.restore(); 				
		}, 40);
	}

	GuesturePlayer.prototype.stop = function(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	if(typeof QW !== 'undefined' && QW.provide){
		QW.provide('GuesturePlayer', GuesturePlayer);
	}else{
		window.GuesturePlayer = GuesturePlayer;
	}
})();
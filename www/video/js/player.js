Number.prototype.format = function() {
	var num = parseInt(this),
		m = parseInt(num / 60),
		s = num % 60;
	return ((m < 10) ? ('0' + m ) : m) + ':' + ((s < 10) ? ('0' + s ) : s);
};


function Player() {
	this._init.apply(this, arguments);
};

Player.prototype = (function() {
	return {
		_init : function() {
			CustEvent.createEvents(this);

			this.video = W('video')[0];
			this._initControl();
			this._initEvent();
		},
		load : function(url) {
			W('.time-control .total').html('00:00');
			W('.time-control .curr').html('00:00');
			W('.progress .curr').css('width', '0%');
			W('.video-player .bt-play').hide();

			if( !this.video.paused ) {
				this.fire('pause');
			}

			this.video.src = url;
			this.video.progress = 0;
		},
		_initControl : function() {
			var video = this.video, 
				me = this;

			video.volume = .8;

			this.on('*', function() {
				W('.bt-action .play-control div').set('className', video.paused ? 'playing' : 'paused');

				if(video.paused) {
					W('.bt-action .play-control div').set('className', 'playing');
					if(video.currentTime > 0) {
						W('.video-player .bt-play').show();
					}
				} else {
					W('.bt-action .play-control div').set('className', 'paused');
					W('.video-player .bt-play').hide();
				}

				if(video.muted) {
					W('.bt-action .mute-control div').set('className', 'vol-0');
				} else {
					if(video.volume < .05 ) {
						W('.bt-action .mute-control div').set('className', 'vol-0');
					} else if(video.volume < .4) {
						W('.bt-action .mute-control div').set('className', 'vol-1');
					} else if(video.volume < .8) {
						W('.bt-action .mute-control div').set('className', 'vol-2');
					} else {
						W('.bt-action .mute-control div').set('className', 'vol-3');
					}
				}

				W('.bt-action .volume-control .curr').css('width', video.volume * 100 + '%');
			});

			this.on('play', function(e) {
				if(video.paused) {
					video.play();
				}
			});

			this.on('pause', function(e) {
				if(!video.paused) {
					video.pause();
				}
			});

			this.on('toggle', function(e) {
				video.paused ? video.play() : video.pause();
			});

			this.on('mute', function(e) {
				var needMute;

				if(typeof e.data !== 'undefined') {
					needMute = parseInt(e.data) == 1;
				} else {
					needMute = !video.muted;
				}

				if(needMute != video.muted) {
					if( needMute ) {
						video.last_volume = video.volume;
						video.volume = 0;
					} else {
						if(typeof video.last_volume !== 'undefined') {
							video.volume = video.last_volume;
						}
					}
					
					video.muted = needMute;
				}
			});

			this.on('v_down', function(e) {
				if(video.muted) {
					video.muted = false;
					video.volume = video.last_volume;
				}

	            var volume = video.volume,
	            	step = e.data ? e.data : .1,
	                newVolume = volume - step;
	            if(newVolume < 0) newVolume = 0;
	            video.volume = newVolume;
			});

			this.on('v_up', function(e) {
				if(video.muted) {
					video.muted = false;
					video.volume = video.last_volume;
				}
				
				var volume = video.volume,
	            	step = e.data ? e.data : .1,
	                newVolume = volume + step;

	            if(newVolume > 1) newVolume = 1;
	            video.volume = newVolume;
			});

			this.on('volume', function(e) {
				if(video.muted) {
					video.muted = false;
					video.volume = video.last_volume;
				}

				video.muted = false;
				
				var volume = e.data;
				volume = Math.max(0, Math.min(1, volume));
				video.volume = volume;
			});

			this.on('progress', function(e) {
				if(video.readyState == 0) {
					return false;
				}

				var progress = e.data;
				progress = Math.max(0, Math.min(1, progress));

				video.currentTime = progress * video.duration;
			});
		},
		_initEvent : function() {
			var me = this;
			W('.video-player').delegate('.play-control, .bt-play', 'click', function(e) {
				e.preventDefault();
				me.fire('toggle');
			}).delegate('.mute-control', 'click', function(e) {
				e.preventDefault();
				me.fire('mute');
			}).delegate('.volume-control', 'click', function(e) {
				e.preventDefault();
				var el = W(this),
					rect = el.getRect();
				var per = (e.pageX - rect.left) / 200;
				me.fire('volume', {data:per});
			}).delegate('.progress', 'click', function(e) {
				e.preventDefault();
				var el = W(this),
					rect = el.getRect();
				var per = (e.pageX - rect.left) / 970;
				me.fire('progress', {data:per});
			});

			this.video.addEventListener('timeupdate', function() {
				var progress = this.currentTime / this.duration;

				progress = Math.max(0, Math.min(1, progress));

				this.progress = progress;

				W('.time-control .total').html(this.duration.format());
				W('.time-control .curr').html(this.currentTime.format());

				W('.progress .curr').css('width', 100 * progress + '%');
	        });
		}
	}
})();
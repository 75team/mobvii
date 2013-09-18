function PlayList() {
	this._init.apply(this, arguments);
};

PlayList.prototype = (function() {
	return {
		_init : function(data, player) {
			CustEvent.createEvents(this);

			var html = [];
			data.forEach(function(item, i) {
				html.push('<li data-index="',i,'"><a href="#"><img src="'+item[0]+'" /></a></li>');
			});
			W('.video-list .list').html(html.join(''));

			this.data = data;
			this.length = this.data.length;
			this.index = 0;
			this.player = player;

			this._initControl();
			this._initEvent();
		},
		_initControl : function() {
			var me = this;
			this.on('next', function() {
				me.select(me.index + 1);
			});

			this.on('prev', function() {
				me.select(me.index - 1);
			});
		},
		_initEvent : function() {
			var me = this;
			W('.video-list .list').delegate('li', 'click', function(e) {
				e.preventDefault();
				var index = W(this).attr('data-index') | 0;

				me.select(index);
			});
		},
		select : function(index) {
			if(index < 0) index = this.length - 1;
			if(index > this.length - 1) index = 0;

			var video = this.player.video,
				src = this.data[index][1];

			W('.video-list .list li').removeClass('on').item(index).addClass('on');

			this.index = index;
			this.player.load(src);
		}
	};
})();
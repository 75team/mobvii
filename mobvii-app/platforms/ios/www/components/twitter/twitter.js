(function() {
	var els = document.getElementsByTagName('script'),
		srcPath = '';
	for (var i = 0; i < els.length; i++) {
		var src = els[i].src.split(/[\\\/]components[\\\/]/g);
		if (src[1]) {
			srcPath = src[0] + '/';
			break;
		}
	}
	document.write(
		  '<script type="text/javascript" src="'+srcPath+'components/twitter/tweet.h.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/twitter/tweet_retouch.js"></script>'
	);
}());
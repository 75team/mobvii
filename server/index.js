var Sender = require('./sender'),
	Receiver = require('./receiver');

Sender.listen(9090);
Receiver.listen(9091);

//捕获所有未捕获的异常，避免游戏退出
process.on('uncaughtException', function (err) {
	console.error(err);
});
//done

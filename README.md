## 介绍
mobvii 是一个开源的工具，可以让手持设备支持通过手势控制PC上的应用

## 如何玩？
```bash
git clone https://github.com/akira-cn/mobvii.git
cd www
python -m SimpleHTTPServer
```

PC网页访问 http://localhost:8080

手持设备上安装 android（android目录下） 或 ios 客户端（mobvii-app目录下）

先进行手势训练，之后即可以玩啦~

## 效果演示视频

http://v.youku.com/v_show/id_XNjEwNjY5NzAw.html


## 高级功能 —— 自己搭建服务器

需要 node.js

```bash
npm install ws
cd server
node index.js
```

修改 www/js/config.js

```javascript
//改为你自己的服务器的地址
var SEND_WS_URL = 'ws://ws1.androidzh.com:9090'; 
var REC_WS_URL = 'ws://ws2.androidzh.com:9091';
```

修改 app 下的 conf.js

```javascript
var CONF = {
	//socket接口地址 - 改为自己的服务器地址
	ws : 'ws://ws1.androidzh.com:9090',
	...
}
```

重新编译 app，安装到手机上

## 手势映射表 
```json
{
	"r_slash" : "playlist.next",
	"r_slash2" : "playlist.next",
	"r_slash3" : "playlist.next",
	"slash" : "playlist.prev",
	"slash2" : "playlist.prev",
	"slash3" : "playlist.prev",
	"swing" : "player.toggle",
	"swing2" : "player.toggle",
	"swing3" : "player.toggle",
	"circle" : "player.unknown",
	"device_hr" : "player.hr",
	"device_down" : "player.pause",
	"device_font" : "player.play",
	"vertical_u" : "player.mute|1",
	"vertical_d" : "player.mute|0",
	"tilt_left" : "player.v_down",
	"tilt_right" : "player.v_up",
	"unknown" : "player.unknown",
	"up" : "player.up"
}
```

# 播放器参数说明 

https://github.com/akira-cn/mobvii/wiki/player_cmd

# 开发团队

(qgy18)[https://github.com/qgy18]
(ivershuo)[https://github.com/ivershuo]
(greengnn)[https://github.com/greengnn]
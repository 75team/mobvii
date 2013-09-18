## 介绍
mobvii 是一个开源的工具，可以让手持设备支持通过手势控制PC上的应用

## 如何玩？
```bash
git clone 
cd www
python -m SimpleHTTPServer
```

PC网页访问 http://localhost:8080

手持设备上安装 android（android目录下） 或 ios 客户端（mobvii-app目录下）

先进行手势训练，之后即可以玩啦~

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
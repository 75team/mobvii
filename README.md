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

== 手势映射表 ==
```json
{
	'r_slash' : 'playlist.next',
	'r_slash2' : 'playlist.next',
	'r_slash3' : 'playlist.next',
	'slash' : 'playlist.prev',
	'slash2' : 'playlist.prev',
	'slash3' : 'playlist.prev',
	'swing' : 'player.toggle',
	'swing2' : 'player.toggle',
	'swing3' : 'player.toggle',
	'circle' : 'player.unknown',
	'device_hr' : 'player.hr',
	'device_down' : 'player.pause',
	'device_font' : 'player.play',
	'vertical_u' : 'player.mute|1',
	'vertical_d' : 'player.mute|0',
	'tilt_left' : 'player.v_down',
	'tilt_right' : 'player.v_up',
	'unknown' : 'player.unknown',
	'up' : 'player.up'
}
```

== 播放器参数 ==

|=指令 |=参数 |=说明 |=示例 |
|player.play |- |播放|{{{player.play}}}|
|player.pause|-|暂停|{{{player.pause}}}|
|player.toggle|-|播放/暂停|{{{player.toggle}}}|
|player.v_down|step，百分比小数，可选，默认0.1|声音调小step|{{{player.v_down|0.5}}}|
|player.v_up|step，百分比小数，可选，默认0.1|声音调大step|{{{player.v_up|0.5}}}|
|player.volume|val，百分比小数|声音调至val|{{{player.volume|0.5}}}|
|player.mute|flag，1表示静音，0表示取消静音，可选，不传表示toggle音量|设置静音|{{{player.mute|1}}}|
|player.progress|val，百分比小数|视频进度调至val|{{{player.progress|0.5}}}|
|playlist.next|-|下一个视频|{{{playlist.next}}}|
|playlist.prev|-|上一个视频|{{{playlist.prev}}}|
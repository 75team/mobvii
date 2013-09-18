/*相关配置*/
var CONF = {
	//socket接口地址
	ws : 'ws://ws1.androidzh.com:9090',
	//默认采样频率，单位ms
	frequency : 40,
	//信号发送最小间隔时间，单位毫秒
	itvTime : 300,
	//设备动作对应指令
	cmdMap : {
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
	},
	//不重复发送的动作
	cmdSingular : [
		'player.pause',
		'player.play',
		'player.hr',
		'player.mute|1',
		'player.mute|0'
	]
};
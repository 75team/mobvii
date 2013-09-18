/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       //app.receivedEvent('deviceready');

        //运行环境检测
        var PageCheck = {
            //检测是否有网络
            network : function(){
                return navigator.network.connection.type == Connection.UNKNOWN || navigator.network.connection.type == Connection.NONE ? '请连接上网络' : true;
            },
            //检测所有
            all : function(){
                var retMsg = [],
                    flag = 0;

                for(var i in this){
                    if('all' != i){
                        retMsg.push(this.network());
                    }
                };                          

                retMsg.forEach(function(i, index){
                    if(true === i){
                        retMsg[index] = '';
                        flag++;
                    }
                });
                return flag == retMsg.length ? true : retMsg.join("\n").replace(/\n+/g, "\n");
            }
        };

        var check = PageCheck.all();
        //不满足运行条件则报提示信息 & 返回
        if(check !== true){
            alert(check);
            return;
        }

        //心电图
        function ecgshow(){
            //心电图曲线
            var ecgEl = g('ecg');
                ecgEl.width = ecgEl.width;
                ecg = ecgEl.getContext('2d');
                ecg.moveTo(0, 150);
                ecg.strokeStyle = '#ccc';
            var e = 0,
                x = 0;
            ecgt = setInterval(function(){
                ecg.lineTo(x += 20, 150 + this.sensorxyz.x * 5);
                ecg.stroke();
                if(x == 320){
                    clearInterval(ecgt);
                    ecgshow();
                }
            }, 80);
        }

        //建立socket连接
        conn = new MyWebSocket(CONF.ws);
        conn.on('open', function() {
            W('#mask').hide();
            W('#ret').html('连接成功。');
            //启动传感器监测
            SensorMonitor.start();
            ecgshow();

            conn.send('device.connet');
        });

        conn.on('close', function() {
            W('#mask').show();
            clearInterval(ecgt);
            setTimeout(function() {
                conn.connect();
            }, 1000);
        });
        conn.connect();

        //监听指令，发送到socket服务器
        W(document).receive("command_sent", function(evt){
            var data = evt.data;
            W('#ret').html(data + (new Date).getTime());
            conn.send(data);
        });

        //跳转
        W('.goc').click(function(e){
            e.preventDefault();
            var _showc =this.dataset.go;
            W('.c').removeClass('selected');
            W('#' + _showc).addClass('selected');
            //手势控制启用、暂停
            switch(_showc){
                case 'xl':
                    SensorMonitor.start();
                    W(document).tweet("xlstart");
                    break;
                case 'ykq' :
                    SensorMonitor.stop();
                    break;
                case 'ss' :
                    SensorMonitor.isUserSetup = false;
                    SensorMonitor.start();
                    break;
            }
        });

        //遥控器
        W('.ykq-btn').click(function(e){
            e.preventDefault();
            W(document).tweet("command_sent", this.dataset.action);
        });

        (function() {
            var id = null;
            W('#p7, #p9').on('touchstart', function(e) {
                var me = this;
                if(id) { 
                    clearInterval(id); 
                    id = null; 
                }
                id = setInterval(function() {
                    W(document).tweet("command_sent", me.dataset.action);
                }, 500);
            }).on('touchend', function(e) {
                if(id) { 
                    clearInterval(id); 
                    id = null; 
                }
            });
        })();
    }
};

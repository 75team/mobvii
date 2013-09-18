package com.weizoo.cordovatest;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.support.v4.app.NavUtils;

import org.apache.cordova.*;

import com.strumsoft.websocket.phonegap.WebSocketFactory;

public class MainActivity extends DroidGap {
	
	//private SensorManager sensorManager;
	//private Sensor sensor;
	//private SensorEventListener sensorListener;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
        
        /*Context context = getApplicationContext();
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE); 
        sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);  

        sensorListener = new SensorEventListener() {  
			@Override
			public void onSensorChanged(SensorEvent event) {
				// TODO Auto-generated method stub
                float x = event.values[0];  
                float y = event.values[1];  
                float z = event.values[2];
                if(x > 5 || x < -5){
                	Log.d("Acc",Float.toString(x)+","+Float.toString(y)+","+Float.toString(z));
                }
			}
			@Override
			public void onAccuracyChanged(Sensor sensor, int accuracy) {
				// TODO Auto-generated method stub
				
			}  S
        };  
        
        sensorManager.registerListener(sensorListener, sensor, SensorManager.SENSOR_DELAY_GAME);*/
        
        super.loadUrl("file:///android_asset/www/index.html");
        // attach websocket factory
        appView.addJavascriptInterface(new WebSocketFactory(appView), "WebSocketFactory");        
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }

    
}

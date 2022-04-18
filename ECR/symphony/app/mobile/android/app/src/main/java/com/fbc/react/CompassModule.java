/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.react;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@ReactModule(name = CompassModule.TAG)
public class CompassModule extends ReactContextBaseJavaModule implements SensorEventListener {
  static final String TAG = "CompassModule";
  static final String EMIT_NAME = "HeadingUpdated";
  private final ReactApplicationContext reactContext;
  private static Context context;

  private int azimuth = 0; // degree
  private int updateThreshold = 1;

  private SensorManager sensorManager;
  private Sensor accelerometerSensor;
  private Sensor magneticSensor;

  private float[] gravity = new float[3];
  private float[] geomagnetic = new float[3];
  private float[] rotationMatrix = new float[9];
  private float[] inclinationMatrix = new float[9];

  CompassModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    context = reactContext.getApplicationContext();
  }

  @Override
  public String getName() {
    return TAG;
  }

  @ReactMethod
  public void start(int updateThreshold) {
    sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
    accelerometerSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
    magneticSensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
    sensorManager.registerListener(this, accelerometerSensor, SensorManager.SENSOR_DELAY_GAME);
    sensorManager.registerListener(this, magneticSensor, SensorManager.SENSOR_DELAY_GAME);
    this.updateThreshold = updateThreshold;
  }

  @ReactMethod
  public void stop() {
    if (sensorManager != null) {
      sensorManager.unregisterListener(this);
    }
  }

  @Override
  public void onSensorChanged(SensorEvent event) {
    // alpha value and algorithm derived from
    // https://developer.android.com/reference/kotlin/android/hardware/SensorEvent
    final float alpha = 0.97f;
    synchronized (this) {
      if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
        gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0];
        gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1];
        gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2];
      }
      if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
        geomagnetic[0] = alpha * geomagnetic[0] + (1 - alpha) * event.values[0];
        geomagnetic[1] = alpha * geomagnetic[1] + (1 - alpha) * event.values[1];
        geomagnetic[2] = alpha * geomagnetic[2] + (1 - alpha) * event.values[2];
      }
      // factor in devices orientation when computing azimuth
      boolean success =
          SensorManager.getRotationMatrix(rotationMatrix, inclinationMatrix, gravity, geomagnetic);
      if (success) {
        float orientation[] = new float[3];
        SensorManager.getOrientation(rotationMatrix, orientation);

        int newAzimuth = (int) Math.toDegrees(orientation[0]);
        newAzimuth = (newAzimuth + 360) % 360;

        // dont react to changes smaller than the threshold value
        // this reduces an excessive amount of updates
        if (Math.abs(azimuth - newAzimuth) > updateThreshold) {
          azimuth = newAzimuth;
          getReactApplicationContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit(EMIT_NAME, azimuth);
        }
      }
    }
  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}

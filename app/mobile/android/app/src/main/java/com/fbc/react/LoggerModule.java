/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.react;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import javax.annotation.Nullable;

@ReactModule(name = LoggerModule.TAG)
public class LoggerModule extends ReactContextBaseJavaModule {
  static final String TAG = "LoggerModule";

  // These string literals must match the flow types and static function names
  // in UserActionLogger.js
  static final String KEY = "key";

  static final String LOG_EVENT = "logEvent";
  static final String LOG_MESSAGE = "logMessage";

  static final String LOG_METRIC = "logMetric";
  static final String METRIC = "metric";

  static final String LOG_ERROR = "logError";
  static final String ERROR_MESSAGE = "errorMessage";

  private ReactApplicationContext reactContext;

  LoggerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return TAG;
  }

  public void logMetric(String key, int metric) {
    WritableMap params = Arguments.createMap();
    params.putString(KEY, key);
    params.putInt(METRIC, metric);
    sendEvent(LOG_METRIC, params);
  }

  public void logError(String key, String errorMessage) {
    WritableMap params = Arguments.createMap();
    params.putString(KEY, key);
    params.putString(ERROR_MESSAGE, errorMessage);
    sendEvent(LOG_ERROR, params);
  }

  public void logEvent(String key, String logMessage) {
    WritableMap params = Arguments.createMap();
    params.putString(KEY, key);
    params.putString(LOG_MESSAGE, logMessage);
    sendEvent(LOG_EVENT, params);
  }

  public void sendEvent(String eventName, @Nullable WritableMap params) {
    this.reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }
}

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.fbc.react;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNPlatformPackage extends TurboReactPackage {
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    switch (name) {
      case LoggerModule.TAG:
        return new LoggerModule(reactContext);
      case CompassModule.TAG:
        return new CompassModule(reactContext);
      default:
        return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    List<Class<? extends NativeModule>> classes =
        new ArrayList<>(Arrays.asList(LoggerModule.class, CompassModule.class));

    final Map<String, ReactModuleInfo> reactModuleInfoMap = new HashMap<>();
    for (Class<? extends NativeModule> moduleClass : classes) {
      ReactModule module = moduleClass.getAnnotation(ReactModule.class);
      if (module == null) {
        continue;
      }
      reactModuleInfoMap.put(
          module.name(),
          new ReactModuleInfo(
              module.name(),
              moduleClass.getName(),
              module.canOverrideExistingModule(),
              module.needsEagerInit(),
              module.hasConstants(),
              module.isCxxModule(),
              false));
    }

    return () -> reactModuleInfoMap;
  }
}

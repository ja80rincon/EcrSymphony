/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import * as TurboModuleRegistry from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';

export interface Spec extends TurboModule {
  logMetric: (key: string, metric: number) => void;
  logError: (key: string, errorMessage: string) => void;
  logEvent: (key: string, logMessage: string) => void;
  sendEvent: (eventName: string, params: Object) => void;
  addListener: () => void;
  removeListeners: () => void;
}

export default TurboModuleRegistry.get<Spec>('LoggerModule');

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
  getString: (hashKey: string) => string;
}

export default (TurboModuleRegistry.get<Spec>('FbtModule'): ?Spec);

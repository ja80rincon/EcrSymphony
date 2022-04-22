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

import NativeFbtModule from './NativeFbtModule';

const _translationsDictionary: {[hashKey: string]: ?string} = {};

export default class FbtI18nNativeAssets {
  static getString = (hashKey: string): ?string => {
    let translatedPayload;
    if (hashKey in _translationsDictionary) {
      translatedPayload = _translationsDictionary[hashKey];
    } else {
      if (__DEV__ && !global.nativeExtensions && !global.nativeCallSyncHook) {
        // Chrome debugger does not support synchronous native method.
        // Thus do not use getString in Chrome debugger.
        // **Translations will not work while debugging**
        translatedPayload = null;
      } else if (NativeFbtModule != null) {
        translatedPayload = NativeFbtModule.getString(hashKey);
      }
      _translationsDictionary[hashKey] = translatedPayload;
    }

    return translatedPayload;
  };
}

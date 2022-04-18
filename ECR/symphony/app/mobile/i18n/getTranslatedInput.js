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

import type {FbtRuntimeCallInput, FbtTranslatedInput} from 'fbt/lib/FbtHooks';

import FbtI18nNativeAssets from './FbtI18nNativeAssets';

function getTranslatedInput(input: FbtRuntimeCallInput): ?FbtTranslatedInput {
  const {options} = input;
  if (options?.hk != null) {
    const translatedPayload = FbtI18nNativeAssets.getString(options.hk);
    if (translatedPayload) {
      return {table: JSON.parse(translatedPayload), args: input.args};
    }
  }
  return null;
}

export {getTranslatedInput};

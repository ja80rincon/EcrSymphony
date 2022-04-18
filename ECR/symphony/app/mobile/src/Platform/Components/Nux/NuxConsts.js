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

export const NUX_NAMES = Object.freeze({
  DUPLICATE_CHECKLIST: 'duplicate_checklist',
});

export type NuxName = $Values<typeof NUX_NAMES>;

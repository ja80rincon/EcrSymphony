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

export const CheckInStatuses = Object.freeze({
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
});

export type CheckInStatus = null | $Values<typeof CheckInStatuses>;

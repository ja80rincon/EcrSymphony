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

export type MutationCallbacks<R> = ?{
  onCompleted?: (response: R) => void,
  onError?: ?(error: Error) => void,
};

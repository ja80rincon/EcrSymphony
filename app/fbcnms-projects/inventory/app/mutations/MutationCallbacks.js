/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local strict-local
 * @format
 */

'use strict';
import type {PayloadError} from 'relay-runtime';

export type MutationCallbacks<R> = ?{
  onCompleted?: (response: R, errors: ?Array<PayloadError>) => void,
  onError?: ?(error: Error) => void,
};

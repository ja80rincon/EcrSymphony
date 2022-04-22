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

import type {OfflineRecordCache} from '@wora/offline-first';
import type {OperationDescriptor} from 'relay-runtime';

export type RelayEnvironmentSubscriber = {
  onComplete: (options: {
    id: string,
    offlinePayload: OfflineRecordCache<{|
      operation: OperationDescriptor,
    |}>,
    snapshot: any,
    response: any,
  }) => Promise<void>,
};

class RelayEnvSubscriptionHandler {
  static _subscribers: Array<RelayEnvironmentSubscriber> = [];

  static addSubscriber(envSubscriber: RelayEnvironmentSubscriber) {
    RelayEnvSubscriptionHandler._subscribers.push(envSubscriber);
  }

  static getSubscribers(): Array<RelayEnvironmentSubscriber> {
    return RelayEnvSubscriptionHandler._subscribers;
  }
}

export default RelayEnvSubscriptionHandler;

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

import type {MiddlewareNextFn} from 'react-relay-network-modern/es/definition';
import type {OfflineRecordCache} from '@wora/offline-first';
import type {OperationDescriptor} from 'relay-runtime';

import * as Constants from 'Platform/Consts/Constants';
import LocalStorage from 'Platform/Services/LocalStorage';
import RelayEnvSubscriptionHandler from 'Platform/Relay/RelayEnvSubscriptionHandler';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import VersionNumber from 'react-native-version-number';
import {Environment, RecordSource, Store} from 'react-relay-offline';
import {METRIC} from 'Platform/Consts/UserActionEvents';
import {
  RelayNetworkLayer,
  errorMiddleware,
  loggerMiddleware,
  perfMiddleware,
} from 'react-relay-network-modern/es';
import {loginService} from 'Platform/Services/Login';

const QUERY_URI = '/graph/query';

export type OfflineOptions = {
  id: string,
  offlinePayload: OfflineRecordCache<{|
    operation: OperationDescriptor,
  |}>,
  snapshot: any,
  response: any,
};

const network: RelayNetworkLayer = new RelayNetworkLayer([
  // TODO log errors using UserActionLogger.logError()
  errorMiddleware(),
  __DEV__ ? loggerMiddleware() : null,
  perfMiddleware({
    logger: (message, req, res) => {
      const operationKind = req.operation.operationKind || ''; // 'query' or 'mutation'
      const queryName = req.operation.name || '';
      const correlationId = res.headers.map['x-correlation-id'] || '';

      // extract the query time from the perfMiddleware message
      const metric = message.substring(
        message.indexOf('[') + 1,
        message.indexOf('ms]'),
      );

      UserActionLogger.logQuery({
        key: METRIC.GRAPHQL_QUERY_RESPONSE_MS,
        metric,
        operationKind,
        queryName,
        correlationId,
      });
    },
  }),
  // Custom Middleware to configure the url and request headers
  // $FlowFixMe - T72031710
  (next: MiddlewareNextFn) => async req => {
    const tenant = await LocalStorage.getTenant();
    if (tenant === null) {
      Promise.reject('Not logged in');
    }
    const host = Constants.getHost(tenant || '');
    const base_url = `https://${host}`;
    req.fetchOpts.url = base_url + QUERY_URI;
    req.fetchOpts.mode = 'cors';
    req.fetchOpts.credentials = 'include';
    req.fetchOpts.headers[
      'User-Agent'
    ] = `symphony-mobile/${VersionNumber.appVersion ?? ''}`;
    const access_token = await loginService.getAccessToken(tenant);
    if (access_token) {
      req.fetchOpts.headers['Authorization'] = 'Bearer ' + access_token;
    }
    return next(req);
  },
]);

const RelayEnvironment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

RelayEnvironment.setOfflineOptions({
  manualExecution: false, //optional
  network, //optional
  start: async mutations => {
    return mutations;
  },
  finish: async (_mutations, _error) => {},
  onExecute: async mutation => {
    return mutation;
  },
  onComplete: async (options: OfflineOptions): Promise<boolean> => {
    await Promise.all(
      RelayEnvSubscriptionHandler.getSubscribers().map(subscriber => {
        return subscriber.onComplete(options);
      }),
    );
    return true;
  },
  onDiscard: async _options => {
    return true;
  },
  onPublish: async offlinePayload => {
    return offlinePayload;
  },
});

export default RelayEnvironment;

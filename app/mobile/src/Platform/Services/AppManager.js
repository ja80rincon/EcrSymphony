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

import type {
  BugData,
  ErrorData,
  EventData,
  MetricData,
} from '@fbcmobile/ui/Logging/UserActionLogger';

import LocalStorage from 'Platform/Services/LocalStorage';
import LoggerModule from 'Platform/Modules/LoggerModule';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RelayEnvSubscriptionHandler from 'Platform/Relay/RelayEnvSubscriptionHandler';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import env from 'react-native-config';
import {LOG_URI, getHost} from 'Platform/Consts/Constants';
import {NativeEventEmitter} from 'react-native';
import {WorkOrderCheckOutEnvSubscriber} from 'Platform/Relay/Mutations/WorkOrderUploadHelper';

class AppManager {
  static initApp() {
    MapboxGL.setAccessToken(env.MAPBOX_TOKEN);

    RelayEnvSubscriptionHandler.addSubscriber(WorkOrderCheckOutEnvSubscriber);

    return UserActionLogger.getInstance()
      .init()
      .then(() => {
        AppManager.setupNativeLogger();
      });
  }

  static setupNativeLogger() {
    // Listen to events that are logged by Native Modules
    const eventEmitter = new NativeEventEmitter(LoggerModule);

    // Log Events
    eventEmitter.addListener('logEvent', (event: EventData) => {
      UserActionLogger.logEvent({
        key: event.key,
        logMessage: event.logMessage,
      });
    });

    // Error Events
    eventEmitter.addListener('logError', (event: ErrorData) => {
      UserActionLogger.logError({
        key: event.key,
        errorMessage: event.errorMessage,
      });
    });

    // Metric Events
    eventEmitter.addListener('logMetric', (event: MetricData) => {
      UserActionLogger.logMetric({
        key: event.key,
        metric: event.metric,
      });
    });

    // Bug Report Events
    eventEmitter.addListener('logBug', (event: BugData) => {
      UserActionLogger.logBug({
        key: event.key,
        details: event.details,
        screenShot: event.screenShot,
      });
    });
  }

  static setupUserActionLogger() {
    LocalStorage.getAuthParams().then(authParams => {
      const loggerHost = getHost(authParams.tenant || '');
      const baseUrl = 'https://' + loggerHost + LOG_URI;

      const fetchParams = {
        method: 'POST',
        headers: {
          accept: '*/*',
          origin: baseUrl,
          host: loggerHost,
          'x-auth-organization': authParams.tenant,
          'cache-control': 'max-age=0',
          'content-type': 'application/json;charset=UTF-8',
          'upgrade-insecure-requests': '1',
          'x-csrf-token': authParams.token,
        },
        credentials: 'include',
      };

      UserActionLogger.getInstance().setFetchParams(fetchParams);
      UserActionLogger.getInstance().setBaseUrl(baseUrl);
      UserActionLogger.getInstance().setCustomPayload({
        email: authParams.email ? authParams.email.toLowerCase() : '',
        tenant: authParams.tenant ? authParams.tenant.toLowerCase() : '',
      });
    });
  }
}

export default AppManager;

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

/* eslint-disable import/no-relative-parent-imports */

global.fetch = require('node-fetch');

jest.mock('node-fetch');
jest.mock('@fbcmobile/ui/Logging/UserActionLogger');
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
}));
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

import LocalStorage from 'Platform/Services/LocalStorage';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fetch from 'node-fetch';
import {EVENT, METRIC} from 'Platform/Consts/UserActionEvents';
import {loginService} from '../Login';

const authParams = {
  tenant: 'fb-test',
  email: 'fb-test@fb.com',
  password: 'password',
};

const fetch200Params = {
  method: 'GET',
  headers: {
    accept: 'text/html',
    origin: 'https://fb-test.thesymphony.cloud',
    host: 'fb-test.thesymphony.cloud',
    'x-auth-organization': 'fb-test',
    'cache-control': 'max-age=0',
    'content-type': '',
    'upgrade-insecure-requests': '1',
  },
  credentials: 'include',
};
const fetch200RawResponse =
  '{"type":"default","status":200,"ok":true,"headers":{"map":{"strict-transport-security":"max-age=15552000; includeSubDomains","content-type":"text/html; charset=utf-8","x-dns-prefetch-control":"off","x-download-options":"noopen","vary":"Accept-Encoding, Accept-Encoding","etag":"W/\\"365-sjrg8HKBDU/148y/+RkfNYC3LSA\\"","server":"nginx/1.17.8","x-frame-options":"SAMEORIGIN","x-content-type-options":"nosniff","date":"Fri, 03 Apr 2020 17:02:44 GMT","x-xss-protection":"1; mode=block"}},"url":"https://fb-test.thesymphony.cloud/user/login","_bodyInit":{"_data":{"size":869,"offset":0,"blobId":"d61f9c29-5651-4628-858e-3720e0c3114f","__collector":{}}},"_bodyBlob":{"_data":{"size":869,"offset":0,"blobId":"d61f9c29-5651-4628-858e-3720e0c3114f","__collector":{}}}}';
const fetch200Response = {
  json: fetch200RawResponse,
  text: () => {
    return '<!-- Copyright 2004-present Facebook. All Rights Reserved.--><!DOCTYPE html><html><head><title>Connectivity Platform</title><meta charset="utf-8"><meta http-equiv="x-ua-compatible" content="ie=edge"><meta name="description" content="Purple Headband"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="shortcut icon" type="image/png" href="/inventory/static/images/favicon.png"><script src="/inventory/static/dist/vendor.80b96c34bd3fe2a434e5.js"></script><script>var CONFIG = {"appData":{"csrfToken":"eWuuGxOD-0Ny7aXZJJYz1hMhX2kmWh4cTiCM","ssoEnabled":false,"ssoSelectedType":"none","csvCharset":null,"enabledFeatures":[],"tabs":[],"user":{"tenant":"","email":"","isSuperUser":false,"isReadOnlyUser":false}}};</script></head><body><div id="root"></div><script src="/inventory/static/dist/login.bf44fb7d9d64c2bc831a.js"></script></body></html>';
  },
};

const login200Params = {
  method: 'POST',
  headers: {
    accept: 'text/html',
    origin: 'https://fb-test.thesymphony.cloud',
    host: 'fb-test.thesymphony.cloud',
    'x-auth-organization': 'fb-test',
    'cache-control': 'max-age=0',
    'content-type': 'application/json',
    'upgrade-insecure-requests': '1',
  },
  credentials: 'include',
  body:
    '{"_csrf":"eWuuGxOD-0Ny7aXZJJYz1hMhX2kmWh4cTiCM","email":"fb-test@fb.com","password":"password"}',
};
const loginWithToken200Response = {
  type: 'default',
  status: 200,
  ok: true,
  headers: {
    map: {
      'strict-transport-security': 'max-age=15552000; includeSubDomains',
      'content-type': 'text/html; charset=utf-8',
      'x-dns-prefetch-control': 'off',
      'x-download-options': 'noopen',
      vary: 'Accept-Encoding',
      etag: 'W/"55f-Z9o+FiIX13kSDeNgHHPtBOFL3sY"',
      server: 'nginx/1.17.8',
      'x-frame-options': 'SAMEORIGIN',
      'x-content-type-options': 'nosniff',
      date: 'Fri, 03 Apr 2020 21:08:06 GMT',
      'x-xss-protection': '1; mode=block',
    },
  },
  url: 'https://fb-test.thesymphony.cloud/inventory',
  _bodyInit: {
    _data: {
      size: 1375,
      offset: 0,
      blobId: 'd70fd653-ab16-48b1-b618-061778072d33',
      __collector: {},
    },
  },
  _bodyBlob: {
    _data: {
      size: 1375,
      offset: 0,
      blobId: 'd70fd653-ab16-48b1-b618-061778072d33',
      __collector: {},
    },
  },
};

const loginWithToken400Response = {
  type: 'default',
  status: 400,
  ok: false,
  headers: {
    map: {
      'strict-transport-security': 'max-age=15552000; includeSubDomains',
      'content-type': 'text/html; charset=utf-8',
      'x-dns-prefetch-control': 'off',
      'x-download-options': 'noopen',
      vary: 'Accept-Encoding',
      etag: 'W/"55f-Z9o+FiIX13kSDeNgHHPtBOFL3sY"',
      server: 'nginx/1.17.8',
      'x-frame-options': 'SAMEORIGIN',
      'x-content-type-options': 'nosniff',
      date: 'Fri, 03 Apr 2020 21:08:06 GMT',
      'x-xss-protection': '1; mode=block',
    },
  },
  url: 'https://fb-test.thesymphony.cloud/inventory',
  _bodyInit: {
    _data: {
      size: 1375,
      offset: 0,
      blobId: 'd70fd653-ab16-48b1-b618-061778072d33',
      __collector: {},
    },
  },
  _bodyBlob: {
    _data: {
      size: 1375,
      offset: 0,
      blobId: 'd70fd653-ab16-48b1-b618-061778072d33',
      __collector: {},
    },
  },
};

describe('Platform login service test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Returns true on successful login', async () => {
    fetch
      .mockImplementationOnce(() => fetch200Response)
      .mockImplementationOnce(() => loginWithToken200Response);

    const result = await loginService.login(authParams);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://fb-test.thesymphony.cloud/user/login',
      fetch200Params,
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      'https://fb-test.thesymphony.cloud/user/login',
      login200Params,
    );
    expect(result).toEqual(true);
  });

  it('Logs if successful login', async () => {
    fetch
      .mockImplementationOnce(() => fetch200Response)
      .mockImplementationOnce(() => loginWithToken200Response);

    const startTime = Date.now();
    const result = await loginService.login(authParams);
    const time = Date.now() - startTime;

    expect(result).toEqual(true);

    expect(UserActionLogger.logMetric).toHaveBeenCalled();
    expect(UserActionLogger.logMetric.mock.calls[0][0]['key']).toBe(
      METRIC.LOGIN_SUCCESS_MS,
    );
    expect(UserActionLogger.logMetric.mock.calls[0][0]['metric']).toBeWithin(
      0,
      time + 1, // end is exclusive
    );
  });

  it('Stores tenant, token and email to LocalStorage if successful login', async () => {
    fetch
      .mockImplementationOnce(() => fetch200Response)
      .mockImplementationOnce(() => loginWithToken200Response);

    const result = await loginService.login(authParams);

    expect(result).toEqual(true);

    const storedParams = await LocalStorage.getAuthParams();
    expect(storedParams.tenant).toEqual(authParams.tenant);
    expect(storedParams.email).toEqual(authParams.email);
    expect(storedParams.token).toEqual('eWuuGxOD-0Ny7aXZJJYz1hMhX2kmWh4cTiCM');
  });

  it('Logs and returns false if unsuccessful login', async () => {
    fetch
      .mockImplementationOnce(() => fetch200Response)
      .mockImplementationOnce(() => loginWithToken400Response);

    const result = await loginService.login(authParams);

    expect(result).toEqual(false);

    expect(UserActionLogger.logEvent).toHaveBeenCalledWith({
      key: EVENT.FAILED_LOGIN,
    });
  });
});

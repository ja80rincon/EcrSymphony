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

import type {SharedWebCredentials} from 'react-native-keychain';

import * as Constants from 'Platform/Consts/Constants';
import * as querystring from 'query-string';
import Keychain from 'react-native-keychain';
import LocalStorage from 'Platform/Services/LocalStorage';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import {ERROR, EVENT, METRIC} from 'Platform/Consts/UserActionEvents';

export type CredsParams = {
  tenant: string,
  email: string,
  password: string,
};

type FetchParams = {
  host: string,
  baseUrl: string,
  params: {
    method: string,
    headers: {
      origin: string,
      host: string,
      accept: string,
    },
    credentials: string,
    body?: ?string,
  },
};

type Tokens = {
  access_token: string,
  refresh_token: string,
  expires_in: number,
  refresh_expires_in: number,
};

type KCTokens = {
  access_token: string,
  refresh_token: string,
  access_expiration_in_ms: string,
  refresh_expiration_in_ms: string,
};

const LOGOUT_URI = '/user/logout';
const LOGIN_URI = '/user/login';
const AUTHCONFIG_URI = '/authconfig';
const AUTHCONFIG_TIMEOUT_MS = 30 * 1000; // 30 seconds
export const KC_AUTH_URI = 'https://auth.thesymphony.cloud/auth';
export const CLIENT_ID = 'symphony-mobile-app';
let access_token, access_expiration_in_ms;

function _getFetchParams(method: string, tenant: string): FetchParams {
  const host = Constants.getHost(tenant);
  const baseUrl = 'https://' + host;

  return {
    host: host,
    baseUrl: baseUrl,
    params: {
      method: method,
      headers: {
        accept: 'text/html',
        origin: baseUrl,
        host: host,
        'x-auth-organization': tenant,
        'cache-control': 'max-age=0',
        'content-type': method === 'POST' ? 'application/json' : '',
        'upgrade-insecure-requests': '1',
      },
      credentials: 'include',
    },
  };
}

async function loggedIn(): Promise<?string> {
  const authParams = await LocalStorage.getAuthParams();
  if (!authParams.token || !authParams.tenant) {
    return null;
  }
  const fetchParams = _getFetchParams('GET', authParams.tenant);
  // Fetch the baseUrl to see if we get redirected to the login page
  try {
    const response = await fetch(fetchParams.baseUrl, fetchParams.params);
    if (response.url && response.url.includes(LOGIN_URI)) {
      // Clear the token since it must now be invalid
      await LocalStorage.unsetAuthParams(['token']);
      return null;
    }
    UserActionLogger.logEvent({
      key: EVENT.STILL_LOGGED_IN,
    });
    return authParams.tenant;
  } catch (error) {
    // If there was a network error when checking if the user is still logged in,
    // return the tenant and assume their credentials are still valid.
    // This will let the app continue to function with all cached GraphQL store data.
    UserActionLogger.logError({
      key: ERROR.ERROR_FETCH,
      errorMessage:
        'error checking if still logged in: ' +
        error.message +
        ' - ' +
        fetchParams.baseUrl +
        LOGIN_URI +
        ' - ' +
        JSON.stringify(fetchParams),
    });
    return authParams.tenant;
  }
}

// This function can be used to invalidate a user's session:
async function logout(): Promise<boolean> {
  const tenant = (await LocalStorage.getTenant()) || '';
  if (tenant === '') {
    return false;
  }
  const fetchParams = _getFetchParams('GET', tenant);
  UserActionLogger.logEvent({
    key: EVENT.SUCCESS_LOGOUT,
  });
  await UserActionLogger.flush();
  await fetch(fetchParams.baseUrl + LOGOUT_URI, fetchParams.params);
  await LocalStorage.unsetAuthParams(['token']);
  await Keychain.resetGenericPassword();
  return true;
}

async function login(creds: CredsParams): Promise<boolean> {
  const startTime = Date.now();
  await LocalStorage.setAuthParams({
    tenant: creds.tenant,
    token: null,
    email: creds.email,
    id: null,
  });
  const fetchParams = _getFetchParams('GET', creds.tenant);
  let loginResponse = null;
  // First try to fetch the login page to get the csrfToken
  try {
    loginResponse = await fetch(
      fetchParams.baseUrl + LOGIN_URI,
      fetchParams.params,
    );
  } catch (error) {
    UserActionLogger.logError({
      key: ERROR.ERROR_FETCH,
      errorMessage:
        'login error getting csrfToken:' +
        error.message +
        ' - ' +
        fetchParams.baseUrl +
        LOGIN_URI +
        ' - ' +
        JSON.stringify(fetchParams),
    });
    return false;
  }
  const responseText = await loginResponse.text();
  const csrfTokenRegex = /"csrfToken":"([a-zA-Z\d_-]+)"/;
  const match = csrfTokenRegex.exec(responseText);
  const token = match?.[1] || '';

  // Now try to login using the credentials and the csrfToken
  const loginParams = _getFetchParams('POST', creds.tenant);
  loginParams.params.body = JSON.stringify({
    _csrf: token,
    email: creds.email,
    password: creds.password,
  });
  try {
    loginResponse = await fetch(
      loginParams.baseUrl + LOGIN_URI,
      loginParams.params,
    );
  } catch (error) {
    UserActionLogger.logError({
      key: ERROR.ERROR_FETCH,
      errorMessage:
        'login error:' +
        error.message +
        ' - ' +
        fetchParams.baseUrl +
        LOGIN_URI +
        ' - ' +
        JSON.stringify(fetchParams),
    });
    return false;
  }

  if (
    !loginResponse.ok ||
    (loginResponse.url && loginResponse.url.includes(LOGIN_URI))
  ) {
    UserActionLogger.logEvent({
      key: EVENT.FAILED_LOGIN,
    });
    return false;
  }

  await LocalStorage.setAuthParams({
    tenant: creds.tenant,
    token: token,
    email: creds.email,
    id: null,
  });
  UserActionLogger.logMetric({
    key: METRIC.LOGIN_SUCCESS_MS,
    metric: Date.now() - startTime,
  });
  return loginResponse.ok;
}

async function getAuthConfig(tenant: string) {
  const fetchParams = _getFetchParams('GET', tenant);
  const controller = new AbortController();
  const _timeout = setTimeout(() => {
    controller.abort();
  }, AUTHCONFIG_TIMEOUT_MS);
  const authConfigResponse = await fetch(fetchParams.baseUrl + AUTHCONFIG_URI, {
    signal: controller.signal,
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
      UserActionLogger.logError({
        key: ERROR.ERROR_FETCH,
        errorMessage:
          'authconfig error:' +
          error.message +
          ' - ' +
          fetchParams.baseUrl +
          AUTHCONFIG_URI +
          ' - ' +
          JSON.stringify(fetchParams),
      });
      throw error;
    });
  await LocalStorage.setTenant(tenant);
  return authConfigResponse.ssoEnabled;
}

async function refreshTokens(
  tokens: KCTokens,
  tenant: ?string,
): Promise<?string> {
  if (!tenant) {
    return null;
  }
  const url = `${KC_AUTH_URI}/realms/${tenant}/protocol/openid-connect/token`;
  const access_token = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      client_id: encodeURIComponent(CLIENT_ID),
    }),
  })
    .then(response => response.json())
    .then(data => saveKCTokens(data))
    .catch(() => {
      NavigationService.alert(
        'error',
        fbt('Error', 'Error occured'),
        fbt(
          'Cannot refresh tokens. Please restart the app and try again.',
          'Error message shown when there is an error fetching new tokens',
        ),
      );
    });
  return access_token;
}

function isTokenExpired(expirationDateInMs: string) {
  const currentDate = new Date();
  return parseInt(expirationDateInMs) < currentDate.getTime();
}

async function saveKCTokens(tokens: Tokens) {
  const currentDate = new Date();
  const accessExpirationInMs = (
    currentDate.getTime() +
    tokens.expires_in * 1000
  ).toString();
  const refreshExpirationInMs = (
    currentDate.getTime() +
    tokens.refresh_expires_in * 1000
  ).toString();
  const key = 'KCtoken';
  const KCtoken = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    access_expiration_in_ms: accessExpirationInMs,
    refresh_expiration_in_ms: refreshExpirationInMs,
  };
  await Keychain.setGenericPassword(key, JSON.stringify(KCtoken));
  access_token = tokens.access_token;
  access_expiration_in_ms = accessExpirationInMs;
  return access_token;
}

async function getAccessToken(tenant: ?string): Promise<?string> {
  if (!access_token) {
    const keystore:
      | false
      | SharedWebCredentials = await Keychain.getGenericPassword();
    if (!keystore) {
      return null;
    }
    const tokens = JSON.parse(keystore.password);
    if (tokens.access_token) {
      access_token = tokens.access_token;
      access_expiration_in_ms = tokens.access_expiration_in_ms;
    }
  }
  if (access_token && isTokenExpired(access_expiration_in_ms)) {
    const keystore:
      | false
      | SharedWebCredentials = await Keychain.getGenericPassword();
    if (!keystore) {
      return null;
    }
    const tokens = JSON.parse(keystore.password);
    if (isTokenExpired(tokens.refresh_expiration_in_ms)) {
      NavigationService.alert(
        'error',
        fbt('Error', 'Error occured'),
        fbt(
          'Your session has expired. Please log in again.',
          'Error message shown when refresh token is expired',
        ),
      );
      return;
    }
    await refreshTokens(tokens, tenant);
  }
  return access_token;
}

export const loginService = {
  login,
  logout,
  loggedIn,
  getAuthConfig,
  saveKCTokens,
  getAccessToken,
  isTokenExpired,
};

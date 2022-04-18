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

export const INVENTORY_DOMAIN = 'thesymphony.cloud';
export const LOCATION_REQUEST_TIMEOUT_MS = 20 * 1000; // 20 seconds
export const LOCATION_MAXIMUM_AGE_MS = 5 * 60 * 1000; // 5 minutes
export const QUERY_TTL_MS = 5 * 1000; // 5 seconds
export const LOG_URI = '/logger/mobile';
/*
 * Utility functions that use the constants
 */

export function getDocumentUploadUrl(tenant: string): string {
  return `https://${getHost(tenant)}/store/put`;
}

export function getDocumentUrl(tenant: string, key: string): string {
  return `https://${getHost(tenant)}/store/get?key=${key}`;
}

export function getHost(tenant: string): string {
  if (tenant.includes('.')) {
    return tenant;
  }
  return tenant + '.' + INVENTORY_DOMAIN;
}

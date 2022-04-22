/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

const WORK_ORDER_INVALID_DISTANCE_METERS = 200;

export const isTechnicianActivityDistanceValid = (
  distanceMeters: ?number,
): boolean => {
  return distanceMeters == null
    ? true
    : distanceMeters < WORK_ORDER_INVALID_DISTANCE_METERS;
};

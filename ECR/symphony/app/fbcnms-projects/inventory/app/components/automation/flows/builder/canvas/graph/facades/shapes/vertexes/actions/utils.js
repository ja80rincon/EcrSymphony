/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
'use strict';

export function getActionType(actionName: string) {
  return `ActionBlock.${actionName}`;
}

export function getTriggerType(triggernName: string) {
  return `TriggerBlock.${triggernName}`;
}

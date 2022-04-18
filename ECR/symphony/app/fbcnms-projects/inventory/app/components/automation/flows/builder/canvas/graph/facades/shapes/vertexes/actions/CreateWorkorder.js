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

import CreateActionBaseClass from './CreateActionBaseClass';
import fbt from 'fbt';
import {IVertexModel, getInitObject} from '../BaseVertext';
import {getActionType} from './utils';

export const ACTION_TYPE_ID = 'work_order';
export const TYPE = getActionType(ACTION_TYPE_ID);
const FILL_COLOR = '#4856b0';

const UpdateInventoryBaseClass = CreateActionBaseClass({
  actionName: ACTION_TYPE_ID,
  fillColor: FILL_COLOR,
  svgPath: '/inventory/static/svg/BlockActionCreateWorkorder.svg',
  defaultText: `${fbt('Create Workorder', '')}`,
});

const TOTAL_SIZE = 72;
const PADDING = 5;

export default class UpdateInventory extends UpdateInventoryBaseClass
  implements IVertexModel {
  constructor(id?: string) {
    super(getInitObject(FILL_COLOR, {}, id));
    this.resize(TOTAL_SIZE, TOTAL_SIZE - 2 * PADDING);
  }
}

export function isCreateWorkorder(element: ?IVertexModel): boolean {
  if (element == null) {
    return false;
  }
  return element.attributes.type === TYPE;
}

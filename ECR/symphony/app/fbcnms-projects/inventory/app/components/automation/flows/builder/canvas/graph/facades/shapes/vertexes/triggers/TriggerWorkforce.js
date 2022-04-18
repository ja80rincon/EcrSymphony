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

import {IVertexModel, PORTS_GROUPS} from '../BaseVertext';

import * as jointJS from 'jointjs';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {VERTEX_COMMON_DISPLAY, getInitObject} from '../BaseVertext';
import {getTriggerType} from '../actions/utils';

export const TRIGGER_TYPE_ID = 'work_order';
export const TYPE = getTriggerType(TRIGGER_TYPE_ID);

const FILL_COLOR = symphony.palette.AUTOMATION.ORANGE;

const TOTAL_SIZE = 72;
const PADDING = 5;
const BORDER = 6;
const BORDER_RADIUS = 16;

const INNER_SIZE = TOTAL_SIZE - 2 * PADDING;
const INNER_CENTER = PADDING + INNER_SIZE / 2;

const IMAGE_SIZE = 34;
const IMAGE_CENTER = IMAGE_SIZE / 2;
const IMAGE_PADDING = INNER_CENTER - IMAGE_CENTER;

const defaultProperties = {
  attrs: {
    ...VERTEX_COMMON_DISPLAY.attrs,
    body: {
      ...VERTEX_COMMON_DISPLAY.defaultAttrProps,
      strokeWidth: BORDER,
      fill: FILL_COLOR,
      rx: BORDER_RADIUS,
      ry: BORDER_RADIUS,
      width: INNER_SIZE,
      height: INNER_SIZE,
      refX2: 9,
    },
    image: {
      ...VERTEX_COMMON_DISPLAY.defaultAttrProps,
      xlinkHref: '/inventory/static/svg/BlockTriggerWorkforce.svg',
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      x: IMAGE_PADDING,
      y: IMAGE_PADDING - PADDING,
      refX2: 4,
    },
  },
};
defaultProperties.attrs.label.text = `${fbt('Work Order', '')}`;

const markup = {
  markup: [
    ...VERTEX_COMMON_DISPLAY.markup,
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
  ],
};

const TriggerWorkforceBaseClass = jointJS.dia.Element.define(
  TYPE,
  defaultProperties,
  markup,
);

export default class TriggerWorkforce extends TriggerWorkforceBaseClass
  implements IVertexModel {
  constructor(id?: string) {
    super(
      getInitObject(
        FILL_COLOR,
        {
          [PORTS_GROUPS.INPUT]: {count: 0},
        },
        id,
      ),
    );
    this.resize(TOTAL_SIZE, TOTAL_SIZE);
  }
}

export function isTriggerWorkforce(element: ?IVertexModel): boolean {
  if (element == null) {
    return false;
  }
  return element.attributes.type === TYPE;
}

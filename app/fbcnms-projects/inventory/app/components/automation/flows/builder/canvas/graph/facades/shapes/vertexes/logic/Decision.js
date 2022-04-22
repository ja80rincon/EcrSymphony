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

import type {IVertexModel} from '../BaseVertext';

import * as jointJS from 'jointjs';
import fbt from 'fbt';
import {
  PORTS_GROUPS,
  VERTEX_COMMON_DISPLAY,
  getInitObject,
} from '../BaseVertext';

export const TYPE = 'DecisionBlock';

const FILL_COLOR = '#9360f7';

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
      refY2: 4,
    },
    image: {
      ...VERTEX_COMMON_DISPLAY.defaultAttrProps,
      xlinkHref: '/inventory/static/svg/BlockFlowDecision.svg',
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      x: IMAGE_PADDING,
      y: IMAGE_PADDING,
      refX2: PADDING,
    },
  },
};
defaultProperties.attrs.label.text = `${fbt('Decision', '')}`;

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

const DecisionBaseClass = jointJS.dia.Element.define(
  TYPE,
  defaultProperties,
  markup,
);

export default class Decision extends DecisionBaseClass
  implements IVertexModel {
  constructor(id?: string) {
    super(
      getInitObject(
        FILL_COLOR,
        {
          [PORTS_GROUPS.OUTPUT]: {count: 2},
        },
        id ? id : undefined,
      ),
    );
    // super();
    this.resize(TOTAL_SIZE, TOTAL_SIZE);
  }
}

export function isDecision(element: ?IVertexModel): boolean {
  if (element == null) {
    return false;
  }
  return element.attributes.type === TYPE;
}

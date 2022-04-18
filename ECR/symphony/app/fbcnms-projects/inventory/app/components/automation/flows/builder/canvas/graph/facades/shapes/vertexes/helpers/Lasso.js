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

import type {IShape} from '../../BaseShape';
import type {IVertexModel} from '../BaseVertext';

import * as jointJS from 'jointjs';
import symphony from '@symphony/design-system/theme/symphony';
import {VERTEX_COMMON_DISPLAY} from '../BaseVertext';

export const TYPE = 'helpers.Lasso';

const defaultProperties = {
  attrs: {
    body: {
      ...VERTEX_COMMON_DISPLAY.defaultAttrProps,
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      stroke: symphony.palette.B900,
      strokeDasharray: '5 5',
      strokeDashoffset: 2.5,
      fill: 'rgba(57, 132, 255, 0.1)',
      rx: 0,
      ry: 0,
      width: 0,
      height: 0,
    },
  },
};

const markup = {
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
  ],
};

const LassoBaseClass = jointJS.dia.Element.define(
  TYPE,
  defaultProperties,
  markup,
);

export default class Lasso extends LassoBaseClass implements IVertexModel {
  constructor() {
    super();
  }
  setFinalSelection() {
    this.fitEmbeds({
      padding: 16,
    });
    this.attr({
      body: {
        fill: 'transparent',
        strokeWidth: 1,
        stroke: symphony.palette.B900,
        rx: 20,
        ry: 20,
      },
    });
  }
}

export function isLasso(element: ?IShape): boolean {
  if (element == null) {
    return false;
  }
  return element.attributes.type === TYPE;
}

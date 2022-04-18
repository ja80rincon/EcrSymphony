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

import * as jointJS from 'jointjs';
import {VERTEX_COMMON_DISPLAY} from '../BaseVertext';
import {getActionType} from './utils';

export type ActionBaseAttributesType = {
  actionName: string,
  defaultText: string,
  fillColor?: string,
  svgPath: string,
};

export default function CreateActionBaseClass(
  actionBaseAttributes: ActionBaseAttributesType,
) {
  const FILL_COLOR = actionBaseAttributes.fillColor ?? '#4856b0';
  const TYPE = getActionType(actionBaseAttributes.actionName);

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
        xlinkHref: actionBaseAttributes.svgPath,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        x: IMAGE_PADDING,
        y: IMAGE_PADDING - PADDING,
        refX2: 4,
      },
    },
  };

  defaultProperties.attrs.label.text = actionBaseAttributes.defaultText;

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

  return jointJS.dia.Element.define(TYPE, defaultProperties, markup);
}

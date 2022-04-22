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

export type Primitive = string | number | boolean;
export type KeyValuePair = {
  [key: string]:
    | Primitive
    | Array<Primitive>
    | KeyValuePair
    | Array<KeyValuePair>,
};

export type Position = $ReadOnly<{|
  x: number,
  y: number,
|}>;

export type Size = $ReadOnly<{|
  height: number,
  width: number,
|}>;

export type Rect = $ReadOnly<{|
  ...Position,
  ...Size,
|}>;

export type ExtendedMouseEvent = $ReadOnly<{|
  target: HTMLElement,
  originalEvent: MouseEvent,
|}> &
  MouseEvent;

export const Events = {
  Graph: {
    OnAdd: 'add',
    OnRemove: 'remove',
    OnChange: 'change',
  },
  Paper: {
    BackdropClick: 'blank:pointerclick',
    BackdropMouseDown: 'blank:pointerdown',
    BackdropMouseDrag: 'blank:pointermove',
    BackdropMouseUp: 'blank:pointerup',
  },
  Block: {
    MouseOver: 'element:mouseover',
    MouseOut: 'element:mouseout',
    MouseUp: 'element:pointerup',
    MouseDown: 'element:pointerdown',
  },
  Port: {
    MouseClick: 'element:magnet:pointerclick',
  },
  Connector: {
    MouseHover: 'link:mouseover',
    MouseDown: 'link:pointerdown',
    MouseUp: 'link:pointerup',
  },
};

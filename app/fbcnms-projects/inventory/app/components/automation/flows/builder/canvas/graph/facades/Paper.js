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

import type {ExtendedMouseEvent, Position, Rect} from './Helpers';
import type {Graph} from './Graph';
import type {ILinkView, LinkEventCallback} from './shapes/edges/Link';
import type {IShape} from './shapes/BaseShape';
import type {
  IVertexModel,
  IVertexView,
  VertexEventCallback,
  VertexPortEventCallback,
} from './shapes/vertexes/BaseVertext';

type EventRegistration = (
  string,
  | PaperEventCallback
  | VertexEventCallback
  | VertexPortEventCallback
  | LinkEventCallback,
) => void;

export type Paper = $ReadOnly<{|
  el: HTMLElement,
  model: Graph,
  getContentArea: () => Rect,
  getContentBBox: () => Rect,
  scale: (
    sx?: number,
    sy?: number,
    ox?: number,
    oy?: number,
  ) => void | {sx: number, sy: number},
  scaleContentToFit: (options?: {
    padding?:
      | number
      | {
          top?: number,
          right?: number,
          bottom?: number,
          left?: number,
        },
  }) => void,
  translate: (tx?: number, ty?: number) => void | {tx: number, ty: number},
  on: EventRegistration,
  off: EventRegistration,
  options: {
    origin: Position,
    validateMagnet: (IVertexView, HTMLElement, ExtendedMouseEvent) => boolean,
  },
  clientToLocalPoint: Position => Position,
  findViewsFromPoint: Position => Array<{model: IVertexModel}>,
  findViewByModel: IShape => IVertexView | ILinkView,
|}>;

export type PaperEventCallback = (ExtendedMouseEvent, number, number) => void;

export type PaperCtorType = ({
  el: HTMLElement,
  model: Graph,
  width: number | string,
  height: number | string,
  gridSize: number,
  interactive: boolean | (IShape => boolean),
}) => Paper;

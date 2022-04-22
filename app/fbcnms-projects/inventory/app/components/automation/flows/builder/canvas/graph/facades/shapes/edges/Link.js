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

import type {ExtendedMouseEvent, KeyValuePair} from '../../Helpers';
import type {Graph} from '../../Graph';
import type {
  IBaseShapeAttributes,
  IShape,
  IShapeView,
} from '../../shapes/BaseShape';
import type {IVertexModel} from '../../shapes/vertexes/BaseVertext';
import type {Paper} from '../../Paper';
import type {Position} from '../../Helpers';

import * as jointJS from 'jointjs';

export const TYPE = 'standard.Link';

export type LinkVertexEndpoint = $ReadOnly<{
  id: string,
  port: ?string,
}>;

export type LinkEndpoint = LinkVertexEndpoint | Position;

export interface ILinkAttributes extends IBaseShapeAttributes {
  +source: LinkEndpoint;
  +target: LinkEndpoint;
  +type: 'standard.Link';
  +z: number;
}

export interface ILinkModel extends IShape {
  +attributes: ILinkAttributes;
  +source: (?LinkEndpoint) => void;
  +target: (?LinkEndpoint) => void;
  +addTo: Graph => void;
  +router: (string, KeyValuePair) => void;
  +getTargetElement: () => ?IVertexModel;
  +attr: KeyValuePair => void;
  +remove: () => void;
}

export type ILinkView = $ReadOnly<{|
  ...IShapeView<ILinkModel>,
  path: KeyValuePair,
|}>;

export type LinkDescriptor = $ReadOnly<{|
  id: string,
  sourceId: ?string,
  targetId: ?string,
|}>;

const Link = jointJS.shapes.standard.Link;
export default Link;

export type LinkEventArgs = $ReadOnly<{|
  model: Link,
  paper: Paper,
|}>;

export type LinkEventCallback = (
  LinkEventArgs,
  ExtendedMouseEvent,
  number,
  number,
) => void;

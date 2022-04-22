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

import type {ILinkAttributes} from './shapes/edges/Link';
import type {IShape} from './shapes/BaseShape';
import type {
  IVertexModel,
  IVertexModelAttributes,
} from './shapes/vertexes/BaseVertext';
import type {KeyValuePair, Rect} from './Helpers';

export type GraphExporter = $ReadOnly<{|
  cells: $ReadOnlyArray<IVertexModelAttributes | ILinkAttributes>,
|}>;

export type Graph = $ReadOnly<{|
  toJSON: () => GraphExporter,
  findModelsInArea: Rect => Array<IVertexModel>,
  on: (string, GraphEventCallback) => void,
  removeCells: (models: IVertexModel[], opt?: KeyValuePair) => void,
|}>;

export type GraphEventCallback = IShape => void;

export type GraphCtorType = () => Graph;

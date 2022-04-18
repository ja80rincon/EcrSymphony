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

import type {FlowWrapperReference} from './GraphContext';
import type {IBlock} from '../shapes/blocks/BaseBlock';
import type {IConnector} from '../shapes/connectors/BaseConnector';
import type {IVertexModel} from '../facades/shapes/vertexes/BaseVertext';
import type {Paper} from '../facades/Paper';
import type {Rect} from '../facades/Helpers';

export type GraphGettersAPI = $ReadOnly<{|
  getMainPaper: () => ?Paper,
  getBlock: string => ?IBlock,
  getConnector: string => ?IConnector,
  getBlocksInArea: Rect => Array<IBlock>,
  getBlocksByType: (type: string) => Array<IBlock>,
  getBlocks: () => Array<IBlock>,
  getConnectors: () => Array<IConnector>,
|}>;

export default function graphGettersAPIProvider(
  flowWrapper: FlowWrapperReference,
): GraphGettersAPI {
  const getMainPaper = graphGetMainPaper.bind(flowWrapper);
  const getConnector = graphGetConnector.bind(flowWrapper);
  const getBlock = graphGetBlock.bind(flowWrapper);
  const getBlocksInArea = graphGetBlocksInArea.bind(flowWrapper);
  const getBlocksByType = getBlocksByTypeFromMap.bind(flowWrapper);
  const getBlocks = graphGetBlocks.bind(flowWrapper);
  const getConnectors = getConnectorsFromMap.bind(flowWrapper);

  return {
    getMainPaper,
    getConnector,
    getBlock,
    getBlocksInArea,
    getBlocksByType,
    getBlocks,
    getConnectors,
  };
}

function graphGetBlock(id: string) {
  return this.current?.blocks.get(id);
}

function graphGetConnector(id: string) {
  return this.current?.connectors.get(id);
}

function graphGetBlocksInArea(rect: Rect): Array<IBlock> {
  if (this.current == null) {
    return [];
  }
  const blocksMap = this.current.blocks;
  const vertexes: Array<IVertexModel> = this.current.graph.findModelsInArea(
    rect,
  );
  const blocks = vertexes
    .map(vertex => blocksMap.get(vertex.id))
    .filter(Boolean);

  return blocks;
}

function graphGetMainPaper(): ?Paper {
  return this.current?.paper;
}

function getBlocksByTypeFromMap(type: string): IBlock[] {
  if (this.current == null) {
    return [];
  }

  return [...this.current.blocks.values()].filter(block => block.type === type);
}

function graphGetBlocks(): IBlock[] {
  if (this.current == null) {
    return [];
  }

  return [...this.current.blocks.values()];
}

function getConnectorsFromMap(): IConnector[] {
  if (this.current == null) {
    return [];
  }

  return [...this.current.connectors.values()];
}

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
import type {Paper} from '../facades/Paper';
import type {Position} from '../facades/Helpers';

import GraphFactory from '../GraphFactory';
import Lasso from '../facades/shapes/vertexes/helpers/Lasso';
import ShapesFactory from '../shapes/ShapesFactory';
import symphony from '@symphony/design-system/theme/symphony';
import {DEFAULT_LINK_SETTINGS} from '../shapes/connectors/BaseConnector';
import {
  blockNameFixer,
  buildPaperConnectionValidation,
  buildPaperInteractivityCheck,
  handleNewConnections,
} from '../utils/helpers';
import {handleMagnetPorts} from '../paper/helpers';

type AddBlockFunctionType = (
  type: string,
  options?: ?{
    id?: ?string,
    text?: ?string,
    position?: ?Position,
    translateClientCoordinates?: ?boolean,
  },
) => ?IBlock;

type AddConnectorFunctionType = (source: IBlock, target: IBlock) => ?IConnector;

export type GraphCoreAPI = $ReadOnly<{|
  bindGraphContainer: HTMLElement => void,
  addBlock: AddBlockFunctionType,
  duplicateBlocks: (blocks: IBlock[], addToGraph?: boolean) => IBlock[],
  addCopiedBlocks: (IBlock[]) => void,
  removeBlocks: (IBlock[]) => void,
  removeConnector: IConnector => void,
  addConnector: AddConnectorFunctionType,
  clearGraph: () => void,
  drawLasso: Position => ?Lasso,
|}>;

export default function graphCoreAPIProvider(
  flowWrapper: FlowWrapperReference,
): GraphCoreAPI {
  const bindGraphContainer = graphBindToContainer.bind(flowWrapper);
  const addBlock = graphAddBlock.bind(flowWrapper);
  const duplicateBlocks = graphDuplicateBlocks.bind(flowWrapper);
  const addCopiedBlocks = graphAddCopiedBlocks.bind(flowWrapper);
  const removeBlocks = graphRemoveBlocks.bind(flowWrapper);
  const removeConnector = graphRemoveConnector.bind(flowWrapper);
  const addConnector = graphAddConnector.bind(flowWrapper);
  const drawLasso = graphDrawLasso.bind(flowWrapper);
  const clearGraph = graphClear.bind(flowWrapper);

  return {
    bindGraphContainer,
    addBlock,
    duplicateBlocks,
    addCopiedBlocks,
    removeBlocks,
    removeConnector,
    addConnector,
    drawLasso,
    clearGraph,
  };
}

function graphBindToContainer(containerElement: HTMLElement) {
  const graph = new GraphFactory.Graph();
  const paper = new GraphFactory.Paper({
    el: containerElement,
    model: graph,
    width: '100%',
    height: '100%',
    gridSize: 1,
    background: {
      color: symphony.palette.D100,
    },
    ...DEFAULT_LINK_SETTINGS,
    validateConnection: buildPaperConnectionValidation(this),
    interactive: buildPaperInteractivityCheck(this),
  });

  const shapesFactory = new ShapesFactory(paper);
  const connectors = new Map();

  handleMagnetPorts(paper);

  this.current = {
    graph,
    paper,
    blocks: new Map(),
    connectors,
    shapesFactory,
    paperScale: 1,
    paperTranslation: {
      x: 0,
      y: 0,
    },
    paperIsLocked: false,
  };

  handleNewConnections(this.current);
}

function getPaperViewPortCenter(paper: Paper): Position {
  const viewPort = paper.el.getBoundingClientRect();
  const x = viewPort.left + viewPort.width / 2;
  const y = viewPort.top + viewPort.height / 2;
  return paper.clientToLocalPoint({x, y});
}

function graphAddBlock(
  type: string,
  options: ?{
    id?: ?string,
    text?: ?string,
    position: ?Position,
    translateClientCoordinates?: ?boolean,
  },
) {
  if (this.current == null) {
    return;
  }

  const shapesFactory = this.current.shapesFactory;
  const blocksMap = this.current.blocks;
  const paper = this.current.paper;

  const position =
    options?.position == null
      ? getPaperViewPortCenter(this.current.paper)
      : options?.translateClientCoordinates
      ? paper.clientToLocalPoint(options.position)
      : options.position;

  const newBlock = shapesFactory.createBlock(type, options?.id ?? '');

  newBlock.model.position(position.x, position.y);
  if (options?.text) {
    newBlock.setName(options.text);
  }

  blocksMap.set(newBlock.id, newBlock);

  return newBlock;
}

function graphRemoveBlocks(blocks: IBlock[]) {
  if (this.current == null) {
    return;
  }
  const blocksMap = this.current.blocks;
  const graph = this.current.graph;
  const connectorsMap = this.current.connectors;
  const idsToRemove = blocks.map(block => block.model.id);

  // This is a temporary way to handle the update of connectorsMap
  // after the removal of the blocks and it's connectors from the graph
  // This is temporary until we finalize the connectors logic implementation
  connectorsMap.forEach(({id, model}: IConnector) => {
    if (
      (model.attributes.source.id != null &&
        idsToRemove.includes(model.attributes.source.id)) ||
      (model.attributes.target.id != null &&
        idsToRemove.includes(model.attributes.target.id))
    ) {
      connectorsMap.delete(id);
    }
  });

  graph.removeCells(blocks.map(block => block.model));
  idsToRemove.forEach(id => blocksMap.delete(id));
}

function getAllBlocks() {
  return [...(this.current?.blocks.values() || [])];
}

function graphClear() {
  graphRemoveBlocks.call(this, getAllBlocks.call(this));
}

function graphRemoveConnector(connector: IConnector) {
  if (this.current == null) {
    return;
  }

  const connectorsMap = this.current.connectors;
  connectorsMap.delete(connector.id);
  connector.model.remove();
}

function graphAddConnector(source: IBlock, target: IBlock) {
  const connector = source.addConnector(null, target);

  if (connector == null || this.current == null) {
    return;
  }

  this.current.connectors.set(connector.id, connector);

  return connector;
}

function graphDrawLasso(position: Position) {
  const graph = this.current?.graph;
  if (graph == null) {
    return;
  }

  const lasso = new Lasso();
  lasso.position(position.x, position.y);
  lasso.addTo(graph);

  return lasso;
}

function graphAddCopiedBlocks(blocks: IBlock[]) {
  if (this.current == null) {
    return;
  }
  const blocksMap = this.current.blocks;
  const fixBlockName = blockNameFixer(getAllBlocks.call(this));
  blocks.forEach(block => {
    fixBlockName(block);
    blocksMap.set(block.id, block);
    block.addToGraph();
  });
  blocks.forEach(block =>
    block.outConnectors.forEach(connector => connector.addToGraph()),
  );
}

function graphDuplicateBlocks(
  blocks: IBlock[],
  addToGraph?: boolean = true,
): IBlock[] {
  if (this.current == null) {
    return [];
  }
  const blocksMap = this.current.blocks;
  const originalIDToNewBlock = new Map<string, IBlock>();
  const fixBlockName = blockNameFixer(getAllBlocks.call(this));

  blocks.forEach(block => {
    const newBlock = addToGraph ? block.clone() : block.copy();
    originalIDToNewBlock.set(block.id, newBlock);
    if (addToGraph) {
      fixBlockName(newBlock);
      blocksMap.set(newBlock.id, newBlock);
    }
  });

  blocks.forEach(block => {
    const duplicatedBlock = originalIDToNewBlock.get(block.id);
    if (duplicatedBlock == null) {
      return;
    }
    [...block.outConnectors].forEach((connector, portIndex) => {
      if (connector == null) {
        return;
      }
      const newTagetBlock = originalIDToNewBlock.get(connector.target.id);
      if (newTagetBlock == null) {
        return;
      }
      duplicatedBlock.addConnector(portIndex, newTagetBlock);
    });
  });

  return [...originalIDToNewBlock.values()];
}

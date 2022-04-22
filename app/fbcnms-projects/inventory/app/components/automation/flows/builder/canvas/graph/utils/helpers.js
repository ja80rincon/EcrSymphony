/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  FlowWrapper,
  FlowWrapperReference,
} from '../graphAPIContext/GraphContext';
import type {IBlock} from '../shapes/blocks/BaseBlock';
import type {
  ILinkModel,
  LinkEndpoint,
  LinkEventArgs,
} from '../facades/shapes/edges/Link';
import type {
  IVertexView,
  VertexPort,
} from '../facades/shapes/vertexes/BaseVertext';

import jss from 'jss';
import symphony from '@symphony/design-system/theme/symphony';
import {Events} from '../facades/Helpers';
import {PORTS_GROUPS} from '../facades/shapes/vertexes/BaseVertext';

const connectorDefaultColor = symphony.palette.secondary;
export const {classes} = jss
  .createStyleSheet(
    {
      defaultBlock: {
        stroke: symphony.palette.white,
      },
      defaultConnector: {
        stroke: connectorDefaultColor,
      },
      isSelected: {
        stroke: symphony.palette.primary,
      },
    },
    {link: true},
  )
  .attach();

export const DISPLAY_SETTINGS = {
  connectors: {
    defaultColor: connectorDefaultColor,
  },
  classes,
};

export function handleNewConnections(flow: ?FlowWrapper) {
  if (flow == null) {
    return;
  }

  const handler = (args: LinkEventArgs) => {
    const newLink: ILinkModel = args.model;
    if (flow.connectors.has(newLink.id) || !isLinkValid(flow, newLink)) {
      return;
    }

    const sourceBlock = getLinkEndpointBlock(flow, newLink, 'source');
    if (sourceBlock == null) {
      return;
    }

    const targetBlock = getLinkEndpointBlock(flow, newLink, 'target');
    if (targetBlock == null || newLink.attributes.source.port == null) {
      return;
    }

    const connector = sourceBlock.addConnector(
      newLink.attributes.source.port,
      targetBlock,
      newLink,
    );

    if (connector == null) {
      return;
    }

    flow.connectors.set(connector.id, connector);
  };
  flow.paper.on(Events.Connector.MouseUp, handler);
}

function getLinkEndpointBlock(
  flow: ?FlowWrapper,
  link: ILinkModel,
  side: 'source' | 'target',
): ?IBlock {
  if (flow == null) {
    return;
  }

  const linkSide =
    side === 'source' ? link.attributes.source : link.attributes.target;
  if (linkSide.id == null) {
    return;
  }

  return flow.blocks.get(linkSide.id);
}

function isLinkValid(flow: ?FlowWrapper, newLink: ILinkModel) {
  if (
    newLink.attributes.source.id == null ||
    newLink.attributes.target.id == null ||
    newLink.attributes.source.id === newLink.attributes.target.id
  ) {
    return false;
  }
  const portSource = getLinkEndpointPort(flow, newLink.attributes.source);
  const portTarget = getLinkEndpointPort(flow, newLink.attributes.target);

  if (portSource == null || portTarget == null) {
    return false;
  }

  if (portSource.group === portTarget.group) {
    return false;
  }

  if (portSource.group === PORTS_GROUPS.INPUT) {
    const originalSource = newLink.attributes.source;
    newLink.source(newLink.attributes.target);
    newLink.target(originalSource);
  }

  return true;
}

function getLinkEndpointPort(
  flow: ?FlowWrapper,
  linkEndpoint: LinkEndpoint,
): ?VertexPort {
  if (flow == null) {
    return;
  }
  if (linkEndpoint.id == null) {
    return;
  }

  const linkEndBlock = flow.blocks.get(linkEndpoint.id);

  if (linkEndBlock == null || linkEndpoint.port == null) {
    return;
  }

  return linkEndBlock.getPortByID(linkEndpoint.port);
}

export function buildPaperConnectionValidation(
  flowWrapper: FlowWrapperReference,
) {
  const isInputPort = (block: ?IBlock, portId: ?string) => {
    if (block == null || portId == null) {
      return false;
    }

    const blockInputPort = block.getInputPort();

    return portId === blockInputPort?.id;
  };

  const isOutputPort = (block: ?IBlock, portId: ?string) => {
    if (block == null || portId == null) {
      return false;
    }

    const blockOutputPorts = block.getOutputPorts();

    return blockOutputPorts.find(outPort => portId == outPort.id);
  };

  return (
    cellViewS: IVertexView,
    magnetS: HTMLElement,
    cellViewT: IVertexView,
    magnetT: HTMLElement,
  ) => {
    if (magnetT != null && magnetT != magnetS) {
      const targetBlockId = cellViewT.model.id;
      const sourceBlockId = cellViewS.model.id;

      if (sourceBlockId === targetBlockId) {
        return false;
      }

      const sourcePortId = magnetS.getAttribute('port');
      const sourceBlock = flowWrapper.current?.blocks.get(sourceBlockId);

      const targetPortId = magnetT.getAttribute('port');
      const targetBlock = flowWrapper.current?.blocks.get(targetBlockId);

      return (
        (isOutputPort(sourceBlock, sourcePortId) &&
          isInputPort(targetBlock, targetPortId)) ||
        (isInputPort(sourceBlock, sourcePortId) &&
          isOutputPort(targetBlock, targetPortId))
      );
    }
    return false;
  };
}

export function buildPaperInteractivityCheck(
  flowWrapper: FlowWrapperReference,
) {
  return () => {
    return !flowWrapper.current?.paperIsLocked;
  };
}

const BLOCK_INDEXER_REGEX = /\s\((\d+)\)$/;
const BLOCK_NAME_REGEX: RegExp = new RegExp(
  `^(.+)${BLOCK_INDEXER_REGEX.source}`,
);

export function blockNameFixer(
  allBlocks: $ReadOnlyArray<IBlock>,
): IBlock => void {
  const blocksNameDuplicationsMap = new Map<string, number>();

  const getBlockBaseName = (name: string) => {
    const blockNameMatch = name.match(BLOCK_NAME_REGEX);
    return (blockNameMatch == null ? name : blockNameMatch[1]).trim();
  };

  const getNameAvailableIndex = (baseName: string) => {
    const nextIndex =
      blocksNameDuplicationsMap.get(baseName) ||
      getHighestIndexerForBaseName(allBlocks, baseName);

    blocksNameDuplicationsMap.set(baseName, nextIndex + 1);

    return nextIndex;
  };

  return (block: IBlock) => {
    const blockBaseName = getBlockBaseName(block.name);
    const blockNameIndexer = getNameAvailableIndex(blockBaseName);
    const name =
      blockNameIndexer === 0
        ? blockBaseName
        : `${blockBaseName} (${blockNameIndexer})`;
    block.setName(name);
  };
}

function getHigherIndexer(
  candidateIndexer: number,
  name: string,
  nameIndexerRegEx: RegExp,
): number {
  const blockNameMatch = name.match(nameIndexerRegEx);
  if (blockNameMatch) {
    const thisBlockIndexer = parseInt(blockNameMatch[1]);
    if (thisBlockIndexer > candidateIndexer) {
      return thisBlockIndexer;
    }
  }
  return candidateIndexer;
}

function getHighestIndexerForBaseName(
  blocks: $ReadOnlyArray<IBlock>,
  baseName: string,
): number {
  const specificBlockNameRegEx: RegExp = new RegExp(
    `^${baseName}${BLOCK_INDEXER_REGEX.source}`,
  );
  return (
    blocks.reduce((topIndex, block) => {
      if (topIndex < 0 && block.name === baseName) {
        topIndex = 0;
      }
      return getHigherIndexer(topIndex, block.name, specificBlockNameRegEx);
    }, -1) + 1
  );
}

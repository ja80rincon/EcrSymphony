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

import type {GraphContextType} from '../../../graphAPIContext/GraphContext';
import type {IBlock} from '../BaseBlock';
import type {Position} from '../../../facades/Helpers';

import nullthrows from 'nullthrows';

export type BlockTypePresentationComponentProps = $ReadOnly<{||}>;
export type BlockTypeExplanationComponentProps = $ReadOnly<{||}>;

interface IBaseBlockType {
  +type: string;
  +createBlock: (
    position?: ?Position,
    translateClientCoordinates?: ?boolean,
  ) => IBlock;
  +checkIfFitsSearch: string => boolean;
}

export interface IBlockType extends IBaseBlockType {
  // eslint-disable-next-line max-len
  +presentationComponent: React.ComponentType<BlockTypePresentationComponentProps>;
  // eslint-disable-next-line max-len
  +explanationComponent: ?React.ComponentType<BlockTypeExplanationComponentProps>;
}

export class BaseBlockType implements IBaseBlockType {
  flow: GraphContextType;
  type = '';

  constructor(flow: GraphContextType) {
    this.flow = flow;
  }

  createBlock(
    position?: ?Position,
    translateClientCoordinates?: ?boolean,
  ): IBlock {
    const options =
      position == null ? null : {position, translateClientCoordinates};
    return nullthrows(this.flow.addBlock(this.type, options));
  }

  checkIfFitsSearch(term: string) {
    return this.type.toLowerCase().includes(term.toLowerCase());
  }
}

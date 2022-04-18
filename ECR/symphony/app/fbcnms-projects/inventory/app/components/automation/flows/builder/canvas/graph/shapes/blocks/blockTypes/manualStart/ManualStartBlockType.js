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

import type {IBlock} from '../../BaseBlock';
import type {IBlockType} from '../BaseBlockType';

import ManualStartPresentation from './ManualStartPresentation';
import fbt from 'fbt';
import {BaseBlockType} from '../BaseBlockType';
import {TYPE} from '../../../../facades/shapes/vertexes/administrative/ManualStart';

export default class ManualStartBlockType extends BaseBlockType
  implements IBlockType {
  type = TYPE;
  presentationComponent = ManualStartPresentation;
  explanationComponent = null;

  createBlock(): IBlock {
    const startBlocks = this.flow.getBlocksByType(this.type);
    if (startBlocks.length > 0) {
      throw `${fbt("Only single 'Start' block is allowed.", '')}`;
    }
    return BaseBlockType.prototype.createBlock.call(this, ...arguments);
  }
}

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

import type {IBlockType} from '../BaseBlockType';

import CreateWorkorderPresentation from './CreateWorkorderPresentation';
import {BaseBlockType} from '../BaseBlockType';
import {TYPE} from '../../../../facades/shapes/vertexes/actions/CreateWorkorder';

export default class CreateWorkorderBlockType extends BaseBlockType
  implements IBlockType {
  type = TYPE;
  presentationComponent = CreateWorkorderPresentation;
  explanationComponent = null;
}

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

import TriggerWorkforcePresentation from './TriggerWorkforcePresentation';
import {BaseBlockType} from '../BaseBlockType';
import {TYPE} from '../../../../facades/shapes/vertexes/triggers/TriggerWorkforce';

export default class TriggerWorkforceBlockType extends BaseBlockType
  implements IBlockType {
  type = TYPE;
  presentationComponent = TriggerWorkforcePresentation;
  explanationComponent = null;
}

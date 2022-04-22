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

import type {GraphCtorType} from './facades/Graph';
import type {PaperCtorType} from './facades/Paper';

import * as jointJS from 'jointjs';

window.joint = jointJS;

export type GraphFactory = $ReadOnly<{|
  Graph: GraphCtorType,
  Paper: PaperCtorType,
|}>;

const graphFactory: GraphFactory = jointJS.dia;

export default graphFactory;

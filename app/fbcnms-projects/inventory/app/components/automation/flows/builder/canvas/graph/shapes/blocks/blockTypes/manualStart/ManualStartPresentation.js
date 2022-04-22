/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import ManualStartIcon from './ManualStartIcon';
import fbt from 'fbt';
import {BasePresentation} from '../BasePresentation';

export default function ManualStartPresentation() {
  return <BasePresentation icon={ManualStartIcon} text={fbt('Start', '')} />;
}

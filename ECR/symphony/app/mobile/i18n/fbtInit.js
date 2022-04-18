/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import {getTranslatedInput} from './getTranslatedInput';
import {init} from 'fbt';
// $FlowFixMe - T72031710
init({hooks: {getTranslatedInput}});

export default {};

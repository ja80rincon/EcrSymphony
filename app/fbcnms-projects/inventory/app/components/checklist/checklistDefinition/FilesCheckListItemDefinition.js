/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {CheckListItemDefinitionProps} from './CheckListItemDefinition';

import CheckListItemDefinitionBase from './CheckListItemDefinitionBase';
import React from 'react';

const FilesCheckListItemDefinition = (props: CheckListItemDefinitionProps) => {
  return <CheckListItemDefinitionBase {...props} />;
};

export default FilesCheckListItemDefinition;

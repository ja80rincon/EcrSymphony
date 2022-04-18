/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {TokenizerDisplayProps} from '@symphony/design-system/components/Token/Tokenizer';

import * as React from 'react';
import StaticNamedNodesTokenizer from './StaticNamedNodesTokenizer';
import {useWorkOrderTemplateNodes} from './WorkOrder';

type WorkOrderTemplatesTokenizerProps = $ReadOnly<{|
  ...TokenizerDisplayProps,
  selectedWorkOrderTemplateIds?: ?$ReadOnlyArray<string>,
  onSelectedWorkOrderTemplateIdsChange?: ($ReadOnlyArray<string>) => void,
|}>;

function WorkOrderTemplatesTokenizer(props: WorkOrderTemplatesTokenizerProps) {
  const {
    selectedWorkOrderTemplateIds,
    onSelectedWorkOrderTemplateIdsChange,
    ...rest
  } = props;
  const workOrderTemplates = useWorkOrderTemplateNodes();
  return (
    <StaticNamedNodesTokenizer
      allNamedNodes={workOrderTemplates}
      selectedNodeIds={selectedWorkOrderTemplateIds}
      onSelectedNodeIdsChange={onSelectedWorkOrderTemplateIdsChange}
      {...rest}
    />
  );
}

export default WorkOrderTemplatesTokenizer;

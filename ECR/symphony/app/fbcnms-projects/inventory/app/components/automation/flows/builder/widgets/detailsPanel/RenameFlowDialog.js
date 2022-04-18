/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import FormFieldTextDialog from './FormFieldTextDialog';
import React from 'react';
import {fbt} from 'fbt';
import {useFlowData} from '../../../data/FlowDataContext';

type Props = $ReadOnly<{|
  onClose: () => void,
  onSave: (newName: string) => void,
|}>;

function RenameFlowDialog(props: Props) {
  const flowData = useFlowData();
  const flowName = flowData.flowDraft?.name || '';
  const title = `${fbt('Flow Name', '')}`;

  return (
    <FormFieldTextDialog
      label={title}
      validationId="Flow name"
      value={flowName}
      {...props}
    />
  );
}

export default RenameFlowDialog;

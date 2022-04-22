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
import fbt from 'fbt';
import {useFlowData} from '../../../data/FlowDataContext';

type Props = $ReadOnly<{|
  onClose: () => void,
  onSave: string => void,
|}>;

function EditFlowDescriptionDialog(props: Props) {
  const flowData = useFlowData();
  const flowDescription = flowData.flowDraft?.description || '';

  return (
    <FormFieldTextDialog
      label=""
      value={flowDescription}
      type="multiline"
      placeholder={`${fbt('Describe this flow...', '')}`}
      rows={4}
      {...props}
    />
  );
}

export default EditFlowDescriptionDialog;

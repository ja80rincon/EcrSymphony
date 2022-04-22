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

'use strict';

import type {WorkOrderTemplateNameSection_workOrder} from './__generated__/WorkOrderTemplateNameSection_workOrder.graphql';

import * as React from 'react';
import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer} from 'react-relay';
type Props = {
  +workOrder: WorkOrderTemplateNameSection_workOrder,
};

const WorkOrderTemplateNameSection = ({workOrder}: Props) => {
  if (workOrder.workOrderTemplate == null) {
    return null;
  }

  return (
    <LabeledTextSection
      title={
        <fbt desc="Section title for the work order template name">
          Template
        </fbt>
      }
      content={workOrder.workOrderTemplate.name}
    />
  );
};

export default createFragmentContainer(WorkOrderTemplateNameSection, {
  workOrder: graphql`
    fragment WorkOrderTemplateNameSection_workOrder on WorkOrder {
      workOrderTemplate {
        name
      }
    }
  `,
});

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

import type {WorkOrderAssigneeSection_workOrder} from './__generated__/WorkOrderAssigneeSection_workOrder.graphql';

import * as React from 'react';
import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer} from 'react-relay';
type Props = {
  +workOrder: WorkOrderAssigneeSection_workOrder,
};

const WorkOrderAssigneeSection = ({workOrder}: Props) => {
  if (workOrder.assignedTo == null) {
    return null;
  }

  return (
    <LabeledTextSection
      title={
        <fbt desc="Section title for the work order assignee">Assignee</fbt>
      }
      content={workOrder.assignedTo.name}
    />
  );
};

export default createFragmentContainer(WorkOrderAssigneeSection, {
  workOrder: graphql`
    fragment WorkOrderAssigneeSection_workOrder on WorkOrder {
      assignedTo {
        name
      }
    }
  `,
});

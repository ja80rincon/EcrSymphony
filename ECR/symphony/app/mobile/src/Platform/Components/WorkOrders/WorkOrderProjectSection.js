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

import type {WorkOrderProjectSection_workOrder} from './__generated__/WorkOrderProjectSection_workOrder.graphql';

import * as React from 'react';
import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer} from 'react-relay-offline';
type Props = {
  +workOrder: WorkOrderProjectSection_workOrder,
};

const WorkOrderProjectSection = ({workOrder}: Props) => {
  if (workOrder.project == null) {
    return null;
  }

  return (
    <LabeledTextSection
      title={<fbt desc="Section title for the work order project">Project</fbt>}
      content={workOrder.project.name}
    />
  );
};

export default createFragmentContainer(WorkOrderProjectSection, {
  workOrder: graphql`
    fragment WorkOrderProjectSection_workOrder on WorkOrder {
      project {
        name
      }
    }
  `,
});

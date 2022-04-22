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

import type {WorkOrderDetailsSection_workOrder} from './__generated__/WorkOrderDetailsSection_workOrder.graphql';

import * as React from 'react';
import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import PillsView from '@fbcmobile/ui/Components/PillsView';
import PriorityPill from '@fbcmobile/ui/Components/PriorityPill';
import StatusPill from '@fbcmobile/ui/Components/StatusPill';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderAssigneeSection from 'Platform/Components/WorkOrders/WorkOrderAssigneeSection';
import WorkOrderDatesSection from 'Platform/Components/WorkOrders/WorkOrderDatesSection';
import WorkOrderLocationSection from 'Platform/Components/WorkOrders/WorkOrderLocationSection';
import WorkOrderProjectSection from 'Platform/Components/WorkOrders/WorkOrderProjectSection';
import WorkOrderTemplateNameSection from 'Platform/Components/WorkOrders/WorkOrderTemplateNameSection';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

type Props = {
  +workOrder: WorkOrderDetailsSection_workOrder,
};

const WorkOrderDetailsSection = ({workOrder}: Props) => {
  const {location} = workOrder;
  const sections = [
    workOrder.project ? (
      <WorkOrderProjectSection workOrder={workOrder} />
    ) : null,
    workOrder.assignedTo ? (
      <WorkOrderAssigneeSection workOrder={workOrder} />
    ) : null,
    workOrder.creationDate || workOrder.installDate ? (
      <WorkOrderDatesSection workOrder={workOrder} />
    ) : null,
    workOrder.workOrderTemplate ? (
      <WorkOrderTemplateNameSection workOrder={workOrder} />
    ) : null,
    workOrder.description ? (
      <LabeledTextSection
        title={<fbt desc="Description section title">Description</fbt>}
        content={workOrder.description}
      />
    ) : null,
    location && location.longitude && location.latitude ? (
      <WorkOrderLocationSection workOrder={workOrder} />
    ) : null,
  ].filter(Boolean);

  return (
    <View style={styles.root}>
      <Text variant="h2" weight="bold" style={styles.detailsHeader}>
        <fbt desc="Header for a section showing details about the work order">
          Details
        </fbt>
      </Text>
      <PillsView style={styles.pills}>
        {workOrder.status && <StatusPill status={workOrder.status} />}
        {workOrder.priority && workOrder.priority !== 'NONE' && (
          <PriorityPill priority={workOrder.priority} />
        )}
      </PillsView>
      <List>
        {sections.map((section, i) => (
          <ListItem
            key={`section_${i}`}
            hideDivider={true}
            style={styles.section}>
            {section}
          </ListItem>
        ))}
      </List>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailsHeader: {
    marginBottom: 16,
  },
  pills: {
    marginBottom: 15,
  },
  section: {
    paddingVertical: 16,
  },
});

export default createFragmentContainer(WorkOrderDetailsSection, {
  workOrder: graphql`
    fragment WorkOrderDetailsSection_workOrder on WorkOrder {
      id
      creationDate
      installDate
      description
      priority
      status
      workOrderTemplate {
        name
      }
      location {
        name
        latitude
        longitude
      }
      project {
        name
      }
      assignedTo {
        name
      }
      ...WorkOrderLocationSection_workOrder
      ...WorkOrderDatesSection_workOrder
      ...WorkOrderProjectSection_workOrder
      ...WorkOrderAssigneeSection_workOrder
      ...WorkOrderTemplateNameSection_workOrder
    }
  `,
});

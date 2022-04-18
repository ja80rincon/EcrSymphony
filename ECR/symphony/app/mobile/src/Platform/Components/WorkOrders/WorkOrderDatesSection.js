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

import type {WorkOrderDatesSection_workOrder} from './__generated__/WorkOrderDatesSection_workOrder.graphql';

import * as React from 'react';
import AppContext from 'Platform/Context/AppContext';
import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import moment from 'moment';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {getLocaleDateTimeString} from '@fbcmobile/ui/Utils/DateUtils';
import {useContext} from 'react';

type Props = {
  +workOrder: WorkOrderDatesSection_workOrder,
};

const WorkOrderDatesSection = ({workOrder}: Props) => {
  const {jsLocale} = useContext(AppContext);
  return (
    <View style={styles.root}>
      {workOrder.creationDate != null ? (
        <LabeledTextSection
          style={styles.block}
          title={
            <fbt desc="Section title for the work order creation date">
              Created On
            </fbt>
          }
          content={getLocaleDateTimeString(
            moment(workOrder.creationDate),
            jsLocale,
          )}
        />
      ) : null}
      {workOrder.creationDate != null && workOrder.installDate != null ? (
        <View style={styles.separator} />
      ) : null}
      {workOrder.installDate != null ? (
        <LabeledTextSection
          style={styles.block}
          title={
            <fbt desc="Section title for the work order due date">Due Date</fbt>
          }
          content={getLocaleDateTimeString(
            moment(workOrder.installDate),
            jsLocale,
          )}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -15,
  },
  block: {
    marginTop: 15,
  },
  separator: {
    flexGrow: 1,
    minWidth: 10,
    flexBasis: 10,
  },
});

export default createFragmentContainer(WorkOrderDatesSection, {
  workOrder: graphql`
    fragment WorkOrderDatesSection_workOrder on WorkOrder {
      creationDate
      installDate
    }
  `,
});

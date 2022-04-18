/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FlowInstanceCardQueryResponse} from './__generated__/FlowInstanceCardQuery.graphql';

import ComparisonViewNoResults from '../comparison_view/ComparisonViewNoResults';
import DateTimeFormat from '../../common/DateTimeFormat';
import React, {useMemo} from 'react';
import Table from '@symphony/design-system/components/Table/Table';
import {formatMultiSelectValue} from '@symphony/design-system/utils/displayUtils';
import {makeStyles} from '@material-ui/styles';
import {useStatusValues} from '../../common/FilterTypesFlow';

const useStyles = makeStyles(() => ({
  table: {
    height: '100%',
  },
}));

export const FLOW_INSTANCES_PAGE_SIZE = 15;

type Props = $ReadOnly<{|
  flowInstance: FlowInstanceCardQueryResponse,
|}>;

const FlowInstanceDetails = (props: Props) => {
  const {flowInstance} = props;
  const classes = useStyles();
  const {statusValues} = useStatusValues();

  const flowInstancesBlocks = useMemo(
    () =>
      flowInstance.blocks?.map(block => {
        return {...block, key: block.id};
      }),
    [flowInstance],
  );

  if (flowInstancesBlocks == null || flowInstancesBlocks.length === 0) {
    return <ComparisonViewNoResults />;
  }

  const tableColumns = [
    {
      key: 'id',
      title: 'id',
      render: row => row.id,
      tooltip: row => row.id,
    },
    {
      key: 'blockName',
      title: 'Block Name',
      render: row => row.block.uiRepresentation.name,
      tooltip: row => row.block.uiRepresentation.name,
    },
    {
      key: 'blockType',
      title: 'Block Type',
      render: row => row.block.details.__typename,
      tooltip: row => row.block.details.__typename,
    },
    {
      key: 'activityType',
      title: 'Activity Type',
      render: row =>
        row.block.details.__typename === 'ActionBlock'
          ? row.block.details.actionType.id
          : '',
      tooltip: row =>
        row.block.details.__typename === 'ActionBlock'
          ? row.block.details.actionType.id
          : '',
    },
    {
      key: 'template',
      title: 'Template',
      render: row =>
        row.block.details.__typename === 'ActionBlock' &&
        row.block.details.actionType.id === 'worker'
          ? row.block.details.workerType.name
          : row.block.details.__typename === 'ActionBlock' &&
            row.block.details.actionType.id === 'worker'
          ? row.block.details.workOrderType.name
          : '',
      tooltip: row =>
        row.block.details.__typename === 'ActionBlock' &&
        row.block.details.actionType.id === 'worker'
          ? row.block.details.workerType.name
          : row.block.details.__typename === 'ActionBlock' &&
            row.block.details.actionType.id === 'worker'
          ? row.block.details.workOrderType.name
          : '',
    },
    {
      key: 'startDate',
      title: 'Start Date',
      render: row => DateTimeFormat.dateTime(row.startDate),
      tooltip: row => DateTimeFormat.dateTime(row.startDate),
    },
    {
      key: 'endDate',
      title: 'End Date',
      render: row =>
        row.block.endDate ? DateTimeFormat.dateOnly(row.endDate) : '-',
      tooltip: row =>
        row.endDate ? DateTimeFormat.dateOnly(row.endDate) : '-',
    },
    {
      key: 'status',
      title: 'Status',
      render: row =>
        formatMultiSelectValue(
          statusValues.map(({value, label}) => ({value, label})),
          row.status,
        ) ?? '',
      tooltip: row =>
        formatMultiSelectValue(
          statusValues.map(({value, label}) => ({value, label})),
          row.status,
        ) ?? '',
    },
  ];

  return (
    <Table
      className={classes.table}
      data={flowInstancesBlocks}
      columns={tableColumns}
    />
  );
};

export default FlowInstanceDetails;

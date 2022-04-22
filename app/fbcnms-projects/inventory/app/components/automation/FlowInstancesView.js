/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FlowInstanceOrder} from './__generated__/AutomationFlowInstancesQueryRendererQuery.graphql';
import type {FlowInstancesViewPaginationQuery} from './__generated__/FlowInstancesViewPaginationQuery.graphql';
import type {FlowInstancesView_query$key} from './__generated__/FlowInstancesView_query.graphql';

import Button from '@symphony/design-system/components/Button';
import ComparisonViewNoResults from '../comparison_view/ComparisonViewNoResults';
import DateTimeFormat from '../../common/DateTimeFormat';
import React, {useMemo} from 'react';
import Table from '@symphony/design-system/components/Table/Table';
import {TABLE_SORT_ORDER} from '@symphony/design-system/components/Table/TableContext';
import {formatMultiSelectValue} from '@symphony/design-system/utils/displayUtils';
import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {usePaginationFragment} from 'react-relay/hooks';
import {useStatusValues} from '../../common/FilterTypesFlow';

const useStyles = makeStyles(() => ({
  table: {
    height: '100%',
  },
}));

export const FLOW_INSTANCES_PAGE_SIZE = 15;

type Props = $ReadOnly<{|
  flowInstances: FlowInstancesView_query$key,
  onFlowInstanceSelected: string => void,
  orderBy: FlowInstanceOrder,
  onOrderChanged: (newOrderSettings: FlowInstanceOrder) => void,
|}>;

const FlowInstancesView = (props: Props) => {
  const {onFlowInstanceSelected, onOrderChanged, orderBy} = props;
  const classes = useStyles();
  const {statusValues} = useStatusValues();

  // $FlowFixMe[missing-type-arg] $FlowFixMe T74239404 Found via relay types
  const {data, loadNext} = usePaginationFragment<
    FlowInstancesViewPaginationQuery,
    FlowInstancesView_query$key,
  >(
    graphql`
      fragment FlowInstancesView_query on Query
      @argumentDefinitions(
        first: {type: "Int"}
        orderBy: {type: "FlowInstanceOrder"}
        filterBy: {type: "[FlowInstanceFilterInput!]"}
        cursor: {type: "Cursor"}
      )
      @refetchable(queryName: "FlowInstancesViewPaginationQuery") {
        flowInstances(
          after: $cursor
          first: $first
          orderBy: $orderBy
          filterBy: $filterBy
        ) @connection(key: "FlowInstancesView_flowInstances") {
          totalCount
          edges {
            node {
              id
              status
              startDate
              endDate
              bssCode
              serviceInstanceCode
              template {
                id
                name
              }
            }
          }
        }
      }
    `,
    props.flowInstances,
  );

  const flowInstancesData = useMemo(
    () =>
      data?.flowInstances?.edges?.map(edge => {
        if (edge.node) {
          return {...edge.node, key: edge.node.id};
        }
      }),
    [data],
  );

  if (flowInstancesData == null || flowInstancesData.length === 0) {
    return <ComparisonViewNoResults />;
  }

  const tableColumns = [
    {
      key: 'flowId',
      title: 'Flow Instance Id',
      render: row => (
        <Button
          variant="text"
          onClick={() => onFlowInstanceSelected(row.id)}
          tooltip={row.id ?? ''}>
          {row.id}
        </Button>
      ),
    },
    {
      key: 'templateFlowName',
      title: 'Type',
      render: row => row.template.name,
      tooltip: row => row.template.name,
    },
    {
      key: 'bssCode',
      title: 'BSS Code',
      render: row => row.bssCode,
      tooltip: row => row.bssCode,
    },
    {
      key: 'serviceInstanceCode',
      title: 'Service Instance Code',
      render: row => row.serviceInstanceCode,
      tooltip: row => row.serviceInstanceCode,
    },
    {
      key: 'startDate',
      title: 'Start Date',
      getSortingValue: row => row.starDate,
      render: row => DateTimeFormat.dateTime(row.startDate),
      tooltip: row => DateTimeFormat.dateTime(row.startDate),
    },
    {
      key: 'endDate',
      title: 'End Date',
      render: row => (row.endDate ? DateTimeFormat.dateOnly(row.endDate) : '-'),
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
      data={flowInstancesData}
      onSortChanged={newSortSettings =>
        onOrderChanged({
          direction:
            newSortSettings.order === TABLE_SORT_ORDER.ascending
              ? 'ASC'
              : 'DESC',
          field:
            newSortSettings.columnKey === 'startDate'
              ? 'START_AT'
              : 'UPDATED_AT',
        })
      }
      paginationSettings={{
        loadNext: onCompleted => {
          loadNext(FLOW_INSTANCES_PAGE_SIZE, {
            // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
            onComplete: () => onCompleted && onCompleted(),
          });
        },
        pageSize: FLOW_INSTANCES_PAGE_SIZE,
        totalRowsCount: data.flowInstances.totalCount,
      }}
      sortSettings={
        orderBy.field === 'START_AT'
          ? {
              columnKey: 'startDate',
              order:
                orderBy.direction === 'ASC'
                  ? TABLE_SORT_ORDER.ascending
                  : TABLE_SORT_ORDER.descending,
              overrideSorting: true,
            }
          : undefined
      }
      columns={tableColumns}
    />
  );
};

export default FlowInstancesView;

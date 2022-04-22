/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderOrder} from './__generated__/WorkOrderComparisonViewQueryRendererSearchQuery.graphql';
import type {WorkOrdersViewPaginationQuery} from './__generated__/WorkOrdersViewPaginationQuery.graphql';
import type {WorkOrdersView_query$key} from './__generated__/WorkOrdersView_query.graphql';

import Button from '@symphony/design-system/components/Button';
import DateTimeFormat from '../../common/DateTimeFormat';
import LocationLink from '../location/LocationLink';
import PriorityTag from './PriorityTag';
import React, {useMemo} from 'react';
import Table from '@symphony/design-system/components/Table/Table';
import fbt from 'fbt';
import nullthrows from '@fbcnms/util/nullthrows';
import {InventoryAPIUrls} from '../../common/InventoryAPI';
import {TABLE_SORT_ORDER} from '@symphony/design-system/components/Table/TableContext';
import {formatMultiSelectValue} from '@symphony/design-system/utils/displayUtils';
import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {useHistory} from 'react-router';
import {usePaginationFragment} from 'react-relay/hooks';
import {useStatusValues} from '../../common/FilterTypes';

const useStyles = makeStyles(() => ({
  table: {
    height: '100%',
  },
}));

export const WORK_ORDERS_PAGE_SIZE = 15;

type Props = $ReadOnly<{|
  workOrders: WorkOrdersView_query$key,
  onWorkOrderSelected: string => void,
  orderBy: WorkOrderOrder,
  onOrderChanged: (newOrderSettings: WorkOrderOrder) => void,
  showLocation: boolean,
|}>;

const WorkOrdersView = (props: Props) => {
  const {onWorkOrderSelected, onOrderChanged, orderBy, showLocation} = props;
  const classes = useStyles();
  const {statusValues} = useStatusValues();

  // $FlowFixMe[missing-type-arg] $FlowFixMe T74239404 Found via relay types
  const {data, loadNext} = usePaginationFragment<
    WorkOrdersViewPaginationQuery,
    WorkOrdersView_query$key,
  >(
    graphql`
      fragment WorkOrdersView_query on Query
      @argumentDefinitions(
        first: {type: "Int"}
        orderBy: {type: "WorkOrderOrder"}
        filterBy: {type: "[WorkOrderFilterInput!]"}
        cursor: {type: "Cursor"}
      )
      @refetchable(queryName: "WorkOrdersViewPaginationQuery") {
        workOrders(
          after: $cursor
          first: $first
          orderBy: $orderBy
          filterBy: $filterBy
        ) @connection(key: "WorkOrdersView_workOrders") {
          totalCount
          edges {
            node {
              id
              name
              description
              owner {
                id
                email
              }
              creationDate
              installDate
              status
              assignedTo {
                id
                email
              }
              location {
                id
                name
              }
              workOrderType {
                id
                name
              }
              project {
                id
                name
              }
              closeDate
              priority
            }
          }
        }
      }
    `,
    props.workOrders,
  );

  const history = useHistory();

  const workOrdersData = useMemo(
    () =>
      data?.workOrders?.edges.map(edge => {
        if (edge.node) {
          return {...edge.node, key: edge.node.id};
        }
      }),
    [data],
  );

  if (workOrdersData == null || workOrdersData.length === 0) {
    return <div />;
  }

  const tableColumns = [
    {
      key: 'name',
      title: 'Name',
      getSortingValue: row => row.name,
      render: row => (
        <Button
          variant="text"
          onClick={() => onWorkOrderSelected(row.id)}
          tooltip={row.name ?? ''}>
          {row.name}
        </Button>
      ),
    },
    {
      key: 'type',
      title: `${fbt('Template', '')}`,
      render: row => row.workOrderType?.name ?? '',
      tooltip: row => row.workOrderType?.name ?? '',
    },
    {
      key: 'project',
      title: 'Project',
      render: row =>
        row.project ? (
          <Button
            variant="text"
            onClick={() =>
              history.push(InventoryAPIUrls.project(nullthrows(row.project).id))
            }
            tooltip={row.project?.name ?? ''}>
            {row.project?.name ?? ''}
          </Button>
        ) : null,
    },
    {
      key: 'owner',
      title: 'Owner',
      render: row => row.owner.email ?? '',
      tooltip: row => row.owner.email ?? '',
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
    {
      key: 'creationDate',
      title: 'Creation Time',
      render: row => DateTimeFormat.dateTime(row.creationDate),
      tooltip: row => DateTimeFormat.dateTime(row.creationDate),
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      render: row => DateTimeFormat.dateOnly(row.installDate),
      tooltip: row => DateTimeFormat.dateOnly(row.installDate),
    },
    ...(showLocation
      ? [
          {
            key: 'location',
            title: 'Location',
            render: row =>
              row.location ? (
                <LocationLink
                  title={row.location.name}
                  id={row.location.id}
                  newTab={true}
                />
              ) : null,
            tooltip: row => row.location?.name ?? '',
          },
        ]
      : []),
    {
      key: 'assignee',
      title: 'Assignee',
      render: row => row.assignedTo?.email || null,
      tooltip: row => row.assignedTo?.email || null,
    },
    {
      key: 'priority',
      title: 'Priority',
      render: row => <PriorityTag priority={row.priority} />,
      tooltip: row => row.priority ?? '',
    },
    {
      key: 'closeDate',
      title: 'Close Time',
      render: row => DateTimeFormat.dateTime(row.closeDate),
      tooltip: row => DateTimeFormat.dateTime(row.closeDate),
    },
  ];

  return (
    <Table
      className={classes.table}
      data={workOrdersData}
      onSortChanged={newSortSettings =>
        onOrderChanged({
          direction:
            newSortSettings.order === TABLE_SORT_ORDER.ascending
              ? 'ASC'
              : 'DESC',
          field: newSortSettings.columnKey === 'name' ? 'NAME' : 'UPDATED_AT',
        })
      }
      paginationSettings={{
        loadNext: onCompleted => {
          loadNext(WORK_ORDERS_PAGE_SIZE, {
            // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
            onComplete: () => onCompleted && onCompleted(),
          });
        },
        pageSize: WORK_ORDERS_PAGE_SIZE,
        totalRowsCount: data.workOrders.totalCount,
      }}
      sortSettings={
        orderBy.field === 'NAME'
          ? {
              columnKey: 'name',
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

WorkOrdersView.defaultProps = {
  showLocation: true,
};

export default WorkOrdersView;

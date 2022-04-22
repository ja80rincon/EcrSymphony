/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AutomationFlowInstancesQueryRendererQuery} from './__generated__/AutomationFlowInstancesQueryRendererQuery.graphql';
import type {FlowInstanceOrder} from './__generated__/AutomationFlowInstancesQueryRendererQuery.graphql';

import * as React from 'react';
import FlowInstancesView, {FLOW_INSTANCES_PAGE_SIZE} from './FlowInstancesView';
import classNames from 'classnames';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useEffect, useMemo, useState} from 'react';
import {useLazyLoadQuery} from 'react-relay/hooks';

import type {DisplayOptionTypes} from '../InventoryViewContainer';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  noResultsRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100px',
  },
  noResultsLabel: {
    color: theme.palette.grey[600],
  },
  searchIcon: {
    color: theme.palette.grey[600],
    marginBottom: '6px',
    fontSize: '36px',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  onFlowInstanceSelected: (flowInstanceId: string) => void,
  filters: Array<any>,
  orderBy: FlowInstanceOrder,
  displayMode?: DisplayOptionTypes,
  onOrderChanged: (newOrderSettings: FlowInstanceOrder) => void,
  defaultStatusFilter?: {[string]: any},
|}>;

const flowInstanceSearchQuery = graphql`
  query AutomationFlowInstancesQueryRendererQuery(
    $limit: Int
    $orderBy: FlowInstanceOrder
    $filters: [FlowInstanceFilterInput!]!
  ) {
    ...FlowInstancesView_query
      @arguments(first: $limit, orderBy: $orderBy, filterBy: $filters)
  }
`;

const AutomationFlowInstancesQueryRenderer = (props: Props) => {
  const classes = useStyles();
  const {
    filters,
    onFlowInstanceSelected,
    className,
    orderBy,
    onOrderChanged,
    defaultStatusFilter,
  } = props;

  const [tableKey, setTableKey] = useState(0);

  const filtersVariable = useMemo(
    () =>
      filters.map(f => ({
        filterType: f.name.toUpperCase(),
        operator: f.operator.toUpperCase(),
        stringValue: f.stringValue,
        propertyValue: f.propertyValue,
        idSet: f.idSet,
        stringSet: f.stringSet,
      })),
    [filters],
  );
  useEffect(() => setTableKey(key => key + 1), [filtersVariable, orderBy]);

  const response = useLazyLoadQuery<AutomationFlowInstancesQueryRendererQuery>(
    flowInstanceSearchQuery,
    {
      limit: FLOW_INSTANCES_PAGE_SIZE,
      filters: filtersVariable,
      orderBy,
    },
  );

  if (response == null) {
    return null;
  }

  return (
    <div className={classNames(classes.root, className)}>
      <FlowInstancesView
        key={tableKey}
        flowInstances={response}
        onFlowInstanceSelected={onFlowInstanceSelected}
        orderBy={orderBy}
        onOrderChanged={onOrderChanged}
      />
    </div>
  );
};

export default AutomationFlowInstancesQueryRenderer;

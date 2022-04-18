/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  LocationWorkOrdersTabQuery,
  WorkOrderOrder,
} from './__generated__/LocationWorkOrdersTabQuery.graphql';

import React, {useCallback, useState} from 'react';
import WorkOrdersView, {
  WORK_ORDERS_PAGE_SIZE,
} from '../work_orders/WorkOrdersView';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {InventoryAPIUrls} from '../../common/InventoryAPI';
import {graphql} from 'relay-runtime';
import {useLazyLoadQuery} from 'react-relay/hooks';

const workOrderSearchQuery = graphql`
  query LocationWorkOrdersTabQuery(
    $limit: Int
    $filters: [WorkOrderFilterInput!]!
    $orderBy: WorkOrderOrder
  ) {
    ...WorkOrdersView_query
      @arguments(first: $limit, orderBy: $orderBy, filterBy: $filters)
  }
`;

type Props = $ReadOnly<{|
  locationId: string,
|}>;

export default function LocationWorkOrdersTab(props: Props) {
  const {locationId} = props;

  const [orderBy, setOrderBy] = useState<WorkOrderOrder>({
    direction: 'DESC',
    field: 'UPDATED_AT',
  });

  const {history} = useRouter();

  const navigateToWorkOrder = useCallback(
    (selectedWorkOrderCardId: ?string) => {
      history.push(InventoryAPIUrls.workorder(selectedWorkOrderCardId));
    },
    [history],
  );

  const response = useLazyLoadQuery<LocationWorkOrdersTabQuery>(
    workOrderSearchQuery,
    {
      limit: WORK_ORDERS_PAGE_SIZE,
      filters: [
        {
          filterType: 'LOCATION_INST',
          operator: 'IS_ONE_OF',
          idSet: [locationId],
        },
      ],
      orderBy,
    },
  );

  if (response == null) {
    return null;
  }

  return (
    <WorkOrdersView
      workOrders={response}
      onWorkOrderSelected={selectedWorkOrderCardId =>
        navigateToWorkOrder(selectedWorkOrderCardId)
      }
      orderBy={orderBy}
      onOrderChanged={setOrderBy}
      showLocation={false}
    />
  );
}

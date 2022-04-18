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

import type {NavigationScreenProp} from 'react-navigation';

import * as React from 'react';
import ChecklistBadge from 'Platform/Screens/WorkOrder/ChecklistBadge';
import NavigationListItem from '@fbcmobile/ui/Components/NavigationListItem';
import fbt from 'fbt';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {isChecklistItemDone} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {useWorkOrderCachedData} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

type Props = $ReadOnly<{|
  +workOrderId: string,
  +navigation: NavigationScreenProp<{}>,
|}>;

const WorkOrderChecklistNavigationListItem = ({
  workOrderId,
  navigation,
}: Props): React$Element<typeof NavigationListItem> => {
  const cachedData = useWorkOrderCachedData(workOrderId);
  const totalItemsCount =
    cachedData?.categories.flatMap(category => category.checklist).length ?? 0;
  const doneItemsCount =
    cachedData?.categories
      .flatMap(category => category.checklist)
      .map(isChecklistItemDone)
      .filter(Boolean).length ?? 0;

  return (
    <NavigationListItem
      title={fbt(
        'Checklist',
        'Title on a navigation menu. Checklist is to-do items',
      )}
      description={
        totalItemsCount > 0
          ? doneItemsCount === totalItemsCount
            ? fbt(
                'You have completed all items',
                'Label shown when user have completed all the checklist items',
              )
            : fbt(
                'You have ' +
                  fbt.plural('item', totalItemsCount - doneItemsCount, {
                    name: 'number of incomplete items',
                    showCount: 'yes',
                    many: 'items',
                  }) +
                  ' left to complete',
                'Label showing how many checklist items that are left to complete',
              )
          : null
      }
      rightContent={
        totalItemsCount > 0 ? (
          <ChecklistBadge
            doneCount={doneItemsCount}
            totalCount={totalItemsCount}
          />
        ) : null
      }
      onClick={() =>
        navigation.navigate(Screens.WorkOrderChecklistScreen, {
          workOrderId,
        })
      }
      fullWidth={true}
    />
  );
};

export default WorkOrderChecklistNavigationListItem;

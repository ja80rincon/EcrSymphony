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
import type {WorkOrderChecklistCategoryNavigationListItem_category} from './__generated__/WorkOrderChecklistCategoryNavigationListItem_category.graphql';

import * as React from 'react';
import ChecklistBadge from 'Platform/Screens/WorkOrder/ChecklistBadge';
import NavigationListItem from '@fbcmobile/ui/Components/NavigationListItem';
import {Fonts} from '@fbcmobile/ui/Theme';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {isChecklistItemDone} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {useCachedWorkOrderCategory} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +workOrderId: string,
  +category: WorkOrderChecklistCategoryNavigationListItem_category,
  +navigation: NavigationScreenProp<{}>,
|}>;

const WorkOrderChecklistCategoryNavigationListItem = ({
  workOrderId,
  category,
  navigation,
}: Props): React$Element<typeof NavigationListItem> => {
  const cachedCategory = useCachedWorkOrderCategory(workOrderId, category.id);
  const totalItemsCount = cachedCategory?.checklist.length ?? 0;
  const doneItemsCount =
    cachedCategory?.checklist.map(isChecklistItemDone).filter(Boolean).length ??
    0;

  return (
    <NavigationListItem
      key={category.id}
      title={category.title}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      description={
        category.description != null && category.description !== ''
          ? category.description
          : null
      }
      fullWidth={false}
      onClick={() =>
        navigation.navigate(Screens.WorkOrderChecklistCategoryScreen, {
          workOrderId,
          categoryId: category.id,
        })
      }
      rightContent={
        totalItemsCount > 0 ? (
          <ChecklistBadge
            doneCount={doneItemsCount}
            totalCount={totalItemsCount}
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  title: {
    ...Fonts.style.h3,
  },
  description: {
    fontFamily: 'Roboto-Light',
  },
});

export default createFragmentContainer(
  WorkOrderChecklistCategoryNavigationListItem,
  {
    category: graphql`
      fragment WorkOrderChecklistCategoryNavigationListItem_category on CheckListCategory {
        id
        title
        description
      }
    `,
  },
);

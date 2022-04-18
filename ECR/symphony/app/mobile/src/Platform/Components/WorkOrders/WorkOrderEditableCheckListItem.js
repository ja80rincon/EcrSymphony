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

import type {CachedCheckListItem} from 'Platform/Components/WorkOrders/CheckListItemTypes';

import DeleteCheckListItemButton from 'Platform/Components/WorkOrders/CheckListItems/Editing/DeleteCheckListItemButton';
import DuplicateCheckListItemButton from 'Platform/Components/WorkOrders/CheckListItems/Editing/DuplicateCheckListItemButton';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import React, {useContext, useRef} from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import {CheckListItemTypes} from './CheckListItemTypes';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet} from 'react-native';
import {isChecklistItemDone} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';

type Props = {|
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +validateValue: boolean,
|};

const WorkOrderEditableCheckListItem = ({
  workOrderId,
  categoryId,
  item,
  validateValue,
}: Props) => {
  const {duplicateChecklistItem} = useContext(WorkOrderChecklistCacheContext);
  const {deleteChecklistItem} = useContext(WorkOrderChecklistCacheContext);
  const swipeableRef = useRef(null);
  const itemConfig = CheckListItemTypes[item.type];
  const hasError =
    validateValue && item.isMandatory === true
      ? !isChecklistItemDone(item)
      : false;
  const EditingComponent = itemConfig.editingComponent;
  if (EditingComponent == null) {
    return null;
  }
  const closeSwipeable = () => swipeableRef.current?.close();

  return (
    <Swipeable
      key={item.id}
      ref={swipeableRef}
      renderLeftActions={() => (
        <DuplicateCheckListItemButton
          onCancelPressed={closeSwipeable}
          onDuplicateItem={numDuplicates => {
            closeSwipeable();
            duplicateChecklistItem(
              workOrderId,
              categoryId,
              item,
              numDuplicates,
            );
          }}
        />
      )}
      renderRightActions={() =>
        item.isMandatory ? null : (
          <DeleteCheckListItemButton
            onCancelPressed={closeSwipeable}
            onDeleteItem={() => {
              closeSwipeable();
              deleteChecklistItem(workOrderId, categoryId, item);
            }}
          />
        )
      }>
      <ListItem dividerStyle={hasError ? styles.editItemDivider : null}>
        <EditingComponent
          workOrderId={workOrderId}
          categoryId={categoryId}
          item={item}
          hasError={hasError}
        />
      </ListItem>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  editItemDivider: {
    backgroundColor: Colors.BrightRed,
  },
});

export default WorkOrderEditableCheckListItem;

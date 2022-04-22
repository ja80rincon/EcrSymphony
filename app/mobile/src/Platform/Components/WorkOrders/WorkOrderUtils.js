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

import type {WorkOrderAddCommentMutationVariables} from 'Platform/Relay/Mutations/__generated__/WorkOrderAddCommentMutation.graphql';
import type {WorkOrderCacheItem} from 'Platform/Components/WorkOrders/CheckListItemTypes';
import type {
  WorkOrderStatus,
  WorkOrderTechnicianActionBottomBar_workOrder,
} from './__generated__/WorkOrderTechnicianActionBottomBar_workOrder.graphql';

import AppContext from 'Platform/Context/AppContext';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import WorkOrderAddCommentMutation from 'Platform/Relay/Mutations/WorkOrderAddCommentMutation';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import {ERROR, EVENT} from 'Platform/Consts/UserActionEvents';
import {Statuses} from '@fbcmobile/ui/Components/StatusPill';
import {isChecklistItemDone} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {useContext, useMemo} from 'react';

export const useWorkOrderEditingCapability = (
  workOrderId: string,
  assigneeAuthId: ?string,
  workOrderStatus: WorkOrderStatus,
) => {
  const {user} = useContext(AppContext);
  const {cache} = useContext(WorkOrderChecklistCacheContext);
  const cachedData = cache[workOrderId];
  return useMemo(
    () => ({
      isViewOnly:
        assigneeAuthId?.toLowerCase() !== user?.email.toLowerCase() ||
        workOrderStatus === Statuses.PLANNED ||
        workOrderStatus === Statuses.SUBMITTED ||
        workOrderStatus === Statuses.BLOCKED ||
        workOrderStatus === Statuses.CLOSED ||
        cachedData == null ||
        cachedData.isSubmitting
    }),
    [assigneeAuthId, user, workOrderStatus, cachedData],
  );
};

export const useIsWorkOrderChecklistCategoryItemsDone = (
  workOrderId: string,
  categoryId: string,
): boolean => {
  const {cache} = useContext(WorkOrderChecklistCacheContext);
  const cachedData = cache[workOrderId];
  if (cachedData == null) {
    return false;
  }
  const category = cachedData.categories.find(c => c.id === categoryId);
  if (category == null) {
    return false;
  }

  return category.checklist
    .filter(item => item.isMandatory === true)
    .every(isChecklistItemDone);
};

export const useIsWorkOrderChecklistItemsDone = (
  workOrderId: string,
): boolean => {
  const {cache} = useContext(WorkOrderChecklistCacheContext);
  const cachedData = cache[workOrderId];
  if (cachedData == null) {
    return false;
  }

  return cachedData.categories
    .map(c => c.checklist)
    .flat()
    .filter(item => item.isMandatory === true)
    .every(isChecklistItemDone);
};

export const useIsAnyWorkOrderChecklistItemsDone = (
  workOrderId: string,
): boolean => {
  const {cache} = useContext(WorkOrderChecklistCacheContext);
  const cachedData = cache[workOrderId];
  if (cachedData == null) {
    return false;
  }

  return cachedData.categories
    .map(c => c.checklist)
    .flat()
    .some(isChecklistItemDone);
};

export const submitComment = async (workOrderId: string, text: string) => {
  const variables: WorkOrderAddCommentMutationVariables = {
    input: {
      id: workOrderId,
      text: text,
      entityType: 'WORK_ORDER',
    },
  };
  return new Promise((resolve, reject) => {
    const callbacks = {
      onCompleted: () => {
        resolve();
        UserActionLogger.logEvent({
          key: EVENT.SUCCESS_WORK_ORDER_ADD_COMMENT,
        });
      },
      onError: error => {
        reject(error);
        UserActionLogger.logError({
          key: ERROR.ERROR_WORK_ORDER_ADD_COMMENT,
          errorMessage: error.toString(),
        });
      },
    };

    const updater = store => {
      const workOrderRecord = store.get(workOrderId);
      const newComment = store.getRootField('addComment');
      const linkedComments = workOrderRecord.getLinkedRecords('comments') ?? [];
      workOrderRecord.setLinkedRecords(
        [...linkedComments, newComment],
        'comments',
      );
    };

    WorkOrderAddCommentMutation(variables, callbacks, updater);
  });
};

export const createWorkOrderCacheEntryFromQuery = (
  workOrder: WorkOrderTechnicianActionBottomBar_workOrder,
): WorkOrderCacheItem => {
  return {
    id: workOrder.id,
    checkInStatus: null,
    categories: workOrder.checkListCategories.map(category => ({
      id: category.id,
      title: category.title,
      checklist: category.checkList
        .slice()
        .sort((item1, item2) => (item1.index ?? 0) - (item2.index ?? 0))
        .map(item => ({
          ...item,
          checked: item.checked,
          stringValue: item.stringValue,
          enumValues: item.enumValues,
          enumSelectionMode: item.enumSelectionMode,
          selectedEnumValues:
            item.selectedEnumValues !== ''
              ? item.selectedEnumValues?.split(',').filter(v => v !== '')
              : undefined,
          files: item.files?.map(f => ({...f, status: 'server'})),
          wifiData:
            item.wifiData != null && item.wifiData.length > 0
              ? item.wifiData.map(d => ({...d}))
              : null,
          cellData:
            item.cellData != null && item.cellData.length > 0
              ? item.cellData.map(d => ({...d}))
              : null,
        })),
    })),
    images: workOrder.images?.map(f => {
      if (f) {
        return {
          id: f.id,
          fileName: f.fileName,
          storeKey: f.storeKey,
          mimeType: f.mimeType,
          sizeInBytes: f.sizeInBytes,
          modified: f.modified,
          status: 'server',
          uploaded: f.uploaded,
          annotation: f.annotation,
        };
      }
    }),
    isSubmitting: false
  };
};

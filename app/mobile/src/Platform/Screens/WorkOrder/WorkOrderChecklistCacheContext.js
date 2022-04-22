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

import type {
  CachedCheckListItem,
  CachedFileData,
  WorkOrderCacheItem,
  WorkOrderCategoryCacheItem,
} from 'Platform/Components/WorkOrders/CheckListItemTypes';
import type {CheckInStatus} from 'Platform/Screens/WorkOrder/CheckInStatusTypes';
import type {PhotoResponse} from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';

import * as React from 'react';
import LocalStorage from 'Platform/Services/LocalStorage';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import {CheckInStatuses} from 'Platform/Screens/WorkOrder/CheckInStatusTypes';
import {ERROR, EVENT} from 'Platform/Consts/UserActionEvents';
import {generateTempId} from '@fbcmobile/ui/Utils/IdUtils';
import {uploadEntityImage} from 'Platform/Utils/UploadUtils';
import {useCallback, useContext, useEffect, useState} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';

export type WorkOrdersCache = {[id: string]: ?WorkOrderCacheItem};

export type WorkOrderChecklistCacheContextType = {
  cache: WorkOrdersCache,
  setCachedChecklistItem: (
    workOrderId: string,
    categoryId: string,
    itemId: string,
    data: CachedCheckListItem,
  ) => void,
  resetCachedImages:(workOrderId: string, images: Array<CachedFileData>) => void,
  setCachedImageItem: (workOrderId: string, data: CachedFileData) => void,
  setCacheImageAsUploaded: (
    workOrderId: string,
    data: CachedFileData,
  ) => Promise<any>,
  initWorkOrderCacheEntry: (item: WorkOrderCacheItem) => void,
  markWorkOrderAsCheckedIn: (workOrderId: string) => void,
  markWorkOrderAsCheckedOut: (workOrderId: string) => void,
  setWorkOrderSubmittingStatus: (workOrderId: string, isSubmitting: boolean) => void,
  duplicateChecklistItem: (
    workOrderId: string,
    categoryId: string,
    item: CachedCheckListItem,
    numDuplications: number,
  ) => void,
  deleteChecklistItem: (
    workOrderId: string,
    categoryId: string,
    item: CachedCheckListItem,
  ) => void,
};

const WorkOrderChecklistCacheContext = React.createContext<WorkOrderChecklistCacheContextType>(
  {
    cache: {},
    setCachedChecklistItem: () => {},
    resetCachedImages: () => {},
    setCachedImageItem: () => {},
    setCacheImageAsUploaded: async () => {},
    markWorkOrderAsCheckedIn: () => {},
    markWorkOrderAsCheckedOut: () => {},
    setWorkOrderSubmittingStatus: () => {},
    initWorkOrderCacheEntry: () => {},
    duplicateChecklistItem: () => {},
    deleteChecklistItem: () => {},
  },
);

type Props = {|
  +children: React.Node,
|};

const getCachedWorkOrder = (
  cache: WorkOrdersCache,
  workOrderId: string,
): ?WorkOrderCacheItem => {
  const cachedWorkOrder = cache[workOrderId];
  return cachedWorkOrder != null && cachedWorkOrder.categories != null
    ? cachedWorkOrder
    : null;
};

export function useWorkOrderCachedData(
  workOrderId: string,
): ?WorkOrderCacheItem {
  const {cache} = useContext(WorkOrderChecklistCacheContext);
  return getCachedWorkOrder(cache, workOrderId);
}

export function useCachedWorkOrderCategory(
  workOrderId: string,
  categoryId: string,
): ?WorkOrderCategoryCacheItem {
  const cachedWorkOrder = useWorkOrderCachedData(workOrderId);
  return cachedWorkOrder?.categories.find(c => c.id === categoryId);
}

const UPDATE_DELAY = 3000; // 3 seconds
let lastCall = null;

export function WorkOrderChecklistCacheContextProvider({children}: Props) {
  const [cache, setCache] = useState<WorkOrdersCache>({});
  const netInfo = useNetInfo();

  const _isUpdateBlocked = function(): boolean {
    const timeNow = Date.now();
    if (lastCall == null || timeNow > lastCall + UPDATE_DELAY) {
      lastCall = timeNow;
      return false;
    }
    lastCall = timeNow;
    return true;
  };

  if (netInfo.isConnected) {
    if (!_isUpdateBlocked()) {
      uploadWOAttachmentImages();
    }
  }

  async function uploadWOAttachmentImages() {
    Object.keys(cache).map(async key => {
      const cachedWorkOrder = cache[key];
      const imagesToUpload = cachedWorkOrder?.images.filter(
        image => image?.status === 'added',
      );
      if (imagesToUpload) {
        for (const file of imagesToUpload) {
          if (file === null || file === undefined) {
            return;
          }
          const photoResponse: PhotoResponse = {
            uri: file.fileName,
            fileName: file.fileName,
            mimeType: file.mimeType ?? 'image/jpeg',
          };

          await uploadEntityImage('WORK_ORDER', key, photoResponse);
          await setCacheImageAsUploaded(key, file);
        }
      }
    });
  }

  useEffect(() => {
    LocalStorage.getWorkOrdersCache().then(stringifiedCache => {
      if (stringifiedCache == null) {
        setCache({});
      } else {
        try {
          const cache: WorkOrdersCache = JSON.parse(stringifiedCache);
          setCache(cache);
          UserActionLogger.logEvent({
            key: EVENT.SUCCESS_WORK_ORDER_CACHE_LOADED,
            logMessage: `Parsed ${
              Object.keys(cache).length
            } work orders from cache`,
          });
        } catch (error) {
          UserActionLogger.logError({
            key: ERROR.ERROR_PARSING_WORK_ORDER_CACHE,
            errorMessage: `Failed to parse work orders cache: ${stringifiedCache}, error: ${error.toString()}`,
          });
        }
      }
    });
  }, []);

  const setCachedChecklistItem = useCallback(
    (
      workOrderId: string,
      categoryId: string,
      itemId: string,
      data: CachedCheckListItem,
    ) => {
      const cachedWorkOrder = getCachedWorkOrder(cache, workOrderId) ?? {
        id: workOrderId,
        checkInStatus: undefined,
        categories: [],
      };
      const categories = cachedWorkOrder.categories;
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      const category = categories[categoryIndex];
      const items = category.checklist;
      const itemIndex = category.checklist.findIndex(i => i.id === itemId);
      const updatedCache = {
        ...cache,
        [workOrderId]: {
          ...cachedWorkOrder,
          categories: [
            ...categories.slice(0, categoryIndex),
            {
              ...category,
              checklist: [
                ...items.slice(0, itemIndex),
                data,
                ...items.slice(itemIndex + 1),
              ],
            },
            ...categories.slice(categoryIndex + 1),
          ],
        },
      };
      setCache(updatedCache);
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
    },
    [cache],
  );

  const resetCachedImages = useCallback(
    (workOrderId: string, imageFiles: Array<CachedFileData>) => {
      const cachedWorkOrder = getCachedWorkOrder(cache, workOrderId) ?? {
        id: workOrderId,
        checkInStatus: undefined,
        categories: [],
        images: [],
      };

      const updatedCache = {
        ...cache,
        [workOrderId]: {
          ...cachedWorkOrder,
          images:imageFiles,
        },
      };
      setCache(updatedCache);
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
    },
    [cache],
  );

  const setCachedImageItem = useCallback(
    (workOrderId: string, data: CachedFileData) => {
      const cachedWorkOrder = getCachedWorkOrder(cache, workOrderId) ?? {
        id: workOrderId,
        checkInStatus: undefined,
        categories: [],
        images: [],
      };

      const updatedCache = {
        ...cache,
        [workOrderId]: {
          ...cachedWorkOrder,
          images: [...cachedWorkOrder.images, data],
        },
      };
      setCache(updatedCache);
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
    },
    [cache],
  );

  const setCacheImageAsUploaded = useCallback(
    async (workOrderId: string, data: CachedFileData) => {
      const cachedWorkOrder = getCachedWorkOrder(cache, workOrderId) ?? {
        id: workOrderId,
        checkInStatus: undefined,
        categories: [],
        images: [],
      };
      data.status = 'server';
      const fileIndex = cachedWorkOrder.images.indexOf(data);
      const updatedCache = {
        ...cache,
        [workOrderId]: {
          ...cachedWorkOrder,
          images: [
            ...cachedWorkOrder.images.slice(0, fileIndex),
            data,
            ...cachedWorkOrder.images.slice(
              fileIndex + 1,
              cachedWorkOrder.images.length,
            ),
          ],
        },
      };
      setCache(updatedCache);
      await LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
    },
    [cache],
  );

  const setWorkOrderCheckInOutStatus = (
    workOrderId: string,
    status: CheckInStatus,
  ) => {
    setCache(oldCache => {
      const updatedCache = {
        ...oldCache,
        [workOrderId]: {
          ...oldCache[workOrderId],
          checkInStatus: status,
        },
      };
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
      return updatedCache;
    });
  };

  const markWorkOrderAsCheckedIn = (workOrderId: string) => {
    setWorkOrderCheckInOutStatus(workOrderId, CheckInStatuses.CHECKED_IN);
  };

  const markWorkOrderAsCheckedOut = (workOrderId: string) => {
    setWorkOrderCheckInOutStatus(workOrderId, CheckInStatuses.CHECKED_OUT);
  };

  const setWorkOrderSubmittingStatus = (workOrderId: string, isSubmitting: boolean) => {
    setCache(oldCache => {
      const updatedCache = {
        ...oldCache,
        [workOrderId]: {
          ...oldCache[workOrderId],
          isSubmitting,
        },
      };
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
      return updatedCache;
    });
  }

  const initWorkOrderCacheEntry = (item: WorkOrderCacheItem) => {
    setCache(oldCache => {
      const updatedCache = {
        ...oldCache,
        [item.id]: item,
      };
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
      return updatedCache;
    });
  };

  const duplicateChecklistItem = (
    workOrderId: string,
    categoryId: string,
    item: CachedCheckListItem,
    numDuplications: number,
  ) => {
    setCache(oldCache => {
      const cachedWorkOrder = getCachedWorkOrder(cache, workOrderId);
      if (cachedWorkOrder == null) {
        return oldCache;
      }
      const categories = cachedWorkOrder.categories;
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      const category = categories[categoryIndex];
      const items = category.checklist;
      const itemIndex = category.checklist.findIndex(i => i.id === item.id);
      const updatedCache = {
        ...cache,
        [workOrderId]: {
          ...cachedWorkOrder,
          categories: [
            ...categories.slice(0, categoryIndex),
            {
              ...category,
              checklist: [
                ...items.slice(0, itemIndex + 1),
                ...[...Array(numDuplications)].map(
                  (_value: null, i: number): CachedCheckListItem => ({
                    id: generateTempId(),
                    type: item.type,
                    title: item.title,
                    helpText: item.helpText,
                    index: itemIndex + i + 1,
                    isMandatory: false,
                    enumSelectionMode: item.enumSelectionMode,
                    enumValues: item.enumValues,
                  }),
                ),
                ...items.slice(itemIndex + 1).map(item => ({
                  ...item,
                  index: (item.index ?? items.length) + numDuplications,
                })),
              ],
            },
            ...categories.slice(categoryIndex + 1),
          ],
        },
      };
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
      return updatedCache;
    });
  };

  const deleteChecklistItem = (
    workOrderId: string,
    categoryId: string,
    item: CachedCheckListItem,
  ) => {
    setCache(oldCache => {
      const cachedWorkOrder = getCachedWorkOrder(cache, workOrderId);
      if (cachedWorkOrder == null) {
        return oldCache;
      }
      const categories = cachedWorkOrder.categories;
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      const category = categories[categoryIndex];
      const items = category.checklist;
      const itemIndex = category.checklist.findIndex(i => i.id === item.id);
      const updatedCache = {
        ...cache,
        [workOrderId]: {
          ...cachedWorkOrder,
          categories: [
            ...categories.slice(0, categoryIndex),
            {
              ...category,
              checklist: [
                ...items.slice(0, itemIndex),
                ...items.slice(itemIndex + 1).map(item => ({
                  ...item,
                  index: (item.index ?? items.length) - 1,
                })),
              ],
            },
            ...categories.slice(categoryIndex + 1),
          ],
        },
      };
      LocalStorage.setWorkOrdersCache(JSON.stringify(updatedCache));
      return updatedCache;
    });
  };

  return (
    <WorkOrderChecklistCacheContext.Provider
      value={{
        cache,
        setCachedChecklistItem,
        resetCachedImages,
        setCachedImageItem,
        setCacheImageAsUploaded,
        markWorkOrderAsCheckedIn,
        markWorkOrderAsCheckedOut,
        setWorkOrderSubmittingStatus,
        initWorkOrderCacheEntry,
        duplicateChecklistItem,
        deleteChecklistItem,
      }}>
      {children}
    </WorkOrderChecklistCacheContext.Provider>
  );
}

export default WorkOrderChecklistCacheContext;

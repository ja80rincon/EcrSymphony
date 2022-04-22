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
  CachedFilesData,
} from 'Platform/Components/WorkOrders/CheckListItemTypes';
import type {
  ClockOutReason,
  FileInput,
  TechnicianWorkOrderCheckOutMutationVariables,
} from 'Platform/Relay/Mutations/__generated__/TechnicianWorkOrderCheckOutMutation.graphql';
import type {OfflineOptions} from 'Platform/Relay/RelayEnvironment';
import type {OfflineRecordCache} from '@wora/offline-first';
import type {OperationDescriptor} from 'relay-runtime';
import type {PhotoResponse} from 'Platform/Utils/UploadUtils';
import type {RelayEnvironmentSubscriber} from 'Platform/Relay/RelayEnvSubscriptionHandler';
import type {WorkOrdersCache} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

import LocalStorage from 'Platform/Services/LocalStorage';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import NetInfo from '@react-native-community/netinfo';
import TechnicianWorkOrderCheckOutMutation from 'Platform/Relay/Mutations/TechnicianWorkOrderCheckOutMutation';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ERROR, EVENT} from 'Platform/Consts/UserActionEvents';
import {isTempId} from '@fbcmobile/ui/Utils/IdUtils';
import {uploadEntityImage, uploadPhoto} from 'Platform/Utils/UploadUtils';
import {useCallback, useContext} from 'react';

type WorkOrderCheckOutCallback = (
  workOrderId: string,
  checkOutType: ClockOutReason,
  distanceMeters: ?number,
  comment: ?string,
  onUpload?: () => void,
  checkoutTime: ?any,
) => Promise<void>;

export const usePerformWorkOrderCheckOut = (): WorkOrderCheckOutCallback => {
  const {cache, markWorkOrderAsCheckedOut} = useContext(
    WorkOrderChecklistCacheContext,
  );

  const uploadPhotosAndSetKeys = async (
    checkListId: string,
    params: ?CachedFilesData,
  ): Promise<?$ReadOnlyArray<FileInput>> => {
    if (params == null) {
      return null;
    }

    const netInfo = await NetInfo.fetch();

    const fileInputs = [];

    // defer image upload until we have connectivity
    if (!netInfo.isConnected) {
      return fileInputs;
    }

    const filesToUpload = params.filter(file => file.status !== 'deleted');
    for (const file of filesToUpload) {
      let key: ?string = file.storeKey;
      if (file.status === 'added') {
        const photoResponse: PhotoResponse = {
          uri: file.fileName,
          fileName: file.fileName,
          mimeType: file.mimeType ?? 'image/jpeg',
          annotation: file.annotation,
        };

        try {
          key = netInfo.isConnected ? await uploadPhoto(photoResponse) : null;
        } catch (error) {
          UserActionLogger.logError({
            key: ERROR.ERROR_FAILED_UPLOADING_PHOTO,
            errorMessage: `Failed to upload photo for checklistitem with id: ${checkListId}. Err: ${error.toString()}`,
          });
        }
      }

      fileInputs.push({
        id: file.id,
        fileName: file.fileName,
        sizeInBytes: file.sizeInBytes,
        modificationTime:
          typeof file.modified === 'string'
            ? new Date(file.modified).getTime()
            : file.modified,
        mimeType: file.mimeType,
        storeKey: nullthrows(key),
        annotation: file.annotation,
      });
    }

    return fileInputs;
  };

  const performWorkOrderCheckOut = useCallback(
    (
      workOrderId,
      checkOutReason,
      distanceMeters,
      comment,
      onUpload,
      checkOutTime,
    ): Promise<void> => {
      const cachedWorkOrder = cache[workOrderId];
      if (cachedWorkOrder == null) {
        return Promise.resolve();
      }

      const getVariables = async (): Promise<TechnicianWorkOrderCheckOutMutationVariables> => {
        return {
          input: {
            workOrderId: workOrderId,
            reason: checkOutReason,
            comment,
            distanceMeters,
            checkOutTime,
            checkListCategories: await Promise.all(
              cachedWorkOrder.categories.slice().map(async category => {
                const items = await Promise.all(
                  category.checklist.slice().map(async item => {
                    let fileInputs;
                    if (item.type == 'files') {
                      fileInputs = await uploadPhotosAndSetKeys(
                        item.id,
                        item.files,
                      );
                    }

                    return {
                      ...item,
                      id: isTempId(item.id) ? null : item.id,
                      selectedEnumValues: item.selectedEnumValues
                        ? item.selectedEnumValues.join(',')
                        : undefined,
                      files: fileInputs,
                    };
                  }),
                );
                return {
                  id: category.id,
                  title: category.title,
                  checkList: items,
                };
              }),
            ),
          },
        };
      };

      return new Promise((resolve, reject) => {
        const showAndLogError = (error: Error) => {
          NavigationService.alert(
            'error',
            fbt(
              'Upload failed',
              'Error message title shown when the user data upload attempt failed',
            ),
            fbt(
              'Check your internet connection and try again.',
              'Error message shown when the user data upload attempt failed',
            ),
          );
          UserActionLogger.logError({
            key: ERROR.ERROR_TECHNICIAN_UPLOADED_DATA,
            errorMessage: error.toString(),
          });
        };

        const callbacks = {
          onCompleted: (_response, errors) => {
            if (errors != null && errors[0] != null) {
              showAndLogError(errors[0]);
              return reject();
            }

            markWorkOrderAsCheckedOut(workOrderId);
            UserActionLogger.logEvent({
              key: EVENT.SUCCESS_TECHNICIAN_UPLOADED_DATA,
            });
            onUpload && onUpload();
            resolve();
          },
          onError: error => {
            showAndLogError(error);
            reject(error);
          },
        };

        getVariables()
          .then(variables => {
            TechnicianWorkOrderCheckOutMutation(variables, callbacks);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    [cache, markWorkOrderAsCheckedOut],
  );

  return performWorkOrderCheckOut;
};

const handleOfflineWorkOrderCheckOutMutation = async (
  mutation: OfflineRecordCache<{|
    operation: OperationDescriptor,
  |}>,
): Promise<void> => {
  const workOrderId =
    mutation.request.payload.operation.request.variables?.input?.workOrderId;

  LocalStorage.getWorkOrdersCache().then(async stringifiedCache => {
    if (stringifiedCache == null) {
      return;
    }

    let cache: ?WorkOrdersCache = null;
    try {
      cache = JSON.parse(stringifiedCache);
    } catch (error) {
      UserActionLogger.logError({
        key: ERROR.ERROR_PARSING_WORK_ORDER_CACHE,
        errorMessage: `Failed to parse work orders cache when handling offline WO checkout: ${stringifiedCache}, error: ${error.toString()}`,
      });
    }

    if (cache == null) {
      return;
    }

    const cachedWorkOrder = cache[workOrderId];

    if (cachedWorkOrder == null || cachedWorkOrder.categories == null) {
      return;
    }

    return await Promise.all(
      cachedWorkOrder.categories.slice().map(async category => {
        await Promise.all(
          category.checklist
            .slice()
            .map(async (checkListItem: CachedCheckListItem) => {
              if (checkListItem.files == null) {
                return;
              }
              for (const file of checkListItem.files) {
                const photoResponse: PhotoResponse = {
                  uri: file.fileName,
                  fileName: file.fileName,
                  mimeType: file.mimeType ?? 'image/jpeg',
                  annotation: file.annotation,
                };

                await uploadEntityImage(
                  'CHECKLIST_ITEM',
                  checkListItem.id,
                  photoResponse,
                );
              }
              return;
            }),
        );
        return;
      }),
    );
  });
};

export const WorkOrderCheckOutEnvSubscriber: RelayEnvironmentSubscriber = {
  onComplete: (options: OfflineOptions): Promise<void> => {
    if (
      options.offlinePayload.request.payload.operation.fragment.node.name ===
      'TechnicianWorkOrderCheckOutMutation'
    ) {
      // after executing the check out mutation we need to upload the images
      return handleOfflineWorkOrderCheckOutMutation(options.offlinePayload);
    }

    return Promise.resolve();
  },
};

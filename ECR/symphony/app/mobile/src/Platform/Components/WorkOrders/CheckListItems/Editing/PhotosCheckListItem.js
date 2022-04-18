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
import type {CarouselData} from '@fbcmobile/ui/Components/FormInput/PhotoCarousel';

import AppContext from 'Platform/Context/AppContext';
import PhotoCarousel from '@fbcmobile/ui/Components/FormInput/PhotoCarousel';
import React, {useCallback, useContext, useMemo} from 'react';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import nullthrows from 'nullthrows';
import {getChecklistItemFileUri} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';

type Props = {|
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +hasError: boolean,
|};

const PhotosCheckListItem = ({
  workOrderId,
  categoryId,
  item,
  hasError,
}: Props) => {
  const {user} = useContext(AppContext);
  const {setCachedChecklistItem} = useContext(WorkOrderChecklistCacheContext);

  const onImageAdded = useCallback(
    (carouselItems: ?Array<CarouselData>, addedItem: CarouselData) => {
      const newItem = {
        fileName: addedItem.fileName,
        sizeInBytes: addedItem.fileSize,
        modified: addedItem.timestamp,
        mimeType: addedItem.mimeType,
        status: 'added',
      };

      setCachedChecklistItem(workOrderId, categoryId, item.id, {
        ...item,
        files: item.files ? [...item.files, newItem] : [newItem],
      });
    },
    [item, setCachedChecklistItem, workOrderId, categoryId],
  );

  const onImageDeleted = useCallback(
    (carouselResponse: ?Array<CarouselData>, deletedImage: CarouselData) => {
      if (item.files) {
        // find the itemIndex to mark as deleted
        const fileIndex = item.files.findIndex(
          file => file.fileName === deletedImage.fileName,
        );
        if (fileIndex != -1 && item.files != null) {
          const fileToRemove = item.files[fileIndex];
          // deleting an added file, can safely remove
          if (fileToRemove.status === 'added') {
            item.files.splice(fileIndex, 1);
          } else {
            // mark as deleted
            fileToRemove.status = 'deleted';
          }
        }

        setCachedChecklistItem(workOrderId, categoryId, item.id, {
          ...item,
          files: item.files,
        });
      }
    },
    [item, setCachedChecklistItem, workOrderId, categoryId],
  );

  const onCaptionAdded = useCallback(
    (
      carouselItems: ?Array<CarouselData>,
      image: CarouselData,
      caption: ?string,
    ) => {
      if (item.files) {
        const fileIndex = item.files.findIndex(
          file => file.fileName === image.fileName,
        );
        if (fileIndex != -1 && item.files != null) {
          const file = item.files[fileIndex];
          file.annotation = caption;
        }
      }

      setCachedChecklistItem(workOrderId, categoryId, item.id, {
        ...item,
        files: item.files ?? [],
      });
    },
    [item, setCachedChecklistItem, workOrderId, categoryId],
  );

  const carouselData = useMemo<Array<CarouselData>>(() => {
    const carouselItems = Array<CarouselData>();

    item.files
      ?.filter(file => file.status !== 'deleted')
      .forEach(file => {
        carouselItems.push({
          fileName: file.fileName,
          mimeType: file.mimeType,
          fileSize: file.sizeInBytes,
          uri: getChecklistItemFileUri(file, nullthrows(user)),
          timestamp: file.modified,
          annotation: file.annotation,
        });
      });

    return carouselItems;
  }, [item.files, user]);

  return (
    <PhotoCarousel
      title={item.title}
      description={item.helpText}
      data={carouselData}
      onAdded={onImageAdded}
      onDeleted={onImageDeleted}
      onAddCaption={onCaptionAdded}
      hasError={hasError}
      isMandatory={item.isMandatory ?? false}
    />
  );
};

export default PhotosCheckListItem;

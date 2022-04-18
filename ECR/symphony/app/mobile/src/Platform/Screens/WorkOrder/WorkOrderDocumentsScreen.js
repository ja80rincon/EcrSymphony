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

import type {NavigationNavigatorProps} from 'react-navigation';
import type {NavigationScreenConfig} from 'react-navigation';
import type {WorkOrderDocumentsScreenQueryResponse} from './__generated__/WorkOrderDocumentsScreenQuery.graphql'

import CachedPhotosSection from 'Platform/Components/CachedPhotosSection';
import React, {useCallback, useContext, useEffect} from 'react';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import fbt from 'fbt';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {ScrollView} from 'react-native';
import {Text} from '@99xt/first-born';
import {useWorkOrderCachedData} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import {fetchQuery} from 'relay-runtime';
import {graphql} from 'babel-plugin-relay/macro'
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';

const attatchmentsQuery = graphql`
  query WorkOrderDocumentsScreenQuery($workOrderId: ID!) {
    node(id: $workOrderId) {
      ... on WorkOrder {
        id
        images {
          id
          fileName
          storeKey
          mimeType
          sizeInBytes
          modified
          uploaded
          annotation
        }
      }
    }
  }
`;

const UPDATE_DELAY = 3000; // 3 seconds
let lastCall = null;

type Props = NavigationNavigatorProps<{}, {params: {workOrderId: string}}>;

const WorkOrderDocumentsScreen = (props: Props) => {
  const {navigation} = props;
  const workOrderId = nullthrows(navigation.getParam('workOrderId'));
  const cachedData = useWorkOrderCachedData(workOrderId);
  const {setCachedImageItem, resetCachedImages} = useContext(WorkOrderChecklistCacheContext);

  useEffect(() => {
    fetchQuery(RelayEnvironment, attatchmentsQuery, {workOrderId}).then((response: WorkOrderDocumentsScreenQueryResponse) => {
        if(response.node?.images) {
          const imagesArray = response.node.images.map(f => {
            return {
                id: f ? f.id : '',
                fileName: f ? f.fileName : '',
                storeKey: f ? f.storeKey : '',
                mimeType: f ? f.mimeType : '',
                sizeInBytes: f ? f.sizeInBytes : 0,
                modified: f ? f.modified : '',
                status: 'server',
                uploaded: f ? f.uploaded : '',
                annotation: f ? f.annotation : '',
              }
          })
          resetCachedImages(workOrderId, imagesArray)
        }
    })
  }, [])

  const _isUpdateBlocked = function(): boolean {
    const timeNow = Date.now();
    if (lastCall == null || timeNow > lastCall + UPDATE_DELAY) {
      lastCall = timeNow;
      return false;
    }
    lastCall = timeNow;
    return true;
  };

  const uploadImage = useCallback(
    photoResponse => {
      if (!photoResponse) {
        return;
      }
      const newItem = {
        fileName: photoResponse.fileName,
        sizeInBytes: photoResponse.fileSize,
        modified: photoResponse.timestamp,
        mimeType: photoResponse.mimeType,
        status: 'added',
      };
      setCachedImageItem(workOrderId, newItem);
    },
    [setCachedImageItem, workOrderId],
  );

  return (
    <ScrollView>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Title of the Attachments screen">Attachments</fbt>
      </Text>
      <CachedPhotosSection
        onUploadImage={uploadImage}
        images={cachedData?.images ? cachedData.images : []}
      />
    </ScrollView>
  );
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

WorkOrderDocumentsScreen.navigationOptions = options;

export default WorkOrderDocumentsScreen;

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

import type {PhotosViewOnlyCheckListItem_item} from './__generated__/PhotosViewOnlyCheckListItem_item.graphql';

import AppContext from 'Platform/Context/AppContext';
import LabeledTextSection from '@fbcmobile/ui/Components/LabeledTextSection';
import PhotoTile from '@fbcmobile/ui/Components/PhotoTile';
import React, {useContext} from 'react';
import nullthrows from 'nullthrows';
import {
  CHECKLIST_ITEM_NOT_APPLICABLE_LABEL,
  getChecklistItemFileUri,
} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {FlatList, StyleSheet} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = $ReadOnly<{|
  +item: PhotosViewOnlyCheckListItem_item,
|}>;

const PhotosViewOnlyCheckListItem = ({item}: Props) => {
  const {user} = useContext(AppContext);
  const fileUris =
    item.files != null
      ? item.files
          .map(file =>
            getChecklistItemFileUri(
              {...file, status: 'server'},
              nullthrows(user),
            ),
          )
          .filter(Boolean)
      : [];
  return (
    <LabeledTextSection
      title={item.title}
      content={
        fileUris != null && fileUris.length > 0 ? (
          <FlatList
            style={styles.listItem}
            data={fileUris}
            renderItem={({item}) => <PhotoTile photoData={item} />}
            keyExtractor={item => item}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          CHECKLIST_ITEM_NOT_APPLICABLE_LABEL
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginRight: 10,
  },
});

export default createFragmentContainer(PhotosViewOnlyCheckListItem, {
  item: graphql`
    fragment PhotosViewOnlyCheckListItem_item on CheckListItem {
      id
      title
      files {
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
  `,
});

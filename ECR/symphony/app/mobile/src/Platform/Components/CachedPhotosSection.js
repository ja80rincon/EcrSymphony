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

import type {CachedFileData} from 'Platform/Components/WorkOrders/CheckListItemTypes';
import type {PhotoResponse} from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';

import * as React from 'react';
import AppContext from 'Platform/Context/AppContext';
import PhotoPicker from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import Section from '@fbcmobile/ui/Components/Section';
import fbt from 'fbt';
import {Image} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {getChecklistItemFileUri} from 'Platform/Components/WorkOrders/CheckListItems/CheckListItemUtils';
import {useContext} from 'react';

type Props = {
  +onUploadImage: (photoResponse: ?PhotoResponse) => void,
  +images: $ReadOnlyArray<?CachedFileData>,
};

const CachedPhotosSection = ({images, onUploadImage}: Props) => {
  const {user} = useContext(AppContext);
  return (
    <Section title={<fbt desc="Section title for photos">Photos</fbt>}>
      <View style={styles.imagesContent}>
        <View style={styles.image}>
          <PhotoPicker
            title={fbt('Upload', 'Button text for uploading files').toString()}
            onSelect={onUploadImage}
            showPreview={false}
          />
        </View>
        {images.map(image => (
          <Image
            key={image?.id ?? image?.fileName}
            style={styles.image}
            source={{
              uri: image && user && getChecklistItemFileUri(image, user),
            }}
            resizeMode="contain"
          />
        ))}
      </View>
    </Section>
  );
};

const styles = StyleSheet.create({
  imagesContent: {
    margin: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    marginRight: 10,
    marginBottom: 10,
    width: 150,
    height: 100,
  },
});

export default CachedPhotosSection;

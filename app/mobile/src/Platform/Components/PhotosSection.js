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

import type {PhotoResponse} from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import type {PhotosSection_images} from './__generated__/PhotosSection_images.graphql';

import * as React from 'react';
import AppContext from 'Platform/Context/AppContext';
import PhotoPicker from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import Section from '@fbcmobile/ui/Components/Section';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import nullthrows from 'nullthrows';
import {Image} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {getDocumentUrl} from 'Platform/Consts/Constants';
import {useContext} from 'react';

type Props = {
  +isUploading: boolean,
  +onUploadImage: (photoResponse: ?PhotoResponse) => void,
  +images: PhotosSection_images,
};

const PhotosSection = ({images, onUploadImage, isUploading}: Props) => {
  const {user} = useContext(AppContext);
  return (
    <Section title={<fbt desc="Section title for photos">Photos</fbt>}>
      <View style={styles.imagesContent}>
        <View style={styles.image}>
          {isUploading ? (
            <SplashScreen
              text={fbt(
                'Uploading...',
                'Text that shows while the file is being uploaded',
              ).toString()}
            />
          ) : (
            <PhotoPicker
              title={fbt(
                'Upload',
                'Button text for uploading files',
              ).toString()}
              onSelect={onUploadImage}
              showPreview={false}
            />
          )}
        </View>
        {images.map(image => (
          <Image
            key={image.id}
            style={styles.image}
            source={{
              uri: getDocumentUrl(
                nullthrows(user).tenant,
                nullthrows(image.storeKey),
              ),
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

export default createFragmentContainer(PhotosSection, {
  images: graphql`
    fragment PhotosSection_images on File @relay(plural: true) {
      id
      storeKey
    }
  `,
});

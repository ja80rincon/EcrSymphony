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

import type {LocationDocumentsScreenDocumentsQueryResponse} from './__generated__/LocationDocumentsScreenDocumentsQuery.graphql';
import type {NavigationNavigatorProps} from 'react-navigation';
import type {NavigationScreenConfig} from 'react-navigation';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import PhotosSection from 'Platform/Components/PhotosSection';
import React, {useCallback, useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {ScrollView} from 'react-native';
import {Text} from '@99xt/first-born';
import {uploadEntityImage} from 'Platform/Utils/UploadUtils';

const imagesQuery = graphql`
  query LocationDocumentsScreenDocumentsQuery($locationId: ID!) {
    node(id: $locationId) {
      ... on Location {
        images {
          ...PhotosSection_images
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {locationId: string}}>;

const LocationDocumentsScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;
  const [isLoading, setIsLoading] = useState(false);
  const locationId = nullthrows(navigation.getParam('locationId'));

  const uploadImage = useCallback(
    photoResponse => {
      if (!photoResponse) {
        return;
      }

      setIsLoading(true);
      uploadEntityImage('LOCATION', locationId, photoResponse).then(() =>
        setIsLoading(false),
      );
    },
    [locationId],
  );

  return (
    <ScrollView style={styles.root}>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Title of the Attachments screen">Attachments</fbt>
      </Text>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironment}
        variables={{locationId}}
        query={imagesQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?LocationDocumentsScreenDocumentsQueryResponse,
            error: ?Error,
            retry: () => void,
            _cached: boolean,
          } = response;
          retryRef.current = retry;
          if (error) {
            return (
              <DataLoadingErrorPane
                retry={() => {
                  retryRef.current && retryRef.current();
                }}
              />
            );
          }

          if (!props || !props.node) {
            return (
              <SplashScreen
                text={fbt(
                  'Loading documents...',
                  'Loading message while loading location documents',
                )}
              />
            );
          }

          const {node} = props;
          if (!node.images) {
            return null;
          }

          return (
            <PhotosSection
              onUploadImage={uploadImage}
              images={node.images.filter(Boolean)}
              isUploading={isLoading}
            />
          );
        }}
      />
    </ScrollView>
  );
};
const styles = {
  root: {
    backgroundColor: Colors.BackgroundWhite,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

LocationDocumentsScreen.navigationOptions = options;

export default LocationDocumentsScreen;

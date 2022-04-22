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
  NavigationNavigatorProps,
  NavigationScreenConfig,
} from 'react-navigation';
import type {WorkOrderScreenQueryResponse} from 'Platform/Screens/__generated__/WorkOrderScreenQuery.graphql';

import Banner from '@fbcmobile/ui/Components/Core/Banner';
import Breadcrumbs from '@fbcmobile/ui/Components/Breadcrumbs';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import Divider from '@fbcmobile/ui/Components/Core/Divider';
import NavigationListItem from '@fbcmobile/ui/Components/NavigationListItem';
import React, {useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import ScrollViewWithBottomBar from '@fbcmobile/ui/Components/Core/ScrollViewWithBottomBar';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderChecklistNavigationListItem from 'Platform/Screens/WorkOrder/WorkOrderChecklistNavigationListItem';
import WorkOrderCommentsSection from 'Platform/Components/WorkOrders/WorkOrderCommentsSection';
import WorkOrderDetailsSection from 'Platform/Components/WorkOrders/WorkOrderDetailsSection';
import WorkOrderTechnicianActionBottomBar from 'Platform/Components/WorkOrders/WorkOrderTechnicianActionBottomBar';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {I18nManager, StyleSheet, View} from 'react-native';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {Toolbar} from 'react-native-material-ui';

const workOrderQuery = graphql`
  query WorkOrderScreenQuery($workOrderId: ID!) {
    node(id: $workOrderId) {
      __typename
      ... on WorkOrder {
        id
        name
        status
        location {
          id
          name
          locationHierarchy {
            id
            name
          }
        }
        ...WorkOrderDetailsSection_workOrder
        ...WorkOrderTechnicianActionBottomBar_workOrder
        ...WorkOrderCommentsSection_workOrder
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {workOrderId: string}}>;

const WorkOrderScreen = ({navigation}: Props) => {
  const [didTechnicianCheckIn, setDidTechnicianCheckIn] = useState(false);
  const [uploadDataBannerKey, setUploadDataBannerKey] = useState(0);
  const scrollViewRef = useRef(null);
  const retryRef = useRef(null);
  const workOrderId = navigation.getParam('workOrderId');
  return (
    <QueryRenderer
      fetchPolicy="store-or-network"
      ttl={QUERY_TTL_MS}
      environment={RelayEnvironment}
      query={workOrderQuery}
      variables={{
        workOrderId,
      }}
      render={response => {
        const {
          props,
          error,
          retry,
          _cached,
        }: {
          props: ?WorkOrderScreenQueryResponse,
          error: Error,
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

        if (!props) {
          return (
            <SplashScreen
              text={fbt(
                'Loading work order...',
                'Loading message while loading the work order',
              )}
            />
          );
        }

        const {node} = props;
        if (node == null || node.__typename !== 'WorkOrder') {
          return null;
        }
        const location = node.location;
        const locationHierarchy = location
          ? [
              ...location.locationHierarchy.map(l => ({
                name: l.name,
                id: l.id,
                type: 'location',
              })),
              {
                name: location.name,
                id: location.id,
                type: 'location',
              },
            ]
          : [];

        return (
          <View style={styles.root}>
            <Toolbar
              style={ApplicationStyles.screen.toolbar}
              leftElement={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
              onLeftElementPress={() => navigation.goBack()}
            />
            {didTechnicianCheckIn && (
              <Banner
                skin="green"
                message={fbt(
                  'Checked-in successfully',
                  'Message shown to the technician after he checked-in to a location',
                ).toString()}
              />
            )}
            {uploadDataBannerKey ? (
              <Banner
                key={uploadDataBannerKey}
                skin="green"
                message={fbt(
                  'The work order was uploaded successfully',
                  'Message shown to the technician after he uploaded data for this work order',
                ).toString()}
              />
            ) : null}
            <ScrollViewWithBottomBar
              ref={scrollViewRef}
              bottomBar={
                <WorkOrderTechnicianActionBottomBar
                  workOrder={node}
                  onTechnicianCheckedIn={() => setDidTechnicianCheckIn(true)}
                  onTechnicianUploadedData={() =>
                    setUploadDataBannerKey(
                      uploadDataBannerKey => uploadDataBannerKey + 1,
                    )
                  }
                />
              }>
              <View style={styles.details}>
                {locationHierarchy.length > 0 ? (
                  <Breadcrumbs
                    style={styles.breadcrumbs}
                    breadcrumbs={locationHierarchy}
                    onClick={b =>
                      navigation.navigate(Screens.LocationScreen, {
                        id: b.id,
                      })
                    }
                  />
                ) : null}
                <Text variant="h1" style={styles.name}>
                  {node.name}
                </Text>
                <WorkOrderDetailsSection workOrder={node} />
              </View>
              <Divider />
              <WorkOrderChecklistNavigationListItem
                navigation={navigation}
                workOrderId={node.id}
              />
              <NavigationListItem
                title={fbt('Properties', 'Title on a navigation menu')}
                onClick={() =>
                  navigation.navigate(Screens.WorkOrderPropertiesListScreen, {
                    workOrderId: node.id,
                  })
                }
                fullWidth={true}
              />
              <NavigationListItem
                title={fbt('Attachments', 'Title on a navigation menu')}
                onClick={() =>
                  navigation.navigate(Screens.WorkOrderDocumentsScreen, {
                    workOrderId: node.id,
                  })
                }
                fullWidth={true}
              />
              <WorkOrderCommentsSection
                workOrder={node}
                onUserSubmittedComment={() =>
                  scrollViewRef.current != null &&
                  // $FlowFixMe - T72031710
                  scrollViewRef.current.scrollToEnd({animated: true})
                }
              />
            </ScrollViewWithBottomBar>
          </View>
        );
      }}
    />
  );
};

const options: NavigationScreenConfig<*> = {
  headerShown: false,
  headerTitle: '',
};

WorkOrderScreen.navigationOptions = options;

const styles = StyleSheet.create({
  root: {
    height: '100%',
    display: 'flex',
  },
  breadcrumbs: {
    marginBottom: 2,
  },
  details: {
    paddingHorizontal: 20,
  },
  name: {
    marginBottom: 35,
  },
});

export default WorkOrderScreen;

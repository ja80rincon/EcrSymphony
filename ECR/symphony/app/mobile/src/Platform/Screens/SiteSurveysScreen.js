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

import type {NavigationDrawerProp} from 'react-navigation-drawer';
import type {NavigationScreenConfig} from 'react-navigation';
import type {NavigationStackProp} from 'react-navigation-stack';
import type {SiteSurveysScreenScreenLocationsNeedSiteSurveyQueryResponse} from 'Platform/Screens/__generated__/SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery.graphql';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import LocationListItem from 'Platform/Components/LocationListItem';
import React, {useRef} from 'react';
import RelayEnvironemnt from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import Toolbar from '@fbcmobile/ui/Components/Toolbar';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {Text} from '@99xt/first-born';
import {View} from 'react-native';

const locationsNeedSiteSurveyQuery = graphql`
  query SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery {
    locations(needsSiteSurvey: true) {
      edges {
        node {
          id
          name
          surveys {
            id
          }
          ...LocationListItem_location
        }
      }
    }
  }
`;

type Props = {
  +navigation: NavigationDrawerProp<{params: {}}> &
    NavigationStackProp<{params: {}}>,
};

const SiteSurveysScreen = (props: Props) => {
  const retryRef = useRef(null);
  const {navigation} = props;

  const navigateToLocation = (id: string) => {
    if (navigation.push) {
      navigation.push(Screens.LocationScreen, {
        id,
      });
    } else {
      throw new Error(
        fbt(
          'A navigation error occurred. Please try again or restart the app.',
          "Error message shown when navigating to a page that can't load",
        ),
      );
    }
  };

  return (
    <Toolbar
      onIconClicked={() => {
        if (navigation.openDrawer) {
          navigation.openDrawer();
          return;
        }
        throw new Error(
          fbt(
            'Menu not available',
            "Error message that appears when a user tries to navigate to the app's main menu and it is not available",
          ),
        );
      }}
      title={fbt('Site Surveys', 'Page title of Site Surveys page').toString()}
      onSearchClicked={() => {
        if (navigation.push) {
          navigation.push(Screens.LocationsSearchScreen);
        }
      }}>
      <QueryRenderer
        fetchPolicy="store-or-network"
        ttl={QUERY_TTL_MS}
        environment={RelayEnvironemnt}
        variables={{}}
        query={locationsNeedSiteSurveyQuery}
        render={response => {
          const {
            props,
            error,
            retry,
            _cached,
          }: {
            props: ?SiteSurveysScreenScreenLocationsNeedSiteSurveyQueryResponse,
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

          if (!props) {
            return (
              <SplashScreen
                text={fbt(
                  'Loading site surveys...',
                  'Loading message while loading the site surveys',
                )}
              />
            );
          }

          const {locations} = props;
          if (!locations || !locations.edges) {
            return null;
          }

          const validLocations = locations.edges
            .map(e => e?.node)
            .filter(Boolean);
          return (
            <View>
              <List
                emptyLabel={fbt(
                  'There are no site surveys for this site yet.',
                  'Empty state label',
                ).toString()}>
                {validLocations.map((location, i) => (
                  <ListItem
                    key={location.id}
                    id={location.id}
                    onItemClicked={() => navigateToLocation(location.id)}
                    hideDivider={i === validLocations.length - 1}>
                    <LocationListItem
                      location={location}
                      rightElement={
                        <Text style={styles.surveyCount} size="caption_big">
                          <fbt desc="Label showing the number of forms available">
                            <fbt:plural
                              many="forms"
                              showCount="yes"
                              count={location.surveys.length}>
                              form
                            </fbt:plural>
                          </fbt>
                        </Text>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </View>
          );
        }}
      />
    </Toolbar>
  );
};

const styles = {
  surveyCount: {
    textAlign: 'right',
    color: Colors.Blue,
  },
};

const options: NavigationScreenConfig<*> = {headerShown: false};
SiteSurveysScreen.navigationOptions = options;

export default SiteSurveysScreen;

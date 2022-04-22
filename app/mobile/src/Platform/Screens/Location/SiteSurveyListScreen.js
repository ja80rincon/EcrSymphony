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
import type {SiteSurveyListScreenQueryResponse} from './__generated__/SiteSurveyListScreenQuery.graphql';

import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import FilterBar from '@fbcmobile/ui/Components/FilterBar';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useCallback, useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import SurveyList from 'Platform/Components/SiteSurveys/SurveyList';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ApplicationStyles, Colors} from '@fbcmobile/ui/Theme';
import {FloatingButton, Text} from '@99xt/first-born';
import {NavigationEvents} from 'react-navigation';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {SearchBar} from 'react-native-elements';
import {View} from 'react-native';

const graphql = require('babel-plugin-relay/macro');

const surveysQuery = graphql`
  query SiteSurveyListScreenQuery($locationId: ID!) {
    node(id: $locationId) {
      ... on Location {
        id
        siteSurveyNeeded
        surveys {
          ...SurveyList_surveys
        }
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {locationId: string}}>;

const SiteSurveyListScreen = (props: Props) => {
  const retryRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const {navigation} = props;
  const locationId: string = nullthrows(navigation.getParam('locationId'));

  const [filter, setFilter] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const stopSearching = useCallback(() => {
    setSearchText('');
    setIsSearching(false);
  }, []);

  return (
    <View style={styles.root}>
      <NavigationEvents
        onWillFocus={() => {
          setRefresh(!refresh);
        }}
      />
      {isSearching ? (
        <SearchBar
          autoFocus
          clearButtonMode="always"
          platform="android"
          placeholder={fbt(
            'Search work orders...',
            'Placeholder text in a search bar',
          ).toString()}
          value={searchText}
          onChangeText={text => {
            setSearchText(text.toLowerCase());
          }}
          onBlur={stopSearching}
          onClear={stopSearching}
          onCancel={stopSearching}
        />
      ) : null}
      <View style={styles.surveyList}>
        <Text style={ApplicationStyles.screenTitle}>
          <fbt desc="Title of the Site Survey screen">Site Survey</fbt>
        </Text>
        <QueryRenderer
          fetchPolicy="store-or-network"
          ttl={QUERY_TTL_MS}
          environment={RelayEnvironment}
          variables={{locationId, refresh}}
          query={surveysQuery}
          render={response => {
            const {
              props,
              error,
              retry,
              _cached,
            }: {
              props: ?SiteSurveyListScreenQueryResponse,
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
                    'Loading site surveys...',
                    'Loading message while loading the site surveys',
                  )}
                />
              );
            }

            const {node} = props;
            return (
              <View style={styles.root}>
                <FilterBar
                  filter={filter}
                  numberOfResults={node.surveys?.length || 0}
                  possibleFilters={[
                    {
                      id: '0',
                      name: fbt(
                        'Most Recent',
                        'Option to filter a list by',
                      ).toString(),
                    },
                  ]}
                  onFilter={f => setFilter(f)}
                />
                <SurveyList
                  style={styles.surveyList}
                  locationId={locationId}
                  surveys={node.surveys}
                  searchText={searchText}
                  onPress={(locationId, completed) => {
                    if (completed) {
                      NavigationService.push(Screens.SurveyDoneScreen, {
                        locationId: locationId,
                      });
                    } else {
                      NavigationService.push(Screens.SurveyCategoriesScreen, {
                        locationId: locationId,
                      });
                    }
                  }}
                />
                {node.siteSurveyNeeded ? (
                  <FloatingButton
                    color={Colors.Blue}
                    size="default"
                    onPress={() => {
                      NavigationService.push(Screens.SurveyCategoriesScreen, {
                        locationId: locationId,
                      });
                    }}
                  />
                ) : null}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  surveyList: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
  },
  title: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

SiteSurveyListScreen.navigationOptions = options;

export default SiteSurveyListScreen;

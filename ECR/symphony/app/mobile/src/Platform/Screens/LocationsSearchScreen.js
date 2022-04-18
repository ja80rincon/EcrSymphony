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

import type {LocationsSearchScreenSearchQueryResponse} from './__generated__/LocationsSearchScreenSearchQuery.graphql';
import type {NavigationScreenConfig} from 'react-navigation';

import Colors from '@fbcmobile/ui/Theme/Colors';
import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import LocationListItem from 'Platform/Components/LocationListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useCallback, useRef} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import {Icon} from 'react-native-material-ui';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {Text} from '@99xt/first-born';
import {useState} from 'react';

const graphql = require('babel-plugin-relay/macro');

const locationsSearchQuery = graphql`
  query LocationsSearchScreenSearchQuery($name: String) {
    locations(first: 100, name: $name) {
      edges {
        node {
          id
          name
          locationType {
            id
            name
          }
          ...LocationListItem_location
        }
      }
    }
  }
`;

const LocationsSearchScreen = () => {
  const retryRef = useRef(null);
  const [searchText, setSearchText] = useState(null);
  const stopSearching = useCallback(() => setSearchText(null), []);
  return (
    <View style={styles.root}>
      <SearchBar
        autoFocus
        clearButtonMode="always"
        platform="android"
        placeholder={fbt(
          'Location name...',
          'Search bar placeholder text',
        ).toString()}
        cancelIcon={
          <TouchableOpacity onPress={stopSearching}>
            <Icon
              name="clear"
              iconSet="MaterialIcons"
              backgroundColor={Colors.Gray10}
            />
          </TouchableOpacity>
        }
        clearIcon={null}
        value={searchText}
        onChangeText={text => {
          setSearchText(text);
        }}
        onBlur={stopSearching}
      />
      <ScrollView>
        {!searchText ? (
          <Text style={styles.placeholder}>
            <fbt desc="Search field label">
              Start typing to search locations by name
            </fbt>
          </Text>
        ) : (
          <QueryRenderer
            fetchPolicy="store-or-network"
            ttl={QUERY_TTL_MS}
            environment={RelayEnvironment}
            variables={{
              name: searchText ?? null,
            }}
            query={locationsSearchQuery}
            render={response => {
              const {
                props,
                error,
                retry,
                _cached,
              }: {
                props: ?LocationsSearchScreenSearchQueryResponse,
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
                      'Loading locations...',
                      'Loading message while loading the locations',
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
                <List
                  style={styles.searchResultsList}
                  emptyLabel={fbt(
                    'No search results',
                    'Label shown when no search results where found',
                  ).toString()}>
                  {validLocations.map(location => (
                    <ListItem
                      key={location.id}
                      id={location.id}
                      onItemClicked={() =>
                        NavigationService.navigate(Screens.LocationScreen, {
                          id: location.id,
                        })
                      }>
                      <LocationListItem
                        location={location}
                        showSurveysCount={false}
                      />
                    </ListItem>
                  ))}
                </List>
              );
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  root: {
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  searchResultsList: {
    paddingLeft: 20,
  },
  placeholder: {
    marginLeft: 16,
  },
};
const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt(
    'Location Search',
    'Location Search screen title',
  ).toString(),
};

LocationsSearchScreen.navigationOptions = options;

export default LocationsSearchScreen;

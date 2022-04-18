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

import type {NavigationScreenConfig} from 'react-navigation';
import type {NavigationStackProp} from 'react-navigation-stack';
import type {SurveyCategoriesScreenQueryResponse} from 'Platform/Screens/Location/__generated__/SurveyCategoriesScreenQuery.graphql';
import type {SurveyCreateData} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';

import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import LocalStorage from 'Platform/Services/LocalStorage';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import SurveyCategoryList from 'Platform/Components/SiteSurveys/SurveyCategoryList';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {Button, Text} from '@99xt/first-born';
import {Colors} from '@fbcmobile/ui/Theme';
import {NavigationEvents} from '@react-navigation/core';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import {markSurveyCompleted} from 'Platform/Relay/Mutations/CreateSurveyUtils.js';

const graphql = require('babel-plugin-relay/macro');

const surveyCategoriesQuery = graphql`
  query SurveyCategoriesScreenQuery($locationId: ID!) {
    node(id: $locationId) {
      ... on Location {
        id
        name
        locationType {
          id
          name
          ...SurveyCategoryList_locationType
        }
      }
    }
  }
`;

type Props = {
  +navigation: NavigationStackProp<{params: {locationId: string}}>,
};

const SurveyCategoriesScreen = (props: Props) => {
  const retryRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [survey, setSurvey] = useState<?SurveyCreateData>(null);
  const {navigation} = props;
  const locationId: string = nullthrows(navigation.getParam('locationId'));

  const getSurvey = useCallback(() => {
    LocalStorage.getInProgressSurvey(locationId).then(survey => {
      setLoading(false);
      setSurvey(survey);
    });
  }, [locationId]);

  useEffect(() => {
    getSurvey();
  }, [getSurvey]);

  const markCompleted = useCallback(() => {
    markSurveyCompleted(locationId, () => {
      navigation &&
        navigation.replace(Screens.SurveyDoneScreen, {
          locationId: locationId,
        });
    });
  }, [locationId, navigation]);

  return loading ? (
    <SplashScreen
      text={fbt(
        'Loading site survey responses...',
        'Text on a loading screen when responses to site survey questions are being loaded',
      ).toString()}
    />
  ) : (
    <QueryRenderer
      fetchPolicy="store-or-network"
      ttl={QUERY_TTL_MS}
      environment={RelayEnvironment}
      variables={{locationId}}
      query={surveyCategoriesQuery}
      render={response => {
        const {
          props,
          error,
          retry,
          _cached,
        }: {
          props: ?SurveyCategoriesScreenQueryResponse,
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
                'Loading survey categories...',
                'Loading screen text shown while loading categories of information within a site survey',
              ).toString()}
            />
          );
        }

        const {node} = props;
        return (
          <View style={styles.root}>
            <NavigationEvents onWillFocus={() => getSurvey()} />
            <View style={styles.headerContainer}>
              <Text bold size="h4">
                {node.name}
              </Text>
              <View style={styles.detailsContainer}>
                <Text size="callout" style={styles.detailsText}>
                  <fbt desc="ID label for locations">
                    ID:
                    <fbt:param name="Location ID">{node.id}</fbt:param>
                  </fbt>
                </Text>
              </View>
            </View>
            <ScrollView>
              <SurveyCategoryList
                locationType={node.locationType}
                onClick={(locationTypeId: string, categoryId: string) => {
                  if (navigation.push) {
                    navigation.push(Screens.SurveyQuestionsScreen, {
                      locationId,
                      locationTypeId,
                      categoryId,
                    });
                  } else {
                    throw new Error(
                      fbt(
                        'A navigation error occurred. Please try again or restart the app.',
                        "Error message shown when navigating to a page that can't load",
                      ),
                    );
                  }
                }}
              />
            </ScrollView>
            {survey ? (
              <Button color={Colors.Blue} onPress={() => markCompleted()}>
                <Text>
                  <fbt desc="Done button label">Done</fbt>
                </Text>
              </Button>
            ) : null}
          </View>
        );
      }}
    />
  );
};

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  headerContainer: {
    padding: 20,
  },
  detailsContainer: {
    paddingVertical: 10,
  },
  detailsText: {
    letterSpacing: 0.5,
    color: Colors.Gray70,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

SurveyCategoriesScreen.navigationOptions = options;

export default SurveyCategoriesScreen;

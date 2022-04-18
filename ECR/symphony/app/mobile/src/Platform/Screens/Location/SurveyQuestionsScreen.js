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
import type {SurveyCreateData} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';
import type {SurveyQuestionsScreenQueryResponse} from './__generated__/SurveyQuestionsScreenQuery.graphql';

import DataLoadingErrorPane from '@fbcmobile/ui/Components/DataLoadingErrorPane';
import LocalStorage from 'Platform/Services/LocalStorage';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import SurveyQuestionList from 'Platform/Components/SiteSurveys/SurveyQuestionList';
import fbt from 'fbt';
import {Button, Text} from '@99xt/first-born';
import {Colors} from '@fbcmobile/ui/Theme';
import {QUERY_TTL_MS} from 'Platform/Consts/Constants';
import {QueryRenderer} from 'react-relay-offline';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import type {NavigationStackProp} from 'react-navigation-stack';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +navigation: NavigationStackProp<{
    params: {locationId: string, locationTypeId: string, categoryId: string},
  }>,
};

const surveyCategoryQuery = graphql`
  query SurveyQuestionsScreenQuery($locationTypeId: ID!) {
    node(id: $locationTypeId) {
      ... on LocationType {
        id
        name
        surveyTemplateCategories {
          id
          categoryTitle
          categoryDescription
          ...SurveyQuestionList_category
          surveyTemplateQuestions {
            id
          }
        }
      }
    }
  }
`;

const SurveyQuestionsScreen = (props: Props) => {
  const retryRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [survey, setSurvey] = useState<?SurveyCreateData>(null);
  const {navigation} = props;
  const locationId = navigation.getParam('locationId');
  const locationTypeId = navigation.getParam('locationTypeId');
  const categoryId = navigation.getParam('categoryId');

  const getSurvey = useCallback(() => {
    LocalStorage.getInProgressSurvey(locationId).then(survey => {
      setLoading(false);
      setSurvey(survey);
    });
  }, [locationId]);

  useEffect(() => {
    getSurvey();
  }, [getSurvey]);

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
      variables={{locationTypeId: locationTypeId}}
      query={surveyCategoryQuery}
      render={response => {
        const {
          props,
          error,
          retry,
          _cached,
        }: {
          props: ?SurveyQuestionsScreenQueryResponse,
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
                'Loading survey category...',
                'Loading screen text shown while loading a category of information within a site survey',
              ).toString()}
            />
          );
        }

        const {node} = props;
        const locationTypeName = node?.name;
        const categories = node?.surveyTemplateCategories;
        const category = categories
          ? categories.find(category => category?.id === categoryId)
          : null;
        return (
          <View style={styles.root}>
            <View style={styles.headerContainer}>
              <Text bold size="h4">
                {category?.categoryTitle}
              </Text>
              <View style={styles.detailsContainer}>
                <Text size="callout" style={styles.detailsText}>
                  {category?.categoryDescription}
                </Text>
              </View>
            </View>
            <ScrollView>
              <SurveyQuestionList
                locationTypeName={locationTypeName}
                category={category}
                categoryId={category?.id}
                categoryTitle={category?.categoryTitle}
                categoryDescription={category?.categoryDescription}
                locationId={locationId}
                survey={survey}
              />
            </ScrollView>
            <Button
              color={Colors.Blue}
              onPress={() => navigation.pop && navigation.pop()}>
              <Text bold>
                <fbt desc="Back button label">Back</fbt>
              </Text>
            </Button>
          </View>
        );
      }}
    />
  );
};

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

SurveyQuestionsScreen.navigationOptions = options;

export default SurveyQuestionsScreen;

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

import type {SurveyList_surveys} from 'Platform/Components/SiteSurveys/__generated__/SurveyList_surveys.graphql';

import LocalStorage from 'Platform/Services/LocalStorage';
import PillsView from '@fbcmobile/ui/Components/PillsView';
import React, {useCallback, useEffect, useState} from 'react';
import StatusPill from '@fbcmobile/ui/Components/StatusPill';
import fbt from 'fbt';
import moment from 'moment';
import {Colors} from '@fbcmobile/ui/Theme';
import {Divider} from 'react-native-material-ui';
import {ScrollView} from 'react-native';
import {Statuses} from '@fbcmobile/ui/Components/StatusPill';
import {Text} from '@99xt/first-born';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import type {Status} from '@fbcmobile/ui/Components/StatusPill';

const graphql = require('babel-plugin-relay/macro');

import type {
  SurveyCreateData,
  SurveyStatus,
} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';

type Props = {
  +locationId: string,
  +surveys: ?SurveyList_surveys,
  +searchText: string,
  +onPress: (string, boolean) => void,
};

const SurveyList = (props: Props) => {
  const [
    pendingSurveys,
    setPendingSurveys,
  ] = useState<?Array<SurveyCreateData>>([]);
  const {locationId, surveys, searchText, onPress} = props;

  function navigateCallback(callback, locationId, completed) {
    callback(locationId, completed);
  }

  // Helper function to cast from a SurveyStatus flow type to a Status flow type
  const castStatus = (status: ?SurveyStatus): ?Status => {
    switch (status) {
      case 'PLANNED':
        return Statuses.PLANNED;
      case 'INPROGRESS':
        return Statuses.PENDING;
      case 'COMPLETED':
        return Statuses.DONE;
    }
    return null;
  };

  const loadSavedSurveys = useCallback(() => {
    LocalStorage.getSurveys(locationId).then(surveys => {
      setPendingSurveys(surveys);
    });
  }, [locationId]);

  useEffect(() => loadSavedSurveys(), [loadSavedSurveys]);
  return (
    <ScrollView style={styles.root}>
      {pendingSurveys
        ? pendingSurveys.map(survey => {
            const status = castStatus(survey.status);
            return (
              <TouchableOpacity
                key={survey.creationTimestamp}
                style={styles.surveyContainer}
                onPress={() => {
                  navigateCallback(
                    onPress,
                    locationId,
                    status === Statuses.DONE,
                  );
                }}>
                <View style={styles.surveyHeaderContainer}>
                  <Text style={styles.surveyTitle}>{survey.name}</Text>
                  <Text style={styles.formCount} size="caption_big">
                    <fbt desc="Text that shows the number of categories in a survey">
                      <fbt:plural
                        many="categories"
                        showCount="yes"
                        count={survey.surveyResponses.length}>
                        category
                      </fbt:plural>
                    </fbt>
                  </Text>
                </View>
                {survey.creationTimestamp && (
                  <PillsView>
                    {status && <StatusPill status={status} />}
                    <Text style={styles.surveyUploadedText} size="callout">
                      <fbt desc="Text that shows the date the survey was created">
                        Created On
                        <fbt:param name="Date value">
                          {moment
                            .unix(survey.creationTimestamp)
                            .format('M/DD/YY h:mma')}
                        </fbt:param>
                      </fbt>
                    </Text>
                  </PillsView>
                )}
                <Divider style={styles.divider} />
              </TouchableOpacity>
            );
          })
        : null}
      {surveys &&
        surveys
          .filter(survey => survey.name.toLowerCase().includes(searchText))
          .map(survey => (
            <TouchableOpacity key={survey.id} style={styles.surveyContainer}>
              <View style={styles.surveyHeaderContainer}>
                <Text style={styles.surveyTitle}>{survey.name}</Text>
                <Text style={styles.formCount} size="caption_big">
                  <fbt desc="Text that shows the number of categories in a survey">
                    <fbt:plural
                      many="categories"
                      showCount="yes"
                      count={survey.surveyResponses.length}>
                      category
                    </fbt:plural>
                  </fbt>
                </Text>
              </View>
              {survey.completionTimestamp && (
                <PillsView>
                  <StatusPill status={Statuses.DONE} />
                  <Text style={styles.surveyUploadedText} size="callout">
                    <fbt desc="Text that shows the date the survey was uploaded">
                      Uploaded on
                      <fbt:param name="Date value">
                        {moment
                          .unix(survey.completionTimestamp)
                          .format('M/DD/YY h:mma')}
                      </fbt:param>
                    </fbt>
                  </Text>
                </PillsView>
              )}
              <Divider style={styles.divider} />
            </TouchableOpacity>
          ))}
    </ScrollView>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  surveyContainer: {
    padding: 15,
    paddingBottom: 0,
  },
  surveyHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  surveyTitle: {
    letterSpacing: 0.5,
    color: Colors.Blue,
    flexGrow: 1,
    flexShrink: 1,
  },
  formCount: {
    textAlign: 'right',
    color: Colors.Purple,
  },
  surveyUploadedText: {
    paddingVertical: 10,
    color: Colors.Gray70,
  },
  divider: {
    marginRight: 20,
  },
};

export default createFragmentContainer(SurveyList, {
  surveys: graphql`
    fragment SurveyList_surveys on Survey @relay(plural: true) {
      id
      name
      completionTimestamp
      surveyResponses {
        questionText
      }
    }
  `,
});

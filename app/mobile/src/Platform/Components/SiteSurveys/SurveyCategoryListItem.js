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

import {createFragmentContainer} from 'react-relay-offline';
import type {SurveyCategoryListItem_category} from 'Platform/Components/SiteSurveys/__generated__/SurveyCategoryListItem_category.graphql';

import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +category: SurveyCategoryListItem_category,
};

const SurveyCategoryListItem = (props: Props) => {
  const {
    categoryTitle,
    categoryDescription,
    surveyTemplateQuestions,
  } = props.category;
  const numQuestions = surveyTemplateQuestions?.length || 0;
  return (
    <View style={styles.root}>
      <View style={styles.categoryHeaderContainer}>
        <Text style={styles.categoryTitle} weight="bold" color="gray">
          {categoryTitle}
        </Text>
        <Text style={styles.questionCount} variant="h7">
          <fbt desc="Text that shows the number of questions">
            <fbt:plural many="questions" showCount="yes" count={numQuestions}>
              question
            </fbt:plural>
          </fbt>
        </Text>
      </View>
      <Text style={styles.categoryDescription} variant="h6">
        {categoryDescription}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  categoryHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    letterSpacing: 0.5,
    flexGrow: 1,
    flexShrink: 1,
  },
  questionCount: {
    textAlign: 'right',
    color: Colors.Blue,
  },
  categoryDescription: {
    marginTop: 10,
    color: Colors.Gray70,
  },
});

export default createFragmentContainer(SurveyCategoryListItem, {
  category: graphql`
    fragment SurveyCategoryListItem_category on SurveyTemplateCategory {
      id
      categoryTitle
      categoryDescription
      ...SurveyQuestionList_category
      surveyTemplateQuestions {
        id
        questionTitle
      }
    }
  `,
});

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
import type {SurveyCreateData} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';
import type {SurveyQuestionList_category} from 'Platform/Components/SiteSurveys/__generated__/SurveyQuestionList_category.graphql';

import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import React from 'react';
import SurveyQuestionListItem from 'Platform/Components/SiteSurveys/SurveyQuestionListItem';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer} from 'react-relay-offline';

type Props = {
  +locationTypeName: string,
  +category: SurveyQuestionList_category,
  +locationId: string,
  +categoryId: string,
  +categoryTitle: string,
  +categoryDescription: string,
  +survey: ?SurveyCreateData,
};

const SurveyQuestionList = (props: Props) => {
  const {
    category,
    categoryId,
    categoryTitle,
    categoryDescription,
    locationId,
    locationTypeName,
    survey,
  } = props;
  const responses = survey?.surveyResponses;
  const listItems =
    (category &&
      category.surveyTemplateQuestions &&
      category.surveyTemplateQuestions.map(question => {
        const response =
          responses &&
          responses.find(r => {
            return r.questionText == question?.questionTitle;
          });
        return question ? (
          <ListItem key={question.id} id={question.id}>
            <SurveyQuestionListItem
              locationTypeName={locationTypeName}
              question={question}
              locationId={locationId}
              categoryId={categoryId}
              categoryTitle={categoryTitle}
              categoryDescription={categoryDescription}
              response={response}
            />
          </ListItem>
        ) : null;
      })) ||
    [];

  return (
    <List
      style={styles.list}
      emptyLabel="No survey questions for this category">
      {listItems.filter(Boolean)}
    </List>
  );
};

const styles = {
  list: {
    paddingLeft: 20,
  },
};

export default createFragmentContainer(SurveyQuestionList, {
  category: graphql`
    fragment SurveyQuestionList_category on SurveyTemplateCategory {
      surveyTemplateQuestions {
        id
        questionTitle
        ...SurveyQuestionListItem_question
      }
    }
  `,
});

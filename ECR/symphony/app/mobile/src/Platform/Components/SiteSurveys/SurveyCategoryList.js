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
import type {SurveyCategoryList_locationType} from 'Platform/Components/SiteSurveys/__generated__/SurveyCategoryList_locationType.graphql';

import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import React from 'react';
import SurveyCategoryListItem from 'Platform/Components/SiteSurveys/SurveyCategoryListItem';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer} from 'react-relay-offline';

type Props = {
  +locationType: SurveyCategoryList_locationType,
  +onClick: (string, string) => void,
};

const SurveyCategoryList = (props: Props) => {
  function navigateCallback(callback, locationTypeId, categoryId) {
    callback(locationTypeId, categoryId);
  }

  const {locationType, onClick} = props;
  const listItems =
    (locationType &&
      locationType.surveyTemplateCategories &&
      locationType.surveyTemplateCategories.map(category =>
        category ? (
          <ListItem
            key={category.id}
            id={category.id}
            onItemClicked={() =>
              navigateCallback(onClick, locationType.id, category.id)
            }>
            <SurveyCategoryListItem category={category} />
          </ListItem>
        ) : null,
      )) ||
    [];

  return (
    <List style={styles.list} emptyLabel="No survey categories">
      {listItems.filter(Boolean)}
    </List>
  );
};

const styles = {
  list: {
    paddingLeft: 20,
  },
};

const container = createFragmentContainer(SurveyCategoryList, {
  locationType: graphql`
    fragment SurveyCategoryList_locationType on LocationType {
      id
      surveyTemplateCategories {
        id
        ...SurveyCategoryListItem_category
        ...SurveyQuestionList_category
      }
    }
  `,
});

export default container;

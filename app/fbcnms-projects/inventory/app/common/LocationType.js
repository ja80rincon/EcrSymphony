/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {LocationTypeNodesQuery} from './__generated__/LocationTypeNodesQuery.graphql';
import type {LocationType2DocumentCategoryNodesQuery} from './__generated__/LocationType2DocumentCategoryNodesQuery.graphql';
import type {LocationTypePropertyCategoryNodesQuery} from './__generated__/LocationTypePropertyCategoryNodesQuery.graphql';
import type {NamedNode, OptionalNamedNode} from './EntUtils';
import type {PropertyType} from './PropertyType';
import type {DocumentCategoryType} from './DocumentCategoryType';
import type {SurveyQuestionType} from '../components/configure/__generated__/AddEditLocationTypeCard_editingLocationType.graphql.js';

import {graphql} from 'relay-runtime';
import {useLazyLoadQuery} from 'react-relay/hooks';

export type LocationType = {
  ...NamedNode,
  mapType: string,
  mapZoomLevel: string,
  propertyTypes: Array<PropertyType>,
  documentCategories: Array<DocumentCategoryType>,
  numberOfLocations: number,
  surveyTemplateCategories: SurveyTemplateCategory[],
  isSite: boolean,
  index?: number,
};

export type SurveyTemplateCategory = {
  id: string,
  categoryTitle: string,
  categoryDescription: string,
  surveyTemplateQuestions: SurveyTemplateQuestion[],
};

export type SurveyTemplateQuestion = {
  id: string,
  questionTitle: string,
  questionDescription: string,
  questionType: SurveyQuestionType,
  index: number,
};

export type LocationTypeIndex = {
  locationTypeID: string,
  index: number,
};

const locationTypeNodesQuery = graphql`
  query LocationTypeNodesQuery {
    locationTypes {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const locationTypeNodesOnDocumentQuery = graphql`
  query LocationTypeNodesOnDocumentQuery {
    locationTypes {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const locationType2DocumentCategoryNodesQuery = graphql`
  query LocationType2DocumentCategoryNodesQuery($ltID: ID) {
    documentCategories(locationTypeID: $ltID) {
      totalCount
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const locationTypePropertyCategoryQuery = graphql`
  query LocationTypePropertyCategoryNodesQuery {
    propertyCategories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export type LocationTypeNode = $Exact<NamedNode>;
export type DocumentCategoryNode = $Exact<OptionalNamedNode>;

export function useLocationTypeNodes(): $ReadOnlyArray<LocationTypeNode> {
  const response = useLazyLoadQuery<LocationTypeNodesQuery>(
    locationTypeNodesQuery,
    {},
  );
  const locationTypesData = response.locationTypes?.edges || [];
  const locationTypes = locationTypesData.map(p => p.node).filter(Boolean);
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  return locationTypes;
}

export function useLocationTypeNodesOnDocuments(): $ReadOnlyArray<LocationTypeNode> {
  const response = useLazyLoadQuery<LocationTypeNodesQuery>(
    locationTypeNodesOnDocumentQuery,
    {},
  );
  const locationTypesData = response.locationTypes?.edges || [];
  const locationTypes = locationTypesData.map(p => p.node).filter(Boolean);
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  return locationTypes;
}
// TODO : location con id parameters
export function useLocationTypePropertyCategoryQuery(): $ReadOnlyArray<DocumentCategoryNode> {
  const response = useLazyLoadQuery<LocationTypePropertyCategoryNodesQuery>(
    locationTypePropertyCategoryQuery,
    {},
  );
  const locationTypesData = response.propertyCategories?.edges || [];
  const locationTypes = [
    {id: '@tmp', name: 'General'},
    ...locationTypesData.map(p => p.node).filter(Boolean),
  ];
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  return locationTypes;
}

export function useDocumentCategoryByLocationTypeNodes(
  locationTypeID: ?string,
): $ReadOnlyArray<DocumentCategoryNode> {
  const response = useLazyLoadQuery<LocationType2DocumentCategoryNodesQuery>(
    locationType2DocumentCategoryNodesQuery,
    {ltID: locationTypeID},
  );
  const locationTypesData = response.documentCategories?.edges || [];
  const documentCategory = locationTypesData.map(p => p.node).filter(Boolean);
  // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
  return documentCategory;
}

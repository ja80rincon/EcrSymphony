/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {EntityType} from '../ComparisonViewTypes';
import type {PropertyType} from '../../../common/PropertyType';

import RelayEnvironment from '../../../common/RelayEnvironment';
import {getListableProperties, getPossibleProperties} from '../FilterUtils';
import {graphql} from 'relay-runtime';
import {useGraphQL} from '@fbcnms/ui/hooks';
import {useMemo} from 'react';

const propertiesQuery = graphql`
  query propertiesHookPossiblePropertiesQuery($entityType: PropertyEntity!) {
    possibleProperties(entityType: $entityType) {
      name
      type
      stringValue
      isListable
    }
  }
`;

const usePropertyFilters = (entityType: EntityType): ?Array<PropertyType> => {
  // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
  const propertiesResponse = useGraphQL(RelayEnvironment, propertiesQuery, {
    entityType: entityType.toString().toUpperCase(),
  });

  return useMemo(() => {
    if (propertiesResponse.response === null) {
      return null;
    }
    if (entityType === 'project') {
      return getListableProperties(propertiesResponse.response);
    } else {
      return getPossibleProperties(propertiesResponse.response);
    }
  }, [propertiesResponse.response]);
};

export default usePropertyFilters;

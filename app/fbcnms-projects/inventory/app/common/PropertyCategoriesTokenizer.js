/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {TokenizerDisplayProps} from '@symphony/design-system/components/Token/Tokenizer';

import * as React from 'react';
import StaticNamedNodesTokenizer from './StaticNamedNodesTokenizer';
import {usePropertyCategoryNodes} from './PropertyCategory';

type LocationTypesTokenizerProps = $ReadOnly<{|
  ...TokenizerDisplayProps,
  selectedLocationTypeIds?: ?$ReadOnlyArray<string>,
  onSelectedLocationTypesIdsChange?: ($ReadOnlyArray<string>) => void,
|}>;

function PropertyCategoriesTokenizer(props: LocationTypesTokenizerProps) {
  const {
    selectedLocationTypeIds,
    onSelectedLocationTypesIdsChange,
    ...rest
  } = props;

  const propertyCategories = usePropertyCategoryNodes({
    orderBy: {
      field: 'INDEX',
      direction: 'ASC',
    },
  }).map(el => ({id: el.id, name: el.name || ''}));

  return (
    <StaticNamedNodesTokenizer
      allNamedNodes={propertyCategories}
      selectedNodeIds={selectedLocationTypeIds}
      onSelectedNodeIdsChange={onSelectedLocationTypesIdsChange}
      {...rest}
    />
  );
}

export default PropertyCategoriesTokenizer;

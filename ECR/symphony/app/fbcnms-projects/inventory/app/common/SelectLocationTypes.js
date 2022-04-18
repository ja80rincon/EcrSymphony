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
import StaticNamedNodesTokenizerBySelect from './StaticNamedNodesTokenizerBySelect';
import Select from '@symphony/design-system/components/Select/Select';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';
import {
  useLocationTypeNodesOnDocuments,
  useDocumentCategoryByLocationTypeNodes,
} from './LocationType';
import {useState, useCallback} from 'react';

const useStyles = makeStyles(() => ({
  paddingTopBottom: {
    paddingTop: '16px',
  },
  paddingBottom: {
    paddingBottom: '16px',
  },
}));

type LocationTypesTokenizerProps = $ReadOnly<{|
  ...TokenizerDisplayProps,
  selectLocationIdOnDocumentCategory: ?number,
  selectedDocumentCategoriesIds?: ?$ReadOnlyArray<string>,
  onSelectedLocationTypesIdsChange?: ($ReadOnlyArray<string>) => void,
  onSelectChange: string => void,
|}>;

function SelectLocationTypes(props: LocationTypesTokenizerProps) {
  const classes = useStyles();
  const {
    selectLocationIdOnDocumentCategory,
    onSelectedLocationTypesIdsChange,
    selectedDocumentCategoriesIds,
    onSelectChange,
    ...rest
  } = props;
  const locationTypes = useLocationTypeNodesOnDocuments();

  const [selectedLocationValue, setSelectedLocationValue] = useState(
    selectLocationIdOnDocumentCategory !== 0
      ? selectLocationIdOnDocumentCategory?.toString()
      : null,
  );

  const documentCategoriesByLocationTypeID = useDocumentCategoryByLocationTypeNodes(
    selectedLocationValue,
  );

  const callOnSelectChange = useCallback(
    (newLocation: string) => {
      if (!onSelectChange) {
        return;
      }
      onSelectChange(newLocation);
      setSelectedLocationValue(newLocation);
    },
    [onSelectChange],
  );

  return (
    <>
      <Select
        disabled={props.disabled}
        label="Location"
        options={locationTypes.map(location => ({
          key: location.id,
          label: location.name,
          value: location.id,
        }))}
        selectedValue={selectedLocationValue}
        size="full"
        onChange={callOnSelectChange}
      />

      <Text variant="subtitle1" className={classes.paddingTopBottom}>
        <fbt desc="">Documents</fbt>
      </Text>
      <Text variant="body2" color="gray" className={classes.paddingBottom}>
        <fbt desc="">Choose Document Categories this policy applies to</fbt>
      </Text>
      {selectedLocationValue && (
        <StaticNamedNodesTokenizerBySelect
          allNamedNodes={documentCategoriesByLocationTypeID}
          selectedNodeIds={selectedDocumentCategoriesIds}
          onSelectedNodeIdsChange={onSelectedLocationTypesIdsChange}
          {...rest}
        />
      )}
    </>
  );
}

export default SelectLocationTypes;

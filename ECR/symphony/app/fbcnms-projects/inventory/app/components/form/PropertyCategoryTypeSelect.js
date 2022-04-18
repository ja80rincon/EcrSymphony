/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {PropertyType} from '../../common/PropertyType';

import AppContext from '@fbcnms/ui/context/AppContext';
import React, {useContext, useMemo} from 'react';
import Select from '@symphony/design-system/components/Select/Select';
import {useState} from 'react';
import {useLocationTypePropertyCategoryQuery} from '../../common/LocationType';

type Props = $ReadOnly<{|
  propertyType: PropertyType,
  onCategoryChange?: (propertyType: PropertyType) => void,
|}>;

export const PropertyCategoryTypeSelect = ({
  propertyType,
  onCategoryChange,
}: Props) => {
  const [category, setCategory] = useState(1);
  const context = useContext(AppContext);
  const propertyCategories = useLocationTypePropertyCategoryQuery();

  const options = useMemo(
    () =>
      propertyCategories.map(type => ({
        key: type?.id,
        value: type?.id,
        label: type.name || '',
      })),
    [context],
  );

  if (propertyType.propertyCategory === null) {
    propertyType.propertyCategory = {
      id: '@tmp',
      name: 'General',
    };
  }

  const selectedValueIndex = useMemo(
    () =>
      options.findIndex(
        val =>
          val.key === propertyType.propertyCategory?.id ||
          (propertyType.propertyCategory?.id === null && val.key === '@tmp'),
      ),
    [options, propertyType],
  );

  return (
    <Select
      options={options}
      selectedValue={
        selectedValueIndex > -1 ? options[selectedValueIndex].value : null
      }
      onChange={data => {
        onCategoryChange &&
          onCategoryChange({
            ...propertyType,
            propertyCategory: {id: data, name: ''},
          });
      }}
    />
  );
};

export default PropertyCategoryTypeSelect;

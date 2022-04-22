/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {FilterProps} from '../comparison_view/ComparisonViewTypes';

import * as React from 'react';
import MutipleSelectInput from '../comparison_view/MutipleSelectInput';
import PowerSearchFilter from '../comparison_view/PowerSearchFilter';
import {useStatusValues} from '../../common/FilterTypesFlow';

const PowerSearchFlowInstanceStatusFilter = (props: FilterProps) => {
  const {
    value,
    onInputBlurred,
    onValueChanged,
    onRemoveFilter,
    editMode,
  } = props;
  const {statusValues} = useStatusValues();
  return (
    <PowerSearchFilter
      name="Status"
      operator={value.operator}
      editMode={editMode}
      value={(value.stringSet ?? [])
        .map(
          value => statusValues.find(status => status.value === value)?.label,
        )
        .join(', ')}
      onRemoveFilter={onRemoveFilter}
      input={
        <MutipleSelectInput
          options={statusValues.map(({value, label}) => ({value, label}))}
          onSubmit={onInputBlurred}
          onBlur={onInputBlurred}
          value={value.stringSet ?? []}
          onChange={newEntries => {
            onValueChanged({
              id: value.id,
              key: value.key,
              name: value.name,
              operator: value.operator,
              stringSet: newEntries,
            });
          }}
        />
      }
    />
  );
};

export default PowerSearchFlowInstanceStatusFilter;

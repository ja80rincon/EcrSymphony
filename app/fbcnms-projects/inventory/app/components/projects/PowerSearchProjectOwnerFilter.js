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

import PowerSearchWorkOrderGeneralUserFilter from '../work_orders/PowerSearchWorkOrderGeneralUserFilter';
import React from 'react';
import {fbt} from 'fbt';

const PowerSearchProjectOwnerFilter = (props: FilterProps) => {
  const {
    value,
    onInputBlurred,
    onValueChanged,
    onRemoveFilter,
    editMode,
    config,
    onNewInputBlurred,
  } = props;

  return (
    <PowerSearchWorkOrderGeneralUserFilter
      config={config}
      value={value}
      onInputBlurred={onInputBlurred}
      onValueChanged={onValueChanged}
      onRemoveFilter={onRemoveFilter}
      onNewInputBlurred={value => onNewInputBlurred(value)}
      editMode={editMode}
      title={fbt('Owner', '')}
    />
  );
};

export default PowerSearchProjectOwnerFilter;

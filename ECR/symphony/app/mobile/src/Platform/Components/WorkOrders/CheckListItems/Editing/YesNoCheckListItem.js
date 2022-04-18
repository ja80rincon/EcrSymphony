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

import type {CachedCheckListItem} from 'Platform/Components/WorkOrders/CheckListItemTypes';
import type {YesNoResponse} from './__generated__/YesNoCheckListItem_item.graphql';

import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import React, {useContext} from 'react';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import fbt from 'fbt';
import {Fonts} from '@fbcmobile/ui/Theme';
import {RadioButton} from 'react-native-material-ui';
import {StyleSheet, View} from 'react-native';

type Props = {|
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +hasError: boolean,
|};

export const YesNoOptions: Array<{
  label: string,
  value: YesNoResponse,
}> = [
  {
    label: `${fbt('Yes', 'Yes question response')}`,
    value: 'YES',
  },
  {
    label: `${fbt('No', 'No question response')}`,
    value: 'NO',
  },
];

const YesNoCheckListItem = ({
  workOrderId,
  categoryId,
  item,
  hasError,
}: Props) => {
  const {setCachedChecklistItem} = useContext(WorkOrderChecklistCacheContext);

  return (
    <FormInput
      title={item.title}
      description={item.helpText}
      hasError={hasError}
      isMandatory={item.isMandatory ?? false}>
      <View style={styles.container}>
        {YesNoOptions.map(option => (
          <RadioButton
            key={option.value}
            label={option.label}
            size={36}
            style={{
              container: styles.radioContainer,
              label: styles.radioLabel,
              icon: styles.radioIcon,
            }}
            checked={item.yesNoResponse === option.value}
            value={option.value}
            onSelect={() =>
              setCachedChecklistItem(workOrderId, categoryId, item.id, {
                ...item,
                yesNoResponse: option.value,
              })
            }
          />
        ))}
      </View>
    </FormInput>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  radioContainer: {
    flex: 0,
    justifyContent: 'flex-start',
    marginLeft: -20,
  },
  radioLabel: {
    ...Fonts.style.h2,
    marginLeft: -15,
    marginRight: 10,
  },
  radioIcon: {
    marginRight: 0,
  },
});

export default YesNoCheckListItem;

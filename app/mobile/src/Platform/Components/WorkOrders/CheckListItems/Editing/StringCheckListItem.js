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

import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import React, {useContext, useRef} from 'react';
import TextFormInput from '@fbcmobile/ui/Components/FormInput/TextFormInput';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import {TextInput} from 'react-native';

type Props = {|
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +hasError: boolean,
|};

const StringCheckListItem = ({
  workOrderId,
  categoryId,
  item,
  hasError,
}: Props) => {
  const {setCachedChecklistItem} = useContext(WorkOrderChecklistCacheContext);
  const inputRef = useRef<?React$ElementRef<typeof TextInput>>(null);

  return (
    <FormInput
      title={item.title}
      description={item.helpText}
      touchableDisabled={false}
      hasError={hasError}
      isMandatory={item.isMandatory ?? false}
      onPress={() => {
        inputRef.current && inputRef.current.focus();
      }}>
      <TextFormInput
        multiline={false}
        onChangeText={stringValue =>
          setCachedChecklistItem(workOrderId, categoryId, item.id, {
            ...item,
            stringValue: stringValue ?? '',
          })
        }
        value={item.stringValue}
        ref={inputRef}
      />
    </FormInput>
  );
};

export default StringCheckListItem;

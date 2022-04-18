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

import BooleanInput from '@fbcmobile/ui/Components/FormInput/BooleanInput';
import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import React, {useContext} from 'react';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

type Props = {|
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +hasError: boolean,
|};

const SimpleCheckListItem = ({
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
      placement="right"
      hasError={hasError}
      isMandatory={item.isMandatory ?? false}>
      <BooleanInput
        value={item.checked ?? false}
        onChangeBool={checked =>
          setCachedChecklistItem(workOrderId, categoryId, item.id, {
            ...item,
            checked: checked ?? false,
          })
        }
      />
    </FormInput>
  );
};

export default SimpleCheckListItem;

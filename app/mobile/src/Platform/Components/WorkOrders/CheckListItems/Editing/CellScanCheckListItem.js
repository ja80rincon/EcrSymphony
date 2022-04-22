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

import CellScanInput from '@fbcmobile/ui/Components/FormInput/SignalScan/CellScanInput';
import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import React, {useContext} from 'react';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

type Props = {
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +hasError: boolean,
};

const CellScanCheckListItem = ({
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
      <CellScanInput
        cellData={item.cellData}
        onCellScanned={scannedCellData => {
          setCachedChecklistItem(workOrderId, categoryId, item.id, {
            ...item,
            cellData: scannedCellData,
          });
        }}
      />
    </FormInput>
  );
};

export default CellScanCheckListItem;

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React from 'react';

import {ParametersCatalogPage} from './pages/ParametersCatalogPage';
import InventorySuspense from '../../../common/InventorySuspense';
import {FormContextProvider} from '../../../common/FormContext';
import {DialogShowingContextProvider} from '@symphony/design-system/components/Dialog/DialogShowingContext';

export default function ParametersCatalog() {
  return (
    <InventorySuspense isTopLevel={true}>
      <FormContextProvider permissions={{adminRightsRequired: true}}>
        <DialogShowingContextProvider>
          <ParametersCatalogPage />
        </DialogShowingContextProvider>
      </FormContextProvider>
    </InventorySuspense>
  );
}

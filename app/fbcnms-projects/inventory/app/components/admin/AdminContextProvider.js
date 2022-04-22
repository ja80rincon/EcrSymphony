/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import {AppContextProvider} from '@fbcnms/ui/context/AppContext';

export default function AdminContextProvider(props: {children: React.Node}) {
  return (
    <AppContextProvider networkIDs={[]}>{props.children}</AppContextProvider>
  );
}

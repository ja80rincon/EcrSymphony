/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import {useContext} from 'react';

export type ReadOnlyModeContextType = {
  isReadOnly: boolean,
};

const ReadOnlyModeContextDefaults = {
  isReadOnly: false,
};

const ReadOnlyModeContext = React.createContext<ReadOnlyModeContextType>(
  ReadOnlyModeContextDefaults,
);

type Props = $ReadOnly<{|
  isReadOnly: boolean,
  children: React.Node,
|}>;

export function ReadOnlyModeContextProvider(props: Props) {
  const {isReadOnly, children} = props;

  return (
    <ReadOnlyModeContext.Provider
      value={{
        isReadOnly,
      }}>
      {children}
    </ReadOnlyModeContext.Provider>
  );
}

export function useReadOnlyMode() {
  return useContext(ReadOnlyModeContext);
}

export default ReadOnlyModeContext;

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React, {createContext, useContext, useReducer} from 'react';
import ThresholdReducer, {initialStore} from './ThresholdReducer';

const ThresholdContext = createContext<T>(null);

const ThresholdProvider = ({children}) => (
  <ThresholdContext.Provider
    value={useReducer<S, A>(ThresholdReducer, initialStore)}>
    {children}
  </ThresholdContext.Provider>
);

const useStore = () => useContext(ThresholdContext)[0];
const useDispatch = () => useContext(ThresholdContext)[1];

export {ThresholdContext, useStore, useDispatch};
export default ThresholdProvider;

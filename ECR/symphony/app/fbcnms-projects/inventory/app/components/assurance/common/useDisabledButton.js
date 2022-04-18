/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import {useMemo} from 'react';

export const useDisabledButton = (element: any, name: any, number: number) => {
  return useMemo(
    () =>
      !(
        Object.values(element).length === number &&
        !Object.values(element).some(item => item === '') &&
        !name?.some(item => item === element.name)
      ),
    [element, name, number],
  );
};

export const useDisabledButtonEdit = (
  dataInputsObject: any,
  number: number,
  inputFilter: any,
) => {
  return useMemo(
    () =>
      !(
        dataInputsObject.length === number &&
        !dataInputsObject.some(item => item === '') &&
        !inputFilter().length > 0
      ),
    [dataInputsObject, inputFilter, number],
  );
};

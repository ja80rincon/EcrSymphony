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

export const useValidation = (
  element: string,
  name: Array<string>,
  nameExisting: string,
) => {
  return useMemo(
    () =>
      name?.some(item => item === element) && {
        error: true,
        helperText: `${nameExisting} name existing`,
        hasError: true,
        errorText: `${nameExisting} name existing`,
      },
    [element, name, nameExisting],
  );
};

export const useValidationEdit = (inputFilter: any, nameExisting: string) => {
  return useMemo(
    () =>
      inputFilter().length > 0 && {
        error: true,
        helperText: `${nameExisting} name existing`,
        hasError: true,
        errorText: `${nameExisting} name existing`,
      },
    [inputFilter, nameExisting],
  );
};

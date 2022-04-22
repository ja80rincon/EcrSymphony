/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import {useEffect, useState} from 'react';

export function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  function handleChange({target}: SyntheticInputEvent<HTMLInputElement>) {
    setValue(target.value);
  }
  return {
    value,
    onChange: handleChange,
  };
}

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

export function useSwitchChecked(initialValue: boolean) {
  const [checked, setChecked] = useState(initialValue);
  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue]);
  function handleChange({target}: SyntheticInputEvent<HTMLInputElement>) {
    setChecked(target.value);
  }
  return {
    checked,
    onChange: handleChange,
  };
}

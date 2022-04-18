/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {SvgIconStyleProps} from '../SvgIcon';

import React from 'react';
import SvgIcon from '../SvgIcon';

const CollapseIcon = (props: SvgIconStyleProps) => (
  <SvgIcon {...props}>
    <path d="M8.001,4 L8.001,6.001 L6.001,6.001 L6.001,18.001 L8.001,18.001 L8.001,20.001 L5,20.001 C4.451,20.001 4,19.551 4,19.001 L4,19.001 L4,5.001 C4,4.451 4.451,4 5,4 L5,4 L8.001,4 Z M13.0382545,6.58073502 L14.4524681,7.99494858 L11.4169297,11.029735 L20.0139431,11.0302734 L20.0139431,13.0302734 L11.4169297,13.029735 L14.4524681,16.0655983 L13.0382545,17.4798119 L8.29582291,12.7373802 C7.93533894,12.3768963 7.90760941,11.8096652 8.2126343,11.417374 L8.29582291,11.3231667 L13.0382545,6.58073502 Z" />
  </SvgIcon>
);

export default CollapseIcon;

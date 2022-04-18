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

const ExpandIcon = (props: SvgIconStyleProps) => (
  <SvgIcon {...props}>
    <path d="M8.001,4 L8.001,6.001 L6.001,6.001 L6.001,18.001 L8.001,18.001 L8.001,20.001 L5,20.001 C4.451,20.001 4,19.551 4,19.001 L4,19.001 L4,5.001 C4,4.451 4.451,4 5,4 L5,4 L8.001,4 Z M14.9786183,6.58073502 L19.7210499,11.3231667 L19.8042385,11.417374 C20.1092634,11.8096652 20.0815339,12.3768963 19.7210499,12.7373802 L19.7210499,12.7373802 L14.9786183,17.4798119 L13.5644047,16.0655983 L16.5999431,13.029735 L8.00292969,13.0302734 L8.00292969,11.0302734 L16.5999431,11.029735 L13.5644047,7.99494858 L14.9786183,6.58073502 Z" />
  </SvgIcon>
);

export default ExpandIcon;

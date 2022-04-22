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

const ApplyIcon = (props: SvgIconStyleProps) => (
  <SvgIcon {...props}>
    <path d="m16.98697,5.18763l0,-5.12963l7.03204,8.27188l-7.03204,8.27078l0,-5.19264c-8.28563,0.73457 -14.97954,5.80976 -16.60734,12.39197c-0.24849,-1.00389 -0.37962,-2.04366 -0.37962,-3.10855c0,-8.04043 7.43566,-14.65742 16.98697,-15.5038z" />
  </SvgIcon>
);

export default ApplyIcon;
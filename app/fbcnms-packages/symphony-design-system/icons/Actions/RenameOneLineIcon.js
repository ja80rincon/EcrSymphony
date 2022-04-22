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

const RenameOneLineIcon = (props: SvgIconStyleProps) => (
  <SvgIcon {...props}>
    <path
      d="M20,19 L20,21 L4,21 L4,19 L20,19 Z M16.6707311,3.29289322 L19.4991582,6.12132034 C19.8896825,6.51184464 19.8896825,7.14500961 19.4991582,7.53553391 L9.77123617,17.263456 L6.14142136,17.7820009 C5.59468735,17.8601058 5.08815536,17.4802068 5.01005051,16.9334728 C4.99664983,16.8396681 4.99664983,16.7444348 5.01005051,16.6506301 L5.52859548,13.0208153 L15.2565175,3.29289322 C15.6470418,2.90236893 16.2802068,2.90236893 16.6707311,3.29289322 Z M13.1344901,8.24193358 L7.41421356,13.9636243 L7.1785113,15.6135401 L8.82842712,15.3778379 L14.5487037,9.65614714 L13.1344901,8.24193358 Z M15.9636243,5.41421356 L14.5487037,6.82772002 L15.9629172,8.24193358 L17.3778379,6.82842712 L15.9636243,5.41421356 Z"
      transform="translate(12.000000, 12.000000) rotate(-360.000000) translate(-12.000000, -12.000000) "
    />
  </SvgIcon>
);

export default RenameOneLineIcon;

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import BaseIcon from '../BaseIcon';
import React from 'react';

type Props = $ReadOnly<{|
  className?: ?string,
|}>;

const CreateWorkorderIcon = (props: Props) => (
  <BaseIcon shape="square" color="blue" {...props}>
    <g transform="translate(9.000000, 9.000000)">
      <path d="M17,9 L17,7 L13,7 L13,9 L17,9 Z M7,11 L7,23 L23,23 L23,11 L7,11 Z M25,10 L25,24 C25,24.5522847 24.5522847,25 24,25 L6,25 C5.44771525,25.0006248 5,24.5529096 5,24.0006248 C5,24.0004165 5.00000007,24.0002081 5.000625,24.0000002 L5.009375,9.9999998 C5.01034522,9.44795962 5.45795931,9.0006252 6.01,9 L11,9 L11,9 L11,6 C11,5.44771525 11.4477153,5 12,5 L18,5 C18.5522847,5 19,5.44771525 19,6 L19,9 L19,9 L24,9 C24.5522847,9 25,9.44771525 25,10 Z" />
    </g>
  </BaseIcon>
);

export default CreateWorkorderIcon;

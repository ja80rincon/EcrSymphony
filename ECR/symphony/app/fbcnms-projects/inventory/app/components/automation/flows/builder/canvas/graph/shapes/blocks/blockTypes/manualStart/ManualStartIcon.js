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

const ManualStartIcon = (props: Props) => (
  <BaseIcon shape="circle" color="green" {...props}>
    <g transform="translate(9.000000, 9.000000)">
      <path d="M15,3 C21.627417,3 27,8.372583 27,15 C27,21.627417 21.627417,27 15,27 C8.372583,27 3,21.627417 3,15 C3,8.372583 8.372583,3 15,3 Z M15,5 C9.4771525,5 5,9.4771525 5,15 C5,20.5228475 9.4771525,25 15,25 C20.5228475,25 25,20.5228475 25,15 C25,9.4771525 20.5228475,5 15,5 Z M14.019104,11.7915419 C14.2044833,11.7915419 14.3862136,11.8430715 14.544002,11.9403767 L18.1655781,14.1737365 C18.6356636,14.4636297 18.7817384,15.0797141 18.4918452,15.5497996 C18.414743,15.6748272 18.3110436,15.7813336 18.1881195,15.8617469 L14.5665435,18.2308749 C14.1043666,18.5332174 13.4846012,18.403646 13.1822587,17.9414691 C13.0758026,17.7787345 13.019104,17.5884916 13.019104,17.3940296 L13.019104,12.7915419 C13.019104,12.2392571 13.4668193,11.7915419 14.019104,11.7915419 Z" />
    </g>
  </BaseIcon>
);

export default ManualStartIcon;

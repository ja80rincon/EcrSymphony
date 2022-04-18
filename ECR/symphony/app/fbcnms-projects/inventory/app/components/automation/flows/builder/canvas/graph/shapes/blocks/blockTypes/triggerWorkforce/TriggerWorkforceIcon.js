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

const TriggerWorkforceIcon = (props: Props) => {
  return (
    <BaseIcon shape="square" color="orange" {...props}>
      <g transform="translate(9.000000, 9.000000)">
        <path d="M17.1221,10.0013 C17.6743847,10.0013 18.1221,10.4490153 18.1221,11.0013 L18.1221,11.0013 L18.1221,13.0013 L22.1221,13.0013 C22.6743847,13.0013 23.1221,13.4490153 23.1221,14.0013 L23.1221,14.0013 L23.1221,24.0013 C23.1221,24.5535847 22.6743847,25.0013 22.1221,25.0013 L22.1221,25.0013 L8.1221,25.0013 C7.56981525,25.0013 7.1221,24.5535847 7.1221,24.0013 L7.1221,24.0013 L7.1221,14.0013 C7.1221,13.4490153 7.56981525,13.0013 8.1221,13.0013 L8.1221,13.0013 L12.1221,13.0013 L12.1221,11.0013 C12.1221,10.4490153 12.5698153,10.0013 13.1221,10.0013 L13.1221,10.0013 Z M21.1221,15.0013 L9.1221,15.0013 L9.1221,23.0013 L21.1221,23.0013 L21.1221,15.0013 Z M16.1221,12.0013 L14.1221,12.0013 L14.1221,13.0013 L16.1221,13.0013 L16.1221,12.0013 Z M7.533,5.3996 L10.103,8.4636 L8.571,9.7486 L6,6.6846 L7.533,5.3996 Z M22.7118,5.3999 L24.2448,6.6849 L21.6738,9.7489 L20.1408,8.4639 L22.7118,5.3999 Z M16.122,3 L16.122,7.001 L14.122,7.001 L14.122,3 L16.122,3 Z" />
      </g>
    </BaseIcon>
  );
};

export default TriggerWorkforceIcon;

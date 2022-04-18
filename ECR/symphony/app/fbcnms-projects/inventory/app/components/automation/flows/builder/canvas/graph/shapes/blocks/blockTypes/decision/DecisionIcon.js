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

const DecisionIcon = (props: Props) => (
  <BaseIcon shape="rounded" color="violet" {...props}>
    <g transform="translate(9.000000, 9.000000)">
      <path d="M6,15.026 C6,13.923 6.897,13.026 8,13.026 C9.103,13.026 10,13.923 10,15.026 C10,16.129 9.103,17.026 8,17.026 C6.897,17.026 6,16.129 6,15.026 M21.973,10.577 L20.558,11.991 L22.591,14.024 L11.854,14.011 C11.695,13.41 11.402,12.869 11.006,12.413 L16.027,7.41 L16.026,9.99718479 L18.026,9.99718479 L18.026,5 C18.026,4.447 17.579,4 17.026,4 L12.0128991,4 L12.0128991,6 L14.608,6 L9.322,11.268 C8.906,11.121 8.466,11.026 8,11.026 C5.791,11.026 4,12.817 4,15.026 C4,17.235 5.791,19.026 8,19.026 C8.478,19.026 8.931,18.928 9.355,18.774 L14.616,24.053 L12.0128991,24.052 L12.0128991,26.052 L17.026,26.052 C17.579,26.052 18.026,25.605 18.026,25.052 L18.026,20.0044657 L16.026,20.0044657 L16.026,22.634 L11.025,17.616 C11.418,17.158 11.709,16.615 11.863,16.011 L22.597,16.024 L20.558,18.061 L21.973,19.476 L25.715,15.734 C26.105,15.343 26.105,14.71 25.715,14.319 L21.973,10.577 Z" />
    </g>
  </BaseIcon>
);

export default DecisionIcon;

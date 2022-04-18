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

const TrueFalseIcon = (props: Props) => {
  return (
    <BaseIcon shape="rounded" color="violet" {...props}>
      <g transform="translate(9.000000, 9.000000)">
        <path d="M8.05454234,14.6278561 L9.46954234,16.0428561 L6.43054234,19.0798561 L17.9887278,19.0841654 L17.9992389,21.0841697 L6.43654234,21.0798561 L9.46954234,24.1128561 L8.05454234,25.5268561 L3.31254234,20.7848561 C2.92254234,20.3938561 2.92254234,19.7608561 3.31254234,19.3698561 L3.31254234,19.3698561 L8.05454234,14.6278561 Z M21.9763226,4.60910894 L26.7183226,9.35110894 C27.1083226,9.74210894 27.1083226,10.3751089 26.7183226,10.7661089 L26.7183226,10.7661089 L21.9763226,15.5081089 L20.5613226,14.0931089 L23.6003226,11.0561089 L12.0421372,11.0517996 L12.0316261,9.05179535 L23.5943226,9.05610894 L20.5613226,6.02310894 L21.9763226,4.60910894 Z" />
      </g>
    </BaseIcon>
  );
};

export default TrueFalseIcon;

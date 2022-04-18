/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {IconComponent} from '@symphony/design-system/components/IconButton';
import type {MouseEventHandler} from '@symphony/design-system/components/Core/Clickable';

import * as React from 'react';
import IconButton from '@symphony/design-system/components/IconButton';

type Props = $ReadOnly<{|
  icon: IconComponent,
  onClick: MouseEventHandler,
  className?: string,
|}>;

export default function FlowBuilderButton(props: Props) {
  const {icon, onClick, className} = props;
  return (
    <IconButton
      className={className}
      icon={icon}
      onClick={onClick}
      skin="gray"
      variant="contained"
    />
  );
}

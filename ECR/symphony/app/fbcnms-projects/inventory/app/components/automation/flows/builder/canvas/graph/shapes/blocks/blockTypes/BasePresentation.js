/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {BaseIconProps} from './BaseIcon.js';

import * as React from 'react';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontWeight: 'normal',
    '&:not(:hover) $icon': {
      backgroundColor: symphony.palette.D50,
      fill: symphony.palette.D900,
    },
  },
  icon: {},
}));

type IconComponent = React.ComponentType<BaseIconProps>;

type BasePresentationProps = $ReadOnly<{|
  icon: IconComponent,
  text: React.Node,
  className?: ?string,
|}>;

export function BasePresentation(props: BasePresentationProps) {
  const classes = useStyles();
  const {icon: IconComponent, text, className} = props;

  return (
    <div className={classNames(classes.root, className)}>
      <IconComponent className={classes.icon} />
      {text}
    </div>
  );
}

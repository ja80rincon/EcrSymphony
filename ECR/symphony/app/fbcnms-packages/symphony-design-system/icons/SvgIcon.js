/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const NORMAL_SIZE = 24;
const LARGE_SIZE = 48;

const useStyles = makeStyles(() => ({
  root: {},
  normal: {
    minWidth: `${NORMAL_SIZE}px`,
    minHeight: `${NORMAL_SIZE}px`,
    width: `${NORMAL_SIZE}px`,
    height: `${NORMAL_SIZE}px`,
  },
  large: {
    minWidth: `${LARGE_SIZE}px`,
    minHeight: `${LARGE_SIZE}px`,
    width: `${LARGE_SIZE}px`,
    height: `${LARGE_SIZE}px`,
  },
  lightColor: {
    fill: symphony.palette.white,
  },
  regularColor: {
    fill: symphony.palette.secondary,
  },
  primaryColor: {
    fill: symphony.palette.primary,
  },
  grayColor: {
    fill: symphony.palette.D500,
  },
  errorColor: {
    fill: symphony.palette.R600,
  },
  inheritColor: {
    fill: 'inherit',
  },
}));

export type SvgIconStyleProps = {|
  className?: string,
  color?: 'light' | 'regular' | 'primary' | 'error' | 'gray' | 'inherit',
  variant?: 'normal' | 'large',
|};

type Props = $ReadOnly<{|
  children: React.Node,
  ...SvgIconStyleProps,
|}>;

const SvgIcon = (props: Props) => {
  const classes = useStyles();
  const {
    className,
    children,
    color = 'regular',
    variant = 'normal',
    ...rest
  } = props;

  const size = variant === 'large' ? LARGE_SIZE : NORMAL_SIZE;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={`${size}px`}
      height={`${size}px`}
      className={classNames(
        classes[variant],
        classes[`${color}Color`],
        className,
      )}
      {...rest}>
      {children}
    </svg>
  );
};

export default SvgIcon;

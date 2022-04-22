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
import SvgIcon from '@symphony/design-system/icons/SvgIcon';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  wrapper: {
    minWidth: '48px',
    minHeight: '48px',
    width: '48px',
    height: '48px',
    marginRight: '16px',
    backgroundColor: symphony.palette.D50,
    fill: symphony.palette.white,
  },
  circle: {
    borderRadius: '50%',
  },
  rounded: {
    borderRadius: '4px',
  },
  square: {
    borderRadius: '11px',
  },
  greenBg: {
    backgroundColor: symphony.palette.AUTOMATION.GREEN,
  },
  blueBg: {
    backgroundColor: symphony.palette.AUTOMATION.BLUE,
  },
  orangeBg: {
    backgroundColor: symphony.palette.AUTOMATION.ORANGE,
  },
  redBg: {
    backgroundColor: symphony.palette.AUTOMATION.RED,
  },
  violetBg: {
    backgroundColor: symphony.palette.AUTOMATION.VIOLET,
  },
  icon: {
    fill: 'inherit',
  },
}));

export type ShapeVariant = 'circle' | 'rounded' | 'square';
export type ColorVariant =
  | 'green'
  | 'blue'
  | 'orange'
  | 'red'
  | 'violet'
  | 'default';

export type BaseIconProps = $ReadOnly<{|
  className?: ?string,
|}>;

type FullProps = $ReadOnly<{|
  shape: ShapeVariant,
  color: ColorVariant,
  children: React.Node,
  ...BaseIconProps,
|}>;

const BaseIcon = (props: FullProps) => {
  const classes = useStyles();
  const {children, className, shape, color} = props;
  const colorClass = `${color}Bg`;

  return (
    <div
      className={classNames(
        classes.wrapper,
        classes[shape],
        classes[colorClass],
        className,
      )}>
      <SvgIcon className={classes.icon} variant="large">
        {children}
      </SvgIcon>
    </div>
  );
};

export default BaseIcon;

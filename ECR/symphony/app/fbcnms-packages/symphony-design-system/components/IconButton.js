/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ButtonSkin, ButtonVariant} from './Button';
import type {MouseEventHandler} from './Core/Clickable';
import type {SvgIconStyleProps} from '../icons/SvgIcon';

import classNames from 'classnames';

import * as React from 'react';
import Button from './Button';
import {makeStyles} from '@material-ui/styles';

export type IconComponent = React.ComponentType<SvgIconStyleProps>;

export type IconButtonProps = $ReadOnly<{|
  className?: string,
  icon: IconComponent,
  skin?: ButtonSkin,
  disabled?: boolean,
  tooltip?: string,
  variant?: ButtonVariant,
|}>;

type Props = $ReadOnly<{|
  onClick?: MouseEventHandler,
  onMouseDown?: MouseEventHandler,
  ...IconButtonProps,
|}>;

const useStyles = makeStyles(() => ({
  noMinWidth: {
    minWidth: 'unset',
  },
}));

const IconButton = ({
  icon: Icon,
  variant = 'text',
  className,
  ...buttonProps
}: Props) => {
  const classes = useStyles();

  return (
    <Button
      className={classNames(
        variant === 'contained' ? classes.noMinWidth : '',
        className,
      )}
      variant={variant}
      {...buttonProps}>
      <Icon color="inherit" />
    </Button>
  );
};

export default IconButton;

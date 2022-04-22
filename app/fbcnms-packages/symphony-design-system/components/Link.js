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
import Text from './Text';
import classNames from 'classnames';
import symphony from '../theme/symphony';
import {makeStyles} from '@material-ui/styles';

const styles = {
  h1: symphony.typography.h1,
  h2: symphony.typography.h2,
  h3: symphony.typography.h3,
  h4: symphony.typography.h4,
  h5: symphony.typography.h5,
  h6: symphony.typography.h6,
  subtitle1: symphony.typography.subtitle1,
  subtitle2: symphony.typography.subtitle2,
  subtitle3: symphony.typography.subtitle3,
  body1: symphony.typography.body1,
  body2: symphony.typography.body2,
  caption: symphony.typography.caption,
  overline: symphony.typography.overline,
  lightColor: {
    color: symphony.palette.white,
  },
  regularColor: {
    color: symphony.palette.secondary,
  },
  primaryColor: {
    color: symphony.palette.primary,
  },
  grayColor: {
    color: symphony.palette.D400,
  },
  errorColor: {
    color: symphony.palette.R600,
  },
  warningColor: {
    color: symphony.palette.Y600,
  },
  lightHover: {
    '&:hover': {
      color: symphony.palette.white,
    },
  },
  regularHover: {
    '&:hover': {
      color: symphony.palette.secondary,
    },
  },
  primaryHover: {
    '&:hover': {
      color: symphony.palette.primary,
    },
  },
  grayHover: {
    '&:hover': {
      color: symphony.palette.D400,
    },
  },
  errorHover: {
    '&:hover': {
      color: symphony.palette.R600,
    },
  },
  warningHover: {
    '&:hover': {
      color: symphony.palette.Y600,
    },
  },
  noVariant: {},
  noUnderline: {
    textDecorationLine: 'none',
  },
};
export const typographyStyles = makeStyles<Props, typeof styles>(() => styles);

type colorOptions =
  | 'light'
  | 'regular'
  | 'primary'
  | 'error'
  | 'gray'
  | 'warning';

type Props = $ReadOnly<{|
  children?: ?React.Node,
  href: string,
  inNewTab?: boolean,
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'subtitle3'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'overline',
  className?: string,
  color?: colorOptions,
  hoverColor?: colorOptions,
  text?: string,
  textClassName?: string,
|}>;

const Link = (props: Props) => {
  const {
    children,
    href,
    inNewTab = false,
    variant = 'noVariant',
    color = 'regular',
    hoverColor = 'primary',
    textClassName,
    className,
  } = props;
  const classes = typographyStyles();
  return (
    <a
      className={classNames(classes['noUnderline'], className)}
      href={href}
      target={inNewTab ? '_blank' : '_self'}
      rel="noopener noreferrer">
      <Text
        className={classNames(
          classes[variant],
          classes[`${color}Color`],
          classes[`${hoverColor}Hover`],
          textClassName,
        )}>
        {children}
      </Text>
    </a>
  );
};

export default Link;

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {TRefFor} from '../../types/TRefFor.flow';

import * as React from 'react';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
    display: 'inline-flex',
    boxSizing: 'border-box',
  },
  disabled: {
    cursor: 'not-allowed',
  },
}));

export type ClickableEvents = $ReadOnly<{|
  onClick?: ?MouseEventHandler,
  onMouseDown?: ?MouseEventHandler,
|}>;

export type MouseEventHandler = (
  SyntheticMouseEvent<HTMLElement>,
) => void | Promise<void>;

type Props = $ReadOnly<{|
  children?: React.Node,
  disabled?: boolean,
  tooltip?: string,
  className?: string,
  ...ClickableEvents,
|}>;

const Clickable = (props: Props, forwardedRef: TRefFor<HTMLElement>) => {
  const {
    children,
    onClick,
    onMouseDown,
    disabled: disabledProp,
    tooltip,
    className,
  } = props;
  const disabled = disabledProp === true;
  const classes = useStyles();
  return (
    <div
      data-is-clickable
      className={classNames(
        classes.root,
        {[classes.disabled]: disabled},
        className,
      )}
      ref={forwardedRef}
      onClick={!disabled ? onClick : undefined}
      onMouseDown={!disabled ? onMouseDown : undefined}
      title={tooltip}>
      {children}
    </div>
  );
};

export default (React.forwardRef<Props, HTMLElement>(
  Clickable,
): React$AbstractComponent<Props, HTMLElement>);

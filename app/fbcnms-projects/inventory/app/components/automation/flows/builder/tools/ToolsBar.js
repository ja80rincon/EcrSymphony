/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    background: 'transparent',
    pointerEvents: 'none',
    flexGrow: 1,
    '& [data-is-clickable]': {
      marginLeft: '8px',
      pointerEvents: 'auto',
    },
    padding: '16px',
    userSelect: 'none',
    display: 'flex',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  children: React.Node,
|}>;

export default function ToolsBar(props: Props) {
  const {className, children} = props;
  const classes = useStyles();

  return <div className={classNames(classes.root, className)}>{children}</div>;
}

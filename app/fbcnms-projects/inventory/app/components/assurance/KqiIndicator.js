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
import Text from '@symphony/design-system/components/Text';
import {BLUE} from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    margin: '0 ',
    padding: '0',
  },
  shape: {
    backgroundColor: BLUE.B600,
    width: '30px',
    height: '32px',
    borderRadius: '10px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    fontSize: '16px',
  },
}));
export type Props = $ReadOnly<{|
  children: React.Node,
|}>;
export default function Indicator(props: Props) {
  const {children} = props;
  const classes = useStyles();
  const rectangle = (
    <div className={classes.shape}>
      <Text className={classes.indicator} variant="caption" color="light">
        {children}
      </Text>
    </div>
  );
  return <>{rectangle}</>;
}

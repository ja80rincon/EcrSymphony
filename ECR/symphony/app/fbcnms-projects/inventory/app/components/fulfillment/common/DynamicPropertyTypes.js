/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import React from 'react';
import {makeStyles} from '@material-ui/styles';

import Button from '@symphony/design-system/components/Button';
import Text from '@symphony/design-system/components/Text';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: '1',
  },
  name: {
    marginRight: '7px',
  },
  container: {
    margin: '7px 0',
  },
}));
type Props = $ReadOnly<{|
  name?: string,
  btn?: string,
  txt?: string,
  className?: string,
|}>;

const DynamicPropertyTypes = (props: Props) => {
  const {name, txt, btn, className} = props;
  const classes = useStyles();

  return (
    <div className={(classes.root, className)}>
      <div className={classes.container}>
        <Text className={classes.name} variant="subtitle2">
          {name}:
        </Text>
        {txt ? (
          <Text weight={'bold'} color={'regular'}>
            {txt}
          </Text>
        ) : (
          <Button variant="text">
            <Text weight={'bold'} color={'primary'}>
              {btn}
            </Text>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DynamicPropertyTypes;

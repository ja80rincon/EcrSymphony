/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import FormField from '@symphony/design-system/components/FormField/FormField';
import React from 'react';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  contPeriods: {
    width: 74,
    border: '3px solid red',
  },
  periods: {
    width: '100%',
    border: '1px solid blue',
    '& .clickable': {
      width: '25px',
    },
  },
}));

const Periods = props => {
  const classes = useStyles();
  return (
    <FormField label={props.lable} className={''}>
      <div className={classes.contPeriods}>
        <TextInput className={classes.periods} type="number" />
      </div>
    </FormField>
  );
};
export default Periods;

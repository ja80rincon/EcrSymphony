/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import Button from '@material-ui/core/Button';
import React from 'react';
import {makeStyles} from '@material-ui/styles';

import classNames from 'classnames';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  button: {
    width: '100%',
    height: '38px',
    cursor: 'default',
    pointerEvents: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  buttonActive: {
    border: '1px solid #00AF5B',
    color: '#00AF5B',
    fontSize: '14px',
  },
  buttonPending: {
    border: '1px solid #FFB63E',
    color: '#FFB63E',
    fontSize: '14px',
  },
  buttonClosed: {
    border: '1px solid #8895AD',
    color: '#8895AD',
    fontSize: '14px',
  },
}));

type Props = $ReadOnly<{|
  creationDate: string,
  beginDate: string,
  endDate: string,
  forwardedRef: any,
|}>;

export const AlarmFilteringStatus = (props: Props) => {
  const {beginDate, endDate, forwardedRef} = props;
  const classes = useStyles();

  return (
    <>
      {moment().format() <= moment(beginDate).format() ||
        (moment().format() <= moment(endDate).format() && (
          <Button
            ref={forwardedRef}
            variant="outlined"
            weight="bold"
            name="alarmStatus"
            value="Active"
            disableRipple
            className={classNames(classes.button, classes.buttonActive)}>
            {'Active'}
          </Button>
        ))}
      {moment().format() > moment(endDate).format() && (
        <Button
          ref={forwardedRef}
          variant="outlined"
          weight="bold"
          name="alarmStatus"
          value="Closed"
          disableRipple
          className={classNames(classes.button, classes.buttonClosed)}>
          {'Closed'}
        </Button>
      )}
      {moment().format() < moment(beginDate).format() &&
        moment().format() < moment(endDate).format() && (
          <Button
            ref={forwardedRef}
            variant="outlined"
            weight="bold"
            name="alarmStatus"
            value="Pending"
            disableRipple
            className={classNames(classes.button, classes.buttonPending)}>
            {'Pending'}
          </Button>
        )}
    </>
  );
};

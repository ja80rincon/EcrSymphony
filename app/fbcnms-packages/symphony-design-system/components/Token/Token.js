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
import IconButton from '../IconButton';
import Text from '../Text';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {CloseTinyIcon} from '../../icons';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '200px',
    backgroundColor: symphony.palette.D50,
    borderRadius: '2px',
    '&:hover:not($disabledToken)': {
      backgroundColor: symphony.palette.D100,
    },
  },
  disabledToken: {
    '& $text': {
      paddingRight: '6px',
    },
  },
  text: {
    padding: '2px 0px 2px 6px',
  },
}));

type Props = $ReadOnly<{|
  label: string,
  onRemove?: () => void,
  disabled?: boolean,
  className?: string,
|}>;

const Token = (props: Props) => {
  const {label, onRemove, disabled = false, className} = props;
  const classes = useStyles();
  return (
    <div
      className={classNames(classes.root, className, {
        [classes.disabledToken]: disabled,
      })}>
      <Text variant="body2" className={classes.text} useEllipsis={true}>
        {label}
      </Text>
      {!disabled && (
        <IconButton
          icon={CloseTinyIcon}
          skin="secondaryGray"
          onClick={onRemove}
        />
      )}
    </div>
  );
};

export default Token;

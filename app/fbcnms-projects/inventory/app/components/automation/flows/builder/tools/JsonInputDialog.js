/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import Button from '@symphony/design-system/components/Button';
import React from 'react';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import {makeStyles} from '@material-ui/styles';
import {useEffect, useState} from 'react';

const useStyles = makeStyles(() => ({
  root: {
    width: '600px',
  },
  bottomBar: {
    paddingTop: '16px',
    paddingBottom: '8px',
    float: 'right',
    '& > *': {
      marginLeft: '8px',
    },
  },
}));

type Props = $ReadOnly<{|
  json: string,
  onSave: string => void,
  onClose: () => void,
|}>;

export default function JsonInputDialog(props: Props) {
  const {json, onSave, onClose} = props;
  const [jsonValue, setJsonValue] = useState(json);
  useEffect(() => {
    setJsonValue(json);
  }, [json]);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextInput
        rows={10}
        value={jsonValue}
        type="multiline"
        onChange={event => setJsonValue(event.target.value)}
      />
      <div className={classes.bottomBar}>
        <Button onClick={() => onSave(jsonValue)}>Save</Button>
        <Button onClick={() => onClose()}>Close</Button>
      </div>
    </div>
  );
}

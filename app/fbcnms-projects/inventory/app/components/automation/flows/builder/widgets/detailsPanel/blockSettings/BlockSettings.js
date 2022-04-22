/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {IBlock} from '../../../canvas/graph/shapes/blocks/BaseBlock';

import * as React from 'react';
import FormFieldTextInput from '../../../../../../admin/userManagement/utils/FormFieldTextInput';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';

type Props = $ReadOnly<{|
  block: IBlock,
|}>;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: '27px',
  },
}));
export default function BlockSettings(props: Props) {
  const {block} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FormFieldTextInput
        label={`${fbt('Block Name', '')}`}
        value={block.name}
        onValueChanged={name => {
          block.setName(name);
        }}
      />
    </div>
  );
}

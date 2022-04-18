/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {GraphSelectionContextType} from '../../selection/GraphSelectionContext';

import * as React from 'react';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';

type Props = $ReadOnly<{|
  selection: GraphSelectionContextType,
|}>;
const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function SelectionSettings(props: Props) {
  const classes = useStyles();
  const {selection} = props;

  return (
    <div className={classes.root}>
      <Text variant="subtitle1">
        <fbt desc="">
          <fbt:param name="Number of selected blocks on canvas" number={true}>
            {selection.selectedElements.length}
          </fbt:param>
          Selected Blocks
        </fbt>
      </Text>
    </div>
  );
}

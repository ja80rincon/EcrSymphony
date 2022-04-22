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
import ToolsBar from './ToolsBar';
import {makeStyles} from '@material-ui/styles';
import {useGraph} from '../canvas/graph/graphAPIContext/GraphContext';

const useStyles = makeStyles(() => ({
  root: {
    bottom: 0,
  },
  marginRight: {
    marginRight: '16px',
  },
}));

export default function BottomBar() {
  const classes = useStyles();

  const flow = useGraph();

  return (
    <ToolsBar className={classes.root}>
      <Button onClick={() => flow.move({x: -50, y: 0})}>Left</Button>
      <Button onClick={() => flow.move({x: 0, y: -50})}>Up</Button>
      <Button onClick={() => flow.move({x: 0, y: 50})}>Down</Button>
      <Button
        className={classes.marginRight}
        onClick={() => flow.move({x: 50, y: 0})}>
        Right
      </Button>
      <Button onClick={() => flow.zoomFit()}>Fit</Button>
      <Button onClick={() => flow.zoomIn()}>Zoom In</Button>
      <Button onClick={() => flow.zoomOut()}>Zoom Out</Button>
      <Button className={classes.marginRight} onClick={() => flow.reset()}>
        Reset
      </Button>
    </ToolsBar>
  );
}

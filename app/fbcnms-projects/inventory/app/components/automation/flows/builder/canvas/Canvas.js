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
import {useEffect, useRef} from 'react';
import {useGraph} from './graph/graphAPIContext/GraphContext';
import {useKeyboardShortcuts} from '../widgets/keyboardShortcuts/KeyboardShortcutsContext';
import {useReadOnlyMode} from '../widgets/readOnlyModeContext';

const useStyles = makeStyles(() => ({
  graphContainer: {
    overflow: 'hidden',
  },
  canvasKeyboardShortcutsMagnet: {},
}));

export default function Canvas() {
  const classes = useStyles();

  const flow = useGraph();
  const keyboardShortcuts = useKeyboardShortcuts();
  const graphContainer = useRef();

  useEffect(() => {
    if (graphContainer.current == null) {
      return;
    }

    const container = graphContainer.current;
    flow.bindGraphContainer(container);
    keyboardShortcuts.initiateKeyboardShortcutsHandlers();
  }, [flow, keyboardShortcuts]);

  const {isReadOnly} = useReadOnlyMode();

  useEffect(() => {
    flow.setPaperInteractionLocked(isReadOnly === true);
  }, [flow, isReadOnly]);

  return (
    <div
      className={classes.graphContainer}
      ref={graphContainer}
      id="graphContainer"
    />
  );
}

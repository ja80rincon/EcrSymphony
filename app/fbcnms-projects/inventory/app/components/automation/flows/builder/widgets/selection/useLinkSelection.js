/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ChangeLinkSelectionFunc} from './GraphSelectionContext';

import {Events} from '../../canvas/graph/facades/Helpers';
import {useCallback, useEffect} from 'react';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';

export default function useLinkSelection(
  changeLinkSelection: ChangeLinkSelectionFunc,
) {
  const flow = useGraph();

  const onConnectorMouseDown = useCallback(
    (connector, _evt) => {
      if (!connector.model.isLink()) {
        return;
      }
      changeLinkSelection(connector);
      // const position = {x: evt.clientX, y: evt.clientY};
      // connector.snapTargetToPointer(position);
    },
    [changeLinkSelection],
  );

  // const onConnectorMouseUp = useCallback(
  //   (connector, evt) => {
  //     const position = {x: evt.clientX, y: evt.clientY};
  //     connector.tryAttachingAtPoint(position, flow);
  //   },
  //   [flow],
  // );

  useEffect(() => {
    flow.onConnectorEvent(Events.Connector.MouseDown, onConnectorMouseDown);
    // flow.onConnectorEvent(Events.Connector.MouseUp, onConnectorMouseUp);
  }, [onConnectorMouseDown, flow]);
}

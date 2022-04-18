/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import {Events} from '../../canvas/graph/facades/Helpers';
import {
  PREDICATES,
  useKeyboardToggle,
} from '../keyboardShortcuts/KeyboardShortcutsContext';
import {useCallback, useMemo, useState} from 'react';
import {useEventRegistrationToggle} from '../../../utils/helpers';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';

export default function usePaperGrab() {
  const [isOnGrabMode, setIsOnGrabMode] = useState(false);
  const flow = useGraph();

  const setCursor = useCallback(
    (cursor: string) => {
      const paperElement = flow.getMainPaper()?.el;
      if (paperElement != null) {
        paperElement.style.cursor = cursor;
      }
    },
    [flow],
  );

  const changeGrabMode = useCallback(
    (newGrabMode, cursor) =>
      setIsOnGrabMode(currentGrabMode => {
        if (currentGrabMode !== newGrabMode) {
          setCursor(cursor);
        }
        return newGrabMode;
      }),
    [setCursor],
  );

  const enterGrabMode = useCallback(() => changeGrabMode(true, 'grab'), [
    changeGrabMode,
  ]);

  const leaveGrabMode = useCallback(() => changeGrabMode(false, 'auto'), [
    changeGrabMode,
  ]);

  useKeyboardToggle(PREDICATES.space, enterGrabMode, leaveGrabMode);

  const onDragStart = useCallback(() => setCursor('grabbing'), [setCursor]);
  const onDragEnd = useCallback(() => setCursor('grab'), [setCursor]);

  const onDragHandler = useCallback(
    e => {
      const originalEventArgs = e.originalEvent;
      const movement = {
        x: originalEventArgs.movementX,
        y: originalEventArgs.movementY,
      };
      flow.move(movement);
    },
    [flow],
  );

  const grabMouseEvents = useMemo(
    () => [
      {name: Events.Paper.BackdropMouseDown, handler: onDragStart},
      {name: Events.Paper.BackdropMouseDrag, handler: onDragHandler},
      {name: Events.Paper.BackdropMouseUp, handler: onDragEnd},
    ],
    [onDragHandler, onDragStart, onDragEnd],
  );
  useEventRegistrationToggle(
    flow.onPaperEvent,
    flow.offPaperEvent,
    grabMouseEvents,
    isOnGrabMode,
  );
}

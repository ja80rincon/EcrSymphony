/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {Position, Rect} from '../builder/canvas/graph/facades/Helpers';

import {useEffect} from 'react';

export function getRectDiff(rectA: Rect, rectB: Rect): Rect {
  return {
    x: rectB.x - rectA.x,
    width: rectB.width - rectA.width,
    y: rectB.y - rectA.y,
    height: rectB.height - rectA.height,
  };
}

export function getRectCenter(rect: Rect): Position {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

export function convertPointsToRect(pt1: Position, pt2: Position): Rect {
  const minX = Math.min(pt1.x, pt2.x);
  const maxX = Math.max(pt1.x, pt2.x);
  const minY = Math.min(pt1.y, pt2.y);
  const maxY = Math.max(pt1.y, pt2.y);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function useEventRegistrationToggle<E, H>(
  registerFunc: (E, H) => void,
  unregisterFunc: (E, H) => void,
  events: $ReadOnlyArray<{name: E, handler: H}>,
  toggleFlag: boolean,
) {
  useEffect(() => {
    const eventRegistrationToggle = toggleFlag ? registerFunc : unregisterFunc;
    events.forEach(event => eventRegistrationToggle(event.name, event.handler));
  }, [registerFunc, unregisterFunc, events, toggleFlag]);
}

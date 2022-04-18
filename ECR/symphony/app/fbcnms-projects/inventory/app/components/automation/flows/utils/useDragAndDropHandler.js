/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import ReactDOM from 'react-dom';
import {useCallback, useRef} from 'react';

type DraggingStaticData = {|
  draggingArea: Element,
  draggedElementContainer: ?HTMLElement,
|};

const useDragAndDropHandler = (
  draggedElement: React.ComponentType<{}>,
  onDrop: (clientX: number, clientY: number) => void,
  onClick?: ?() => void,
) => {
  const draggingData = useRef<DraggingStaticData>({
    draggingArea: document.getElementsByTagName('body')[0],
    draggedElementContainer: null,
  });

  const dragHandler = useCallback(
    (moveArgs: MouseEvent) => {
      if (draggingData.current.draggedElementContainer == null) {
        const dragged = document.createElement('div');
        dragged.style.position = 'fixed';
        ReactDOM.render(React.createElement(draggedElement), dragged);
        setElementPosition(dragged, moveArgs);
        dragged.style.top = moveArgs.clientY + 'px';
        dragged.style.left = moveArgs.clientX + 'px';
        draggingData.current.draggingArea.appendChild(dragged);
        draggingData.current.draggedElementContainer = dragged;
      } else {
        setElementPosition(
          draggingData.current.draggedElementContainer,
          moveArgs,
        );
      }
    },
    [draggedElement],
  );

  const dropHandler = useCallback(() => {
    const dragged = draggingData.current.draggedElementContainer;
    if (dragged == null) {
      if (onClick) {
        onClick();
      }
    } else {
      const draggedRect = dragged.getBoundingClientRect();
      onDrop(draggedRect.left, draggedRect.top);
      dragged.remove();
    }

    draggingData.current.draggedElementContainer = null;
    draggingData.current.draggingArea.removeEventListener(
      'mousemove',
      dragHandler,
    );
    draggingData.current.draggingArea.removeEventListener(
      'mouseup',
      dropHandler,
    );
  }, [onDrop, onClick, dragHandler]);

  return () => {
    draggingData.current.draggingArea.addEventListener(
      'mousemove',
      dragHandler,
    );
    draggingData.current.draggingArea.addEventListener('mouseup', dropHandler);
  };
};

function setElementPosition(
  element: HTMLElement,
  position: {clientX: number, clientY: number},
) {
  element.style.top = position.clientY + 'px';
  element.style.left = position.clientX + 'px';
}

export default useDragAndDropHandler;

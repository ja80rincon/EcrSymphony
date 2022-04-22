/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  ChangeSelectionFunc,
  IsIgnoredElementFunc,
} from './GraphSelectionContext';
import type {GraphContextType} from '../../canvas/graph/graphAPIContext/GraphContext';
import type {IBlock} from '../../canvas/graph/shapes/blocks/BaseBlock';
import type {Position} from '../../canvas/graph/facades/Helpers';

import Lasso from '../../canvas/graph/facades/shapes/vertexes/helpers/Lasso';
import {Events} from '../../canvas/graph/facades/Helpers';
import {
  PREDICATES,
  useKeyboardToggle,
} from '../keyboardShortcuts/KeyboardShortcutsContext';
import {
  convertPointsToRect,
  useEventRegistrationToggle,
} from '../../../utils/helpers';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';

function createSelectionMarkup(
  flow: GraphContextType,
  position: Position,
): ?Lasso {
  return flow.drawLasso(position);
}

function wrapSelectedBlocksWithContainerIfNeeded(
  container: Lasso,
  blocks: ?$ReadOnlyArray<IBlock>,
): boolean {
  const currentlyEmbeddedElements = container.getEmbeddedCells();
  currentlyEmbeddedElements
    .filter(
      element =>
        blocks == null || blocks.find(block => block.id === element.id) == null,
    )
    .forEach(element => container.unembed(element));
  if (Array.isArray(blocks) && blocks.length > 1) {
    blocks.forEach(block => {
      container.embed(block.model);
    });
    container.setFinalSelection();

    return true;
  }

  return false;
}

type LassoSelectionApi = {
  checkIfElementShouldBeIgnored: IsIgnoredElementFunc,
};

export default function useLassoSelection(
  selectedElements: $ReadOnlyArray<IBlock>,
  changeSelection: ChangeSelectionFunc,
): LassoSelectionApi {
  const [isLassoAvailable, setIsLassoAvailable] = useState(true);
  const [selectionStart, setSelectionStart] = useState<?Position>(null);
  const [selectionEnd, setSelectionEnd] = useState<?Position>(null);
  const [
    selectionProgressMarkup,
    setSelectionProgressMarkup,
  ] = useState<?Lasso>();
  const [
    finalSelectionContainer,
    setFinalSelectionContainer,
  ] = useState<?Lasso>();

  const flow = useGraph();

  const startSelection = useCallback(
    (startPosition: Position) => {
      setSelectionStart(startPosition);
      setSelectionProgressMarkup(() =>
        // As long as selection markup is Rectangle and Elements are Rectangles,
        // need to keep in function
        createSelectionMarkup(flow, startPosition),
      );
      setSelectionEnd(startPosition);
    },
    [flow],
  );

  const removeFinalSelectionContainer = useCallback(() => {
    setFinalSelectionContainer(currentSelectionGroup => {
      if (currentSelectionGroup != null) {
        const elements = currentSelectionGroup.getEmbeddedCells();
        elements.forEach(element => currentSelectionGroup.unembed(element));
        currentSelectionGroup.remove();
      }

      return null;
    });
  }, []);

  const clearSelection = useCallback(() => {
    changeSelection([]);
    removeFinalSelectionContainer();
  }, [removeFinalSelectionContainer, changeSelection]);

  const changeSelectionMarkupToSelectionContainer = useCallback(() => {
    setSelectionProgressMarkup(currentMarkup => {
      if (currentMarkup != null) {
        const newFinalSelectionContainer = currentMarkup;
        setFinalSelectionContainer(newFinalSelectionContainer);
      }
      return null;
    });
  }, []);

  const stopSelection = useCallback(() => {
    setSelectionStart(null);
    setSelectionEnd(null);
    changeSelectionMarkupToSelectionContainer();
  }, [changeSelectionMarkupToSelectionContainer]);

  const onDragStartHandler = useCallback(
    (e, x, y) => {
      clearSelection();
      startSelection({x, y});
    },
    [clearSelection, startSelection],
  );

  const onDragHandler = useCallback((e, x, y) => setSelectionEnd({x, y}), []);

  const onDragDoneHandler = stopSelection;

  useEffect(() => {
    if (finalSelectionContainer == null) {
      return;
    }

    const haveLassoSelection = wrapSelectedBlocksWithContainerIfNeeded(
      finalSelectionContainer,
      selectedElements,
    );
    if (!haveLassoSelection) {
      removeFinalSelectionContainer();
    }
  }, [
    selectedElements,
    finalSelectionContainer,
    removeFinalSelectionContainer,
    selectionProgressMarkup,
    startSelection,
    changeSelectionMarkupToSelectionContainer,
  ]);

  useEffect(() => {
    if (selectionStart == null || selectionEnd == null) {
      return;
    }

    const selectionRect = convertPointsToRect(selectionStart, selectionEnd);

    if (selectionProgressMarkup != null) {
      selectionProgressMarkup.position(selectionRect.x, selectionRect.y);
      selectionProgressMarkup.resize(selectionRect.width, selectionRect.height);
    }

    const blocks = flow.getBlocksInArea(selectionRect);
    const newSelection = blocks.filter(
      block => block.id != selectionProgressMarkup?.id,
    );
    changeSelection(newSelection);
  }, [
    changeSelection,
    selectionEnd,
    selectionProgressMarkup,
    selectionStart,
    flow,
  ]);

  const allowLasso = useCallback(() => setIsLassoAvailable(true), []);
  const blockLasso = useCallback(() => {
    stopSelection();
    setIsLassoAvailable(false);
  }, [stopSelection]);

  useKeyboardToggle(PREDICATES.space, blockLasso, allowLasso);

  const dragMouseEvents = useMemo(
    () => [
      {name: Events.Paper.BackdropMouseDown, handler: onDragStartHandler},
      {name: Events.Paper.BackdropMouseDrag, handler: onDragHandler},
      {name: Events.Paper.BackdropMouseUp, handler: onDragDoneHandler},
    ],
    [onDragHandler, onDragStartHandler, onDragDoneHandler],
  );
  useEventRegistrationToggle(
    flow.onPaperEvent,
    flow.offPaperEvent,
    dragMouseEvents,
    isLassoAvailable,
  );

  const checkIfElementShouldBeIgnored = useCallback(
    (element: ?IBlock) =>
      element == null ||
      element.id === finalSelectionContainer?.id ||
      element.id === selectionProgressMarkup?.id,
    [finalSelectionContainer, selectionProgressMarkup],
  );

  return {
    checkIfElementShouldBeIgnored,
  };
}

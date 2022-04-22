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
import type {IBlock} from '../../canvas/graph/shapes/blocks/BaseBlock';

import {Events} from '../../canvas/graph/facades/Helpers';
import {useCallback, useEffect, useState} from 'react';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';

const useExplicitSelection = (
  changeSelection: ChangeSelectionFunc,
  isIgnoredElement: IsIgnoredElementFunc,
) => {
  const [
    explicitlySelectedElement,
    setExplicitlySelectedElement,
  ] = useState<?IBlock>();

  const flow = useGraph();

  useEffect(() => {
    setExplicitlySelectedElement(null);
    if (
      explicitlySelectedElement == null ||
      isIgnoredElement(explicitlySelectedElement)
    ) {
      return;
    }
    changeSelection(explicitlySelectedElement);
  }, [changeSelection, explicitlySelectedElement, isIgnoredElement]);

  const onBlockClicked = useCallback((element: IBlock) => {
    setExplicitlySelectedElement(element);
  }, []);

  const onBlockAdded = useCallback((newBlock: IBlock) => {
    if (newBlock.isSelected) {
      return;
    }
    setExplicitlySelectedElement(newBlock);
  }, []);

  useEffect(() => {
    flow.onBlockEvent(Events.Block.MouseUp, onBlockClicked);
    flow.onGraphBlockEvent(Events.Graph.OnAdd, onBlockAdded);
  }, [flow, onBlockClicked, onBlockAdded]);
};

export default useExplicitSelection;

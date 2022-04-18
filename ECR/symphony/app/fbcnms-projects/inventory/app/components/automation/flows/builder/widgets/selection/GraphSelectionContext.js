/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {IBlock} from '../../canvas/graph/shapes/blocks/BaseBlock';
import type {IConnector} from '../../canvas/graph/shapes/connectors/BaseConnector';

import * as React from 'react';
import emptyFunction from '@fbcnms/util/emptyFunction';
import useExplicitSelection from './useExplicitSelection';
import useLassoSelection from './useLassoSelection';
import useLinkSelection from './useLinkSelection';
import {Events} from '../../canvas/graph/facades/Helpers';
import {
  PREDICATES,
  useKeyboardShortcut,
} from '../keyboardShortcuts/KeyboardShortcutsContext';
import {useCallback, useContext, useEffect, useState} from 'react';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';

type SelectedElement = $ReadOnly<IBlock>;
type SelectedLink = $ReadOnly<IConnector>;

export type Selection = $ReadOnlyArray<SelectedElement>;

export type ChangeSelectionFunc = (SelectedElement | Selection) => void;
export type ChangeLinkSelectionFunc = SelectedLink => void;

export type GraphSelectionContextType = {
  selectedElements: Selection,
  selectedLink: ?SelectedLink,
  changeSelection: ChangeSelectionFunc,
  changeLinkSelection: ChangeLinkSelectionFunc,
};

const GraphSelectionContextDefaults = {
  selectedElements: [],
  selectedLink: null,
  changeSelection: emptyFunction,
  changeLinkSelection: emptyFunction,
};

const GraphSelectionContext = React.createContext<GraphSelectionContextType>(
  GraphSelectionContextDefaults,
);

export type IsIgnoredElementFunc = IBlock => boolean;

type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export function GraphSelectionContextProvider(props: Props) {
  const flow = useGraph();
  const [selectedElements, setSelectedElements] = useState<
    $ReadOnlyArray<IBlock>,
  >([]);
  const [selectedLink, setSelectedLink] = useState<?IConnector>();

  const clearSelectedElements = useCallback(() => {
    setSelectedElements(prevSelectedElements => {
      if (prevSelectedElements.length === 0) {
        return prevSelectedElements;
      }

      prevSelectedElements.forEach(element => element.deselect());
      return [];
    });
  }, []);

  const clearSelectedLinks = useCallback(() => {
    setSelectedLink(prevSelected => {
      if (prevSelected == null) {
        return;
      }

      prevSelected.deselect();
      return null;
    });
  }, []);

  const changeSelection: ChangeSelectionFunc = useCallback(
    (newSelection: IBlock | $ReadOnlyArray<IBlock>) => {
      const newSelectedElements: $ReadOnlyArray<IBlock> = Array.isArray(
        newSelection,
      )
        ? newSelection
        : [newSelection];

      setSelectedElements(previousSelectedElements => {
        if (previousSelectedElements != null) {
          previousSelectedElements
            .filter(element => !newSelectedElements.includes(element))
            .forEach(element => element.deselect());
        }
        newSelectedElements
          .filter(
            element => !(previousSelectedElements || []).includes(element),
          )
          .forEach(element => element.select());

        clearSelectedLinks();

        return newSelectedElements;
      });
    },
    [clearSelectedLinks],
  );

  const changeLinkSelection: ChangeLinkSelectionFunc = useCallback(
    (newSelection: IConnector) => {
      setSelectedLink(previousSelectedLinks => {
        if (previousSelectedLinks != null) {
          previousSelectedLinks.deselect();
        }

        newSelection.select();
        clearSelectedElements();

        return newSelection;
      });
    },
    [clearSelectedElements],
  );

  const {checkIfElementShouldBeIgnored} = useLassoSelection(
    selectedElements,
    changeSelection,
  );

  const onBlockRemoved = useCallback(() => {
    clearSelectedElements();
    clearSelectedLinks();
  }, [clearSelectedElements, clearSelectedLinks]);

  useExplicitSelection(changeSelection, checkIfElementShouldBeIgnored);
  useLinkSelection(changeLinkSelection);

  useEffect(() => {
    flow.onGraphBlockEvent(Events.Graph.OnRemove, onBlockRemoved);
  }, [flow, onBlockRemoved]);

  const selectAllBlocks = useCallback(() => changeSelection(flow.getBlocks()), [
    changeSelection,
    flow,
  ]);

  useKeyboardShortcut(
    PREDICATES.combination([PREDICATES.ctrl, PREDICATES.key('a')]),
    selectAllBlocks,
  );

  return (
    <GraphSelectionContext.Provider
      value={{
        selectedElements: selectedElements ?? [],
        selectedLink: selectedLink,
        changeSelection,
        changeLinkSelection,
      }}>
      {props.children}
    </GraphSelectionContext.Provider>
  );
}

export function useGraphSelection() {
  return useContext(GraphSelectionContext);
}

export default GraphSelectionContext;

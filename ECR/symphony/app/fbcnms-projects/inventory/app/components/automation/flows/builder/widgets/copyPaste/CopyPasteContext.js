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

import * as React from 'react';
import emptyFunction from '@fbcnms/util/emptyFunction';
import {
  PREDICATES,
  useKeyboardShortcuts,
} from '../keyboardShortcuts/KeyboardShortcutsContext';
import {useCallback, useContext, useEffect, useState} from 'react';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';
import {useGraphSelection} from '../selection/GraphSelectionContext';
import {useReadOnlyMode} from '../readOnlyModeContext';

export type CopyPasteContextType = {
  allowDuplicate: boolean,
  allowCopy: boolean,
  allowPaste: boolean,
  duplicate: () => void,
  copy: () => void,
  paste: () => void,
};

const CopyPasteContextDefaults = {
  allowDuplicate: false,
  allowCopy: false,
  allowPaste: false,
  duplicate: emptyFunction,
  copy: emptyFunction,
  paste: emptyFunction,
};

const CopyPasteContext = React.createContext<CopyPasteContextType>(
  CopyPasteContextDefaults,
);

type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export function CopyPasteContextProvider(props: Props) {
  const flow = useGraph();
  const selection = useGraphSelection();

  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [allowCopy, setAllowCopy] = useState(false);
  const [clipboard, setClipboard] = useState<?(IBlock[])>(null);

  const duplicate = useCallback(() => {
    if (!allowDuplicate) {
      return;
    }

    const blocksToDuplicate = selection.selectedElements;
    const duplicatedBlocks = flow.duplicateBlocks([...blocksToDuplicate]);
    selection.changeSelection(duplicatedBlocks);
  }, [allowDuplicate, flow, selection]);

  const copy = useCallback(() => {
    if (!allowCopy) {
      return;
    }
    const blocksToDuplicate = selection.selectedElements;
    const duplicatedBlocks = flow.duplicateBlocks(
      [...blocksToDuplicate],
      false,
    );
    setClipboard(duplicatedBlocks);
  }, [allowCopy, flow, selection]);

  const paste = useCallback(() => {
    if (clipboard == null) {
      return;
    }

    flow.addCopiedBlocks(clipboard);
    setClipboard(null);
    selection.changeSelection(clipboard);
  }, [clipboard, selection, flow]);

  const {isReadOnly} = useReadOnlyMode();

  const keyboardShortcuts = useKeyboardShortcuts();
  const registerKeyboardShortcut =
    keyboardShortcuts.registerCanvasKeyboardShortcut;

  useEffect(() => {
    if (!isReadOnly) {
      const unregisterCallbacks = [
        registerKeyboardShortcut(
          PREDICATES.combination([PREDICATES.ctrl, PREDICATES.key('d')]),
          duplicate,
        ),
        registerKeyboardShortcut(
          PREDICATES.combination([PREDICATES.ctrl, PREDICATES.key('c')]),
          copy,
        ),
        registerKeyboardShortcut(
          PREDICATES.combination([PREDICATES.ctrl, PREDICATES.key('v')]),
          paste,
        ),
      ];

      return () => unregisterCallbacks.forEach(unregister => unregister());
    }
  }, [isReadOnly, copy, paste, duplicate, registerKeyboardShortcut]);

  useEffect(() => {
    setAllowDuplicate(!isReadOnly && selection.selectedElements.length > 0);
    setAllowCopy(!isReadOnly && selection.selectedElements.length > 0);
  }, [isReadOnly, selection]);

  return (
    <CopyPasteContext.Provider
      value={{
        allowDuplicate,
        allowCopy,
        allowPaste: clipboard != null,
        duplicate,
        copy,
        paste,
      }}>
      {props.children}
    </CopyPasteContext.Provider>
  );
}

export function useCopyPaste() {
  return useContext(CopyPasteContext);
}

export default CopyPasteContext;

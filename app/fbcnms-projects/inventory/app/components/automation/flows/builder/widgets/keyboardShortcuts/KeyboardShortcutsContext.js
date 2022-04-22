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
import emptyFunction from '@fbcnms/util/emptyFunction';
import {Events} from '../../canvas/graph/facades/Helpers';
import {createContext, useCallback, useContext, useEffect, useRef} from 'react';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';

type KeyboardEvents = 'keydown' | 'keyup';

type Predicate = KeyboardEvent => boolean;

type CustomizedKeyboardEvent = KeyboardEvent & {
  handled?: ?boolean,
};

const keyPredicate = (char: string) => (args: KeyboardEvent) =>
  args.key === char;

export const PREDICATES = {
  ctrl: (args: KeyboardEvent) => args.metaKey || args.ctrlKey,
  space: keyPredicate(' '),
  del: keyPredicate('Delete'),
  key: keyPredicate,
  combination: (predicates: $ReadOnlyArray<Predicate>) => (
    args: KeyboardEvent,
  ) => [...predicates].find(predicate => predicate(args) === false) == null,
};

type EventUnregistrationFunction = () => void;
type CanvasKeyboardShortcutEventRegistration = (
  predicate: Predicate,
  callback: () => void,
  event?: KeyboardEvents,
) => EventUnregistrationFunction;

export type KeyboardShortcutsContextType = {
  initiateKeyboardShortcutsHandlers: () => void,
  registerCanvasKeyboardShortcut: CanvasKeyboardShortcutEventRegistration,
  blockShortcuts: () => void,
  unblockShortcuts: () => void,
};

const KeyboardShortcutsContextDefaults = {
  initiateKeyboardShortcutsHandlers: emptyFunction,
  registerCanvasKeyboardShortcut: () => emptyFunction,
  blockShortcuts: emptyFunction,
  unblockShortcuts: emptyFunction,
};

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>(
  KeyboardShortcutsContextDefaults,
);

type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export function KeyboardShortcutsContextProvider(props: Props) {
  const keyboardShortcutsHandler = useRef();
  const focusShortcutsHandler = useCallback(() => {
    if (keyboardShortcutsHandler.current == null) {
      return;
    }
    keyboardShortcutsHandler.current.focus();
  }, []);

  const flow = useGraph();

  const initiateKeyboardShortcutsHandlers = useCallback(() => {
    flow.onPaperEvent(Events.Paper.BackdropMouseDown, focusShortcutsHandler);
    flow.onBlockEvent(Events.Block.MouseDown, focusShortcutsHandler);
    flow.onConnectorEvent(Events.Connector.MouseDown, focusShortcutsHandler);

    const focusMagnet = document.getElementsByTagName('body')[0];

    if (focusMagnet != null) {
      focusMagnet.addEventListener('focusout', (event: FocusEvent) => {
        if (event.relatedTarget == null) {
          focusShortcutsHandler();
        }
      });
    }

    focusShortcutsHandler();
  }, [flow, focusShortcutsHandler]);

  const keyboardShortcutsBlocked = useRef(false);

  const blockShortcuts = useCallback(() => {
    keyboardShortcutsBlocked.current = true;
  }, []);
  const unblockShortcuts = useCallback(() => {
    keyboardShortcutsBlocked.current = false;
  }, []);

  const registerCanvasKeyboardShortcut = useCallback(
    (predicate: Predicate, callback: () => void, event?: KeyboardEvents) => {
      const eventName: KeyboardEvents = event ?? 'keydown';

      const checkPredicateAndFire = (args: CustomizedKeyboardEvent) => {
        if (keyboardShortcutsBlocked.current === true) {
          return;
        }
        if (predicate(args)) {
          callback();
          args.stopPropagation();
          args.preventDefault();
        }
      };

      if (keyboardShortcutsHandler.current != null) {
        keyboardShortcutsHandler.current.addEventListener(
          eventName,
          checkPredicateAndFire,
        );
      }

      return () => {
        if (keyboardShortcutsHandler.current != null) {
          keyboardShortcutsHandler.current.removeEventListener(
            eventName,
            checkPredicateAndFire,
          );
        }
      };
    },
    [],
  );

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        initiateKeyboardShortcutsHandlers,
        registerCanvasKeyboardShortcut,
        blockShortcuts,
        unblockShortcuts,
      }}>
      {props.children}
      <div ref={keyboardShortcutsHandler} tabIndex="0" />
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  return useContext(KeyboardShortcutsContext);
}

export function useKeyboardShortcut(
  predicate: Predicate,
  callback: () => void,
  event?: KeyboardEvents,
) {
  const keyboardShortcuts = useKeyboardShortcuts();
  useEffect(
    () =>
      keyboardShortcuts.registerCanvasKeyboardShortcut(
        predicate,
        callback,
        event,
      ),
    [predicate, callback, event, keyboardShortcuts],
  );
}

export function useKeyboardToggle(
  predicate: KeyboardEvent => boolean,
  callbackOn: () => void,
  callbackOff: () => void,
) {
  useKeyboardShortcut(predicate, callbackOn);
  useKeyboardShortcut(predicate, callbackOff, 'keyup');
}

export default KeyboardShortcutsContext;

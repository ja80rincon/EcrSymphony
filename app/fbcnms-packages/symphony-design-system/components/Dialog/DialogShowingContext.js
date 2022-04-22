/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {BaseDialogComponentProps, BaseDialogProps} from './BaseDialog';

import * as React from 'react';
import BaseDialog from './BaseDialog';
import emptyFunction from '@fbcnms/util/emptyFunction';
import {createContext, useCallback, useContext, useMemo, useState} from 'react';

export type DialogShowingContextValue = $ReadOnly<{|
  showDialog: (props: BaseDialogProps, replaceExisting?: ?boolean) => void,
  hideDialog: () => void,
  isShown: boolean,
|}>;

const DialogShowingContext = createContext<DialogShowingContextValue>({
  showDialog: emptyFunction,
  hideDialog: emptyFunction,
  isShown: false,
});

export function useDialogShowingContext() {
  return useContext(DialogShowingContext);
}

type Props = $ReadOnly<{|
  children: React.Node,
|}>;

const EMPTY_HIDDEN_DIALOG_PROPS: BaseDialogComponentProps = {
  title: null,
  children: null,
  onClose: emptyFunction,
  hidden: true,
};

export function DialogShowingContextProvider(props: Props) {
  const [
    baseDialogProps,
    setBaseDialogProps,
  ] = useState<BaseDialogComponentProps>(EMPTY_HIDDEN_DIALOG_PROPS);

  const isShown = useMemo(() => baseDialogProps.hidden !== true, [
    baseDialogProps.hidden,
  ]);

  const showDialog = useCallback(
    (props: BaseDialogProps, replaceExisting?: ?boolean) => {
      if (isShown && replaceExisting !== true) {
        return;
      }
      setBaseDialogProps(props);
    },
    [isShown],
  );
  const hideDialog = useCallback(() => {
    setBaseDialogProps(currentDialogProps => ({
      ...currentDialogProps,
      hidden: true,
    }));
  }, []);

  const value = useMemo(
    () => ({
      showDialog,
      hideDialog,
      isShown,
    }),
    [hideDialog, showDialog, isShown],
  );

  return (
    <DialogShowingContext.Provider value={value}>
      {props.children}
      <BaseDialog {...baseDialogProps} />
    </DialogShowingContext.Provider>
  );
}

export default DialogShowingContext;

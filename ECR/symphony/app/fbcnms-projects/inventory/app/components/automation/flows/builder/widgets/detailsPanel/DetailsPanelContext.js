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
import useSettingsPanel from './useSettingsPanel';
import {POSITION} from '@symphony/design-system/components/Dialog/DialogFrame';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useContext, useEffect} from 'react';
import {useDialogShowingContext} from '@symphony/design-system/components/Dialog/DialogShowingContext';

export type DetailsPanelContextType = {
  isShown: boolean,
  show: () => void,
  hide: () => void,
  toggle: () => void,
};

const DetailsPanelContextDefaults = {
  isShown: false,
  show: emptyFunction,
  hide: emptyFunction,
  toggle: emptyFunction,
};

const DetailsPanelContext = React.createContext<DetailsPanelContextType>(
  DetailsPanelContextDefaults,
);

type Props = $ReadOnly<{|
  children: React.Node,
|}>;

const useStyles = makeStyles(() => ({
  detailsContainer: {
    marginRight: '16px',
    marginTop: '64px',
    marginBottom: '16px',
  },
}));

export function DetailsPanelContextProvider(props: Props) {
  const dialogShowingContext = useDialogShowingContext();
  const classes = useStyles();
  const dialogDetails = useSettingsPanel();

  const hide = useCallback(() => {
    dialogShowingContext.hideDialog();
  }, [dialogShowingContext]);

  const show = useCallback(() => {
    dialogShowingContext.showDialog(
      {
        ...dialogDetails,
        className: classes.detailsContainer,
        showCloseButton: true,
        position: POSITION.right,
        isModal: false,
        onClose: hide,
      },
      true,
    );
  }, [classes.detailsContainer, dialogShowingContext, dialogDetails, hide]);

  useEffect(() => {
    if (dialogShowingContext.isShown) {
      //update only if it's already open
      show();
    }
  }, [dialogDetails, show, dialogShowingContext]);

  const toggle = useCallback(
    () => (dialogShowingContext.isShown ? hide() : show()),
    [dialogShowingContext, show, hide],
  );

  return (
    <DetailsPanelContext.Provider
      value={{
        isShown: dialogShowingContext.isShown,
        show,
        hide,
        toggle,
      }}>
      {props.children}
    </DetailsPanelContext.Provider>
  );
}

export function useDetailsPane() {
  return useContext(DetailsPanelContext);
}

export default DetailsPanelContext;

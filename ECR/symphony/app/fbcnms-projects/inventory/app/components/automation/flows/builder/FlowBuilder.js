/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import AddFlowDialog from '../view/AddFlowDialog';
import BlocksBar from './tools/blocksBar/BlocksBar';
import BottomBar from './tools/BottomBar';
import Canvas from './canvas/Canvas';
import FlowHeader from './tools/FlowHeader';
import React, {useEffect, useMemo, useState} from 'react';
import TopBar from './tools/TopBar';
import usePaperGrab from './widgets/navigation/usePaperGrab';
import {CopyPasteContextProvider} from './widgets/copyPaste/CopyPasteContext';
import {DetailsPanelContextProvider} from './widgets/detailsPanel/DetailsPanelContext';
import {DialogShowingContextProvider} from '@symphony/design-system/components/Dialog/DialogShowingContext';
import {FlowDataContextProvider} from '../data/FlowDataContext';
import {GraphContextProvider} from './canvas/graph/graphAPIContext/GraphContext';
import {GraphSelectionContextProvider} from './widgets/selection/GraphSelectionContext';
import {InventoryAPIUrls} from '../../../../common/InventoryAPI';
import {KeyboardShortcutsContextProvider} from './widgets/keyboardShortcuts/KeyboardShortcutsContext';
import {
  ReadOnlyModeContextProvider,
  useReadOnlyMode,
} from './widgets/readOnlyModeContext';
import {makeStyles} from '@material-ui/styles';
import {useHistory, useLocation} from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
    userSelect: 'none',
  },
  workspace: {
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
  },
  topBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: 'transparent',
    pointerEvents: 'none',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'transparent',
    pointerEvents: 'none',
  },
}));

export const NEW_FLOW_PARAM = 'new';
export const TESTING_PURPOSES = 'testing_playground';

export type FlowDraft = $ReadOnly<{
  id: ?string,
  name: ?string,
  description?: ?string,
}>;

export default function FlowBuilder() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const showDialog = () => setDialogOpen(true);
  const hideDialog = () => setDialogOpen(false);

  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const flowId = queryParams.get('flowId');

  const isNewFlowDraft = flowId?.startsWith(NEW_FLOW_PARAM) || false;
  const isOnPlayground = flowId?.startsWith(TESTING_PURPOSES) || false;

  useEffect(() => {
    if (isOnPlayground) {
      return;
    }
    if (isNewFlowDraft) {
      showDialog();
    }
  }, [isNewFlowDraft, isOnPlayground]);

  return (
    <ReadOnlyModeContextProvider isReadOnly={false}>
      <GraphContextProvider>
        <KeyboardShortcutsContextProvider>
          <FlowDataContextProvider
            flowId={isNewFlowDraft || isOnPlayground ? null : flowId}>
            <DialogShowingContextProvider>
              <GraphSelectionContextProvider>
                <CopyPasteContextProvider>
                  <DetailsPanelContextProvider>
                    <FlowBuilderLayout />
                    <AddFlowDialog
                      open={dialogOpen}
                      onClose={hideDialog}
                      onSave={flowId => {
                        setDialogOpen(false);
                        history.push(InventoryAPIUrls.flow(flowId));
                      }}
                    />
                  </DetailsPanelContextProvider>
                </CopyPasteContextProvider>
              </GraphSelectionContextProvider>
            </DialogShowingContextProvider>
          </FlowDataContextProvider>
        </KeyboardShortcutsContextProvider>
      </GraphContextProvider>
    </ReadOnlyModeContextProvider>
  );
}

function FlowBuilderLayout() {
  const classes = useStyles();

  usePaperGrab();

  const {isReadOnly} = useReadOnlyMode();
  const sideBar = useMemo(
    () => (isReadOnly ? null : <BlocksBar title={<FlowHeader />} />),
    [isReadOnly],
  );

  return (
    <div className={classes.root}>
      {sideBar}
      <div className={classes.workspace}>
        <TopBar />
        <Canvas />
        <BottomBar />
      </div>
    </div>
  );
}

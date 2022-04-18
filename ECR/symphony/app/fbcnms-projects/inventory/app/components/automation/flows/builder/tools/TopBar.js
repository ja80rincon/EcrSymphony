/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import Button from '@symphony/design-system/components/Button';
import FlowBuilderButton from '../../utils/FlowBuilderButton';
import FlowHeader from './FlowHeader';
import React, {useCallback} from 'react';
import Strings from '@fbcnms/strings/Strings';
import ToolsBar from './ToolsBar';
import fbt from 'fbt';
import {
  PREDICATES,
  useKeyboardShortcut,
} from '../widgets/keyboardShortcuts/KeyboardShortcutsContext';
import {SettingsIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';
import {useCopyPaste} from '../widgets/copyPaste/CopyPasteContext';
import {useDetailsPane} from '../widgets/detailsPanel/DetailsPanelContext';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {useFlowData} from '../../data/FlowDataContext';
import {useGraph} from '../canvas/graph/graphAPIContext/GraphContext';
import {useGraphSelection} from '../widgets/selection/GraphSelectionContext';
import {useReadOnlyMode} from '../widgets/readOnlyModeContext';

const useStyles = makeStyles(() => ({
  root: {
    top: 0,
  },
  right: {
    display: 'flex',
  },
  center: {
    flexGrow: 1,
  },
  left: {},
}));

export default function TopBar() {
  const {isReadOnly} = useReadOnlyMode();
  return isReadOnly ? ViewerTopBar() : BuilderTopBar();
}

function BuilderTopBar() {
  const classes = useStyles();

  const flow = useGraph();
  const selection = useGraphSelection();
  const detailsPane = useDetailsPane();
  const flowData = useFlowData();
  const enqueueSnackbar = useEnqueueSnackbar();
  const copyPaste = useCopyPaste();

  const deleteSelected = useCallback(() => {
    if (selection.selectedLink) {
      return flow.removeConnector(selection.selectedLink);
    } else {
      return flow.removeBlocks([...selection.selectedElements]);
    }
  }, [flow, selection]);
  useKeyboardShortcut(PREDICATES.del, deleteSelected);

  const save = useCallback(() => {
    flowData
      .save()
      .then(() => {
        enqueueSnackbar(`${fbt('Flow draft has been saved!', '')}`, {
          variant: 'success',
        });
      })
      .catch(() => {
        enqueueSnackbar(
          `${fbt(
            'There was an error when trying to save the flow draft.',
            '',
          )}`,
          {
            variant: 'error',
          },
        );
      });
  }, [enqueueSnackbar, flowData]);
  useKeyboardShortcut(PREDICATES.key('s'), save);

  const publish = useCallback(() => {
    flowData
      .publish()
      .then(() => {
        enqueueSnackbar(`${fbt('Flow has been published!', '')}`, {
          variant: 'success',
        });
      })
      .catch(() => {
        enqueueSnackbar(
          `${fbt('There was an error when trying to publish the flow.', '')}`,
          {
            variant: 'error',
          },
        );
      });
  }, [enqueueSnackbar, flowData]);

  return (
    <ToolsBar className={classes.root}>
      <div className={classes.left}>
        <Button
          onClick={deleteSelected}
          disabled={
            selection.selectedElements.length == 0 && !selection.selectedLink
          }>
          Delete
        </Button>
        <Button onClick={copyPaste.copy} disabled={!copyPaste.allowCopy}>
          Copy
        </Button>
        <Button onClick={copyPaste.paste} disabled={!copyPaste.allowPaste}>
          Paste
        </Button>
        <Button
          onClick={copyPaste.duplicate}
          disabled={!copyPaste.allowDuplicate}>
          Duplicate
        </Button>
      </div>
      <div className={classes.center} />
      <div className={classes.right}>
        <FlowBuilderButton icon={SettingsIcon} onClick={detailsPane.toggle} />
        <Button
          disabled={!flowData.flowDraft?.id || !flowData.hasChanges}
          onClick={save}>
          {Strings.common.saveButton}
        </Button>
        <Button onClick={publish} tooltip="publish last saved version">{`${fbt(
          'Publish',
          '',
        )}`}</Button>
      </div>
    </ToolsBar>
  );
}

function ViewerTopBar() {
  const classes = useStyles();
  const detailsPane = useDetailsPane();

  return (
    <ToolsBar className={classes.root}>
      <div className={classes.left}>
        <FlowHeader />
      </div>
      <div className={classes.center} />
      <div className={classes.right}>
        <FlowBuilderButton icon={SettingsIcon} onClick={detailsPane.toggle} />
      </div>
    </ToolsBar>
  );
}

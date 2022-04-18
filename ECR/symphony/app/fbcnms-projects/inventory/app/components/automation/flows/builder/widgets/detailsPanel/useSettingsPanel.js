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
import BlockSettings from './blockSettings/BlockSettings';
import FlowSettings from './flowSettings/FlowSettings';
import FlowTitle from './flowSettings/FlowTitle';
import SelectionSettings from './selectionSettings/SelectionSettings';
import fbt from 'fbt';
import {FormContextProvider} from '../../../../../../common/FormContext';
import {makeStyles} from '@material-ui/styles';
import {useDialogShowingContext} from '@symphony/design-system/components/Dialog/DialogShowingContext';
import {useEffect} from 'react';
import {useFormAlertsContext} from '@symphony/design-system/components/Form/FormAlertsContext';
import {useGraphSelection} from '../selection/GraphSelectionContext';
import {useKeyboardShortcuts} from '../keyboardShortcuts/KeyboardShortcutsContext';
import {useReadOnlyMode} from '../readOnlyModeContext';

type SettingsPanelType = $ReadOnly<{|
  title: React.Node,
  children: React.Node,
|}>;

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '6px',
  },
}));

export default function useSettingsPanel(): SettingsPanelType {
  const classes = useStyles();
  const selection = useGraphSelection();
  const selectionCount = selection.selectedElements.length;

  const keyboardShortcutsContext = useKeyboardShortcuts();

  const noSelectionDetails = () => ({
    title: <FlowTitle className={classes.title} />,
    children: <FlowSettings />,
  });

  const singleSelectionDetails = () => ({
    title: 'Block Settings',
    children: <BlockSettings block={selection.selectedElements[0]} />,
  });

  const multiSelectionDetails = () => ({
    title: 'Selection Settings',
    children: <SelectionSettings selection={selection} />,
  });

  const details =
    selectionCount === 0
      ? noSelectionDetails()
      : selectionCount === 1
      ? singleSelectionDetails()
      : multiSelectionDetails();

  return {
    title: (
      <KeyboardShortcutsBlockingForm
        block={keyboardShortcutsContext.blockShortcuts}
        unblock={keyboardShortcutsContext.unblockShortcuts}>
        {details.title}
      </KeyboardShortcutsBlockingForm>
    ),
    children: (
      <KeyboardShortcutsBlockingForm
        block={keyboardShortcutsContext.blockShortcuts}
        unblock={keyboardShortcutsContext.unblockShortcuts}>
        {details.children}
      </KeyboardShortcutsBlockingForm>
    ),
  };
}

type KeyboardShortcutsBlockerProps = $ReadOnly<{|
  children: React.Node,
  block: () => void,
  unblock: () => void,
|}>;

function KeyboardShortcutsBlockingForm(props: KeyboardShortcutsBlockerProps) {
  const {children, block, unblock} = props;

  const dialogShowingContext = useDialogShowingContext();
  useEffect(() => {
    if (dialogShowingContext.isShown) {
      block();
    } else {
      unblock();
    }
  }, [dialogShowingContext.isShown, block, unblock]);

  return (
    <FormContextProvider permissions={{adminRightsRequired: true}}>
      <FormEditLockHandler>{children}</FormEditLockHandler>
    </FormContextProvider>
  );
}

type FormEditLockHandlerProps = $ReadOnly<{|
  children: React.Node,
|}>;

function FormEditLockHandler(props: FormEditLockHandlerProps) {
  const {children} = props;

  const {isReadOnly} = useReadOnlyMode();
  const alerts = useFormAlertsContext();
  alerts.editLock.check({
    fieldId: 'system_default_policy',
    fieldDisplayName: 'Workforce Global Policy',
    value: isReadOnly,
    checkCallback: isReadOnly =>
      isReadOnly ? `${fbt('Edit is not allowed in viewer mode', '')}` : '',
  });

  return children;
}

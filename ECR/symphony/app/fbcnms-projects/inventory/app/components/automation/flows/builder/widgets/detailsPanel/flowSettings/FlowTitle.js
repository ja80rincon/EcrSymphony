/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import FormAction from '@symphony/design-system/components/Form/FormAction';
import IconButton from '@symphony/design-system/components/IconButton';
import React, {useCallback} from 'react';
import RenameFlowDialog from '../RenameFlowDialog';
import Text from '@symphony/design-system/components/Text';
import {POSITION} from '@symphony/design-system/components/Dialog/DialogFrame';
import {RenameOneLineIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';
import {useDialogShowingContext} from '@symphony/design-system/components/Dialog/DialogShowingContext';
import {useFlowData} from '../../../../data/FlowDataContext';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '6px',
    '&:hover $renameButton': {
      opacity: 1,
    },
  },
  name: {
    width: '320px',
    marginRight: '16px',
  },
  renameButton: {
    opacity: 0,
  },
}));

export default function FlowTitle() {
  const classes = useStyles();
  const flowData = useFlowData();
  const dialogShowingContext = useDialogShowingContext();

  const hide = useCallback(() => {
    dialogShowingContext.hideDialog();
  }, [dialogShowingContext]);

  const show = useCallback(() => {
    dialogShowingContext.showDialog(
      {
        title: 'Rename Flow',
        children: (
          <RenameFlowDialog
            onClose={hide}
            onSave={newName => {
              flowData.save({name: newName});
              hide();
            }}
          />
        ),
        showCloseButton: true,
        position: POSITION.center,
        isModal: true,
        onClose: hide,
      },
      true,
    );
  }, [dialogShowingContext, hide, flowData]);

  return (
    <div className={classes.root}>
      <div className={classes.name}>
        <Text variant="h6">{flowData.flowDraft?.name ?? null}</Text>
      </div>
      <FormAction hideOnEditLocks={true}>
        <IconButton
          className={classes.renameButton}
          icon={RenameOneLineIcon}
          onClick={show}
          skin="gray"
        />
      </FormAction>
    </div>
  );
}

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import DetailsPanelSection from '../DetailsPanelSection';
import EditFlowDescriptionDialog from '../EditFlowDescriptionDialog';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import IconButton from '@symphony/design-system/components/IconButton';
import React, {useCallback} from 'react';
import classNames from 'classnames';
import fbt from 'fbt';
import {POSITION} from '@symphony/design-system/components/Dialog/DialogFrame';
import {RenameMultipleLinesIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';
import {useDialogShowingContext} from '@symphony/design-system/components/Dialog/DialogShowingContext';
import {useFlowData} from '../../../../data/FlowDataContext';

const useStyles = makeStyles(() => ({
  root: {
    '&:hover $editDescriptionButton': {
      opacity: 1,
    },
  },
  editDescriptionButton: {
    opacity: 0,
  },
}));

type Props = $ReadOnly<{|
  className?: string,
|}>;

export default function FlowDescription(props: Props) {
  const {className} = props;
  const classes = useStyles();
  const flowData = useFlowData();
  const dialogShowingContext = useDialogShowingContext();

  const hide = useCallback(() => {
    dialogShowingContext.hideDialog();
  }, [dialogShowingContext]);

  const show = useCallback(() => {
    dialogShowingContext.showDialog(
      {
        title: 'Edit Description',
        children: (
          <EditFlowDescriptionDialog
            onClose={hide}
            onSave={newDescription => {
              flowData.save({description: newDescription});
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

  const actionItems = [
    <FormAction hideOnEditLocks={true}>
      <IconButton
        className={classes.editDescriptionButton}
        icon={RenameMultipleLinesIcon}
        onClick={show}
        skin="gray"
      />
    </FormAction>,
  ];

  return (
    <DetailsPanelSection
      title={fbt('Flow description', '')}
      body={flowData.flowDraft?.description ?? null}
      actionItems={actionItems}
      className={classNames(classes.root, className)}
    />
  );
}

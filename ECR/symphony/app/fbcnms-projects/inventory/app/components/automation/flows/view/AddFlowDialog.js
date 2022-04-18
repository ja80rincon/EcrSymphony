/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import Button from '@symphony/design-system/components/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {useCallback, useState} from 'react';
import Text from '@symphony/design-system/components/Text';

import type {
  AddFlowDraftMutationResponse,
  AddFlowDraftMutationVariables,
} from '../../../../mutations/__generated__/AddFlowDraftMutation.graphql';
import type {MutationCallbacks} from '../../../../mutations/MutationCallbacks';

import AddFlowDraftMutation from '../../../../mutations/AddFlowDraftMutation';
import NameDescriptionSection from '../../../../common/NameDescriptionSection';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import nullthrows from '@fbcnms/util/nullthrows';
import symphony from '@symphony/design-system/theme/symphony';
import {LogEvents, ServerLogger} from '../../../../common/LoggingUtils';
import {fbt} from 'fbt';
import {getGraphError} from '../../../../common/EntUtils';
import {makeStyles} from '@material-ui/styles';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  dialogTitle: {
    padding: '24px',
    paddingBottom: '16px',
  },
  dialogTitleText: {
    fontSize: '20px',
    lineHeight: '24px',
    color: theme.palette.blueGrayDark,
    fontWeight: 500,
  },
  dialogContent: {
    padding: '24px',
    maxHeight: '350px',
    overflowY: 'auto',
    borderBottom: `1px solid ${symphony.palette.separator}`,
  },
  dialogActions: {
    padding: '24px',
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 2,
  },
}));

type Props = $ReadOnly<{|
  open: boolean,
  onClose: () => void,
  onSave: (flowId: string) => void,
|}>;

export type Flow = {
  id: string,
  name: string,
  description: ?string,
};

const AddFlowDialog = ({open, onClose, onSave}: Props) => {
  const classes = useStyles();

  const enqueueSnackbar = useEnqueueSnackbar();

  const [flow, setFlow] = useState<Flow>({
    id: '',
    name: '',
    description: '',
    endParamDefinitions: [],
  });

  const enqueueError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        children: key => (
          <SnackbarItem id={key} message={message} variant="error" />
        ),
      });
    },
    [enqueueSnackbar],
  );

  const setFlowDetail = (key: 'name' | 'description', value) => {
    setFlow(prevWorkOrder => {
      return {...prevWorkOrder, [`${key}`]: value};
    });
  };

  const saveFlow = () => {
    const {name, description} = nullthrows(flow);
    const variables: AddFlowDraftMutationVariables = {
      input: {
        name,
        description,
        endParamDefinitions: [],
      },
    };

    const callbacks: MutationCallbacks<AddFlowDraftMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          enqueueError(errors[0].message);
        } else {
          onSave(nullthrows(response.addFlowDraft?.id));
        }
      },
      onError: (error: Error) => {
        enqueueError(getGraphError(error));
      },
    };
    ServerLogger.info(LogEvents.ADD_FLOW_BUTTON_CLICKED, {
      source: 'flow_create',
    });
    AddFlowDraftMutation(variables, callbacks);
  };

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      fullWidth={true}
      className={classes.root}>
      <DialogTitle className={classes.dialogTitle}>
        <Text className={classes.dialogTitleText}>
          <fbt desc="">Create new Flow</fbt>
        </Text>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <NameDescriptionSection
          name={flow.name}
          description={flow.description}
          onNameChange={value => setFlowDetail('name', value)}
          onDescriptionChange={value => setFlowDetail('description', value)}
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} skin="regular">
          <fbt desc="">Cancel</fbt>
        </Button>
        <Button disabled={!flow.name} onClick={saveFlow}>
          <fbt desc="">Create</fbt>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFlowDialog;

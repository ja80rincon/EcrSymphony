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
import ProjectTypesList from './ProjectTypesList';
import React, {useState} from 'react';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import useFeatureFlag from '@fbcnms/ui/context/useFeatureFlag';

import CSVUploadDialog from '../CSVUploadDialog';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import nullthrows from '@fbcnms/util/nullthrows';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minHeight: 550,
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
  avatar: {
    backgroundColor: '#e4f2ff',
  },
  tab: {
    fontSize: '14px',
    fontWeight: 500,
  },
  dialogContent: {
    padding: 0,
    overflowY: 'auto',
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
  onProjectTypeSelected: (id: string) => void,
|}>;

const AddProjectDialog = (props: Props) => {
  const [selectedProjectTypeId, setSelectedProjectTypeId] = useState(null);
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [mode, setMode] = useState('projects');

  const useBulkUpload = useFeatureFlag('projects_bulk_upload');

  const handleTabChange = (event: SyntheticEvent<*>, tabIndex: number) => {
    const tabContent = tabIndex == 0 ? 'projects' : 'upload';
    setValue(tabIndex);
    setMode(tabContent);
  };

  return (
    <Dialog
      maxWidth="sm"
      open={props.open}
      onClose={props.onClose}
      fullWidth={true}
      classes={{paper: classes.dialogPaper}}>
      <Tabs
        value={value}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary">
        <Tab className={classes.tab} label="Projects" />
        {useBulkUpload && <Tab className={classes.tab} label="Bulk Upload" />}
      </Tabs>
      <DialogTitle className={classes.dialogTitle}>
        <Text className={classes.dialogTitleText}>
          {mode === 'projects'
            ? fbt(
                'Select a template for this project',
                'project template selection',
              )
            : ''}
        </Text>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {mode === 'projects' ? (
          <ProjectTypesList onSelect={type => setSelectedProjectTypeId(type)} />
        ) : (
          <CSVUploadDialog mode="projects" />
        )}
      </DialogContent>
      {mode === 'projects' && (
        <DialogActions className={classes.dialogActions}>
          <Button onClick={props.onClose} skin="regular">
            Cancel
          </Button>
          <Button
            disabled={selectedProjectTypeId === null}
            onClick={() => {
              props.onProjectTypeSelected(nullthrows(selectedProjectTypeId));
            }}>
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AddProjectDialog;

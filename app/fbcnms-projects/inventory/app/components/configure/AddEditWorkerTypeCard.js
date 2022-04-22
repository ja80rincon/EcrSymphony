/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AddEditWorkerTypeCard_workerType} from './__generated__/AddEditWorkerTypeCard_workerType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WorkerType} from '../../common/Worker';

import Breadcrumbs from '@fbcnms/ui/components/Breadcrumbs';
import Button from '@symphony/design-system/components/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExpandingPanel from '@fbcnms/ui/components/ExpandingPanel';
import ExperimentalPropertyTypesTable from '../form/ExperimentalPropertyTypesTable';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import NameDescriptionSection from '../../common/NameDescriptionSection';
import PropertyTypesTableDispatcher from '../form/context/property_types/PropertyTypesTableDispatcher';
import React, {useCallback, useState} from 'react';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {FormContextProvider} from '../../common/FormContext';
import {addWorkerType} from '../../mutations/AddWorkerTypeMutation';
import {createFragmentContainer, graphql} from 'react-relay';
import {deleteWorkerType} from '../../mutations/RemoveWorkerTypeMutation';
import {editWorkerType} from '../../mutations/EditWorkerTypeMutation';
import {generateTempId, isTempId} from '../../common/EntUtils';
import {makeStyles} from '@material-ui/styles';
import {toMutablePropertyType} from '../../common/PropertyType';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {usePropertyTypesReducer} from '../form/context/property_types/PropertyTypesTableState';

const useStyles = makeStyles(() => ({
  root: {
    padding: '24px 16px',
    maxHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    paddingBottom: '24px',
  },
  body: {
    overflowY: 'auto',
  },
  buttons: {
    display: 'flex',
  },
  cancelButton: {
    marginRight: '8px',
  },
  deleteButton: {
    cursor: 'pointer',
    color: symphony.palette.D400,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  },
  assigneeCanCompleteContainer: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '8px',
  },
}));

type Props = $ReadOnly<{|
  open: boolean,
  onClose: () => void,
  onSave: () => void,
  workerType: ?AddEditWorkerTypeCard_workerType,
  ...WithAlert,
|}>;

const AddEditWorkerTypeCard = ({
  workerType,
  onClose,
  onSave,
  confirm,
}: Props) => {
  const classes = useStyles();
  const [editingWorkerType, setEditingWorkerType] = useState<WorkerType>({
    id: workerType?.id ?? generateTempId(),
    name: workerType?.name ?? '',
    description: workerType?.description,
    propertyTypes: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [propertyTypes, propertyTypesDispatcher] = usePropertyTypesReducer(
    (workerType?.propertyTypes ?? [])
      .filter(Boolean)
      .map(toMutablePropertyType),
  );

  const enqueueSnackbar = useEnqueueSnackbar();

  const onDelete = useCallback(() => {
    confirm(
      fbt(
        'Are you sure you want to delete ' +
          fbt.param('name', editingWorkerType.name),
        '',
      ).toString(),
    ).then(
      deleteApproved =>
        deleteApproved &&
        deleteWorkerType(editingWorkerType.id)
          .then(onClose)
          .catch((errorMessage: string) =>
            enqueueSnackbar(errorMessage, {
              children: key => (
                <SnackbarItem id={key} message={errorMessage} variant="error" />
              ),
            }),
          ),
    );
  }, [
    confirm,
    editingWorkerType.name,
    editingWorkerType.id,
    onClose,
    enqueueSnackbar,
  ]);

  const nameChanged = name =>
    setEditingWorkerType(workerType => ({
      ...workerType,
      name,
    }));

  const descriptionChanged = description =>
    setEditingWorkerType(workerType => ({
      ...workerType,
      description,
    }));

  const onSaveClicked = () => {
    setIsSaving(true);
    const workerToSave: WorkerType = {
      ...editingWorkerType,
      propertyTypes,
    };
    const saveAction = isTempId(editingWorkerType.id)
      ? addWorkerType
      : editWorkerType;
    saveAction(workerToSave)
      .then(onSave)
      .catch((errorMessage: string) =>
        enqueueSnackbar(errorMessage, {
          children: key => (
            <SnackbarItem id={key} message={errorMessage} variant="error" />
          ),
        }),
      )
      .finally(() => setIsSaving(false));
  };

  const isOnEditMode = workerType != null;

  return (
    <FormContextProvider
      permissions={{
        entity: 'automationTemplate',
        action: isOnEditMode ? 'update' : 'create',
      }}>
      <div className={classes.root}>
        <div className={classes.header}>
          <Breadcrumbs
            breadcrumbs={[
              {
                id: 'wk_templates',
                name: 'Worker Templates',
                onClick: onClose,
              },
              workerType
                ? {
                    id: workerType.id,
                    name: workerType.name,
                  }
                : {
                    id: 'new_wo_type',
                    name: `${fbt('New worker template', '')}`,
                  },
            ]}
            size="large"
          />
          <div className={classes.buttons}>
            {isOnEditMode && (
              <FormActionWithPermissions
                permissions={{entity: 'automationTemplate', action: 'delete'}}>
                <Button
                  className={classes.deleteButton}
                  variant="text"
                  skin="gray"
                  onClick={onDelete}>
                  <DeleteOutlineIcon />
                </Button>
              </FormActionWithPermissions>
            )}
            <Button
              className={classes.cancelButton}
              skin="regular"
              onClick={onClose}>
              Cancel
            </Button>
            <FormAction disableOnFromError={true} disabled={isSaving}>
              <Button onClick={onSaveClicked}>Save</Button>
            </FormAction>
          </div>
        </div>
        <div className={classes.body}>
          <ExpandingPanel title="Details">
            <NameDescriptionSection
              title="Title"
              name={editingWorkerType.name ?? ''}
              namePlaceholder={`${fbt('New worker template', '')}`}
              description={editingWorkerType.description ?? ''}
              descriptionPlaceholder={`${fbt(
                'Write a description if you want it to appear whenever this template of worker is created',
                '',
              )}`}
              onNameChange={nameChanged}
              onDescriptionChange={descriptionChanged}
            />
          </ExpandingPanel>
          <ExpandingPanel title="Properties">
            <PropertyTypesTableDispatcher.Provider
              value={propertyTypesDispatcher}>
              <ExperimentalPropertyTypesTable
                supportDelete={true}
                propertyTypes={propertyTypes}
              />
            </PropertyTypesTableDispatcher.Provider>
          </ExpandingPanel>
        </div>
      </div>
    </FormContextProvider>
  );
};

export default createFragmentContainer(withAlert(AddEditWorkerTypeCard), {
  workerType: graphql`
    fragment AddEditWorkerTypeCard_workerType on WorkerType {
      id
      name
      description
      propertyTypes {
        id
        name
        type
        nodeType
        index
        stringValue
        intValue
        booleanValue
        floatValue
        latitudeValue
        longitudeValue
        rangeFromValue
        rangeToValue
        isEditable
        isMandatory
        isInstanceProperty
        isDeleted
        category
      }
    }
  `,
});

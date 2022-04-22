/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AddEditWorkOrderTypeCard_workOrderType} from './__generated__/AddEditWorkOrderTypeCard_workOrderType.graphql';
import type {ChecklistCategoriesMutateStateActionType} from '../checklist/ChecklistCategoriesMutateAction';
import type {ChecklistCategoriesStateType} from '../checklist/ChecklistCategoriesMutateState';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WorkOrderType} from '../../common/WorkOrder';

import Breadcrumbs from '@fbcnms/ui/components/Breadcrumbs';
import Button from '@symphony/design-system/components/Button';
import CheckListCategoryExpandingPanel from '../checklist/checkListCategory/CheckListCategoryExpandingPanel';
import Checkbox from '@symphony/design-system/components/Checkbox/Checkbox';
import ChecklistCategoriesMutateDispatchContext from '../checklist/ChecklistCategoriesMutateDispatchContext';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExpandingPanel from '@fbcnms/ui/components/ExpandingPanel';
import ExperimentalPropertyTypesTable from '../form/ExperimentalPropertyTypesTable';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import FormField from '@symphony/design-system/components/FormField/FormField';
import NameDescriptionSection from '../../common/NameDescriptionSection';
import PropertyTypesTableDispatcher from '../form/context/property_types/PropertyTypesTableDispatcher';
import React, {useCallback, useReducer, useState} from 'react';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {FormContextProvider} from '../../common/FormContext';
import {addWorkOrderType} from '../../mutations/AddWorkOrderTypeMutation';
import {convertChecklistCategoriesStateToDefinitions} from '../checklist/ChecklistUtils';
import {createFragmentContainer, graphql} from 'react-relay';
import {deleteWorkOrderType} from '../../mutations/RemoveWorkOrderTypeMutation';
import {editWorkOrderType} from '../../mutations/EditWorkOrderTypeMutation';
import {generateTempId, isTempId} from '../../common/EntUtils';
import {
  getInitialStateFromChecklistDefinitions,
  reducer,
} from '../checklist/ChecklistCategoriesMutateReducer';
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
  workOrderType: ?AddEditWorkOrderTypeCard_workOrderType,
  ...WithAlert,
|}>;

const AddEditWorkOrderTypeCard = ({
  workOrderType,
  onClose,
  onSave,
  confirm,
}: Props) => {
  const classes = useStyles();
  const [
    editingWorkOrderType,
    setEditingWorkOrderType,
  ] = useState<WorkOrderType>({
    id: workOrderType?.id ?? generateTempId(),
    name: workOrderType?.name ?? '',
    description: workOrderType?.description,
    assigneeCanCompleteWorkOrder:
      workOrderType?.assigneeCanCompleteWorkOrder ?? true,
    numberOfWorkOrders: workOrderType?.numberOfWorkOrders ?? 0,
    propertyTypes: [],
    checklistCategoryDefinitions: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [propertyTypes, propertyTypesDispatcher] = usePropertyTypesReducer(
    (workOrderType?.propertyTypes ?? [])
      .filter(Boolean)
      .map(toMutablePropertyType),
  );

  // TODO (T66662674): Explore using combineReducers
  const [editingCategories, dispatch] = useReducer<
    ChecklistCategoriesStateType,
    ChecklistCategoriesMutateStateActionType,
    ?$ElementType<
      AddEditWorkOrderTypeCard_workOrderType,
      'checkListCategoryDefinitions',
    >,
  >(
    reducer,
    workOrderType?.checkListCategoryDefinitions,
    getInitialStateFromChecklistDefinitions,
  );

  const enqueueSnackbar = useEnqueueSnackbar();

  const onDelete = useCallback(() => {
    confirm(
      fbt(
        'Are you sure you want to delete ' +
          fbt.param('name', editingWorkOrderType.name),
        '',
      ).toString(),
    ).then(
      deleteApproved =>
        deleteApproved &&
        deleteWorkOrderType(editingWorkOrderType.id)
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
    editingWorkOrderType.name,
    editingWorkOrderType.id,
    onClose,
    enqueueSnackbar,
  ]);

  const nameChanged = name =>
    setEditingWorkOrderType(workOrder => ({
      ...workOrder,
      name,
    }));

  const descriptionChanged = description =>
    setEditingWorkOrderType(workOrder => ({
      ...workOrder,
      description,
    }));

  const assigneeCanCompleteChanged = selection =>
    setEditingWorkOrderType(workOrder => ({
      ...workOrder,
      assigneeCanCompleteWorkOrder: selection === 'checked',
    }));

  const onSaveClicked = () => {
    setIsSaving(true);
    const workOrderToSave: WorkOrderType = {
      ...editingWorkOrderType,
      checklistCategoryDefinitions: convertChecklistCategoriesStateToDefinitions(
        editingCategories,
      ),
      propertyTypes,
    };
    const saveAction = isTempId(editingWorkOrderType.id)
      ? addWorkOrderType
      : editWorkOrderType;
    saveAction(workOrderToSave)
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

  const isOnEditMode = workOrderType != null;

  return (
    <FormContextProvider
      permissions={{
        entity: 'workorderTemplate',
        action: isOnEditMode ? 'update' : 'create',
      }}>
      <div className={classes.root}>
        <div className={classes.header}>
          <Breadcrumbs
            breadcrumbs={[
              {
                id: 'wo_templates',
                name: 'Work Order Templates',
                onClick: onClose,
              },
              workOrderType
                ? {
                    id: workOrderType.id,
                    name: workOrderType.name,
                  }
                : {
                    id: 'new_wo_type',
                    name: `${fbt('New work order template', '')}`,
                  },
            ]}
            size="large"
          />
          <div className={classes.buttons}>
            {isOnEditMode && (
              <FormActionWithPermissions
                permissions={{entity: 'workorderTemplate', action: 'delete'}}>
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
              name={editingWorkOrderType.name ?? ''}
              namePlaceholder={`${fbt('New work order template', '')}`}
              description={editingWorkOrderType.description ?? ''}
              descriptionPlaceholder={`${fbt(
                'Write a description if you want it to appear whenever this template of work order is created',
                '',
              )}`}
              onNameChange={nameChanged}
              onDescriptionChange={descriptionChanged}
            />
            <div className={classes.assigneeCanCompleteContainer}>
              <FormField>
                <Checkbox
                  className={classes.checkbox}
                  title={fbt(
                    'The assignee of the work order can complete it',
                    '',
                  )}
                  checked={
                    editingWorkOrderType.assigneeCanCompleteWorkOrder ?? true
                  }
                  onChange={assigneeCanCompleteChanged}
                />
              </FormField>
            </div>
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
          <ChecklistCategoriesMutateDispatchContext.Provider value={dispatch}>
            <CheckListCategoryExpandingPanel
              categories={editingCategories}
              isDefinitionsOnly={true}
            />
          </ChecklistCategoriesMutateDispatchContext.Provider>
        </div>
      </div>
    </FormContextProvider>
  );
};

export default createFragmentContainer(withAlert(AddEditWorkOrderTypeCard), {
  workOrderType: graphql`
    fragment AddEditWorkOrderTypeCard_workOrderType on WorkOrderType {
      id
      name
      description
      assigneeCanCompleteWorkOrder
      numberOfWorkOrders
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
      checkListCategoryDefinitions {
        id
        title
        description
        checklistItemDefinitions {
          id
          title
          type
          index
          isMandatory
          enumValues
          enumSelectionMode
          helpText
        }
      }
    }
  `,
});

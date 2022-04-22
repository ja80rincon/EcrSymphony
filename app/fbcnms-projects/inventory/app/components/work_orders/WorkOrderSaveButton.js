/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {ChecklistCategoriesStateType} from '../checklist/ChecklistCategoriesMutateState';
import type {
  EditWorkOrderMutationResponse,
  EditWorkOrderMutationVariables,
} from '../../mutations/__generated__/EditWorkOrderMutation.graphql';
import type {MutationCallbacks} from '../../mutations/MutationCallbacks.js';
import type {Property} from '../../common/Property';
import type {WorkOrderDetails_workOrder} from './__generated__/WorkOrderDetails_workOrder.graphql.js';

import type {AddAppointmentMutationVariables} from '../../mutations/__generated__/AddAppointmentMutation.graphql';

import AddAppointmentMutation from '../../mutations/AddAppointmentMutation';
import Button from '@symphony/design-system/components/Button';
import EditWorkOrderMutation from '../../mutations/EditWorkOrderMutation';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import React, {useCallback} from 'react';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import Strings from '@fbcnms/strings/Strings';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {AppointmentData} from './SelectAvailabilityAssignee';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {convertChecklistCategoriesStateToInput} from '../checklist/ChecklistUtils';
import {getGraphError} from '../../common/EntUtils';
import {toPropertyInput} from '../../common/Property';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';

type Props = $ReadOnly<{|
  workOrder: WorkOrderDetails_workOrder,
  properties: Array<Property>,
  checkListCategories: ChecklistCategoriesStateType,
  locationId: ?string,
  appointmentData: AppointmentData,
|}>;

const WorkOrderSaveButton = (props: Props) => {
  const {
    workOrder,
    properties,
    checkListCategories,
    locationId,
    appointmentData,
  } = props;
  const enqueueSnackbar = useEnqueueSnackbar();
  const {history, match} = useRouter();

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

  const saveWorkOrder = useCallback(() => {
    const {
      id,
      name,
      description,
      owner,
      installDate,
      status,
      priority,
      assignedTo,
      project,
      organizationFk,
    } = workOrder;
    const variables: EditWorkOrderMutationVariables = {
      input: {
        id,
        name,
        description,
        organizationFk: organizationFk?.id || null,
        ownerId: owner.id,
        installDate: installDate ? installDate.toString() : null,
        status,
        priority,
        assigneeId: assignedTo?.id,
        projectId: project?.id,
        properties: toPropertyInput(properties),
        locationId,
        checkListCategories: convertChecklistCategoriesStateToInput(
          checkListCategories,
        ),
      },
    };
    const callbacks: MutationCallbacks<EditWorkOrderMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          enqueueError(errors[0].message);
        } else {
          // navigate to main page
          _saveAppointment(response.editWorkOrder.id);
        }
      },
      onError: (error: Error) => {
        enqueueError(getGraphError(error));
      },
    };
    ServerLogger.info(LogEvents.SAVE_WORK_ORDER_BUTTON_CLICKED, {
      source: 'work_order_details',
    });
    EditWorkOrderMutation(variables, callbacks);
  }, [
    workOrder,
    checkListCategories,
    properties,
    locationId,
    enqueueError,
    history,
    match.url,
  ]);

  const _saveAppointment = workorderID => {
    const assigneeID = workOrder?.assignedTo?.id;
    const {duration, date, saveAppointment} = appointmentData;
    if (!saveAppointment || !assigneeID) return history.push(match.url);
    const variables: AddAppointmentMutationVariables = {
      input: {
        workorderID,
        assigneeID,
        duration,
        date,
      },
    };
    AddAppointmentMutation(variables, {
      onCompleted: () => history.push(match.url),
    });
  };

  return (
    <FormAction disableOnFromError={true}>
      <Button onClick={saveWorkOrder}>{Strings.common.saveButton}</Button>
    </FormAction>
  );
};

export default WorkOrderSaveButton;

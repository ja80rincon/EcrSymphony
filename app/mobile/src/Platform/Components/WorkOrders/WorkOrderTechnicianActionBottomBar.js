/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {ButtonState} from 'Platform/Components/WorkOrders/WorkOrderTechnicianActionButton';
import type {ClockOutReason} from 'Platform/Relay/Mutations/__generated__/TechnicianWorkOrderCheckOutMutation.graphql';
import type {WorkOrderTechnicianActionBottomBar_workOrder} from './__generated__/WorkOrderTechnicianActionBottomBar_workOrder.graphql';
import type {WorkOrderTechnicianCheckInMutationVariables} from 'Platform/Relay/Mutations/__generated__/WorkOrderTechnicianCheckInMutation.graphql';

import * as React from 'react';
import AppContext from 'Platform/Context/AppContext';
import BottomBar from '@fbcmobile/ui/Components/Core/BottomBar';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import WorkOrderCheckOutDialog from 'Platform/Components/WorkOrders/WorkOrderCheckOutDialog';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import WorkOrderInvalidDistanceBottomSheet from 'Platform/Components/WorkOrders/WorkOrderInvalidDistanceBottomSheet';
import WorkOrderTechnicianActionButton from 'Platform/Components/WorkOrders/WorkOrderTechnicianActionButton';
import WorkOrderTechnicianCheckInMutation from 'Platform/Relay/Mutations/WorkOrderTechnicianCheckInMutation';
import fbt from 'fbt';
import useWorkOrderDistanceValidation from 'Platform/Hooks/useWorkOrderDistanceValidation';
import {CheckInStatuses} from 'Platform/Screens/WorkOrder/CheckInStatusTypes';
import {ERROR, EVENT} from 'Platform/Consts/UserActionEvents';
import {Statuses} from '@fbcmobile/ui/Components/StatusPill';
import {createFragmentContainer} from 'react-relay-offline';
import {createWorkOrderCacheEntryFromQuery} from 'Platform/Components/WorkOrders/WorkOrderUtils';
import {useCallback, useContext, useMemo, useState} from 'react';
import {usePerformWorkOrderCheckOut} from 'Platform/Relay/Mutations/WorkOrderUploadHelper';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +workOrder: WorkOrderTechnicianActionBottomBar_workOrder,
  +onTechnicianCheckedIn: () => void,
  +onTechnicianUploadedData: () => void,
};

const WorkOrderTechnicianActionBottomBar = ({
  workOrder,
  onTechnicianCheckedIn,
  onTechnicianUploadedData,
}: Props) => {
  const {user} = useContext(AppContext);
  const [isLocationErrorSheetOpen, setIsLocationErrorSheetOpen] = useState(
    false,
  );
  const validateDistance = useWorkOrderDistanceValidation();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [lastDistanceMeters, setLastDistanceMeters] = useState<?number>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {cache, initWorkOrderCacheEntry, markWorkOrderAsCheckedIn, setWorkOrderSubmittingStatus} = useContext(
    WorkOrderChecklistCacheContext,
  );
  const performWorkOrderCheckOut = usePerformWorkOrderCheckOut();
  const cachedData = cache[workOrder.id];
  const doesNeedCheckIn =
    workOrder.assignedTo?.authID.toLowerCase() === user?.email.toLowerCase() &&
    workOrder.status !== Statuses.CLOSED &&
    workOrder.status !== Statuses.DONE &&
    (cachedData?.checkInStatus == null ||
      cachedData?.checkInStatus === CheckInStatuses.CHECKED_OUT);
  const hasCachedItems = cachedData != null;

  React.useEffect(() => {
    if (cachedData == null) {
      initWorkOrderCacheEntry(createWorkOrderCacheEntryFromQuery(workOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTechnicianCheckInPressed = useCallback(
    (distanceMeters: ?number, checkInTime: ?any) => {
      setIsSubmitting(true);

      const variables: WorkOrderTechnicianCheckInMutationVariables = {
        workOrderId: workOrder.id,
        input: {distanceMeters, checkInTime},
      };
      const callbacks = {
        onCompleted: () => {
          if (cachedData == null) {
            initWorkOrderCacheEntry(
              createWorkOrderCacheEntryFromQuery(workOrder),
            );
          } else {
            markWorkOrderAsCheckedIn(workOrder.id);
          }
          setIsSubmitting(false);
          UserActionLogger.logEvent({
            key: EVENT.TECHNICIAN_CHECKED_IN,
          });
          onTechnicianCheckedIn();
        },
        onError: error => {
          setIsSubmitting(false);
          UserActionLogger.logError({
            key: ERROR.ERROR_TECHNICIAN_CHECK_IN,
            errorMessage: error.toString(),
          });
        },
      };

      WorkOrderTechnicianCheckInMutation(variables, callbacks);
    },
    [
      workOrder,
      onTechnicianCheckedIn,
      initWorkOrderCacheEntry,
      cachedData,
      markWorkOrderAsCheckedIn,
    ],
  );

  const onTechnicianCheckOutPressed = useCallback(
    async (
      checkoutType: ClockOutReason,
      comment?: ?string,
      checkOutTime: ?any,
    ) => {
      setIsSubmitting(true);
      setIsUploadDialogOpen(false);
      setWorkOrderSubmittingStatus(workOrder.id, true)
      try {
        await performWorkOrderCheckOut(
          workOrder.id,
          checkoutType,
          lastDistanceMeters,
          comment,
          onTechnicianUploadedData,
          checkOutTime,
        );
      } catch {
        NavigationService.alert(
          'error',
          fbt(
            'Upload failed',
            'Error message title shown when the user data upload attempt failed',
          ),
          fbt(
            'Check your internet connection and try again.',
            'Error message shown when the user data upload attempt failed',
          ),
        );
      } finally {
        setIsSubmitting(false);
        setWorkOrderSubmittingStatus(workOrder.id, false)
      }
    },
    [
      workOrder,
      performWorkOrderCheckOut,
      onTechnicianUploadedData,
      lastDistanceMeters,
    ],
  );

  const buttonState: ?ButtonState = useMemo(() => {
    if (doesNeedCheckIn) {
      return 'check-in';
    } else if (workOrder.status !== Statuses.CLOSED && hasCachedItems) {
      return 'check-out';
    }
    return null;
  }, [doesNeedCheckIn, hasCachedItems, workOrder.status]);

  const performCheckInOutAction = useCallback(
    (distanceMeters: ?number) => {
      setIsLocationErrorSheetOpen(false);
      if (buttonState === 'check-in') {
        onTechnicianCheckInPressed(distanceMeters, new Date().toISOString());
      } else {
        setLastDistanceMeters(distanceMeters);
        setIsUploadDialogOpen(true);
      }
    },
    [buttonState, onTechnicianCheckInPressed, setIsUploadDialogOpen],
  );

  const onActionButtonPress = useCallback(() => {
    const locationCoords = workOrder.location?.parentCoords;
    if (locationCoords == null) {
      performCheckInOutAction(null);
      return;
    }

    validateDistance(locationCoords, (isValid, distanceMeters) => {
      if (isValid || isLocationErrorSheetOpen) {
        performCheckInOutAction(distanceMeters);
      } else if (!isLocationErrorSheetOpen) {
        setIsLocationErrorSheetOpen(true);
      }
    });
  }, [
    isLocationErrorSheetOpen,
    workOrder.location,
    performCheckInOutAction,
    validateDistance,
  ]);

  if (buttonState == null) {
    return null;
  }

  return (
    <BottomBar>
      <WorkOrderTechnicianActionButton
        onPress={onActionButtonPress}
        isDisabled={isSubmitting}
        isSubmitting={isSubmitting}
        buttonState={buttonState}
      />
      {workOrder.location?.parentCoords != null ? (
        <WorkOrderInvalidDistanceBottomSheet
          locationCoords={workOrder.location.parentCoords}
          onPerformCheckInOut={performCheckInOutAction}
          isOpen={isLocationErrorSheetOpen}
          onClose={() => setIsLocationErrorSheetOpen(false)}
          buttonState={buttonState}
        />
      ) : null}
      {
        isUploadDialogOpen ?
        (<WorkOrderCheckOutDialog
        workOrderId={workOrder.id}
        shown={isUploadDialogOpen}
        onDialogClosed={() => setIsUploadDialogOpen(false)}
        onActionClicked={onTechnicianCheckOutPressed}
      />) : null
      }
    </BottomBar>
  );
};

export default createFragmentContainer(WorkOrderTechnicianActionBottomBar, {
  workOrder: graphql`
    fragment WorkOrderTechnicianActionBottomBar_workOrder on WorkOrder {
      id
      status
      assignedTo {
        authID
      }
      location {
        parentCoords {
          latitude
          longitude
        }
      }
      checkListCategories {
        id
        title
        checkList {
          id
          title
          helpText
          index
          isMandatory
          type
          enumSelectionMode
          selectedEnumValues
          enumValues
          stringValue
          checked
          yesNoResponse
          wifiData {
            timestamp
            frequency
            channel
            bssid
            strength
            ssid
            band
            channelWidth
            capabilities
            latitude
            longitude
          }
          cellData {
            networkType
            signalStrength
            timestamp
            baseStationID
            networkID
            systemID
            cellID
            locationAreaCode
            mobileCountryCode
            mobileNetworkCode
            primaryScramblingCode
            operator
            arfcn
            physicalCellID
            trackingAreaCode
            timingAdvance
            earfcn
            uarfcn
            latitude
            longitude
          }
          files {
            id
            fileName
            storeKey
            mimeType
            sizeInBytes
            modified
            uploaded
            annotation
          }
        }
      }
      images {
        id
        fileName
        storeKey
        mimeType
        sizeInBytes
        modified
        uploaded
        annotation
      }
    }
  `,
});

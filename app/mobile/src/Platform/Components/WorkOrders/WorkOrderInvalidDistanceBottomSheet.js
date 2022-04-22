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

import BottomSheet from '@fbcmobile/ui/Components/Core/BottomSheet';
import Images from 'Platform/Images';
import RNShake from 'react-native-shake';
import React, {useCallback, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderTechnicianActionButton from 'Platform/Components/WorkOrders/WorkOrderTechnicianActionButton';
import fbt from 'fbt';
import useWorkOrderDistanceValidation from 'Platform/Hooks/useWorkOrderDistanceValidation';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {navigateToCoords} from '@fbcmobile/ui/Utils/MapUtils';

type Props = {|
  +locationCoords: {|+latitude: number, +longitude: number|},
  +onPerformCheckInOut: (distanceMeters: number) => void,
  +isOpen: boolean,
  +onClose: () => void,
  +buttonState: ButtonState,
|};

const DialogSteps = Object.freeze({
  INITIAL_VALIDATION: 'initial_validation',
  OPTIONAL_SKIP_VALIDATION: 'optional_skip_validation',
});

type DialogStep = $Values<typeof DialogSteps>;

const WorkOrderInvalidDistanceBottomSheet = ({
  locationCoords,
  onPerformCheckInOut,
  isOpen,
  onClose,
  buttonState,
}: Props) => {
  const [validationStep, setValidationStep] = useState<DialogStep>(
    DialogSteps.INITIAL_VALIDATION,
  );
  const validateDistance = useWorkOrderDistanceValidation();
  const onActionButtonPressed = useCallback(() => {
    validateDistance(locationCoords, (isValid, distanceMeters) => {
      if (isValid) {
        onPerformCheckInOut(distanceMeters);
        return;
      }

      if (validationStep === DialogSteps.OPTIONAL_SKIP_VALIDATION) {
        onPerformCheckInOut(distanceMeters);
      } else {
        setValidationStep(DialogSteps.OPTIONAL_SKIP_VALIDATION);
      }
    });
  }, [locationCoords, onPerformCheckInOut, validateDistance, validationStep]);

  const performClose = useCallback(() => {
    onClose();
    setValidationStep(DialogSteps.INITIAL_VALIDATION);
  }, [onClose]);

  React.useEffect(() => {
    RNShake.addEventListener('ShakeEvent', () => {
      performClose();
    });

    return () => {
      RNShake.removeEventListener('ShakeEvent');
    };
  }, [performClose]);

  return (
    <BottomSheet
      height={322}
      isOpen={isOpen}
      closeOnPressBack={true}
      closeOnPressMask={true}
      onClose={performClose}>
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.dismissButton} onPress={performClose}>
          <Text variant="h7" weight="medium" color="lightGray">
            <fbt desc="Dismiss button. Closes the dialog">Dismiss</fbt>
          </Text>
        </TouchableOpacity>
        <View style={styles.image}>
          <Image
            source={
              validationStep === DialogSteps.INITIAL_VALIDATION
                ? Images.direction
                : Images.direction_fail
            }
          />
        </View>
        <View style={styles.locationErrorContent}>
          <Text variant="h1" style={styles.title}>
            {validationStep === DialogSteps.INITIAL_VALIDATION ? (
              <fbt
                desc="Title instructing the technician they need to
            move closer to the location in order to check-in">
                Move Closer
              </fbt>
            ) : buttonState === 'check-in' ? (
              <fbt
                desc="Title asking the technician if they want to check into
              the location despite not being close enough">
                Check In Anyway?
              </fbt>
            ) : (
              <fbt
                desc="Title asking the technician if they want to check out of
              the location despite not being close enough">
                Check Out Anyway?
              </fbt>
            )}
          </Text>
          <Text variant="h6" weight="light">
            {validationStep === DialogSteps.INITIAL_VALIDATION ? (
              <fbt
                desc="Instructing the technician they need to
            move closer to the location in order to check-in">
                Please move closer to the location of this work order and try
                again.
              </fbt>
            ) : (
              <fbt
                desc="Instructing the technician they are still too
                far from the location of the work order">
                You're still far away from the location of this work order.
              </fbt>
            )}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigateToCoords(
                locationCoords.latitude,
                locationCoords.longitude,
              )
            }>
            <Text
              variant="h6"
              color="primary"
              weight="regular"
              style={styles.getDirections}>
              <fbt desc="Button label. Clicking it will open the maps app and navigate the user.">
                Get Directions
              </fbt>
            </Text>
          </TouchableOpacity>
        </View>
        <WorkOrderTechnicianActionButton
          onPress={onActionButtonPressed}
          isDisabled={false}
          isSubmitting={false}
          buttonState={buttonState}
          requiresConfirmation={
            validationStep === DialogSteps.OPTIONAL_SKIP_VALIDATION
          }
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  title: {
    marginBottom: 2,
  },
  locationErrorContent: {
    marginBottom: 22,
    flexGrow: 1,
    paddingHorizontal: 4,
  },
  image: {
    marginBottom: 19,
  },
  dismissButton: {
    alignSelf: 'flex-end',
  },
  getDirections: {
    textDecorationLine: 'underline',
    marginTop: 17,
  },
});

export default WorkOrderInvalidDistanceBottomSheet;

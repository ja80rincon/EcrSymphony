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

import type {ClockOutReason} from 'Platform/Relay/Mutations/__generated__/TechnicianWorkOrderCheckOutMutation.graphql';

import Modal from 'react-native-modal';
import ModalActions from '@fbcmobile/ui/Components/Core/Modal/ModalActions';
import ModalContent from '@fbcmobile/ui/Components/Core/Modal/ModalContent';
import React, {useState, useEffect} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors, Fonts} from '@fbcmobile/ui/Theme';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import {RadioButton} from 'react-native-material-ui';
import {
  useIsWorkOrderChecklistItemsDone,
} from 'Platform/Components/WorkOrders/WorkOrderUtils';

type Props = {|
  +workOrderId: string,
  +shown: boolean,
  +onDialogClosed: () => void,
  +onActionClicked: (
    clockOutReason: ClockOutReason,
    comment?: ?string,
    checkOutTime: ?any,
  ) => void | Promise<void>,
|};

type CheckOutReason = 'submit' | 'blocked' | 'pause';
type DialogStep = 'checkout_reason' | 'incomplete_reason';

const WorkOrderCheckOutDialog = ({
  workOrderId,
  shown,
  onDialogClosed,
  onActionClicked,
}: Props) => {
  const [dialogStep, setDialogStep] = useState<DialogStep>('checkout_reason');
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<?CheckOutReason>(null);
  const [checkOutOptions, setCheckoutOptions] = useState(
    [{
      key: 'pause',
      label: fbt(
        'Pause work order',
        'Radio button label. Pauses the work order.',
      ).toString()
    }]);
  const isWorkOrderChecklistItemsDone = useIsWorkOrderChecklistItemsDone(
    workOrderId,
  );

  useEffect(() => {
  setCheckoutOptions(isWorkOrderChecklistItemsDone ? [...checkOutOptions, {
          key: 'submit',
          label: fbt(
            'Submit work order',
            'Radio button label. Submits the work order.',
          ).toString(),
        }]
        : [...checkOutOptions, {
          key: 'blocked',
          label: fbt(
            'Report as blocked',
            'Radio button label. Reports this work order cannot be completed.',
          ).toString(),
        }])
  }, []);

  const resetDialogState = () => {
    setDialogStep('checkout_reason');
    setSelectedOption(null);
    setInputValue('');
  };

  const performAction = (clockOutReason: ClockOutReason, comment?: ?string) => {
    onActionClicked(clockOutReason, comment, new Date().toISOString());
    resetDialogState();
  };

  const onNextPressed = () => {
    switch (selectedOption) {
      case 'submit':
        if (dialogStep === 'checkout_reason' && isWorkOrderChecklistItemsDone) {
          performAction('SUBMIT', inputValue);
        } else if (dialogStep === 'incomplete_reason') {
          performAction('SUBMIT_INCOMPLETE', inputValue);
        } else {
          setDialogStep('incomplete_reason');
        }
        break;
      case 'pause':
        performAction('PAUSE');
        break;
      case 'blocked':
        if (dialogStep === 'checkout_reason') {
          setDialogStep('incomplete_reason');
        } else {
          performAction('BLOCKED', inputValue);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Modal isVisible={shown} backdropOpacity={0.6} propagateSwipe={true}>
      <View style={styles.modal}>
        <ModalContent style={styles.content}>
          {dialogStep === 'checkout_reason' ? (
            <>
              <Text variant="h3" weight="bold" style={styles.title}>
                <fbt desc="Dialog title. The technician needs to provide a reason for checking out of this work order.">
                  Select check-out type
                </fbt>
              </Text>
              {checkOutOptions.map(option => (
                <RadioButton
                  key={option.key}
                  label={option.label}
                  checked={option.key === selectedOption}
                  value={option.key}
                  onSelect={() => setSelectedOption(option.key)}
                  style={{
                    container: styles.radioOption,
                    icon: styles.radioIcon,
                    label: styles.radioLabel,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Text variant="h3" weight="bold" style={styles.title}>
                {selectedOption === 'submit' ? (
                  <fbt
                    desc="Dialog title. Below is a text box where the technician can provide a
                  reason for not completing all of the checklist items">
                    Please provide a reason for not completing the checklist
                  </fbt>
                ) : (
                  <fbt
                    desc="Dialog title. Below is a text box where the technician can provide a
                  reason for reporting this work order as blocked">
                    Provide a reason for reporting this work order as blocked
                  </fbt>
                )}
              </Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder={fbt(
                  'Ex: Equipment X was missing...',
                  'Text input placeholder. The technician can provide more details about ' +
                    'why they did not complete the form',
                ).toString()}
                placeholderTextColor={Colors.DisabledText}
                value={inputValue}
                onChangeText={setInputValue}
                numberOfLines={5}
              />
            </>
          )}
        </ModalContent>
        <ModalActions
          cancelLabel={`${fbt(
            'Cancel',
            'Dialog button. Cancel checking out from this work order',
          )}`}
          onCancelPressed={() => {
            onDialogClosed();
            resetDialogState();
          }}
          okLabel={
            dialogStep === 'checkout_reason'
              ? `${fbt('Next', 'Upload the work order dialog button')}`
              : `${fbt('Submit', 'Dialog button. Submits the work order')}`
          }
          onOkPressed={onNextPressed}
          isOkDisabled={
            dialogStep === 'checkout_reason' && selectedOption == null
          }
          showDivider={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    minHeight: Dimensions.get('window').height / 3,
    borderRadius: 4,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 22,
    paddingVertical: 30,
  },
  title: {
    marginBottom: 23,
  },
  input: {
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.Divider,
    borderRadius: 5,
    height: 100,
  },
  radioOption: {
    marginBottom: 10,
    flex: 0,
  },
  radioIcon: {
    color: Colors.Blue,
  },
  radioLabel: {
    color: Colors.BlueGray,
    ...Fonts.style.h5,
    fontFamily: 'Roboto-Light',
  },
});

export default WorkOrderCheckOutDialog;
